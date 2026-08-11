from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools import search_tool, save_to_txt

load_dotenv()


class ResearchResponse(BaseModel):
    topic: str
    summary: str
    sources: list[str]
    analysis: str
    tools_used: list[str]


llm = ChatOllama(
    model="qwen2.5:3b",
    temperature=0,
    num_predict=1000
)


# PROMPT

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are a professional research assistant.

Your job is to research the user's topic and produce ONE complete, accurate,
concise, and useful research response.

IMPORTANT SEARCH RULES:

- Use the search tool when external information is needed.
- After calling the search tool, carefully evaluate the returned information.
- A message saying "No good DuckDuckGo Search Result was found" does NOT automatically
  mean that the research has failed.
- If the search result contains ANY useful or relevant information, use it and continue.
- Do NOT call the search tool repeatedly when you already have sufficient information.
- Only perform another search if the previous result contains absolutely no useful
  information for answering the user's topic.
- At most, retry the search once if the first search genuinely provides no useful information.
- After obtaining sufficient information, STOP searching and generate the final response.
- Never search indefinitely.

RESEARCH RULES:

- Do not invent facts or sources.
- Use information obtained from the search results when available.
- Keep the response concise but complete.
- Clearly separate the topic, summary, sources, analysis, and tools used.
- If a source is provided by the search result, use that source.
- Do not claim that a tool was used if it was not actually used.

FINAL RESPONSE:

Return ONE clean and complete research response using this structure:

## Topic
[topic]

## Summary
[concise summary]

## Sources
[list of relevant sources]

## Analysis
[brief analysis]

## Tools Used
[list of tools actually used]

IMPORTANT:
- Complete ALL sections before finishing.
- Do not return JSON.
- Do not return an incomplete response.
- Do not repeat the research unnecessarily.
- Do not continue calling tools after sufficient information has been obtained.
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

tools = [search_tool]

agent = create_tool_calling_agent(
    llm=llm,
    prompt=prompt,
    tools=tools
)

agent_executer = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True
)

# Topic to research on
topic = input("Enter the Research topic : ")

raw_resp = agent_executer.invoke({
    "topic": topic
})


# Get the COMPLETE final response
final_response = raw_resp.get("output", "")


if not final_response.strip():

    print("Error: Agent returned an empty response.")

else:

    print("\n" + "=" * 50)
    print("RESEARCH RESULT")
    print("=" * 50)
    print(final_response)
    print("=" * 50)

# Added saving condition
save_choice = input(
    "Do you want to save the generated research? (Yes/No): "
).strip().lower()

if save_choice in ("yes", "y"):
    save_to_txt(final_response)
    print("Final response saved to research_output.txt.")

elif save_choice in ("no", "n"):
    print("Research was not saved.")

else:
    print("Invalid choice. Research was not saved.")
