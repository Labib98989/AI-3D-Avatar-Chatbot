# 3D AI Avatar Chatbot (FastAPI + Unity WebGL + Gemini 2.5)

A real-time interactive 3D avatar that you can talk to directly in the browser. 
It listens to your voice, processes the intent using Google's Gemini 2.5 Flash model, 
and responds with synchronized lip-sync and procedural animations.

![Demo Screenshot](path_to_screenshot.png) 
**

## 🛠️ Tech Stack
- **Frontend:** HTML5, Vanilla JavaScript (ES6 Modules)
- **3D Engine:** Unity 2022 (WebGL Build)
- **Backend:** Python FastAPI
- **AI Brain:** Google Gemini 2.5 Flash (via `google-genai` SDK)
- **Speech:** Web Speech API (STT) & Browser Synthesis (TTS)

## 🚀 Features
- **Real-time Voice Conversation:** Talk to the avatar using your microphone.
- **Smart Animation System:** The AI determines emotions (Happy, Wave, Thinking) and triggers Unity animations.
- **Lip Sync:** Procedural mouth movement synchronized with audio volume.
- **Modular Design:** Decoupled modules for Speech, TTS, and API logic.

## 📦 How to Run

### Option 1: Docker (Recommended)
1. Clone the repo.
2. Create a `.env` file with your API key: `GEMINI_API_KEY=your_key_here`
3. Run:
   ```bash

   docker compose up
