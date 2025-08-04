# AnBuddy Web Demo

A beautiful, functional web demonstration of the AnBuddy mental health support chatbot.

## 🚀 Quick Start

1. **Start the Backend** (if not already running):
   ```bash
   cd ../chatbot-backend
   python app.py
   ```

2. **Open the Web Demo**:
   - Open `index.html` in your web browser
   - Or serve it with a local server:
     ```bash
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

## ✨ Features Demonstrated

### 🤖 AI Chat Interface
- **Real-time messaging** with typing indicators
- **AI-powered responses** from your Flask backend
- **Fallback responses** when backend is offline
- **Conversation history** maintained

### 🆘 Emergency Support
- **SOS Button** with animated feedback
- **Emergency Contacts Modal** with crisis hotlines
- **Click-to-call** simulation for emergency contacts

### 🎨 User Experience
- **Dark/Light Theme** toggle with smooth transitions
- **Responsive Design** works on all screen sizes
- **Modern UI** with animations and micro-interactions
- **Connection Status** indicator

### 🔧 Technical Features
- **Real API Integration** with your Flask backend
- **Error Handling** with graceful fallbacks
- **Local Storage** for theme preferences
- **Responsive Layout** for mobile and desktop

## 🎯 Interview Demo Script

### Opening (30 seconds)
*"This is AnBuddy, a mental health support chatbot. I've created both a React Native mobile app and this web demo to showcase the full-stack implementation."*

### Live Demo (3-4 minutes)

1. **Show the Interface**
   - Point out the clean, professional design
   - Show the connection status indicator
   - Demonstrate the theme toggle

2. **AI Chat Demo**
   - Type: *"I'm feeling anxious about my presentation tomorrow"*
   - Show the typing indicator
   - Display the empathetic AI response
   - Try another message: *"Work has been really stressful lately"*

3. **Emergency Features**
   - Click the red SOS button
   - Show the emergency contacts modal
   - Point out the crisis hotlines
   - Demonstrate the click-to-call functionality

4. **Technical Highlights**
   - Show the browser console to demonstrate API calls
   - Point out the real-time connection status
   - Demonstrate the fallback system by stopping the backend

5. **Responsive Design**
   - Resize the browser window to show mobile responsiveness
   - Show how the layout adapts

### Technical Talking Points

**"This web demo showcases:**
- **Full-stack integration** with the Flask backend
- **Real-time communication** with the AI chatbot
- **Modern web technologies** (ES6, CSS Grid, Flexbox)
- **Responsive design** principles
- **Error handling** and fallback systems
- **User experience** best practices"

## 🛠️ Technical Implementation

### Frontend Technologies
- **HTML5** with semantic markup
- **CSS3** with CSS Variables for theming
- **Vanilla JavaScript** (ES6+) with classes
- **Font Awesome** for icons
- **Google Fonts** (Inter) for typography

### Key Features
- **Real API Integration**: Connects to your Flask backend
- **Theme System**: CSS variables for easy theming
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized animations and efficient DOM updates

### Browser Console Commands
For demo purposes, you can use these commands in the browser console:

```javascript
// Simulate different scenarios
demoFeatures.simulateAnxiety();
demoFeatures.simulateStress();
demoFeatures.toggleConnection();
demoFeatures.showEmergency();
```

## 📱 Mobile Experience

The web demo is fully responsive and provides an excellent mobile experience:
- Touch-friendly interface
- Optimized for mobile screens
- Smooth animations on mobile devices
- Proper viewport handling

## 🔗 Integration with Backend

The web demo connects to your Flask backend running on `http://localhost:5001`:
- **Health Check**: Monitors backend status
- **Chat API**: Sends messages and receives AI responses
- **Error Handling**: Graceful fallback when backend is unavailable

## 🎨 Customization

The demo is easily customizable:
- **Colors**: Modify CSS variables in `styles.css`
- **Messages**: Update fallback responses in `script.js`
- **Contacts**: Modify emergency contacts in the JavaScript
- **Styling**: Adjust animations and layout in CSS

## 🚀 Deployment Ready

The web demo can be easily deployed to:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Any static hosting service**

Just update the API endpoint URLs for production deployment.

---

**Perfect for showcasing your AnBuddy project in interviews!** 🎉 