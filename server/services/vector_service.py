import os
import logging
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings

logger = logging.getLogger(__name__)

VECTORSTORE_FOLDER = os.getenv("VECTORSTORE_FOLDER", "vectorstores")

_embeddings = None


def get_embeddings():
    global _embeddings
    if _embeddings is None:
        logger.info("Loading FastEmbed model (lightweight, no PyTorch)...")
        _embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
        logger.info("Embeddings model loaded successfully")
    return _embeddings


def build_vectorstore(chunks: list, session_id: str) -> FAISS:
    embeddings = get_embeddings()
    vectorstore = FAISS.from_documents(chunks, embeddings)
    save_path = os.path.join(VECTORSTORE_FOLDER, session_id)
    os.makedirs(save_path, exist_ok=True)
    vectorstore.save_local(save_path)
    logger.info(f"Vector store built and saved for session {session_id}")
    return vectorstore


def load_vectorstore(session_id: str) -> FAISS:
    embeddings = get_embeddings()
    save_path = os.path.join(VECTORSTORE_FOLDER, session_id)
    if not os.path.exists(save_path):
        raise FileNotFoundError(f"Vector store not found for session {session_id}")
    return FAISS.load_local(
        save_path,
        embeddings,
        allow_dangerous_deserialization=True
    )


def search(session_id: str, query: str, k: int = 10) -> list:
    vs = load_vectorstore(session_id)
    results = vs.similarity_search(query, k=k)
    return results


def delete_vectorstore(session_id: str):
    import shutil
    save_path = os.path.join(VECTORSTORE_FOLDER, session_id)
    if os.path.exists(save_path):
        shutil.rmtree(save_path)