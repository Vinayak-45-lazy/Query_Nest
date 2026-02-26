import os
from typing import List, Tuple

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document


# ───────────────────────────────────────────
# Text Extraction
# ───────────────────────────────────────────

def extract_text(file_path: str) -> Tuple[str, int]:
    """
    Extract raw text from a PDF file.
    Tries PyPDF2 first, falls back to pypdf.
    Returns (full_text, page_count).
    """
    text = ""
    page_count = 0

    # Primary: PyPDF2
    try:
        from PyPDF2 import PdfReader
        reader = PdfReader(file_path)
        page_count = len(reader.pages)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        if text.strip():
            return text, page_count
    except Exception:
        pass

    # Fallback: pypdf
    try:
        from pypdf import PdfReader as PdfReader2
        reader2 = PdfReader2(file_path)
        page_count = len(reader2.pages)
        text = ""
        for page in reader2.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text, page_count
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")


# ───────────────────────────────────────────
# Text Splitting
# ───────────────────────────────────────────

def split_text(text: str) -> List[Document]:
    """
    Split extracted text into overlapping chunks for vector indexing.
    Returns a list of LangChain Document objects.
    """
    if not text.strip():
        raise ValueError("PDF appears to be empty or contains no extractable text.")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    docs = splitter.create_documents([text])
    return docs


# ───────────────────────────────────────────
# Full pipeline helper
# ───────────────────────────────────────────

def process_pdf(file_path: str):
    """
    Full pipeline: extract text → split into chunks.
    Returns (chunks, page_count, chunk_count).
    """
    text, page_count = extract_text(file_path)
    chunks = split_text(text)
    chunk_count = len(chunks)
    return chunks, page_count, chunk_count