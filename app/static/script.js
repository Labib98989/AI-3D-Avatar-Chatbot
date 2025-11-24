// Configuration
const API_URL = "/chat"; 
const AVATAR_NAME = "Veena";

// Elements
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const statusDiv = document.getElementById('status');

// Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;

recognition.lang = 'en-US';
recognition.interimResults = true; 

// flag to prevent rapid-fire clicking
let isMicBusy = false;

// --- 1. VOICE INPUT ---

micBtn.addEventListener('click', () => {
    // If we are in the middle of starting/stopping, ignore the click
    if (isMicBusy) return;
    
    isMicBusy = true; // Lock the button

    if (micBtn.classList.contains('listening')) {
        recognition.stop();
    } else {
        try {
            recognition.start();
        } catch (err) {
            console.warn("Mic start error:", err);
            isMicBusy = false; // Unlock if it failed
        }
    }
});

recognition.onstart = () => {
    isMicBusy = false; // Unlock: We successfully started
    micBtn.classList.add('listening');
    statusDiv.textContent = "Listening...";
    if (!chatInput.value) { 
        chatInput.placeholder = "Listening...";
    }
};

recognition.onend = () => {
    isMicBusy = false; // Unlock: We successfully stopped
    micBtn.classList.remove('listening');
    statusDiv.textContent = "Ready.";
    chatInput.placeholder = "Type a message...";
};

recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

    chatInput.value = transcript;
};

recognition.onerror = (event) => {
    isMicBusy = false; // Unlock on error
    console.warn("Speech Error:", event.error);
    
    if (event.error === 'no-speech') return; 

    statusDiv.textContent = "Mic Error: " + event.error;
    micBtn.classList.remove('listening');
};

// --- 2. SENDING MESSAGE ---

sendBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        sendMessageToAI(message);
        chatInput.value = ""; 
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = chatInput.value.trim();
        if (message) {
            sendMessageToAI(message);
            chatInput.value = "";
        }
    }
});

// --- 3. API & AVATAR LOGIC ---

async function sendMessageToAI(message) {
    statusDiv.textContent = "AI is thinking...";
    
    // Disable controls
    chatInput.disabled = true;
    sendBtn.disabled = true;
    micBtn.disabled = true;
    
    sendUnityMessage("TriggerThinking", ""); 

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        statusDiv.textContent = "AI is speaking...";
        
        if (data.emotion === "wave") {
            sendUnityMessage("TriggerWave", ""); 
        }
        
        speak(data.text);
        
    } catch (error) {
        statusDiv.textContent = "Error: " + error;
        chatInput.disabled = false;
        sendBtn.disabled = false;
        micBtn.disabled = false;
    }
}

// --- 4. TTS & LIP SYNC ---

function speak(text) {
    if (synth.speaking) return;

    const utterThis = new SpeechSynthesisUtterance(text);
    
    // Voice Selection
    const voices = synth.getVoices();
    const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google US English'));
    if (femaleVoice) utterThis.voice = femaleVoice;

    let lipSyncInterval;

    utterThis.onstart = function() {
        lipSyncInterval = setInterval(() => {
            const volume = (Math.random() * 0.8 + 0.2).toFixed(2);
            sendUnityMessage("SetExternalLoudness", volume);
        }, 50);
    };

    utterThis.onend = function () {
        clearInterval(lipSyncInterval);
        sendUnityMessage("SetExternalLoudness", "0");
        
        statusDiv.textContent = "Ready.";
        chatInput.disabled = false;
        sendBtn.disabled = false;
        micBtn.disabled = false;
        chatInput.focus();
    };

    synth.speak(utterThis);
}

function sendUnityMessage(methodName, value) {
    if (typeof unityInstance !== "undefined") {
        try {
            unityInstance.SendMessage(AVATAR_NAME, methodName, value);
        } catch (e) {
            if (e.message.includes("undefined")) return;
            console.warn("Unity send failed:", e);
        }
    }
}