from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re

# Import the existing agent components
from main import agent_executer
from tools import save_to_txt

app = FastAPI()

# Allow CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str

class SaveRequest(BaseModel):
    data: str

class ResearchResponse(BaseModel):
    topic: str
    summary: str
    sources: list[str]
    analysis: str
    tools_used: list[str]

def parse_markdown_response(raw_text: str) -> dict:
    """Parse the agent's markdown response into structured fields."""
    sections = {
        "topic": "",
        "summary": "",
        "sources": [],
        "analysis": "",
        "tools_used": []
    }
    
    # Split by headings: ## Topic, ## Summary, etc. (allow ### as well)
    parts = re.split(r'(?i)^#{2,3}\s+(Topic|Summary|Sources|Analysis|Tools Used)\s*$', raw_text, flags=re.MULTILINE)
    
    current_section = None
    for part in parts:
        part_clean = part.strip()
        part_lower = part_clean.lower()
        if part_lower in ["topic", "summary", "sources", "analysis", "tools used"]:
            current_section = part_lower
        elif current_section:
            content = part_clean
            if not content:
                continue
                
            if current_section == "topic":
                sections["topic"] = content
            elif current_section == "summary":
                sections["summary"] = content
            elif current_section == "sources":
                # split by newlines or list items
                sources = [s.lstrip("- *").strip() for s in content.split('\n') if s.strip()]
                sections["sources"] = sources
            elif current_section == "analysis":
                sections["analysis"] = content
            elif current_section == "tools used":
                tools = [t.lstrip("- *").strip() for t in content.split('\n') if t.strip()]
                sections["tools_used"] = tools
            current_section = None
            
    return sections

@app.post("/api/research", response_model=ResearchResponse)
async def research(req: ResearchRequest):
    try:
        raw_resp = agent_executer.invoke({"topic": req.topic})
        final_response = raw_resp.get("output", "")
        if not final_response.strip():
            raise HTTPException(status_code=500, detail="Agent returned an empty response")
            
        parsed = parse_markdown_response(final_response)
        
        # Fallback if topic is empty
        if not parsed.get("topic"):
            parsed["topic"] = req.topic
            
        return ResearchResponse(**parsed)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/save")
async def save(req: SaveRequest):
    try:
        # Save raw string representation back to text file
        save_to_txt(req.data)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
