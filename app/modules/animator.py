def determine_animation(sentiment, intent):
    """
    Decides the animation trigger based on sentiment and intent.
    Returns a string key for Unity (e.g., 'Wave', 'Sad', 'Think').
    """
    
    # Priority Overrides
    if intent == "greeting":
        return "wave"
    if intent == "goodbye":
        return "wave"
    
    # Sentiment Mapping
    if sentiment == "positive":
        return "happy"
    elif sentiment == "negative":
        return "sad"
    elif intent == "question":
        return "thinking"
        
    return "idle" # Default