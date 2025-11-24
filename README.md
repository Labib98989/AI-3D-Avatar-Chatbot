# Veena: Interactive 3D AI Assistant

![Project Status](https://img.shields.io/badge/Status-Live-success) ![Docker](https://img.shields.io/badge/Docker-Supported-blue) ![Stack](https://img.shields.io/badge/Tech-FastAPI%20%7C%20Unity%20%7C%20Gemini-orange)

> **[🔴 LIVE DEMO: Chat with Veena Here](https://your-render-app-name.onrender.com)**
> *(Replace the link above once you deploy to Render)*

**Veena** is a real-time, full-stack 3D avatar chatbot. She listens to voice input via the browser, "thinks" using Google's Gemini 2.5 Flash model, and responds with synchronized lip-sync and procedural animations.

Unlike standard text chatbots, Veena is built to have **presence**. She waves when greeted, thinks when queried, and speaks naturally using browser-native text-to-speech.

<img width="1920" height="945" alt="{B86C0C54-6FC0-40B7-B6C6-DE4EDD5E0F74}" src="https://github.com/user-attachments/assets/3528f902-7157-4a56-a830-e50262b85b3c" />



---

## 🛠️ Tech Stack

### Frontend (The Body)
* **Unity 2022 (WebGL):** Handles the 3D rendering, skeletal animation, and state management.
* **JavaScript (ES6 Modules):**
    * **Web Speech API:** For real-time Speech-to-Text (STT).
    * **SpeechSynthesis API:** For Text-to-Speech (TTS).
    * **Custom Bridge:** A bidirectional communication layer connecting the HTML DOM to the Unity Instance.

### Backend (The Brain)
* **Python FastAPI:** High-performance async web server.
* **Google Gemini 2.5 Flash:** The LLM powering the conversation.
* **Google GenAI SDK:** For interfacing with the model.
* **Modular Architecture:** Separated logic for Routing (Intent detection), Animation logic, and Response generation.

### DevOps
* **Docker:** Containerized application for consistent deployment.
* **Render:** Cloud hosting platform (PaaS).

---

## ✨ Key Features

1.  **Voice-First Interface:** Talk naturally; no typing required (though a text fallback exists).
2.  **Procedural Lip Sync:** Mouth movements are calculated in real-time based on TTS audio volume, not pre-baked animations.
3.  **Smart Animation Router:** A dedicated "Router" AI analyzes user sentiment to trigger specific animations (Waving, Thinking, Sad, Happy) independent of the verbal response.
4.  **Context Aware:** Maintains conversation history for coherent multi-turn chats.
5.  **Mobile Optimized:** Includes specific C# optimizations (Frame Capping, Bone Weight Reduction) to run smoothly on mobile browsers.

---

## 🚀 How to Run Locally (Docker)

This is the recommended way to run the project. It ensures all dependencies match the production environment.

### Prerequisites
* Docker Desktop installed.
* A Google Gemini API Key.

### Steps
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/veena-avatar.git](https://github.com/yourusername/veena-avatar.git)
    cd veena-avatar
    ```

2.  **Create the Environment file:**
    Create a file named `.env` in the root folder and add your key:
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    ```

3.  **Build and Run:**
    ```bash
    docker compose up --build
    ```

4.  **Open in Browser:**
    Navigate to `http://localhost:8000`.

---

## 💻 How to Run Locally (Manual / No Docker)

If you want to modify the Python code directly without rebuilding containers.

1.  **Set up Python:**
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

2.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set Environment Variable:**
    Create a `.env` file (see above).

4.  **Run Server:**
    ```bash
    uvicorn app.main:app --reload
    ```

---

## ☁️ Deployment Guide (Render)

This project is configured for one-click deployment on **Render**.

1.  **Push to GitHub:** Ensure your code is in a public repository.
2.  **Create Web Service:** Go to [Render Dashboard](https://dashboard.render.com/) -> New Web Service.
3.  **Connect Repo:** Select your GitHub repository.
4.  **Select Runtime:** Choose **Docker**.
5.  **Environment Variables:**
    * Add a key named `GEMINI_API_KEY` and paste your Google key.
6.  **Deploy:** Click "Create Web Service".

*Note: HTTPS is required for the Microphone to work. Render provides this automatically.*

---

## 📂 Project Structure

```text
/
├── app/
│   ├── main.py              # FastAPI Entry Point
│   ├── controller.py        # Orchestrator (Links Router, Animator, Responder)
│   ├── modules/             # AI Logic Modules
│   └── static/
│       ├── index.html       # The Main UI
│       ├── main.js          # Frontend Controller
│       ├── speechRecognition.js
│       ├── textToSpeech.js
│       └── unity/           # The Compiled Unity WebGL Build
├── Dockerfile               # Production Image Build Instructions
├── docker-compose.yml       # Local Development Container Config
└── requirements.txt         # Python Dependencies


