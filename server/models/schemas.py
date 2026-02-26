from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime


# ───────────────────────────────────────────
# Question
# ───────────────────────────────────────────

class Question(BaseModel):
    questionId: str
    questionText: str
    options: List[str] = []
    correctAnswer: str
    explanation: str


# ───────────────────────────────────────────
# Uploaded Document (in-memory session data)
# ───────────────────────────────────────────

class UploadedDocument(BaseModel):
    sessionId: str
    fileName: str
    uploadedAt: datetime
    pageCount: int
    chunkCount: int
    vectorStoreReady: bool


# ───────────────────────────────────────────
# Question Set
# ───────────────────────────────────────────

class GeneratedQuestionSet(BaseModel):
    setId: str
    sessionId: str
    questionType: Literal["MCQ", "ShortAnswer", "TrueFalse", "Mixed"]
    difficulty: Literal["Easy", "Medium", "Hard"]
    count: Literal[5, 10, 15, 20]
    topic: Optional[str] = None
    questions: List[Question] = []
    generatedAt: datetime


# ───────────────────────────────────────────
# Request Bodies
# ───────────────────────────────────────────

class GenerateRequest(BaseModel):
    sessionId: str
    questionType: Literal["MCQ", "ShortAnswer", "TrueFalse", "Mixed"]
    difficulty: Literal["Easy", "Medium", "Hard"]
    count: Literal[5, 10, 15, 20]
    topic: Optional[str] = None


# ───────────────────────────────────────────
# Response Models
# ───────────────────────────────────────────

class UploadResponse(BaseModel):
    sessionId: str
    fileName: str
    pageCount: int
    chunkCount: int
    vectorStoreReady: bool
    message: str


class GenerateResponse(BaseModel):
    setId: str
    sessionId: str
    questionType: str
    difficulty: str
    count: int
    topic: Optional[str]
    questions: List[Question]
    generatedAt: datetime


class StatusResponse(BaseModel):
    sessionId: str
    vectorStoreReady: bool
    fileName: Optional[str] = None
    pageCount: Optional[int] = None
    chunkCount: Optional[int] = None


class HistoryResponse(BaseModel):
    sessionId: str
    questionSets: List[GeneratedQuestionSet]


class ErrorResponse(BaseModel):
    detail: str