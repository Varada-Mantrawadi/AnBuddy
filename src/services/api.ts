// API Configuration
const isIosSimulator = true; // quick heuristic; can be refined at runtime
// Use host.docker.internal for emulators that need to reach host; for iOS Simulator, localhost works.
const API_BASE_URL = 'http://localhost:5001/api';

// Types
export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  timestamp: string;
  message_id: number;
  error?: string;
}

export interface EmergencyContact {
  id: number;
  name: string;
  number: string;
  type: string;
  description: string;
}

export interface EmergencyContactsResponse {
  success: boolean;
  contacts: EmergencyContact[];
}

// API Service Class
class ApiService {
  private baseUrl: string;
  private authToken?: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token?: string) {
    this.authToken = token;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Send chat message
  async sendMessage(
    message: string, 
    conversationHistory: Message[]
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
        },
        body: JSON.stringify({
          message,
          conversation_history: conversationHistory.map(msg => ({
            id: msg.id,
            text: msg.text,
            isUser: msg.isUser,
            timestamp: msg.timestamp.toISOString(),
          })),
        }),
      });

      const data: ChatResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get response from chatbot');
      }

      return data;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }

  // Get emergency contacts
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    try {
      const response = await fetch(`${this.baseUrl}/emergency-contacts`, {
        headers: {
          ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
        },
      });
      const data: EmergencyContactsResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to fetch emergency contacts');
      }

      return data.contacts;
    } catch (error) {
      console.error('Emergency contacts API error:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const isHealthy = await this.healthCheck();
      return {
        connected: isHealthy,
        message: isHealthy 
          ? 'Successfully connected to AnBuddy backend' 
          : 'Backend is not responding'
      };
    } catch (error) {
      return {
        connected: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Journaling
  async saveJournalEntry(text: string): Promise<{ success: boolean }>{
    const response = await fetch(`${this.baseUrl}/journal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
      },
      body: JSON.stringify({ text, timestamp: new Date().toISOString() }),
    });
    return response.json();
  }

  async listJournalEntries(): Promise<Array<{ id: number; text: string; timestamp: string }>>{
    const response = await fetch(`${this.baseUrl}/journal`, {
      headers: {
        ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
      },
    });
    const data = await response.json();
    return data.entries || [];
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export for testing or custom configuration
export { ApiService }; 