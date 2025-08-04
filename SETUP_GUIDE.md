# AnBuddy - Complete Setup Guide

## Project Overview

**AnBuddy** is a React Native mental health support chatbot application that provides users with an AI-powered companion for emotional support and crisis intervention.

### Key Features
- 🤖 **AI-Powered Chatbot**: Intelligent, empathetic responses using OpenAI GPT-3.5-turbo
- 🆘 **Emergency Support**: SOS button with immediate access to crisis hotlines
- 📱 **Cross-Platform**: Works on both iOS and Android
- 🌙 **Dark/Light Theme**: Adaptive UI based on user preferences
- 🔄 **Real-time Chat**: Live conversation with typing indicators
- 📊 **Connection Status**: Visual feedback for backend connectivity

## Architecture

```
AnBuddy/
├── React Native App (Frontend)
│   ├── Chat Interface
│   ├── Emergency Contacts
│   ├── Navigation
│   └── API Integration
└── Flask Backend (Chatbot API)
    ├── OpenAI Integration
    ├── Fallback Responses
    ├── Emergency Contacts API
    └── Health Monitoring
```

## Prerequisites

- Node.js (v18 or higher)
- Python 3.8+ (for backend)
- React Native development environment
- OpenAI API key

## Step 1: Backend Setup

### 1.1 Install Python Dependencies

```bash
cd chatbot-backend
pip install -r requirements.txt
```

### 1.2 Configure Environment

```bash
cp env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_openai_api_key_here
PORT=5000
FLASK_ENV=development
```

### 1.3 Start the Backend Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 1.4 Test Backend

```bash
# Health check
curl http://localhost:5000/api/health

# Test chat endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "conversation_history": []}'
```

## Step 2: Frontend Setup

### 2.1 Install Dependencies

```bash
npm install
```

### 2.2 iOS Setup (if developing for iOS)

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### 2.3 Start Metro Bundler

```bash
npm start
```

### 2.4 Run the App

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## Step 3: API Integration

The React Native app automatically connects to the backend API. The integration includes:

- **Real-time Chat**: Messages sent to `/api/chat` endpoint
- **Emergency Contacts**: Fetched from `/api/emergency-contacts`
- **Health Monitoring**: Connection status via `/api/health`
- **Error Handling**: Graceful fallbacks when backend is unavailable

## Step 4: Testing

### 4.1 Run Tests

```bash
npm test
```

### 4.2 Manual Testing

1. **Chat Functionality**: Send messages and verify AI responses
2. **Emergency Features**: Test SOS button and contact modal
3. **Offline Mode**: Disconnect backend and test fallback behavior
4. **Theme Switching**: Test dark/light mode transitions

## API Endpoints

### POST /api/chat
Send a message to the chatbot.

**Request:**
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

**Response:**
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

## Development Workflow

### Backend Development
1. Modify `chatbot-backend/app.py` for API changes
2. Update fallback responses in the `FALLBACK_RESPONSES` dictionary
3. Test with curl or Postman
4. Restart Flask server: `python app.py`

### Frontend Development
1. Modify React Native components in `src/`
2. Update API service in `src/services/api.ts`
3. Test on device/simulator
4. Hot reload available with Metro bundler

## Deployment

### Backend Deployment
- Deploy Flask app to Heroku, AWS, or similar
- Set environment variables for production
- Configure CORS for production domain
- Add authentication for production use

### Frontend Deployment
- Build Android APK: `cd android && ./gradlew assembleRelease`
- Build iOS app through Xcode
- Distribute through app stores

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Check if Flask server is running
   - Verify port 5000 is not blocked
   - Check firewall settings

2. **OpenAI API Errors**
   - Verify API key is correct
   - Check API quota and billing
   - Ensure internet connectivity

3. **React Native Build Issues**
   - Clear Metro cache: `npm start -- --reset-cache`
   - Clean and rebuild: `cd android && ./gradlew clean`

4. **iOS Build Issues**
   - Update CocoaPods: `cd ios && bundle exec pod install`
   - Clean Xcode build folder

## Security Considerations

- Never commit `.env` files to version control
- Use HTTPS in production
- Implement rate limiting
- Add user authentication
- Secure API keys and secrets
- Regular security updates

## Future Enhancements

- User authentication and profiles
- Conversation history persistence
- Advanced NLP and sentiment analysis
- Integration with professional mental health services
- Push notifications for check-ins
- Analytics and usage insights
- Multi-language support

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Test with provided curl examples
4. Check console logs for detailed error messages

## License

This project is for educational and demonstration purposes. Please ensure compliance with OpenAI's usage policies and local regulations regarding mental health applications. 