# Livedrop – Simplified Deployment Guide

This guide explains how to **manually deploy** your Livedrop project and set up the **ngrok tunnel for the LLM (Google Colab)**.

---

## 1. Manual Deployment Overview

### 🧱 Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo.
2. Select your project (it auto-detects Next.js).
3. Add your environment variables under **Settings → Environment Variables**:

   ```bash
   NEXT_PUBLIC_API_URL=https://livedrop-patricksoueid.onrender.com
   ```
4. Click **Deploy**.

### ⚙️ Backend (Render)

1. Go to [render.com](https://render.com).
2. Create a **New Web Service** and connect your GitHub repo.
3. Set the root directory to the backend folder (e.g., `/apps/api`).
4. Set:

   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
5. Add these environment variables:

   ```bash
   PORT=8080
   MONGODB_URI=<your MongoDB URI>
   LLM_BASE_URL=https://<your-ngrok-url>.ngrok-free.app
   CORS_ALLOW_ORIGINS=["https://livedrop-patrick-soueid.vercel.app","https://*.vercel.app"]
   ```
6. Click **Deploy Web Service**.

### ☁️ MongoDB Atlas

1. Create a cluster in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Add your database user and copy the connection string.
3. Use it as the value for `MONGODB_URI` on Render.

---

## 2. Google Colab + ngrok Setup

You’ll run the LLM API on Colab and expose it with ngrok.

### 🧠 Steps in Colab:

1. Open your Colab notebook.
2. Run the cells in this order:
   1️⃣ **Install dependencies (pip install)**
   2️⃣ **Imports**
   3️⃣ **Load the LLM model**
   4️⃣ **Start Flask API** (with a `/generate` route)
   5️⃣ **Start ngrok tunnel**

### 🧩 Flask example:

```python
from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json(force=True)
    prompt = data.get('prompt', '')
    response = model.generate(prompt)  # assuming model is loaded above
    return jsonify({'text': response})
```

### 🌐 ngrok setup:

When you run the ngrok cell, Colab will ask for your **ngrok auth token** — paste it when prompted. It will output a public HTTPS URL like:

```
https://xxxxxx.ngrok-free.app
```

Copy this URL and paste it in your **Render environment variable** as `LLM_BASE_URL`.

> ✅ Keep your Colab notebook running; if it stops, the ngrok URL changes — update Render again.

---

## 3. Running Locally (optional)

If you want to test everything before deploying:

### Backend:

```bash
cd apps/api
npm install
npm run dev
```

### Frontend:

```bash
cd apps/storefront
npm install
npm run dev
```

### In Colab:

Run your notebook and get the ngrok URL → update `.env`.

Then open your browser at `http://localhost:3000`.

---

## 4. Summary

✅ **Frontend** → Vercel
✅ **Backend** → Render
✅ **LLM API** → Colab + ngrok
✅ **Database** → MongoDB Atlas

Make sure to keep Colab running while testing or demoing — once stopped, your backend loses access to the LLM endpoint.
