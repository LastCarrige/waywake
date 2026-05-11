import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

// Імпорти логіки від дівчат
import { useSensorData, startMockSensorData } from '../hooks/useSensorData';
import { useSleepStore } from '../store/useSleepStore';
import { resetProcessor } from '../services/SleepProcessor';
import { stopAlarm } from '../services/AlarmService';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'SleepTracking'>;

const PHASE_COLORS: Record<string, string> = {
  wake:    '#5EEAD4',
  light:   '#60A5FA',
  deep:    '#2563EB',
  rem:     '#9333EA',
  unknown: '#444',
};

export default function SleepTrackingScreen() {
  const navigation = useNavigation<Nav>();
  const { isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  // --- ЛОГІКА ДАТЧИКІВ ТА СТОРУ ---
  useSensorData(); // Слухаємо нативні датчики
  const { currentPhase, alarmTriggered, resetAlarm, setTracking } = useSleepStore();

  useEffect(() => {
    const stopMock = startMockSensorData(); // Запуск симуляції даних для тесту
    setTracking(true);
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      stopMock();
      clearInterval(timer);
      setTracking(false);
    };
  }, []);

  // Авто-перехід, якщо спрацював розумний будильник
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

  // --- ТВОЯ АНІМАЦІЯ ХВИЛЬ ---
  const moveAnim1 = useRef(new Animated.Value(0)).current;
  const moveAnim2 = useRef(new Animated.Value(0)).current;
  const moveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createSmoothWaveAnimation = (anim: Animated.Value, distance: number, duration: number, delay: number = 0) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: distance,
            duration: duration,
            easing: Easing.bezier(0.42, 0, 0.58, 1), 
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: -distance,
            duration: duration,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createSmoothWaveAnimation(moveAnim1, 12, 4000, 0);
    createSmoothWaveAnimation(moveAnim2, -9, 3500, 500);
    createSmoothWaveAnimation(moveAnim3, 10, 5000, 1000);
  }, []);

  const phaseColor = PHASE_COLORS[currentPhase] ?? PHASE_COLORS.unknown;
  const textColor = isDark ? '#ffffff' : '#071225';

  return (
    <ImageBackground 
      source={isDark ? require('../../assets/images/background1.png') : require('../../assets/images/background_light.png')} 
      style={[styles.container, { backgroundColor: isDark ? '#071225' : '#F0F4F8' }]}
      resizeMode="cover"
    >
      <View style={styles.smallLogoContainer}>
        <Image source={require('../../assets/images/logo_bg.png')} style={styles.logoLayer} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_moon.png')} style={[styles.logoLayer, { width: '60%', height: '60%' }]} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_pin.png')} style={[styles.logoLayer, { width: '40%', height: '40%' }]} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_dot.png')} style={[styles.logoLayer, { width: '15%', height: '15%' }]} resizeMode="contain" />
      </View>

      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtnCircle} onPress={() => navigation.goBack()}>
            <Text style={[styles.backArrow, { color: textColor }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Tracking</Text>
        </View>
        <Image source={require('../../assets/images/Header-line.png')} style={[styles.headerLine, { tintColor: textColor }]} resizeMode="stretch" />
      </View>

      <View style={styles.clockSection}>
        <Text style={[styles.currentTimeText, { color: textColor }]}>
          {currentTime.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        
        {/* Індикатор фази (динамічний колір від дівчат) */}
        <View style={[styles.phaseIndicator, { borderColor: phaseColor }]}>
          <Text style={[styles.phaseText, { color: phaseColor }]}>
            {currentPhase.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.waveContainer}>
        <Animated.Image source={require('../../assets/images/wave1.png')} style={[styles.waveItem, { transform: [{ translateX: moveAnim1 }] }]} resizeMode="stretch" />
        <Animated.Image source={require('../../assets/images/wave2.png')} style={[styles.waveItem, styles.waveLayer2, { transform: [{ translateX: moveAnim2 }] }]} resizeMode="stretch" />
        <Animated.Image source={require('../../assets/images/wave3.png')} style={[styles.waveItem, styles.waveLayer3, { transform: [{ translateX: moveAnim3 }] }]} resizeMode="stretch" />
      </View>

      <View style={styles.arrivalInfo}>
        <Text style={[styles.arrivalLabel, { color: textColor }]}>Arrival In</Text>
        <Text style={styles.timeRemaining}>45 min</Text>
      </View>

      <TouchableOpacity style={styles.stopBtn} onPress={handleStop}>
        <Text style={styles.stopBtnText}>Stop</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25, paddingTop: 60, paddingBottom: 30 },
  smallLogoContainer: { position: 'absolute', top: 50, right: 20, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  logoLayer: { position: 'absolute', width: '100%', height: '100%' },
  header: { marginTop: 20, marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold' },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  backBtnCircle: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 2, borderColor: '#a7a7a7', alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 24, marginTop: -3 },
  headerLine: { width: '100%', height: 2, marginTop: 20 },
  clockSection: { alignItems: 'center', marginTop: 20 },
  currentTimeText: { fontSize: 72, fontWeight: '600' },
  phaseIndicator: { marginTop: 15, borderWidth: 2, borderRadius: 20, paddingVertical: 5, paddingHorizontal: 20 },
  phaseText: { fontSize: 14, fontWeight: '700', letterSpacing: 2 },
  waveContainer: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  waveItem: { position: 'absolute', width: width * 1.1, height: 120 },
  waveLayer2: { opacity: 0.7, height: 100 },
  waveLayer3: { opacity: 0.5, height: 80 },
  arrivalInfo: { alignItems: 'center', marginBottom: 30 },
  arrivalLabel: { opacity: 0.7, fontSize: 14 },
  timeRemaining: { color: '#7BB8E9', fontSize: 32, fontWeight: 'bold' },
  stopBtn: { backgroundColor: '#6188DB', width: '100%', paddingVertical: 18, borderRadius: 30, alignItems: 'center', elevation: 5 },
  stopBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});