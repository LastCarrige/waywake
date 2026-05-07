// src/screens/SleepTrackingScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

import { useSensorData, startMockSensorData } from '../hooks/useSensorData';
import { useSleepStore } from '../store/useSleepStore';
import { resetProcessor } from '../services/SleepProcessor';
import { stopAlarm } from '../services/AlarmService';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SleepTracking'>;

const PHASE_COLORS: Record<string, string> = {
  wake:    '#5EEAD4',
  light:   '#60A5FA',
  deep:    '#2563EB',
  rem:     '#9333EA',
  unknown: '#444',
};

const SleepTrackingScreen = () => {
  const navigation = useNavigation<Nav>();
  const [time, setTime] = useState(new Date());

  // Підключаємо слухач нативних подій — КЛЮЧОВА ЧАСТИНА
useSensorData();

useEffect(() => {
  const stop = startMockSensorData();
  return stop;
}, []);
  const { currentPhase, alarmTriggered, resetAlarm, setTracking } = useSleepStore();

  // Оновлення годинника
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    setTracking(true);
    return () => {
      clearInterval(timer);
      setTracking(false);
    };
  }, []);

  // Авто-перехід при спрацюванні будильника
  useEffect(() => {
    if (alarmTriggered) {
      navigation.navigate('TimeWakeUp');
    }
  }, [alarmTriggered]);

  const handleStop = () => {
    resetProcessor();
    resetAlarm();
    stopAlarm();
    setTracking(false);
    navigation.navigate('TimeWakeUp');
  };

  const phaseColor = PHASE_COLORS[currentPhase] ?? PHASE_COLORS.unknown;

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>
        {time.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', hour12: false })}
      </Text>
      <Text style={styles.statusText}>Tracking Sleep...</Text>

      {/* Індикатор поточної фази */}
      <View style={[styles.phaseIndicator, { borderColor: phaseColor }]}>
        <Text style={[styles.phaseText, { color: phaseColor }]}>
          {currentPhase.toUpperCase()}
        </Text>
      </View>

      {/* Хвилі (SVG через react-native-svg якщо потрібно, або просто текст) */}
      <View style={styles.waveSection}>
        <Text style={styles.wavePlaceholder}>〜〜〜〜〜〜〜〜〜〜〜〜</Text>
      </View>

      <View style={styles.arrivalInfo}>
        <Text style={styles.arrivalLabel}>Arrival In</Text>
        <Text style={styles.arrivalTime}>45 min</Text>
      </View>

      <TouchableOpacity style={styles.stopBtn} onPress={handleStop}>
        <Text style={styles.stopBtnText}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  timeText: { fontSize: 48, fontWeight: '700', color: '#FFF' },
  statusText: { fontSize: 14, color: '#7DE7EE', marginTop: 8 },
  phaseIndicator: {
    marginTop: 32,
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  phaseText: { fontSize: 16, fontWeight: '700', letterSpacing: 3 },
  waveSection: { marginTop: 32 },
  wavePlaceholder: { fontSize: 24, color: '#435AB4', letterSpacing: 4 },
  arrivalInfo: {
    marginTop: 32,
    alignItems: 'center',
  },
  arrivalLabel: { color: '#AAA', fontSize: 13 },
  arrivalTime: { color: '#FFF', fontSize: 28, fontWeight: '700' },
  stopBtn: {
    marginTop: 48,
    backgroundColor: '#8E1EC6',
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 30,
  },
  stopBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default SleepTrackingScreen;
