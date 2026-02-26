import os
import shutil
from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from app_state import sessions
from models.schemas import UploadResponse, StatusResponse
from services.pdf_service import process_pdf
from services.vector_service import build_vectorstore, delete_vectorstore

router = APIRouter()

UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", 10))
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


# ───────────────────────────────────────────
# POST /api/upload
# ───────────────────────────────────────────

@router.post("", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF file, extract text, build FAISS vector store.
    Returns sessionId + document metadata.
    """

    # 1. Validate file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # 2. Read file and check size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE_MB}MB.",
        )

    # 3. Generate session ID and save file
    session_id = str(uuid4())
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    file_path = os.path.join(UPLOAD_FOLDER, f"{session_id}.pdf")

    with open(file_path, "wb") as f:
        f.write(contents)

    # 4. Process PDF → chunks
    try:
        chunks, page_count, chunk_count = process_pdf(file_path)
    except ValueError as e:
        os.remove(file_path)
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"PDF processing failed: {str(e)}")

    # 5. Build FAISS vector store
    try:
        build_vectorstore(chunks, session_id)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Vector store creation failed: {str(e)}")

    # 6. Store session in memory
    sessions[session_id] = {
        "sessionId": session_id,
        "fileName": file.filename,
        "uploadedAt": datetime.now().isoformat(),
        "pageCount": page_count,
        "chunkCount": chunk_count,
        "vectorStoreReady": True,
        "filePath": file_path,
        "questionSets": [],
    }

    return UploadResponse(
        sessionId=session_id,
        fileName=file.filename,
        pageCount=page_count,
        chunkCount=chunk_count,
        vectorStoreReady=True,
        message=f"PDF processed successfully. {chunk_count} chunks indexed.",
    )


# ───────────────────────────────────────────
# GET /api/upload/status/{session_id}
# ───────────────────────────────────────────

@router.get("/status/{session_id}", response_model=StatusResponse)
async def get_upload_status(session_id: str):
    """
    Check whether a session's vector store is ready.
    """
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail=f"Session '{session_id}' not found. Please upload a PDF first.",
        )

    return StatusResponse(
        sessionId=session_id,
        vectorStoreReady=session["vectorStoreReady"],
        fileName=session.get("fileName"),
        pageCount=session.get("pageCount"),
        chunkCount=session.get("chunkCount"),
    )