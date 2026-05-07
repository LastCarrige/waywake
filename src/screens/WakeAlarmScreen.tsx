// src/screens/WakeAlarmScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSleepStore } from '../store/useSleepStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'WakeAlarm'>;

const STAGE_CONFIG = [
  { id: 'wake',  label: 'Awake', color: '#5EEAD4', probIndex: 0 },
  { id: 'light', label: 'Light', color: '#60A5FA', probIndex: 1 },
  { id: 'deep',  label: 'Deep',  color: '#2563EB', probIndex: 2 },
  { id: 'rem',   label: 'REM',   color: '#9333EA', probIndex: 3 },
];

const WakeAlarmScreen = () => {
  const navigation = useNavigation<Nav>();
  const { currentProbabilities, epochHistory } = useSleepStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Wake alarm</Text>
      <View style={styles.divider} />

      {/* Останні фази у вигляді простого бару */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Sleep phases (last 8 epochs)</Text>
        <View style={styles.chartBars}>
          {epochHistory.slice(-8).map((epoch, i) => {
            const cfg = STAGE_CONFIG.find(s => s.id === epoch.phase);
            const height = Math.round(Math.max(...epoch.probabilities) * 80);
            return (
              <View key={i} style={styles.barWrapper}>
                <View style={[styles.bar, {
                  height: Math.max(height, 8),
                  backgroundColor: cfg?.color ?? '#333'
                }]} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Поточні ймовірності фаз */}
      <Text style={styles.sectionTitle}>Sleep Stages</Text>
      {STAGE_CONFIG.map(stage => {
        const pct = Math.round((currentProbabilities[stage.probIndex] ?? 0) * 100);
        return (
          <View key={stage.id} style={styles.stageRow}>
            <View style={[styles.dot, { backgroundColor: stage.color }]} />
            <Text style={styles.stageLabel}>{stage.label}</Text>
            <Text style={[styles.stagePct, { color: stage.color }]}>{pct}%</Text>
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.analysisBtn}
        onPress={() => navigation.navigate('SleepAnalysis')}
      >
        <Text style={styles.analysisBtnText}>View Analysis</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFF' },
  divider: { width: 60, height: 2, backgroundColor: '#7DE7EE', marginVertical: 16 },
  chartCard: { backgroundColor: '#1A2240', borderRadius: 20, padding: 16, marginBottom: 24 },
  chartTitle: { color: '#AAA', fontSize: 12, marginBottom: 12 },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 6 },
  barWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: 80 },
  bar: { width: '100%', borderRadius: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 12 },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2240',
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  stageLabel: { flex: 1, color: '#FFF', fontSize: 15 },
  stagePct: { fontSize: 15, fontWeight: '700' },
  analysisBtn: {
    marginTop: 32,
    backgroundColor: '#435AB4',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  analysisBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default WakeAlarmScreen;
