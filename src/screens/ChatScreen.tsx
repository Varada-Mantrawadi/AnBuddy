import { type ComponentClass } from 'react';
import { useState, useEffect, useRef, default as React } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Modal,
  Dimensions,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightTheme, darkTheme } from '../styles/theme';
import { apiService, Message, EmergencyContact } from '../services/api';

const { width } = Dimensions.get('window');

const AnimatedView = Animated.View as any;

const TypingIndicator = () => {
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(dot1, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2, {
            toValue: 1,
            duration: 400,
            delay: 200,
            useNativeDriver: true,
          }),
          Animated.timing(dot3, {
            toValue: 1,
            duration: 400,
            delay: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(dot1, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animate());
    };

    animate();
  }, []);

  return (
    <View style={styles.typingIndicator}>
      {[dot1, dot2, dot3].map((dot, index) => (
        <AnimatedView
          key={index}
          style={[
            styles.typingDot,
            {
              transform: [
                {
                  translateY: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const ChatScreen = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Hello! I'm AnBuddy. How are you feeling today?", 
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = React.useState('');
  const [showEmergencyModal, setShowEmergencyModal] = React.useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const panicButtonAnimation = React.useRef(new Animated.Value(1)).current;
  const modalAnimation = React.useRef(new Animated.Value(0)).current;

  // Check connection status on component mount
  useEffect(() => {
    checkConnection();
    loadEmergencyContacts();
  }, []);

  const checkConnection = async () => {
    try {
      const result = await apiService.testConnection();
      setIsConnected(result.connected);
      if (!result.connected) {
        Alert.alert(
          'Connection Issue',
          'Unable to connect to AnBuddy backend. Some features may not work properly.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      setIsConnected(false);
      console.error('Connection check failed:', error);
    }
  };

  const loadEmergencyContacts = async () => {
    try {
      const contacts = await apiService.getEmergencyContacts();
      setEmergencyContacts(contacts);
    } catch (error) {
      console.error('Failed to load emergency contacts:', error);
      // Fallback to default contacts
      setEmergencyContacts([
        { id: 1, name: 'Emergency Helpline', number: '911', type: 'emergency', description: 'For immediate emergency assistance' },
        { id: 2, name: 'Crisis Hotline', number: '1-800-273-8255', type: 'crisis', description: '24/7 crisis support and suicide prevention' },
        { id: 3, name: 'Therapist', number: '+1-555-0123', type: 'professional', description: 'Professional mental health support' },
      ]);
    }
  };

  const animatePanicButton = () => {
    Animated.sequence([
      Animated.timing(panicButtonAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(panicButtonAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePanicPress = () => {
    animatePanicButton();
    setShowEmergencyModal(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeEmergencyModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowEmergencyModal(false));
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage = { 
        id: Date.now(), 
        text: newMessage, 
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages((prev: Message[]) => [...prev, userMessage]);
      setNewMessage('');
      setIsTyping(true);

      try {
        // Send message to API
        const response = await apiService.sendMessage(newMessage, messages);
        
        const botMessage = { 
          id: response.message_id, 
          text: response.response, 
          isUser: false,
          timestamp: new Date(response.timestamp)
        };
        
        setMessages((prev: Message[]) => [...prev, botMessage]);
      } catch (error) {
        console.error('Failed to send message:', error);
        
        // Fallback response
        const fallbackMessage = { 
          id: Date.now() + 1, 
          text: "I'm having trouble connecting right now. Please try again in a moment, or if you need immediate help, use the SOS button.", 
          isUser: false,
          timestamp: new Date()
        };
        setMessages((prev: Message[]) => [...prev, fallbackMessage]);
        
        Alert.alert(
          'Connection Error',
          'Unable to send message. Please check your connection and try again.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsTyping(false);
      }
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const bubbleAnimation = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.spring(bubbleAnimation, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <AnimatedView
        style={[
          styles.messageRow,
          message.isUser ? styles.userRow : styles.botRow,
          {
            opacity: bubbleAnimation,
            transform: [
              {
                scale: bubbleAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            message.isUser ? styles.userMessage : styles.botMessage,
            { backgroundColor: message.isUser ? theme.colors.chat.userBubble : theme.colors.chat.botBubble }
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: message.isUser ? theme.colors.chat.userText : theme.colors.chat.botText }
            ]}
          >
            {message.text}
          </Text>
          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </AnimatedView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Connection Status Indicator */}
      {!isConnected && (
        <View style={styles.connectionWarning}>
          <Text style={styles.connectionWarningText}>
            ⚠️ Offline Mode - Limited functionality
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && (
          <View style={styles.typingContainer}>
            <TypingIndicator />
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.background,
              color: theme.colors.text.primary,
              borderColor: theme.colors.border
            }]}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.text.secondary}
            multiline
            editable={isConnected}
          />
          <TouchableOpacity
            style={[
              styles.sendButton, 
              { 
                backgroundColor: isConnected ? theme.colors.primary : '#CCCCCC'
              }
            ]}
            onPress={sendMessage}
            disabled={!isConnected}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <AnimatedView style={[
        styles.panicButtonContainer,
        { transform: [{ scale: panicButtonAnimation }] }
      ]}>
        <TouchableOpacity 
          style={styles.panicButton}
          onPress={handlePanicPress}
        >
          <Text style={styles.panicButtonText}>SOS</Text>
        </TouchableOpacity>
      </AnimatedView>

      <Modal
        visible={showEmergencyModal}
        transparent
        animationType="none"
      >
        <AnimatedView 
          style={[
            styles.modalOverlay,
            { opacity: modalAnimation }
          ]}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Emergency Contacts</Text>
            {emergencyContacts.map(contact => (
              <TouchableOpacity 
                key={contact.id}
                style={styles.contactButton}
                onPress={() => {
                  Alert.alert(
                    'Call Contact',
                    `Would you like to call ${contact.name}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Call', onPress: () => console.log(`Calling ${contact.number}`) }
                    ]
                  );
                }}
              >
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
                <Text style={styles.contactDescription}>{contact.description}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeEmergencyModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </AnimatedView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  connectionWarning: {
    backgroundColor: '#FFA500',
    padding: 8,
    alignItems: 'center',
  },
  connectionWarningText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userMessage: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingHorizontal: 25,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  panicButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    zIndex: 1000,
  },
  panicButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  panicButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  contactNumber: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  contactDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: '#EEE',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 8,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 2,
  },
});

export default ChatScreen; 