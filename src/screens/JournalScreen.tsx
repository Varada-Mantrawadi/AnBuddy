import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

type Entry = { id: number; text: string; timestamp: string };

const JournalScreen = () => {
  const [text, setText] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const STORAGE_KEY = 'journalCache';

  const load = async () => {
    try {
      const remote = await apiService.listJournalEntries();
      setEntries(remote);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
    } catch {
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) setEntries(JSON.parse(cached));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    const value = text.trim();
    if (!value) return;
    try {
      const res = await apiService.saveJournalEntry(value);
      if (!res.success) throw new Error('Save failed');
      setText('');
      load();
    } catch (e) {
      Alert.alert('Offline', 'Saving locally. Will sync when online.');
      const local: Entry = { id: Date.now(), text: value, timestamp: new Date().toISOString() };
      const next = [local, ...entries];
      setEntries(next);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setText('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="How are you feeling today?"
          multiline
        />
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={entries}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.entryTime}>{new Date(item.timestamp).toLocaleString()}</Text>
            <Text style={styles.entryText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  inputBox: { padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#eee' },
  input: { minHeight: 80, backgroundColor: '#F8F8F8', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0' },
  saveBtn: { marginTop: 12, alignSelf: 'flex-end', backgroundColor: '#4CAF50', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  saveText: { color: '#FFF', fontWeight: '700' },
  entry: { backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  entryTime: { color: '#999', fontSize: 12, marginBottom: 6 },
  entryText: { color: '#333', fontSize: 16 },
});

export default JournalScreen;


