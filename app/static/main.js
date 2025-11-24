import { startListening, stopListening, getListeningStatus } from './speechRecognition.js';
import { speak, stopSpeaking } from './textToSpeech.js';

// Configuration
const API_URL = "/chat";
const AVATAR_NAME = "Veena";

// UI Elements
const micBtn = document.getElementById('mic-btn');
const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('chat-input');
const statusDiv = document.getElementById('status');

// --- 1. SPEECH RECOGNITION ---

micBtn.addEventListener('click', () => {
    if (getListeningStatus()) {
        stopListening();
        micBtn.classList.remove('listening');
        statusDiv.textContent = "Ready.";
    } else {
        // Start listening
        micBtn.classList.add('listening');
        statusDiv.textContent = "Listening...";
        chatInput.placeholder = "Listening...";
        
        startListening(
            // Callback 1: Final Text (User paused)
            (finalText) => {
                chatInput.value = finalText;
            },
            // Callback 2: Interim Text (Real-time preview)
            (interimText) => {
                chatInput.value = interimText;
            }
        );
    }
});

// --- 2. SEND MESSAGE ---

sendBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});

async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // 1. Stop Mic if running
    if (getListeningStatus()) {
        stopListening();
        micBtn.classList.remove('listening');
    }

    // 2. Lock UI
    chatInput.value = "";
    chatInput.disabled = true;
    sendBtn.disabled = true;
    statusDiv.textContent = "AI is thinking...";

    // 3. Unity: Start Thinking
    sendUnityMessage("TriggerThinking", "");

    try {
        // 4. Call API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();

        statusDiv.textContent = "AI is speaking...";

        // 5. Unity: Animation
        if (data.emotion === "wave") {
            sendUnityMessage("TriggerWave", "");
        }

        // 6. Speak + Lip Sync
        let lipSyncTimer = null;

        speak(data.text, 
            // onStart
            () => {
                lipSyncTimer = setInterval(() => {
                    const vol = (Math.random() * 0.8 + 0.2).toFixed(2);
                    sendUnityMessage("SetExternalLoudness", vol);
                }, 50);
            },
            // onEnd
            () => {
                clearInterval(lipSyncTimer);
                sendUnityMessage("SetExternalLoudness", "0");
                resetUI();
            }
        );

    } catch (error) {
        console.error(error);
        statusDiv.textContent = "Error: " + error.message;
        resetUI();
    }
}

function resetUI() {
    chatInput.disabled = false;
    sendBtn.disabled = false;
    statusDiv.textContent = "Ready.";
    chatInput.focus();
}

// --- UNITY BRIDGE ---
function sendUnityMessage(method, value) {
    if (typeof unityInstance !== "undefined") {
        try {
            unityInstance.SendMessage(AVATAR_NAME, method, value);
        } catch (e) {
            // Ignore if Unity is still loading
        }
    }
}