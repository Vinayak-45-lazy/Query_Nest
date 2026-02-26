from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, HTTPException

from app_state import sessions
from models.schemas import GenerateRequest, GenerateResponse
from services.vector_service import search
from services.ai_service import generate_questions
from services.question_formatter import format_questions

router = APIRouter()


# ───────────────────────────────────────────
# POST /api/generate
# ───────────────────────────────────────────

@router.post("", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    """
    Generate questions from an uploaded PDF session.
    Body: sessionId, questionType, difficulty, count, topic (optional)
    """

    # 1. Validate session exists
    session = sessions.get(request.sessionId)
    if not session:
        raise HTTPException(
            status_code=404,
            detail=f"Session '{request.sessionId}' not found. Please upload a PDF first.",
        )

    if not session.get("vectorStoreReady"):
        raise HTTPException(
            status_code=400,
            detail="Vector store is not ready yet. Please wait and try again.",
        )

    # 2. Build search query from topic or use generic query
    query = request.topic.strip() if request.topic else "key concepts important topics main ideas"

    # 3. Retrieve relevant chunks from FAISS
    try:
        docs = search(request.sessionId, query, k=10)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vector search failed: {str(e)}")

    if not docs:
        raise HTTPException(
            status_code=422,
            detail="No relevant content found in the document for this topic.",
        )

    # 4. Generate questions via Groq LLM
    try:
        raw_response = generate_questions(
            docs=docs,
            question_type=request.questionType,
            difficulty=request.difficulty,
            count=request.count,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")

    # 5. Parse and format LLM response
    try:
        questions = format_questions(raw_response, expected_count=request.count)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")

    # 6. Auto-reduce count warning if LLM returned fewer questions
    actual_count = len(questions)

    # 7. Build question set object
    set_id = str(uuid4())
    generated_at = datetime.now()

    question_set = {
        "setId": set_id,
        "sessionId": request.sessionId,
        "questionType": request.questionType,
        "difficulty": request.difficulty,
        "count": actual_count,
        "topic": request.topic or None,
        "questions": questions,
        "generatedAt": generated_at.isoformat(),
    }

    # 8. Append to session history
    session["questionSets"].append(question_set)

    return GenerateResponse(
        setId=set_id,
        sessionId=request.sessionId,
        questionType=request.questionType,
        difficulty=request.difficulty,
        count=actual_count,
        topic=request.topic or None,
        questions=questions,
        generatedAt=generated_at,
    )


# ───────────────────────────────────────────
# GET /api/generate/{set_id}
# ───────────────────────────────────────────

@router.get("/{set_id}", response_model=GenerateResponse)
async def get_question_set(set_id: str):
    """
    Retrieve a specific question set by its setId.
    """
    for session in sessions.values():
        for qs in session.get("questionSets", []):
            if qs["setId"] == set_id:
                return GenerateResponse(
                    setId=qs["setId"],
                    sessionId=qs["sessionId"],
                    questionType=qs["questionType"],
                    difficulty=qs["difficulty"],
                    count=qs["count"],
                    topic=qs.get("topic"),
                    questions=qs["questions"],
                    generatedAt=datetime.fromisoformat(qs["generatedAt"]),
                )

    raise HTTPException(
        status_code=404,
        detail=f"Question set '{set_id}' not found.",
    )