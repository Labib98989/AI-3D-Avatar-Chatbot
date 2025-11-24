from modules import router, memory, animator, responder

async def process_user_message(user_message: str):
    print(f"--- Processing: {user_message} ---")
    
    # 1. ROUTER: Analyze what the user wants
    # (Uses cheap Flash Lite model)
    analysis = router.analyze_intent(user_message)
    print(f"Router Analysis: {analysis}")
    
    # 2. MEMORY: Do we need context?
    history = []
    if analysis.get("requires_memory", True):
        history = memory.get_history()
        
    # 3. ANIMATION: Decide on the body language immediately
    # (Pure logic, no API cost)
    animation_trigger = animator.determine_animation(
        analysis.get("sentiment", "neutral"),
        analysis.get("intent", "chat")
    )
    
    # 4. RESPONDER: Generate the text
    # (Uses standard Flash model)
    bot_text = responder.generate_reply(user_message, history, analysis)
    
    # 5. SAVE: Update memory
    memory.save_interaction(user_message, bot_text)
    
    # 6. RETURN: Package everything for the Frontend
    return {
        "text": bot_text,
        "emotion": animation_trigger, # Unity will use this
        "debug_intent": analysis.get("intent") # Just for us to see
    }