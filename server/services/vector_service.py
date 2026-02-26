import os
from typing import List

from langchain_core.documents import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# ───────────────────────────────────────────
# Local embeddings — 100% free, no API key
# Downloads model on first run (~90MB)
# ───────────────────────────────────────────

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"},
    encode_kwargs={"normalize_embeddings": True},
)

VECTORSTORE_FOLDER = os.getenv("VECTORSTORE_FOLDER", "vectorstores")


# ───────────────────────────────────────────
# Build & Save
# ───────────────────────────────────────────

def build_vectorstore(chunks: List[Document], session_id: str) -> FAISS:
    """
    Build a FAISS vector store from document chunks and persist it locally.
    """
    if not chunks:
        raise ValueError("No chunks provided to build vector store.")

    vectorstore = FAISS.from_documents(chunks, embeddings)

    save_path = os.path.join(VECTORSTORE_FOLDER, session_id)
    os.makedirs(save_path, exist_ok=True)
    vectorstore.save_local(save_path)

    return vectorstore


# ───────────────────────────────────────────
# Load
# ───────────────────────────────────────────

def load_vectorstore(session_id: str) -> FAISS:
    """
    Load a previously saved FAISS vector store for a session.
    """
    load_path = os.path.join(VECTORSTORE_FOLDER, session_id)

    if not os.path.exists(load_path):
        raise FileNotFoundError(
            f"Vector store not found for session '{session_id}'. "
            "Please upload a PDF first."
        )

    vectorstore = FAISS.load_local(
        load_path,
        embeddings,
        allow_dangerous_deserialization=True,
    )
    return vectorstore


# ───────────────────────────────────────────
# Similarity Search
# ───────────────────────────────────────────

def search(session_id: str, query: str, k: int = 10) -> List[Document]:
    """
    Retrieve the top-k most relevant chunks for a query.
    """
    vectorstore = load_vectorstore(session_id)
    results = vectorstore.similarity_search(query, k=k)
    return results


# ───────────────────────────────────────────
# Cleanup
# ───────────────────────────────────────────

def delete_vectorstore(session_id: str) -> None:
    """
    Remove a session's vector store from disk.
    """
    import shutil
    store_path = os.path.join(VECTORSTORE_FOLDER, session_id)
    if os.path.exists(store_path):
        shutil.rmtree(store_path)