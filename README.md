# QueryNest — AI Question Generator

> Upload any PDF. Generate smart MCQ, Short Answer, and True/False questions instantly using Llama 3.3 70B via Groq.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- A free Groq API key from [console.groq.com](https://console.groq.com)

---

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/querynest.git
cd querynest
```

---

### 2. Backend Setup

```bash
cd server

# Create virtual environment
python -m venv venv

# Activate it
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
```

Now open `server/.env` and add your Groq API key:

```env
GROQ_API_KEY=gsk_your_actual_key_here
```

Create required folders:

```bash
mkdir -p uploads vectorstores
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd client

# Install dependencies
npm install

# Start React dev server
npm start
```

Frontend runs at: `http://localhost:3000`

> The `"proxy": "http://localhost:8000"` in `package.json` forwards all `/api/*` requests to the backend automatically — no CORS issues in dev.

---

### 4. Full folder structure

```
querynest/
├── server/
│   ├── uploads/              ← uploaded PDFs (gitignored)
│   ├── vectorstores/         ← FAISS indexes (gitignored)
│   ├── routers/
│   │   ├── upload.py
│   │   ├── generate.py
│   │   └── download.py
│   ├── services/
│   │   ├── pdf_service.py
│   │   ├── vector_service.py
│   │   ├── ai_service.py
│   │   └── question_formatter.py
│   ├── models/
│   │   └── schemas.py
│   ├── app_state.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
└── client/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   ├── services/
    │   ├── App.jsx
    │   ├── index.js
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## ☁️ Deployment

### Backend → Render (Free)

1. Push your code to GitHub

2. Go to [render.com](https://render.com) → **New → Web Service**

3. Connect your GitHub repo

4. Configure the service:
   | Setting | Value |
   |---|---|
   | **Name** | querynest-api |
   | **Root Directory** | `server` |
   | **Runtime** | Python 3 |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | **Instance Type** | Free |

5. Add Environment Variables in Render dashboard:
   ```
   GROQ_API_KEY=gsk_your_key_here
   FRONTEND_URL=https://your-app.vercel.app
   UPLOAD_FOLDER=uploads
   VECTORSTORE_FOLDER=vectorstores
   MAX_FILE_SIZE_MB=10
   ```

6. Click **Deploy** — Render will install deps and start the server.

> ⚠️ **Important:** Render free tier has an ephemeral filesystem — uploaded PDFs and vectorstores are lost on redeploy. This is fine for demos. For production, add persistent storage.

> ⚠️ **Cold starts:** Free tier spins down after 15 min of inactivity. First request may take ~30 seconds.

---

### Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → **New Project**

2. Import your GitHub repo

3. Configure:
   | Setting | Value |
   |---|---|
   | **Framework Preset** | Create React App |
   | **Root Directory** | `client` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `build` |

4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-render-app.onrender.com
   ```

5. Click **Deploy**

6. Go back to Render and update `FRONTEND_URL` to your Vercel URL.

---

## 🔑 How to Get a Free Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up free with Gmail
3. Click **API Keys** in the navbar
4. Click **Create API Key**
5. Name it `querynest`
6. Copy the key → paste in `server/.env`

---

## 🧠 How It Works

```
User uploads PDF
      ↓
PyPDF2 extracts text
      ↓
LangChain splits into 1000-char chunks
      ↓
sentence-transformers embeds chunks (all-MiniLM-L6-v2)
      ↓
FAISS stores vectors locally
      ↓
User selects type / difficulty / count / topic
      ↓
FAISS similarity search retrieves top-10 relevant chunks
      ↓
Groq (llama-3.3-70b-versatile) generates questions as JSON
      ↓
Frontend displays flip cards + PDF download
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload PDF, returns `sessionId` |
| `GET` | `/api/upload/status/{sessionId}` | Check vectorstore ready |
| `POST` | `/api/generate` | Generate questions |
| `GET` | `/api/generate/{setId}` | Get specific question set |
| `GET` | `/api/download/{setId}` | Get data for PDF export |
| `GET` | `/api/download/history/{sessionId}` | Get all question sets |
| `DELETE` | `/api/download/history/{sessionId}` | Clear session |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Tailwind CSS + React Router v6 |
| Backend | FastAPI + Uvicorn |
| AI Framework | LangChain + LangChain-Groq |
| LLM | Llama 3.3 70B via Groq (free) |
| Embeddings | sentence-transformers all-MiniLM-L6-v2 (local, free) |
| Vector Store | FAISS (local, free) |
| PDF Parsing | PyPDF2 + pypdf |
| Frontend Deploy | Vercel (free) |
| Backend Deploy | Render (free) |

---

## ⚡ Tips for Best Results

- Use text-based PDFs (not scanned images)
- Smaller, focused PDFs produce better questions than 500-page books
- Use the **Topic Filter** to target specific chapters or concepts
- **Hard** difficulty works best with detailed technical documents
- **Mixed** mode is great for comprehensive exam prep

---

## 👥 Team

Built with ❤️ by a 2-person team using 100% free tools.