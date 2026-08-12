# Research Agent

A full-stack, AI-powered research assistant. The Research Agent takes a natural language query, performs deep research using a LangChain-powered intelligent backend, and presents the findings in a modern React frontend.

## Features

- **Intelligent Agent**: Built with LangChain and ChatOllama (`qwen2.5:3b`), the agent autonomously searches the web using DuckDuckGo to gather, summarize, and analyze topics.
- **Modern UI**: A responsive, animated interface built with React, Vite, Tailwind CSS v4, and Framer Motion.
- **Smart Sidebar & History**: Automatically manages your Recent Topics locally.
- **One-Click Export**: Save your generated research reports to a local text file.

## Tech Stack

**Backend:**
- Python 3.11+
- FastAPI & Uvicorn (REST API)
- LangChain & LangChain Ollama (Agent orchestration)
- DuckDuckGo Search (Web search tool)

**Frontend:**
- React 18 + Vite
- Tailwind CSS v4
- Framer Motion

---

## Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- Python (v3.11+ recommended)
- Ollama (with the `qwen2.5:3b` model installed) 
- Check requirements.txt for more detailed step of installation

### 1. Backend Setup (FastAPI + LangChain)

1. Open a terminal in the project root.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the required Python dependencies: (according to your versions)
   ```bash
   pip install fastapi uvicorn pydantic python-dotenv langchain langchain-ollama duckduckgo-search langchain-community
   ```
4. Start the backend server:
   ```bash
   uvicorn api:app --reload --port 8000
   ```
   *The API will be available at http://localhost:8000*

### 2. Frontend Setup (React/Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at http://localhost:5173*

---

## How the Agent Works

The backend utilizes **LangChain** to orchestrate an autonomous research agent:
1. **Model**: Uses `ChatOllama` running the local `qwen2.5:3b` model.
2. **Tools**: Equipped with a `DuckDuckGoSearchRun` tool allowing the agent to query the live web.
3. **Execution**: The `create_tool_calling_agent` evaluates the user's prompt, decides when and what to search, and processes the retrieved data. The `AgentExecutor` manages this loop until sufficient information is gathered to structure a comprehensive final markdown report.

## Folder Structure

```text
.
├── api.py                 # FastAPI backend server
├── main.py                # LangChain Agent and Prompt definition
├── tools.py               # DuckDuckGo Tool and save logic
├── research_output.txt    # Output destination for saved reports
└── frontend/              # React Application
    ├── index.html         
    ├── package.json       
    ├── vite.config.js     # Configured to proxy /api to FastAPI
    └── src/
        ├── index.css      
        ├── App.jsx        # Main layout and state management
        ├── components/    # Reusable UI components
        └── services/      # Axios API calls and LocalStorage history
```
