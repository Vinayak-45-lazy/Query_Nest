from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app_state import sessions
from models.schemas import HistoryResponse, GeneratedQuestionSet
from services.vector_service import delete_vectorstore
import os

router = APIRouter()


# ───────────────────────────────────────────
# GET /api/download/{set_id}
# ───────────────────────────────────────────

@router.get("/{set_id}")
async def download_question_set(set_id: str):
    """
    Return raw question set data for client-side PDF export via jsPDF.
    """
    for session in sessions.values():
        for qs in session.get("questionSets", []):
            if qs["setId"] == set_id:
                return JSONResponse(content={
                    "setId": qs["setId"],
                    "sessionId": qs["sessionId"],
                    "fileName": session.get("fileName", "document.pdf"),
                    "questionType": qs["questionType"],
                    "difficulty": qs["difficulty"],
                    "count": qs["count"],
                    "topic": qs.get("topic"),
                    "questions": qs["questions"],
                    "generatedAt": qs["generatedAt"],
                })

    raise HTTPException(
        status_code=404,
        detail=f"Question set '{set_id}' not found.",
    )


# ───────────────────────────────────────────
# GET /api/history/{session_id}
# ───────────────────────────────────────────

@router.get("/history/{session_id}")
async def get_history(session_id: str):
    """
    Return all question sets generated in a session.
    """
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail=f"Session '{session_id}' not found.",
        )

    question_sets = session.get("questionSets", [])

    return JSONResponse(content={
        "sessionId": session_id,
        "fileName": session.get("fileName"),
        "pageCount": session.get("pageCount"),
        "uploadedAt": session.get("uploadedAt"),
        "totalSets": len(question_sets),
        "questionSets": [
            {
                "setId": qs["setId"],
                "questionType": qs["questionType"],
                "difficulty": qs["difficulty"],
                "count": qs["count"],
                "topic": qs.get("topic"),
                "generatedAt": qs["generatedAt"],
            }
            for qs in question_sets
        ],
    })


# ───────────────────────────────────────────
# DELETE /api/history/{session_id}
# ───────────────────────────────────────────

@router.delete("/history/{session_id}")
async def clear_session(session_id: str):
    """
    Delete session data: remove from memory, delete vectorstore and uploaded file.
    """
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail=f"Session '{session_id}' not found.",
        )

    # Remove uploaded PDF file
    file_path = session.get("filePath")
    if file_path and os.path.exists(file_path):
        os.remove(file_path)

    # Remove FAISS vector store
    try:
        delete_vectorstore(session_id)
    except Exception:
        pass  # Best effort cleanup

    # Remove from in-memory store
    del sessions[session_id]

    return JSONResponse(content={
        "success": True,
        "message": f"Session '{session_id}' cleared successfully.",
    })