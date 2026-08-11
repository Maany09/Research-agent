from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools import search_tool , save_tool

load_dotenv()

class ResearchResponse(BaseModel):
    topic: str
    summary: str
    sources: list[str]
    analysis: str
    tools_used: list[str]



parser = PydanticOutputParser(pydantic_object=ResearchResponse)

llm = ChatOllama(model="qwen2.5:3b", temperature=0)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are a research assistant.

Your job is to research the user's topic using the available tools and provide a concise research response.

Follow these rules:

1. Use the search tool when the topic requires current or external information.
2. After gathering enough information, generate a concise research response.
3. The final response MUST follow the provided format instructions.
4. If the user asks to save the research, use the save_response tool AFTER generating the research.
5. Do not call save_response before the research is complete.
6. Keep the research factual, concise, and useful.

{format_instructions}"""
        ),
        (
            "human",
            "{topic}"
        ),
        (
            "placeholder",
            "{agent_scratchpad}"
        ),
    ]
)


# added parsing ,
prompt = prompt.partial(
    format_instructions=parser.get_format_instructions()
)

tools = [search_tool, save_tool]
agent = create_tool_calling_agent(
    llm=llm,
    prompt=prompt,
    tools=tools
)

agent_executer = AgentExecutor(agent=agent, tools=tools, verbose=True)
topic = input("Enter the Research topic : ")
raw_resp = agent_executer.invoke({"topic" : topic})

# if error occurs in Parsing the Structured response

try :
    structured_resp = parser.parse(raw_resp.get("output"))
    print(structured_resp)
except Exception as e:
    print("Error in getting structured Response", e , "Raw Response - ", raw_resp)