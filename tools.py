from langchain_community.tools import DuckDuckGoSearchRun
from langchain.tools import Tool
from datetime import datetime


# Search tool

search = DuckDuckGoSearchRun()

search_tool = Tool(
    name="search",
    func=search.run,
    description=(
        "Search the DuckDuckGo web for current and relevant information. "
        "Input must be a search query string."
    )
)


# Save research to text file

def save_to_txt(data: str):
    filename = "research_output.txt"

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    formatted_text = (
        "\n"
        + "=" * 70
        + "\n\n"
        "--- Research Output ---\n"
        f"Timestamp: {timestamp}\n\n"
        f"{data}\n\n"
    )

    with open(filename, "a", encoding="utf-8") as f:
        f.write(formatted_text)

    return f"Data successfully saved to {filename}"
