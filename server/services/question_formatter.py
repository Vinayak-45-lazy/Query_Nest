import json
import re
from typing import List
from uuid import uuid4


# ───────────────────────────────────────────
# JSON Cleaner
# ───────────────────────────────────────────

def clean_json_response(raw: str) -> str:
    """
    Strip markdown code fences and any leading/trailing noise
    that Groq sometimes wraps around the JSON array.
    """
    text = raw.strip()

    # Remove ```json ... ``` or ``` ... ``` fences
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)

    # Strip any text before the first '[' and after the last ']'
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1:
        raise ValueError(
            "LLM response did not contain a valid JSON array. "
            f"Raw response snippet: {raw[:300]}"
        )

    return text[start : end + 1]


# ───────────────────────────────────────────
# Validator
# ───────────────────────────────────────────

def validate_question(q: dict) -> dict:
    """
    Ensure required fields exist and apply safe defaults.
    """
    return {
        "questionId": str(uuid4()),
        "questionText": q.get("questionText", "").strip(),
        "options": q.get("options", []),
        "correctAnswer": q.get("correctAnswer", "").strip(),
        "explanation": q.get("explanation", "").strip(),
    }


# ───────────────────────────────────────────
# Main Formatter
# ───────────────────────────────────────────

def format_questions(raw_response: str, expected_count: int = None) -> List[dict]:
    """
    Parse raw LLM response into a list of validated question dicts.

    Steps:
      1. Strip markdown fences
      2. Parse JSON
      3. Validate each question object
      4. Optionally warn if count doesn't match expected
    """
    cleaned = clean_json_response(raw_response)

    try:
        questions = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Failed to parse LLM response as JSON: {str(e)}\n"
            f"Cleaned response: {cleaned[:500]}"
        )

    if not isinstance(questions, list):
        raise ValueError("LLM response JSON was not a list of questions.")

    if len(questions) == 0:
        raise ValueError("LLM returned an empty question list.")

    formatted = [validate_question(q) for q in questions]

    # Trim to expected count if LLM over-generated
    if expected_count and len(formatted) > expected_count:
        formatted = formatted[:expected_count]

    return formatted