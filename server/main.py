import os
import sys

# Fix path BEFORE anything else
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Ensure runtime folders exist
os.makedirs(os.getenv("UPLOAD_FOLDER", "uploads"), exist_ok=True)
os.makedirs(os.getenv("VECTORSTORE_FOLDER", "vectorstores"), exist_ok=True)

# In-memory session store
from app_state import sessions

# Routers
from routers import upload, generate, download

app = FastAPI(
    title="QueryNest API",
    description="AI-powered question generator backend",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_URL", "https://querynest.vercel.app"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router,   prefix="/api/upload",   tags=["Upload"])
app.include_router(generate.router, prefix="/api/generate", tags=["Generate"])
app.include_router(download.router, prefix="/api/download", tags=["Download"])

@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "app": "QueryNest API", "version": "1.0.0"}

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}