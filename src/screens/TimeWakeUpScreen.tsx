// src/screens/TimeWakeUpScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { stopAlarm } from '../services/AlarmService';
import { useSleepStore } from '../store/useSleepStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TimeWakeUp'>;

const TimeWakeUpScreen = () => {
  const navigation = useNavigation<Nav>();
  const { resetAlarm } = useSleepStore();
  const pulse = new Animated.Value(1);

  useEffect(() => {
    // Анімація пульсу кнопки
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleDismiss = () => {
    stopAlarm();
    resetAlarm();
    navigation.navigate('WakeAlarm');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good Morning!</Text>
      <View style={styles.divider} />
      <Text style={styles.subGreeting}>You are arriving soon</Text>
      <Text style={styles.description}>Waking you at the optimal time</Text>

      <TouchableOpacity onPress={handleDismiss}>
        <Animated.View style={[styles.rippleButton, { transform: [{ scale: pulse }] }]}>
          <View style={styles.buttonCore} />
        </Animated.View>
      </TouchableOpacity>

      <Text style={styles.tapHint}>Tap to dismiss</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: { fontSize: 36, fontWeight: '700', color: '#FFF' },
  divider: { width: 60, height: 2, backgroundColor: '#7DE7EE', marginVertical: 16 },
  subGreeting: { fontSize: 18, color: '#7DE7EE' },
  description: { fontSize: 13, color: '#AAA', marginTop: 8, marginBottom: 48 },
  rippleButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(126, 231, 238, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#7DE7EE',
  },
  buttonCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7DE7EE',
  },
  tapHint: { color: '#555', marginTop: 24, fontSize: 13 },
});

export default TimeWakeUpScreen;
