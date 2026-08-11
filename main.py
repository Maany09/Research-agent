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

llm = ChatOllama(model="qwen2.5:3b", temperature=0, num_predict=1000)

# PROMPT
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are a research assistant.

Your job is to research the user's topic using the available tools and provide a concise research response.

Follow these rules:

1. Understand the user's research topic.
2. Use the search tool when external or current information is needed.
3. Analyze the information returned by the search tool.
4. Generate the complete research response.
5. If the user asks to save the response, ONLY AFTER generating the complete response, call the save_response tool.
6. When calling save_response, pass the COMPLETE research response as its input.
7. Never call save_response with an empty input.
8. If search returns no useful results, do not save an empty response. Continue using your knowledge or perform another search.
9. Keep the final response concise but complete.
10. Do not return JSON.
11. Use clean Markdown formatting.

The final response should contain:

- Topic
- Summary
- Sources
- Analysis
- Tools Used

Complete every section before finishing the response.

"""
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

# Agent setup
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
    print("\n" + "=" * 50)
    print("RESEARCH RESULT")
    print("=" * 50)
    print(structured_resp["output"])
    print("=" * 50)
except Exception as e:
    print("Error in getting structured Response", e , "Raw Response - ", raw_resp)