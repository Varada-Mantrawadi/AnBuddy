import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState<string>('');
  const theme = React.useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem('userProfile');
        if (data) {
          const parsed = JSON.parse(data);
          setUserName(parsed?.name || '');
        }
      } catch {}
    })();
  }, []);

  const toggleTheme = () => { theme.toggle(); };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello{userName ? `, ${userName}` : ''}!</Text>
          <Text style={styles.question}>How are you feeling today?</Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={[styles.card, styles.chatCard]}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.cardTitle}>Start Chat</Text>
            <Text style={styles.cardDescription}>Talk to AnBuddy about anything</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.breathingCard]}
            onPress={() => navigation.navigate('Breathing')}
          >
            <Text style={styles.cardTitle}>Breathing Exercise</Text>
            <Text style={styles.cardDescription}>Take a moment to relax</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.journalCard]}
            onPress={() => navigation.navigate('Journal')}
          >
            <Text style={styles.cardTitle}>Journal</Text>
            <Text style={styles.cardDescription}>Write down your thoughts</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.resourcesCard]}
          >
            <Text style={styles.cardTitle}>Resources</Text>
            <Text style={styles.cardDescription}>Helpful tips and contacts</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.panicButton}
          onPress={() => navigation.navigate('Panic')}
        >
          <Text style={styles.panicButtonText}>EMERGENCY HELP</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.panicButton, { backgroundColor: '#607D8B', marginTop: 12 }]}
          onPress={async () => { 
            try {
              await AsyncStorage.removeItem('userProfile');
            } catch {}
            navigation.replace('SignIn');
          }}
        >
          <Text style={styles.panicButtonText}>Log out</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ alignSelf: 'center', marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#7E57C2' }}
          onPress={toggleTheme}
        >
          <Text style={{ color: '#FFF', fontWeight: '600' }}>{theme.isDark ? 'Light Mode' : 'Dark Mode'}</Text>
        </TouchableOpacity>
      </ScrollView>
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  question: {
    fontSize: 20,
    color: '#666',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 50) / 2,
    height: 150,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatCard: {
    backgroundColor: '#4CAF50',
  },
  breathingCard: {
    backgroundColor: '#2196F3',
  },
  journalCard: {
    backgroundColor: '#9C27B0',
  },
  resourcesCard: {
    backgroundColor: '#FF9800',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  panicButton: {
    backgroundColor: '#FF4444',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  panicButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;