// src/screens/SleepAnalysisScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSleepStore } from '../store/useSleepStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SleepAnalysis'>;

const SleepAnalysisScreen = () => {
  const navigation = useNavigation<Nav>();
  const { epochHistory } = useSleepStore();

  // Підрахунок хвилин per phase
  const totalEpochs = epochHistory.length;
  const minutesByPhase = { wake: 0, light: 0, deep: 0, rem: 0 };
  epochHistory.forEach(e => {
    if (e.phase in minutesByPhase) {
      (minutesByPhase as any)[e.phase] += 0.5; // 1 епоха = 30 сек = 0.5 хв
    }
  });
  const totalMin = totalEpochs * 0.5;
  const hours = Math.floor(totalMin / 60);
  const mins = Math.round(totalMin % 60);

  const deepPct = totalEpochs > 0
    ? Math.round((epochHistory.filter(e => e.phase === 'deep').length / totalEpochs) * 100)
    : 0;
  const remPct = totalEpochs > 0
    ? Math.round((epochHistory.filter(e => e.phase === 'rem').length / totalEpochs) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Sleep analysis</Text>
      <View style={styles.divider} />

      {/* Статистика */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Sleep Duration</Text>
          <Text style={styles.statValue}>{hours}h {mins}m</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Deep Sleep</Text>
          <Text style={[styles.statValue, { color: '#2563EB' }]}>{deepPct}%</Text>
        </View>
      </View>

      {/* Insights */}
      <Text style={styles.sectionTitle}>Insights</Text>
      <View style={styles.insightBox}>
        <Text style={styles.insightText}>
          <Text style={{ color: '#7DE7EE' }}>Deep sleep: </Text>
          {deepPct}% of total sleep time.
          {deepPct >= 20 ? ' Great job! 💪' : ' Try to reduce screen time before sleeping.'}
        </Text>
      </View>
      <View style={styles.insightBox}>
        <Text style={styles.insightText}>
          <Text style={{ color: '#9333EA' }}>REM sleep: </Text>
          {remPct}% of total.
        </Text>
      </View>

      {/* Кнопки */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsBtnText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.newTripBtn}
          onPress={() => navigation.navigate('PlanTrip')}
        >
          <Text style={styles.newTripBtnText}>New trip</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  content: { padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 28, color: '#FFF' },
  title: { fontSize: 28, fontWeight: '700', color: '#FFF' },
  divider: { width: 60, height: 2, backgroundColor: '#7DE7EE', marginVertical: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#1A2240', borderRadius: 16, padding: 16 },
  statLabel: { color: '#AAA', fontSize: 12 },
  statValue: { color: '#FFF', fontSize: 24, fontWeight: '700', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 12 },
  insightBox: { backgroundColor: '#1A2240', borderRadius: 16, padding: 16, marginBottom: 12 },
  insightText: { color: '#FFF', fontSize: 14, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 32 },
  settingsBtn: { flex: 1, backgroundColor: '#1A2240', padding: 16, borderRadius: 20, alignItems: 'center' },
  settingsBtnText: { color: '#7DE7EE', fontWeight: '600' },
  newTripBtn: { flex: 1, backgroundColor: '#435AB4', padding: 16, borderRadius: 20, alignItems: 'center' },
  newTripBtnText: { color: '#FFF', fontWeight: '600' },
});

export default SleepAnalysisScreen;
