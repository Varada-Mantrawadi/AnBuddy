// AnBuddy Web Demo - JavaScript
class AnBuddyWebDemo {
    constructor() {
        this.messages = [];
        this.isConnected = true;
        this.currentTheme = 'light';
        this.typingTimeout = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadEmergencyContacts();
        this.addWelcomeMessage();
        this.checkConnection();
    }

    initializeElements() {
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.sosButton = document.getElementById('sosButton');
        this.emergencyModal = document.getElementById('emergencyModal');
        this.closeModal = document.getElementById('closeModal');
        this.emergencyContacts = document.getElementById('emergencyContacts');
        this.themeToggle = document.getElementById('themeToggle');
    }

    setupEventListeners() {
        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        });

        // SOS button
        this.sosButton.addEventListener('click', () => this.showEmergencyModal());

        // Modal controls
        this.closeModal.addEventListener('click', () => this.hideEmergencyModal());
        this.emergencyModal.addEventListener('click', (e) => {
            if (e.target === this.emergencyModal) {
                this.hideEmergencyModal();
            }
        });

        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Load theme from localStorage
        const savedTheme = localStorage.getItem('anbuddy-theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            id: Date.now(),
            text: "Hello! I'm AnBuddy, your mental health companion. How are you feeling today?",
            isUser: false,
            timestamp: new Date()
        };
        this.addMessage(welcomeMessage);
    }

    async sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: text,
            isUser: true,
            timestamp: new Date()
        };
        this.addMessage(userMessage);

        // Clear input
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Try to get response from backend
            const response = await this.getAIResponse(text);
            this.hideTypingIndicator();
            
            const botMessage = {
                id: Date.now() + 1,
                text: response,
                isUser: false,
                timestamp: new Date()
            };
            this.addMessage(botMessage);
        } catch (error) {
            console.error('Failed to get AI response:', error);
            this.hideTypingIndicator();
            
            // Fallback response
            const fallbackMessage = {
                id: Date.now() + 1,
                text: this.getFallbackResponse(text),
                isUser: false,
                timestamp: new Date()
            };
            this.addMessage(fallbackMessage);
        }
    }

    async getAIResponse(message) {
        try {
            const response = await fetch('http://localhost:5001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversation_history: this.messages.map(msg => ({
                        id: msg.id,
                        text: msg.text,
                        isUser: msg.isUser,
                        timestamp: msg.timestamp.toISOString(),
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            throw error;
        }
    }

    getFallbackResponse(message) {
        const messageLower = message.toLowerCase();
        
        if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
            return "Hello! I'm AnBuddy, your mental health companion. How are you feeling today?";
        } else if (messageLower.includes('anxiety') || messageLower.includes('anxious') || messageLower.includes('worried')) {
            return "I understand anxiety can be really overwhelming. Would you like to talk about what's causing you to feel this way?";
        } else if (messageLower.includes('stress') || messageLower.includes('stressed') || messageLower.includes('overwhelmed')) {
            return "Stress can really take a toll on us. What's been stressing you out lately?";
        } else if (messageLower.includes('sad') || messageLower.includes('depressed') || messageLower.includes('down')) {
            return "I'm sorry you're feeling sad. It's okay to feel this way. Would you like to talk about what's been happening?";
        } else {
            return "I'm here to listen and support you. Can you tell me more about what you're going through?";
        }
    }

    addMessage(message) {
        this.messages.push(message);
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.isUser ? 'user' : 'bot'}`;
        
        messageElement.innerHTML = `
            <div class="message-bubble">
                <div class="message-text">${this.escapeHtml(message.text)}</div>
                <div class="message-time">${this.formatTime(message.timestamp)}</div>
            </div>
        `;
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async loadEmergencyContacts() {
        const contacts = [
            {
                id: 1,
                name: "Emergency Helpline",
                number: "911",
                type: "emergency",
                description: "For immediate emergency assistance"
            },
            {
                id: 2,
                name: "National Suicide Prevention Lifeline",
                number: "1-800-273-8255",
                type: "crisis",
                description: "24/7 crisis support and suicide prevention"
            },
            {
                id: 3,
                name: "Crisis Text Line",
                number: "Text HOME to 741741",
                type: "crisis",
                description: "Text-based crisis support"
            },
            {
                id: 4,
                name: "SAMHSA's National Helpline",
                number: "1-800-662-4357",
                type: "support",
                description: "Treatment referral and information service"
            }
        ];

        this.emergencyContacts.innerHTML = contacts.map(contact => `
            <div class="contact-item" onclick="alert('Calling ${contact.name}: ${contact.number}')">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-number">${contact.number}</div>
                <div class="contact-description">${contact.description}</div>
            </div>
        `).join('');
    }

    showEmergencyModal() {
        this.emergencyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideEmergencyModal() {
        this.emergencyModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    async checkConnection() {
        try {
            const response = await fetch('http://localhost:5001/api/health');
            const data = await response.json();
            
            if (data.status === 'healthy') {
                this.setConnectionStatus(true);
            } else {
                this.setConnectionStatus(false);
            }
        } catch (error) {
            this.setConnectionStatus(false);
        }
    }

    setConnectionStatus(connected) {
        this.isConnected = connected;
        const statusElement = this.connectionStatus;
        
        if (connected) {
            statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Connected</span>';
            statusElement.classList.remove('offline');
        } else {
            statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Offline</span>';
            statusElement.classList.add('offline');
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('anbuddy-theme', theme);
        
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnBuddyWebDemo();
});

// Add some demo functionality for interview purposes
window.demoFeatures = {
    // Simulate different scenarios
    simulateAnxiety: () => {
        const demo = window.anbuddyDemo;
        if (demo) {
            demo.messageInput.value = "I'm feeling really anxious about my upcoming presentation";
            demo.sendMessage();
        }
    },
    
    simulateStress: () => {
        const demo = window.anbuddyDemo;
        if (demo) {
            demo.messageInput.value = "Work has been so stressful lately";
            demo.sendMessage();
        }
    },
    
    toggleConnection: () => {
        const demo = window.anbuddyDemo;
        if (demo) {
            demo.setConnectionStatus(!demo.isConnected);
        }
    },
    
    showEmergency: () => {
        const demo = window.anbuddyDemo;
        if (demo) {
            demo.showEmergencyModal();
        }
    }
}; 