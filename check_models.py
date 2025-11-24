'''import os
from dotenv import load_dotenv
from google import genai

# 1. Load the API key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Error: GEMINI_API_KEY not found in .env")
    exit()

# 2. Initialize the NEW Client (Note the import change!)
client = genai.Client(api_key=api_key)

print(f"Checking models for SDK: google-genai (Nov 2025 standard)...\n")

try:
    # 3. List models using the new method
    # In the new SDK, we iterate through the models paginator
    for m in client.models.list():
        # We filter for models that support generating content
        if "generateContent" in m.supported_actions:
             # Highlight the newest ones
            prefix = "- "
            if "gemini-3" in m.name:
                prefix = "★ " # Star the new stuff
            elif "gemini-2.5" in m.name:
                prefix = "☆ "
            
            print(f"{prefix}{m.name}")
            
except Exception as e:
    print(f"Error: {e}")'''