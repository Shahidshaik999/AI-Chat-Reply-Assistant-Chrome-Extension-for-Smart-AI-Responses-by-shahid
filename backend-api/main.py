"""
AI Chat Reply Assistant - FastAPI Backend
Generates smart reply suggestions using Google Gemini AI
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import logging

from ai_service import AIService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Chat Reply Assistant API",
    description="Generate smart reply suggestions for chat messages",
    version="1.0.0"
)

# Configure CORS to allow Chrome extension to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your extension ID
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI service
ai_service = AIService()

# Request/Response models
class MessageRequest(BaseModel):
    message: str
    platform: str = "whatsapp"  # whatsapp or linkedin

class SuggestionsResponse(BaseModel):
    suggestions: List[str]
    original_message: str

# Health check endpoint
@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "AI Chat Reply Assistant",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Main endpoint to generate reply suggestions
@app.post("/generate-reply", response_model=SuggestionsResponse)
async def generate_reply(request: MessageRequest):
    """
    Generate 3 AI-powered reply suggestions for a given message
    
    Args:
        request: MessageRequest containing the message text and platform
        
    Returns:
        SuggestionsResponse with 3 reply suggestions
    """
    try:
        logger.info(f"Received message from {request.platform}: {request.message[:50]}...")
        
        # Validate input
        if not request.message or len(request.message.strip()) == 0:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        if len(request.message) > 5000:
            raise HTTPException(status_code=400, detail="Message too long (max 5000 characters)")
        
        # Generate suggestions using AI
        suggestions = await ai_service.generate_suggestions(
            message=request.message,
            platform=request.platform
        )
        
        logger.info(f"Generated {len(suggestions)} suggestions")
        
        return SuggestionsResponse(
            suggestions=suggestions,
            original_message=request.message
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate suggestions: {str(e)}")

# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
