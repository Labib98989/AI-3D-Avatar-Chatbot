import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# We use the cheapest/fastest model for this "Administrative" task
ROUTER_MODEL = "gemini-2.5-flash-lite" 

def analyze_intent(user_text):
    """
    Analyzes user text to determine what the system needs to do.
    Returns a JSON object with intent, sentiment, and suggested_action.
    """
    
    prompt = f"""
    You are the Router for a 3D Avatar Chatbot.
    Analyze the following user input: "{user_text}"
    
    Return ONLY a raw JSON object (no markdown) with these fields:
    - "intent": "greeting", "question", "statement", "goodbye", or "unknown"
    - "sentiment": "positive", "negative", or "neutral"
    - "requires_memory": boolean (true if the user refers to past context like "what did I just say?")
    - "priority": "low" or "high"
    """

    try:
        response = client.models.generate_content(
            model=ROUTER_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json" # Enforce JSON output
            )
        )
        # Parse the JSON string into a Python Dictionary
        return json.loads(response.text)
    except Exception as e:
        print(f"Router Error: {e}")
        # Fallback if the router fails
        return {"intent": "chat", "sentiment": "neutral", "requires_memory": True}