import os

VECTORSTORE_FOLDER = os.getenv("VECTORSTORE_FOLDER", "vectorstores")
_text_store = {}

def build_vectorstore(chunks: list, session_id: str):
    texts = [chunk.page_content for chunk in chunks]
    _text_store[session_id] = texts
    save_path = os.path.join(VECTORSTORE_FOLDER, session_id)
    os.makedirs(save_path, exist_ok=True)
    with open(os.path.join(save_path, "texts.txt"), "w", encoding="utf-8") as f:
        f.write("\n---\n".join(texts))
    return session_id

def load_vectorstore(session_id: str):
    if session_id in _text_store:
        return _text_store[session_id]
    save_path = os.path.join(VECTORSTORE_FOLDER, session_id, "texts.txt")
    if not os.path.exists(save_path):
        raise FileNotFoundError(f"Store not found for session {session_id}")
    with open(save_path, "r", encoding="utf-8") as f:
        texts = f.read().split("\n---\n")
    _text_store[session_id] = texts
    return texts

def search(session_id: str, query: str, k: int = 10) -> list:
    texts = load_vectorstore(session_id)
    return texts[:k]

def delete_vectorstore(session_id: str):
    import shutil
    _text_store.pop(session_id, None)
    save_path = os.path.join(VECTORSTORE_FOLDER, session_id)
    if os.path.exists(save_path):
        shutil.rmtree(save_path)