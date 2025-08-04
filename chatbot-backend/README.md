# AnBuddy Chatbot Backend

A Flask-based backend API for the AnBuddy mental health support chatbot.

## Features

- **AI-Powered Responses**: Uses OpenAI GPT-3.5-turbo for intelligent, empathetic responses
- **Fallback System**: Contextual fallback responses when AI is unavailable
- **Mental Health Focus**: Specialized for mental health support conversations
- **Emergency Contacts**: API endpoint for emergency contact information
- **CORS Enabled**: Ready for React Native frontend integration

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Configuration**:
   ```bash
   cp env.example .env
   ```
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

3. **Run the Server**:
   ```bash
   python app.py
   ```
   The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/chat
Send a message to the chatbot.

**Request Body**:
```json
{
  "message": "I'm feeling anxious today",
  "conversation_history": [
    {
      "id": 1,
      "text": "Hello",
      "isUser": true,
      "timestamp": "2024-01-01T10:00:00"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "response": "I understand anxiety can be really overwhelming...",
  "timestamp": "2024-01-01T10:01:00",
  "message_id": 2
}
```

### GET /api/health
Health check endpoint.

### GET /api/emergency-contacts
Get emergency contact information.

## Integration with React Native

The backend is designed to work seamlessly with the AnBuddy React Native app. The API endpoints match the expected format for the mobile app's chat functionality.

## Security Notes

- Never commit your `.env` file to version control
- The OpenAI API key should be kept secure
- Consider implementing rate limiting for production use
- Add authentication for production deployments 