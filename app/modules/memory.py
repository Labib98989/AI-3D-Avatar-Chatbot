import json
import os

MEMORY_FILE = "memory.json"

def get_history(limit=5):
    """Returns the last N turns of conversation."""
    if not os.path.exists(MEMORY_FILE):
        return []
    try:
        with open(MEMORY_FILE, "r") as f:
            data = json.load(f)
            return data[-limit:] # Return only the last 'limit' items
    except:
        return []

def save_interaction(user_text, bot_text):
    """Appends the new interaction to the JSON file."""
    history = []
    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, "r") as f:
                history = json.load(f)
        except:
            pass
            
    history.append({"user": user_text, "bot": bot_text})
    
    # Optional: Keep file from growing forever (limit to last 50 turns)
    if len(history) > 50:
        history = history[-50:]
        
    with open(MEMORY_FILE, "w") as f:
        json.dump(history, f, indent=2)