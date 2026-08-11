from langchain_community.tools import DuckDuckGoSearchRun
from langchain.tools import Tool
from datetime import datetime


# search tool

search = DuckDuckGoSearchRun()

search_tool = Tool(
    name="search",
    func=search.run,
    description=(
        "Search the DuckDuckGOweb for current and relevant information. "
        "Input must be a search query string."
    )
)


# Save to txt - tool

def save_to_txt(data: str):
    filename = "research_output.txt"

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    formatted_text = (
        "--- Research Output ---\n"
        f"Timestamp: {timestamp}\n\n"
        f"{data}\n\n"
    )

    with open(filename, "a", encoding="utf-8") as f:
        f.write(formatted_text)

    return f"Data successfully saved to {filename}"


save_tool = Tool(
    name="save_response",
    func=save_to_txt,
    description=(
        "Save the completed research response to research_output.txt. "
        "Input must be the complete research response as a string."
    )
)