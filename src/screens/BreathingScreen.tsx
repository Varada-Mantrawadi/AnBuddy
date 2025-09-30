import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BreathingScreen = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'Inhale'|'Hold'|'Exhale'>('Inhale');
  const [cycle, setCycle] = useState(0);

  const animateBreathing = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.3, duration: 4000, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.3, duration: 2000, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.0, duration: 4000, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished && isRunning) {
        setCycle(c => c + 1);
        animateBreathing();
      }
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning) {
      setPhase('Inhale');
      animateBreathing();
      let t = 0;
      interval = setInterval(() => {
        t = (t + 1) % 10;
        if (t < 4) { setPhase('Inhale'); }
        else if (t < 6) { setPhase('Hold'); }
        else { setPhase('Exhale'); }
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isRunning]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />
        <Text style={styles.phase}>{phase}</Text>
        <Text style={styles.cycle}>Cycles: {cycle}</Text>
        <TouchableOpacity 
          style={[styles.button, isRunning ? styles.stop : styles.start]}
          onPress={() => setIsRunning(s => !s)}
        >
          <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
        {!isRunning && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ color: '#666' }}>Press Start to begin guided breathing.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#2196F3' },
  phase: { marginTop: 24, fontSize: 24, fontWeight: '700', color: '#333' },
  cycle: { marginTop: 8, fontSize: 14, color: '#666' },
  button: { marginTop: 32, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  start: { backgroundColor: '#4CAF50' },
  stop: { backgroundColor: '#FF4444' },
  buttonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});

export default BreathingScreen;


