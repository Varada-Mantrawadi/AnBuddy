from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
import json
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI (you'll need to set OPENAI_API_KEY in .env file)
openai.api_key = os.getenv('OPENAI_API_KEY')

# Mental health conversation context
MENTAL_HEALTH_CONTEXT = """
You are AnBuddy, a compassionate AI mental health companion. Your role is to:
1. Provide empathetic and supportive responses
2. Help users process their emotions
3. Offer coping strategies when appropriate
4. Recognize when professional help might be needed
5. Maintain a warm, non-judgmental tone
6. Never give medical advice or diagnose conditions

Always respond in a caring, supportive manner. If someone expresses severe distress or suicidal thoughts, 
encourage them to contact emergency services or a crisis hotline.
"""

# Fallback responses when OpenAI is not available
FALLBACK_RESPONSES = {
    "greeting": [
        "Hello! I'm AnBuddy, your mental health companion. How are you feeling today?",
        "Hi there! I'm here to listen and support you. What's on your mind?",
        "Welcome! I'm AnBuddy. I'm here to chat and support you through whatever you're going through."
    ],
    "anxiety": [
        "I understand anxiety can be really overwhelming. Would you like to talk about what's causing you to feel this way?",
        "It sounds like you're dealing with some anxiety. Remember, it's okay to feel this way. What's been happening?",
        "Anxiety can feel really intense. Let's talk about what's going on - sometimes just sharing can help."
    ],
    "stress": [
        "Stress can really take a toll on us. What's been stressing you out lately?",
        "I hear you're feeling stressed. That's completely valid. Would you like to talk about what's been going on?",
        "Stress is tough to deal with. Let's work through this together. What's been on your mind?"
    ],
    "sadness": [
        "I'm sorry you're feeling sad. It's okay to feel this way. Would you like to talk about what's been happening?",
        "Sadness can be really heavy to carry alone. I'm here to listen if you want to share what's going on.",
        "I hear that you're feeling down. That's really hard. What's been contributing to these feelings?"
    ],
    "default": [
        "I'm here to listen and support you. Can you tell me more about what you're going through?",
        "Thank you for sharing that with me. How are you feeling about it?",
        "I appreciate you opening up to me. What would be most helpful for you right now?"
    ]
}

def get_fallback_response(user_message):
    """Get a contextual fallback response based on user message"""
    message_lower = user_message.lower()
    
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'start']):
        return FALLBACK_RESPONSES["greeting"]
    elif any(word in message_lower for word in ['anxiety', 'anxious', 'worried', 'nervous']):
        return FALLBACK_RESPONSES["anxiety"]
    elif any(word in message_lower for word in ['stress', 'stressed', 'overwhelmed', 'pressure']):
        return FALLBACK_RESPONSES["stress"]
    elif any(word in message_lower for word in ['sad', 'depressed', 'down', 'blue', 'hopeless']):
        return FALLBACK_RESPONSES["sadness"]
    else:
        return FALLBACK_RESPONSES["default"]

def get_openai_response(user_message, conversation_history=None):
    """Get response from OpenAI API"""
    try:
        if not openai.api_key:
            raise Exception("OpenAI API key not configured")
        
        messages = [
            {"role": "system", "content": MENTAL_HEALTH_CONTEXT}
        ]
        
        # Add conversation history if provided
        if conversation_history:
            for msg in conversation_history[-10:]:  # Keep last 10 messages for context
                messages.append({
                    "role": "user" if msg["isUser"] else "assistant",
                    "content": msg["text"]
                })
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=150,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return None

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        conversation_history = data.get('conversation_history', [])
        
        if not user_message:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400
        
        # Try to get response from OpenAI
        ai_response = get_openai_response(user_message, conversation_history)
        
        # If OpenAI fails, use fallback responses
        if not ai_response:
            fallback_options = get_fallback_response(user_message)
            import random
            ai_response = random.choice(fallback_options)
        
        response_data = {
            'success': True,
            'response': ai_response,
            'timestamp': datetime.now().isoformat(),
            'message_id': len(conversation_history) + 2
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AnBuddy Chatbot API',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/emergency-contacts', methods=['GET'])
def get_emergency_contacts():
    """Get emergency contact information"""
    contacts = [
        {
            "id": 1,
            "name": "Emergency Helpline",
            "number": "911",
            "type": "emergency",
            "description": "For immediate emergency assistance"
        },
        {
            "id": 2,
            "name": "National Suicide Prevention Lifeline",
            "number": "1-800-273-8255",
            "type": "crisis",
            "description": "24/7 crisis support and suicide prevention"
        },
        {
            "id": 3,
            "name": "Crisis Text Line",
            "number": "Text HOME to 741741",
            "type": "crisis",
            "description": "Text-based crisis support"
        },
        {
            "id": 4,
            "name": "SAMHSA's National Helpline",
            "number": "1-800-662-4357",
            "type": "support",
            "description": "Treatment referral and information service"
        }
    ]
    
    return jsonify({
        'success': True,
        'contacts': contacts
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True) 