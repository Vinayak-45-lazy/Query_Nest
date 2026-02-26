import os
from typing import List
from langchain_core.documents import Document
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

def get_llm() -> ChatGroq:
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        groq_api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.7,
        max_tokens=4096,
    )

MCQ_PROMPT = """You are an expert educator creating exam questions.
Based ONLY on the following content:
{context}

Generate exactly {count} {difficulty} level Multiple Choice Questions.
Rules:
- Each question must have exactly 4 options labeled A, B, C, D
- Clearly mark the correct answer as just the letter (e.g. "A")
- Add a one-line explanation
- Return ONLY a valid JSON array, no markdown, no extra text

Format:
[
  {{
    "questionText": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "A",
    "explanation": "..."
  }}
]"""

SHORT_ANSWER_PROMPT = """You are an expert educator creating exam questions.
Based ONLY on the following content:
{context}

Generate exactly {count} {difficulty} level Short Answer Questions.
Rules:
- Each question needs a 2-3 sentence model answer
- Provide the model answer in correctAnswer field
- Add a one-line explanation
- Return ONLY a valid JSON array, no markdown, no extra text

Format:
[
  {{
    "questionText": "...",
    "options": [],
    "correctAnswer": "Model answer here...",
    "explanation": "..."
  }}
]"""

TRUE_FALSE_PROMPT = """You are an expert educator creating exam questions.
Based ONLY on the following content:
{context}

Generate exactly {count} {difficulty} level True/False Questions.
Rules:
- Each statement must be clearly True or False based on the content
- correctAnswer must be exactly "True" or "False"
- Add a one-line explanation
- Return ONLY a valid JSON array, no markdown, no extra text

Format:
[
  {{
    "questionText": "Statement here...",
    "options": ["True", "False"],
    "correctAnswer": "True",
    "explanation": "..."
  }}
]"""

MIXED_PROMPT = """You are an expert educator creating exam questions.
Based ONLY on the following content:
{context}

Generate exactly {count} {difficulty} level questions as a MIX of MCQ, Short Answer, and True/False types.
Rules:
- Distribute types roughly evenly
- MCQ: exactly 4 options labeled A, B, C, D; correctAnswer is the letter only
- Short Answer: options is empty []; correctAnswer is a 2-3 sentence model answer
- True/False: options are ["True", "False"]; correctAnswer is exactly "True" or "False"
- Add a one-line explanation for each
- Include a "type" field: "MCQ", "ShortAnswer", or "TrueFalse"
- Return ONLY a valid JSON array, no markdown, no extra text

Format:
[
  {{
    "type": "MCQ",
    "questionText": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "A",
    "explanation": "..."
  }}
]"""

PROMPT_MAP = {
    "MCQ": MCQ_PROMPT,
    "ShortAnswer": SHORT_ANSWER_PROMPT,
    "TrueFalse": TRUE_FALSE_PROMPT,
    "Mixed": MIXED_PROMPT,
}

def build_context(docs: List[Document], max_chars: int = 6000) -> str:
    context = "\n\n".join([doc.page_content for doc in docs])
    return context[:max_chars]

def generate_questions(
    docs: List[Document],
    question_type: str,
    difficulty: str,
    count: int,
) -> str:
    if question_type not in PROMPT_MAP:
        raise ValueError(f"Unknown question type: {question_type}")

    context = build_context(docs)
    prompt_template = PROMPT_MAP[question_type]
    prompt = prompt_template.format(
        context=context,
        count=count,
        difficulty=difficulty,
    )

    llm = get_llm()
    response = llm.invoke(prompt)
    return response.content