from langchain_community.tools import DuckDuckGoSearchRun
from langchain.tools import Tool
from datetime import datetime

search = DuckDuckGoSearchRun()

# Created a tool for search
search_tool = Tool(

    name = "search",
    func=search.run,
    description="Search web for information."
)

def save_to_txt(data: str, filename: str = "research_output.txt"):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted_text = f"--- Research Output ---\nTimestamp: {timestamp}\n\n{data}\n\n"

    with open(filename, "a", encoding="utf-8") as f:
        f.write(formatted_text)
    
    return f"Data successfully saved to {filename}"

# to save the generated research info...
save_tool = Tool(

    name = "save_response",
    func = save_to_txt,
    description= "Saves structerd research data to a text file."
)