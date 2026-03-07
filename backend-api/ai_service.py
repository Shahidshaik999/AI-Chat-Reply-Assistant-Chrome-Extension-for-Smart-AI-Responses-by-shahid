"""
AI Service for generating reply suggestions
Uses Groq API with Llama 3.1 model (fast and efficient!)
"""

import os
from typing import List
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AIService:
    def __init__(self):
        """Initialize the AI service with API credentials"""
        
        # Get API key from environment variable
        self.api_key = os.getenv("GROQ_API_KEY")
        
        if not self.api_key:
            raise ValueError(
                "GROQ_API_KEY not found in environment variables. "
                "Please create a .env file with your API key."
            )
        
        # Initialize Groq client
        self.client = Groq(api_key=self.api_key)
        self.model = "llama-3.1-8b-instant"
        
        print(f"✓ AI Service initialized with Groq API ({self.model})")
    
    async def generate_suggestions(self, message: str, platform: str = "whatsapp") -> List[str]:
        """
        Generate 3 reply suggestions for a given message
        
        Args:
            message: The incoming message text
            platform: The platform (whatsapp or linkedin)
            
        Returns:
            List of 3 reply suggestions
        """
        
        # Create the prompt
        prompt = self._create_prompt(message, platform)
        
        try:
            # Generate response using Groq
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful AI assistant that generates short, natural reply suggestions for chat messages."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=200,
            )
            
            # Parse the response
            response_text = chat_completion.choices[0].message.content
            suggestions = self._parse_response(response_text)
            
            # Ensure we have exactly 3 suggestions
            if len(suggestions) < 3:
                suggestions.extend([
                    "Thank you for your message!",
                    "I'll get back to you soon.",
                    "Sounds good!"
                ][:3 - len(suggestions)])
            
            return suggestions[:3]
            
        except Exception as e:
            print(f"Error calling Groq API: {str(e)}")
            # Return fallback suggestions
            return self._get_fallback_suggestions(platform)
    
    def _create_prompt(self, message: str, platform: str) -> str:
        """Create the AI prompt for generating suggestions"""
        
        context = ""
        if platform == "linkedin":
            context = "This is a professional LinkedIn conversation. Keep replies professional and business-appropriate."
        else:
            context = "This is a casual chat conversation. Keep replies friendly and natural."
        
        prompt = f"""You are an AI communication assistant that helps people reply to messages.

{context}

Generate exactly 3 short reply suggestions for the following message.

Rules:
1. Each reply must be SHORT (maximum 15 words)
2. Replies must be grammatically correct
3. Use natural, conversational language
4. Be polite and friendly
5. Vary the tone: one professional, one casual, one neutral
6. Do NOT use quotes around the replies
7. Number each reply (1., 2., 3.)

Message: "{message}"

Generate 3 reply suggestions:"""

        return prompt
    
    def _parse_response(self, response_text: str) -> List[str]:
        """Parse the AI response into a list of suggestions"""
        
        suggestions = []
        lines = response_text.strip().split('\n')
        
        for line in lines:
            line = line.strip()
            
            # Remove numbering (1., 2., 3., etc.)
            if line and (line[0].isdigit() or line.startswith('-') or line.startswith('*')):
                # Remove common prefixes
                line = line.lstrip('0123456789.-*) ')
                
            # Remove quotes if present
            line = line.strip('"\'')
            
            if line and len(line) > 5:  # Valid suggestion
                suggestions.append(line)
        
        return suggestions
    
    def _get_fallback_suggestions(self, platform: str) -> List[str]:
        """Return fallback suggestions if AI fails"""
        
        if platform == "linkedin":
            return [
                "Thank you for reaching out. I'll review this and get back to you.",
                "I appreciate your message. Let me check on this.",
                "Thanks for the information. I'll follow up shortly."
            ]
        else:
            return [
                "Thanks for letting me know!",
                "Got it, I'll get back to you soon.",
                "Sounds good, talk to you later!"
            ]


# Alternative implementations available:
# - Google Gemini: Use google-generativeai package
# - OpenAI: Use openai package
# - Anthropic Claude: Use anthropic package
# 
# Groq is chosen for speed and cost-effectiveness!
