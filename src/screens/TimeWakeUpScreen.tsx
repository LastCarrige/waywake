import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

// Імпорти логіки від дівчат
import { stopAlarm } from '../services/AlarmService';
import { useSleepStore } from '../store/useSleepStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TimeWakeUp'>;

export default function TimeWakeUpScreen() {
  const navigation = useNavigation<Nav>();
  const { resetAlarm } = useSleepStore();

  // Твої анімації для 3-х хвиль
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startWave = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2500,
            easing: Easing.bezier(0.4, 0, 0.6, 1),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startWave(wave1, 0);
    startWave(wave2, 800);
    startWave(wave3, 1600);
  }, []);

  const handleDismiss = () => {
    stopAlarm(); // Зупиняємо звук
    resetAlarm(); // Скидаємо стан будильника в сторі
    navigation.navigate('SleepAnalysis'); // Переходимо до аналізу сну
  };

  const renderWave = (anim: Animated.Value) => {
    const scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 2.8],
    });
    const opacity = anim.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 0.6, 0],
    });

    return (
      <Animated.View style={[styles.rippleWave, { transform: [{ scale }], opacity }]} />
    );
  };

  return (
    <ImageBackground 
      source={require('../assets/images/TimeWakeUp.png')}
      style={styles.container}
    >
      <View style={styles.contentWrapper}>
        <Text style={styles.greeting}>Good Morning!</Text>
        <View style={styles.divider} />
        <Text style={styles.subGreeting}>You are arriving soon</Text>
        <Text style={styles.description}>Waking you at the optimal time</Text>

        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.buttonContainer}
            activeOpacity={1}
            onPress={handleDismiss}
          >
            {renderWave(wave1)}
            {renderWave(wave2)}
            {renderWave(wave3)}
            <View style={styles.buttonCore} />
          </TouchableOpacity>
        </View>
        <Text style={styles.tapHint}>Tap to dismiss</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contentWrapper: { alignItems: 'center', width: '100%' },
  greeting: { fontSize: 42, fontWeight: '700', color: 'white' },
  divider: { width: 250, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 25 },
  subGreeting: { fontSize: 24, color: 'white', marginBottom: 8 },
  description: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 80 },
  actionSection: { height: 150, justifyContent: 'center', alignItems: 'center' },
  buttonContainer: { width: 150, height: 150, justifyContent: 'center', alignItems: 'center' },
  buttonCore: { 
    width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#72D7FF', zIndex: 10,
    shadowColor: '#72D7FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 15, elevation: 10
  },
  rippleWave: { position: 'absolute', width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#72D7FF' },
  tapHint: { color: 'rgba(255,255,255,0.4)', marginTop: 24, fontSize: 13 },
});