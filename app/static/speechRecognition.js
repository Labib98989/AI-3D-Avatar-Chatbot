// web/hooks/speechRecognition.js
// Fixed: prevents repeating inputs and double callbacks.

let recognition = null;
let isListening = false;
let transcriptText = "";
let lastError = null;
let lastFinalTranscript = ""; 

function initRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("SpeechRecognition not supported in this browser.");
    lastError = "SpeechRecognition not supported";
    return null;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let interim = "";
    let finalText = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const { transcript } = event.results[i][0];
      if (event.results[i].isFinal) {
        finalText += transcript;
      } else {
        interim += transcript;
      }
    }

    // Merge transcripts
    const combined = finalText.trim() || interim.trim();
    transcriptText = combined;

    // 1. Handle Final Text
    if (
      finalText &&
      finalText.trim().length > 0 &&
      finalText.trim() !== lastFinalTranscript
    ) {
      lastFinalTranscript = finalText.trim();
      console.log("[DEBUG] Final Transcript:", lastFinalTranscript);
      if (typeof recognition.onTranscript === "function") {
        recognition.onTranscript(lastFinalTranscript);
      }
    } 
    // 2. Handle Interim Text (For UI Preview)
    else if (interim) {
      // If we have an interim listener, fire it
      if (typeof recognition.onInterim === "function") {
        recognition.onInterim(interim);
      }
    }
  };

  recognition.onerror = (event) => {
    lastError = event.error;
    console.error("Speech recognition error:", event.error);
    isListening = false;
  };

  recognition.onend = () => {
    console.log("[DEBUG] Recognition ended.");
    isListening = false;
  };

  return recognition;
}

// MODIFIED: Added onInterim parameter
export function startListening(onTranscript, onInterim) {
  if (!recognition) initRecognition();
  if (!recognition) return;

  if (isListening) {
    console.log("[DEBUG] Already listening.");
    return;
  }

  recognition.onTranscript = onTranscript;
  recognition.onInterim = onInterim; // Store the interim callback
  
  transcriptText = "";
  lastError = null;
  lastFinalTranscript = "";

  try {
    recognition.start();
    isListening = true;
    console.log("[DEBUG] Listening started.");
  } catch (e) {
    console.error("SpeechRecognition start failed:", e);
    lastError = e.message;
  }
}

export function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
    console.log("[DEBUG] Listening stopped.");
  }
}

export function getListeningStatus() {
  return isListening;
}

export function getTranscript() {
  return transcriptText;
}

export function getError() {
  return lastError;
}

export function isSpeechSupported() {
  return (
    "SpeechRecognition" in window || "webkitSpeechRecognition" in window
  );
}

window.addEventListener("beforeunload", () => {
  if (recognition && isListening) recognition.stop();
});