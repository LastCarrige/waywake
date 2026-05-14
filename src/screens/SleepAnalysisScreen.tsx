import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../context/ThemeContext';
import { useSleepStore } from '../store/useSleepStore'; // Підключаємо їхнє сховище даних

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'SleepAnalysis'>;

export default function SleepAnalysisScreen() {
  const navigation = useNavigation<Nav>();
  const { isDark } = useTheme();
  const { epochHistory } = useSleepStore(); // Беремо історію сну

  // --- ЛОГІКА ПІДРАХУНКУ ДАНИХ (з коду дівчат) ---
  const totalEpochs = epochHistory.length;
  const totalMin = totalEpochs * 0.5; // 1 епоха = 30 сек
  const hours = Math.floor(totalMin / 60);
  const mins = Math.round(totalMin % 60);

  const deepPct = totalEpochs > 0
    ? Math.round((epochHistory.filter(e => e.phase === 'deep').length / totalEpochs) * 100)
    : 0;

  // --- ТВОЯ АНІМАЦІЯ ХВИЛЬ ---
  const moveAnim1 = useRef(new Animated.Value(0)).current;
  const moveAnim2 = useRef(new Animated.Value(0)).current;
  const moveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnim = (anim: Animated.Value, duration: number, toValue: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: -toValue, duration, useNativeDriver: true }),
        ])
      ).start();
    };
    createAnim(moveAnim1, 3000, 10);
    createAnim(moveAnim2, 2500, -8);
    createAnim(moveAnim3, 3500, 12);
  }, []);

  // Динамічні кольори
  const textColor = isDark ? '#ffffff' : '#071225';

  return (
    <ImageBackground 
      source={isDark ? require('../assets/images/background1.png') : require('../assets/images/background_light.png')}
      style={[styles.container, { backgroundColor: isDark ? '#071225' : '#F0F4F8' }]}
      resizeMode="cover"
    >
      {/* ФІКСОВАНА ВЕРХНЯ ЧАСТИНА */}
      <View style={styles.fixedHeader}>
        <View style={styles.smallLogoContainer}>
          <Image source={require('../assets/images/logo_bg.png')} style={styles.logoLayer} />
          <Image source={require('../assets/images/logo_moon.png')} style={[styles.logoLayer, { width: '60%', height: '60%' }]} />
          <Image source={require('../assets/images/logo_pin.png')} style={[styles.logoLayer, { width: '40%', height: '40%' }]} />
          <Image source={require('../assets/images/logo_dot.png')} style={[styles.logoLayer, { width: '15%', height: '15%' }]} />
        </View>

        <View style={styles.headerContent}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.backBtnCircle} onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]}>Sleep analysis</Text>
          </View>
          <Image source={require('../assets/images/Header-line.png')} style={[styles.headerLine, { tintColor: textColor }]} resizeMode="stretch" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* STATS - Сюди підставляємо реальні hours/mins */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Image source={require('../assets/images/moon-icon.png')} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statLabel}>Sleep Duration</Text>
            <Text style={[styles.statValue, { color: textColor }]}>{hours}h {mins}m</Text>
          </View>
          <View style={styles.statCard}>
            <Image source={require('../assets/images/quality-icon.png')} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statLabel}>Deep Sleep</Text>
            <Text style={[styles.statValue, { color: '#69beff' }]}>{deepPct}%</Text>
          </View>
        </View>

        {/* SLEEP PATTERN (Твоя анімація) */}
        <View style={styles.patternCard}>
          <View style={styles.patternTitleRow}>
            <View style={styles.patternLine} />
            <Text style={styles.patternTitle}>SLEEP PATTERN</Text>
            <View style={styles.patternLine} />
          </View>
          <View style={styles.wavePlaceholder}>
            <Animated.Image source={require('../assets/images/wave1.png')} style={[styles.waveImage, { transform: [{ translateX: moveAnim1 }], opacity: 0.8 }]} resizeMode="stretch" />
            <Animated.Image source={require('../assets/images/wave2.png')} style={[styles.waveImage, { transform: [{ translateX: moveAnim2 }], opacity: 0.6, position: 'absolute' }]} resizeMode="stretch" />
            <Animated.Image source={require('../assets/images/wave3.png')} style={[styles.waveImage, { transform: [{ translateX: moveAnim3 }], opacity: 0.4, position: 'absolute' }]} resizeMode="stretch" />
          </View>
        </View>

        {/* INSIGHTS - Логіка порад залежно від % глибокого сну */}
        <View style={styles.insightsSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Insights</Text>
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              <Text style={{ color: '#5eead4', fontWeight: '600' }}>{deepPct >= 20 ? 'Good job!' : 'Note:'}</Text> 
              {' '}You got {deepPct}% deep sleep. {deepPct < 20 && 'Try to sleep earlier tonight.'}
            </Text>
          </View>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnSettings} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.btnTextSettings}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnNewTrip} onPress={() => navigation.navigate('PlanTrip')}>
            <Text style={styles.btnTextNewTrip}>New trip</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedHeader: { paddingHorizontal: 25, paddingTop: 60, zIndex: 10 },
  headerContent: { marginTop: 10 },
  smallLogoContainer: { position: 'absolute', top: 60, right: 25, width: 55, height: 55, alignItems: 'center', justifyContent: 'center' },
  logoLayer: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'contain' },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  backBtnCircle: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#071225', borderWidth: 2, borderColor: '#a7a7a7', alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: 'white', fontSize: 24, marginTop: -3 },
  headerTitle: { fontSize: 30, fontWeight: 'bold' },
  headerLine: { width: '100%', height: 2, marginTop: 15 },
  scrollContent: { paddingHorizontal: 25, paddingTop: 20, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  statIcon: { width: 24, height: 24, marginBottom: 12 },
  statLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '700' },
  patternCard: { backgroundColor: 'rgba(57, 101, 125, 0.3)', borderRadius: 24, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  patternTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  patternTitle: { color: '#FFF', fontSize: 14, fontWeight: '600', letterSpacing: 2, marginHorizontal: 10, opacity: 0.8 },
  patternLine: { flex: 1, height: 1, backgroundColor: 'rgba(125, 231, 238, 0.3)' },
  wavePlaceholder: { height: 80, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  waveImage: { width: width * 1.2, height: 80 },
  insightsSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 13, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 15 },
  insightBox: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(125, 171, 251, 0.3)' },
  insightText: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 14, lineHeight: 20 },
  actions: { gap: 12 },
  btnSettings: { backgroundColor: '#6188DB', paddingVertical: 18, borderRadius: 35, alignItems: 'center', elevation: 5 },
  btnNewTrip: { backgroundColor: 'rgba(59, 130, 246, 0.2)', paddingVertical: 18, borderRadius: 35, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  btnTextSettings: { color: '#071225', fontSize: 18, fontWeight: 'bold' },
  btnTextNewTrip: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});