import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSleepStore } from '../store/useSleepStore';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'WakeAlarm'>;

const STAGE_CONFIG = [
  { id: 'wake',  label: 'Awake', color: '#5EEAD4', probIndex: 0 },
  { id: 'rem',   label: 'Rem',   color: '#9333EA', probIndex: 3 },
  { id: 'light', label: 'Light', color: '#60A5FA', probIndex: 1 },
  { id: 'deep',  label: 'Deep',  color: '#2563EB', probIndex: 2 },
];

const WakeAlarmScreen = () => {
  const navigation = useNavigation<Nav>();
  const { isDark } = useTheme();
  const { currentProbabilities, epochHistory } = useSleepStore();

  const textColor = isDark ? '#ffffff' : '#071225';

  return (
    <ImageBackground 
      source={isDark ? require('../assets/images/background1.png') : require('../assets/images/background_light.png')}
      style={[styles.container, { backgroundColor: isDark ? '#071225' : '#F0F4F8' }]}
      resizeMode="cover"
    >
      {/* ЛОГОТИП */}
      <View style={styles.smallLogoContainer}>
        <Image source={require('../assets/images/logo_bg.png')} style={styles.logoLayer} resizeMode="contain" />
        <Image source={require('../assets/images/logo_moon.png')} style={[styles.logoLayer, { width: '60%', height: '60%' }]} resizeMode="contain" />
        <Image source={require('../assets/images/logo_pin.png')} style={[styles.logoLayer, { width: '40%', height: '40%' }]} resizeMode="contain" />
        <Image source={require('../assets/images/logo_dot.png')} style={[styles.logoLayer, { width: '15%', height: '15%' }]} resizeMode="contain" />
      </View>

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Wake alarm</Text>
        <Image source={require('../assets/images/Header-line.png')} style={[styles.headerLine, { tintColor: textColor }]} resizeMode="stretch" />
      </View>

      {/* CHART SECTION - Динамічні дані від дівчат */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Sleep phases (last 8 epochs)</Text>
        <View style={styles.chartContent}>
          {epochHistory.slice(-8).map((epoch, index) => {
            const cfg = STAGE_CONFIG.find(s => s.id === epoch.phase);
            // Розрахунок висоти стовпчика на основі ймовірності
            const barHeight = Math.round(Math.max(...epoch.probabilities) * 80);
            return (
              <View key={index} style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { height: Math.max(barHeight, 10), backgroundColor: cfg?.color ?? '#333' }
                  ]} 
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* STAGES LIST - Реальні відсотки ймовірності */}
      <View style={styles.stagesList}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Sleep Stages</Text>
        {STAGE_CONFIG.map((stage) => {
          const pct = Math.round((currentProbabilities[stage.probIndex] ?? 0) * 100);
          return (
            <View key={stage.id} style={styles.stageCard}>
              <View style={styles.stageLeft}>
                <View style={[styles.dotGlow, { backgroundColor: stage.color }]} />
                <View style={[styles.dotCore, { backgroundColor: stage.color }]} />
                <Text style={[styles.stageText, { color: textColor }]}>{stage.label}</Text>
              </View>
              <Text style={[styles.percentageText, { color: stage.color }]}>{pct}%</Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity 
        style={styles.continueBtn} 
        onPress={() => navigation.navigate('SleepAnalysis')}
      >
        <Text style={styles.btnText}>View Analysis</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25, paddingTop: 60, paddingBottom: 40 },
  smallLogoContainer: { position: 'absolute', top: 50, right: 20, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
  logoLayer: { position: 'absolute', width: '100%', height: '100%' },
  header: { marginTop: 20, marginBottom: 30 },
  headerTitle: { fontSize: 32, fontWeight: 'bold' },
  headerLine: { width: '100%', height: 2, marginTop: 20 },
  chartCard: { height: 160, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 25, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  chartTitle: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 12, marginBottom: 10 },
  chartContent: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  barContainer: { alignItems: 'center', flex: 1 },
  bar: { width: 15, borderRadius: 6 },
  stagesList: { flex: 1, justifyContent: 'center' },
  sectionTitle: { fontSize: 14, opacity: 0.6, marginBottom: 15, fontWeight: '600', textTransform: 'uppercase' },
  stageCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: 16, borderRadius: 25, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  stageLeft: { flexDirection: 'row', alignItems: 'center' },
  dotCore: { width: 8, height: 8, borderRadius: 4, marginRight: 15 },
  dotGlow: { position: 'absolute', width: 20, height: 20, borderRadius: 10, left: -6, opacity: 0.3 },
  stageText: { fontSize: 16 },
  percentageText: { fontSize: 16, fontWeight: '600' },
  continueBtn: { backgroundColor: '#6188DB', paddingVertical: 18, borderRadius: 30, alignItems: 'center', elevation: 5, marginTop: 20 },
  btnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});

export default WakeAlarmScreen;