import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# Use the slightly smarter model for actual conversation
RESPONDER_MODEL = "gemini-2.5-flash" 

def generate_reply(user_text, history, intent_data):
    
    # We update the prompt to be explicit about WHERE the information comes from
    system_instruction = f"""
    You are a 3D Avatar. 
    User Sentiment: {intent_data['sentiment']}
    User Intent: {intent_data['intent']}
    
    IMPORTANT INSTRUCTIONS:
    1. You have a "Perfect Memory" of the conversation provided below.
    2. If the user asks "What is my name?" or "Check my name", YOU MUST check the "Chat History" section below.
    3. Do NOT say you cannot access personal info. You HAVE access to the chat history. Use it.
    4. Keep it short (under 2 sentences). 
    """
    
    # Build context string
    context_str = system_instruction + "\n\n=== CHAT HISTORY START ===\n"
    
    # We explicitly label the turns so the AI sees them clearly
    if not history:
        context_str += "(No history yet)\n"
    else:
        for turn in history:
            context_str += f"User: {turn['user']}\nAvatar: {turn['bot']}\n"
            
    context_str += "=== CHAT HISTORY END ===\n\n"
    context_str += f"User: {user_text}\nAvatar:"

    try:
        response = client.models.generate_content(
            model=RESPONDER_MODEL,
            contents=context_str
        )
        return response.text.strip()
    except Exception as e:
        return "I am having trouble speaking right now."