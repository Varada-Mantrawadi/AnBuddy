import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../services/api';

type EmergencyContact = {
  id: number;
  name: string;
  number: string;
  description: string;
  type: 'emergency' | 'crisis' | 'support';
};

const defaultContacts: EmergencyContact[] = [];

const PanicScreen = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>(defaultContacts);

  useEffect(() => {
    (async () => {
      try {
        const list = await apiService.getEmergencyContacts();
        setContacts(list);
      } catch {
        setContacts([
          { id: 1, name: 'Emergency Helpline', number: '911', type: 'emergency', description: 'For immediate emergency assistance' },
          { id: 2, name: 'Crisis Hotline', number: '1-800-273-8255', type: 'crisis', description: '24/7 crisis support and suicide prevention' },
        ]);
      }
    })();
  }, []);

  const handleCall = (contact: EmergencyContact) => {
    setSelectedContact(contact);
    setShowConfirmation(true);
  };

  const confirmCall = () => {
    if (selectedContact) {
      setShowConfirmation(false);
      Linking.openURL(`tel:${selectedContact.number}`);
    }
  };

  const getContactStyle = (type: string) => {
    switch (type) {
      case 'emergency':
        return styles.emergencyContact;
      case 'crisis':
        return styles.crisisContact;
      default:
        return styles.supportContact;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Emergency Help</Text>
          <Text style={styles.subtitle}>You're not alone. Help is available.</Text>
        </View>

        <View style={styles.contactsContainer}>
          {contacts.map(contact => (
            <TouchableOpacity
              key={contact.id}
              style={[styles.contactCard, getContactStyle(contact.type)]}
              onPress={() => handleCall(contact)}
            >
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
              <Text style={styles.contactDescription}>{contact.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.breathingButton}>
          <Text style={styles.breathingButtonText}>Start Breathing Exercise</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showConfirmation}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Call {selectedContact?.name}?</Text>
            <Text style={styles.modalDescription}>
              You will be connected to {selectedContact?.number}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmCall}
              >
                <Text style={styles.confirmButtonText}>Call Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  contactsContainer: {
    marginBottom: 20,
  },
  contactCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emergencyContact: {
    backgroundColor: '#FF4444',
  },
  crisisContact: {
    backgroundColor: '#FF9800',
  },
  supportContact: {
    backgroundColor: '#4CAF50',
  },
  contactName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  contactNumber: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  breathingButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  breathingButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#EEE',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default PanicScreen;
