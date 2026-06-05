# 📘 QueryNest — AI Question Generator

QueryNest is an AI-powered web application that generates high-quality, contextual questions from PDF documents using Large Language Models (LLMs). It is designed for students and educators to automate question creation for study and assessment.

---

## 🚀 Features

* 📄 Upload PDF documents (notes, textbooks, research papers)
* 🤖 AI-based question generation using Groq LLM
* 🧠 Supports multiple question types:

  * MCQ (Multiple Choice Questions)
  * Short Answer
  * True/False
  * Mixed Mode
* 🎯 Difficulty levels: Easy, Medium, Hard
* 🔢 Select number of questions (5–20)
* 📥 Download generated questions as PDF
* 🕘 Session-based history for previously generated questions
* ⚡ Fast processing using FAISS vector search

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router

### Backend

* FastAPI (Python)
* Uvicorn

### AI & Processing

* Groq API (Llama 3 model)
* LangChain
* FAISS (Vector Database)
* Sentence Transformers (Embeddings)

### Utilities

* PyPDF2 / pypdf (PDF parsing)
* jsPDF (PDF export)
* Axios

---

## ⚡ Key Highlights

* 🔍 Converts PDFs into embeddings using FAISS for semantic search
* 🤖 Generates context-aware questions using LLM
* 💡 Fully free tech stack (no paid APIs or services)
* ⚙️ Lightweight architecture with no database (session-based)
* 🎨 Clean and responsive UI inspired by modern EdTech platforms

---

## 📂 Project Structure

```
querynest/
├── client/        # React frontend
├── server/        # FastAPI backend
├── uploads/       # Uploaded PDFs
├── vectorstores/  # FAISS indexes
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-link>
cd querynest
```

### 2. Backend Setup

```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file in the server folder:

```
GROQ_API_KEY=your_api_key_here
```

---

## 📌 Use Case

* Students can generate practice questions from notes
* Educators can create assessments quickly
* Helps reduce manual effort in content creation

---

## 👨‍💻 Author

**Vinayak G Sanamani**
Full Stack Developer | DevOps & AWS Enthusiast

---
