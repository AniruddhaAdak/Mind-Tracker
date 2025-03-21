from fastapi import FastAPI, HTTPException
import google.generativeai as genai

app = FastAPI()

# Configure the Gemini API with your key
genai.configure(api_key="AIzaSyAt2xeDF9iRPRABSuPBEUloEXWwon3mtSY")

@app.post("/ai/affirmations")
async def get_affirmation(mood: str):
    try:
        # Initialize the Gemini model
        model = genai.GenerativeModel("gemini-pro")
        # Generate content based on the user's mood
        response = model.generate_content(f"Generate a loving, positive affirmation for someone feeling {mood}")
        return {"affirmation": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/messages")
async def get_message(prompt: str):
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)
        return {"message": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))