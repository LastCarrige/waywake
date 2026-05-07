// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const navigation = useNavigation<Nav>();
  const [alarmSound, setAlarmSound] = useState('Gentle Chime');
  const [language, setLanguage] = useState('English');
  const [showAlarmPicker, setShowAlarmPicker] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.divider} />

      {/* Smartwatch */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Smartwatch</Text>
        <View style={styles.watchRow}>
          <Text style={styles.watchName}>⌚ Samsung Watch</Text>
          <View style={styles.connectedDot} />
        </View>
        <Text style={styles.watchStatus}>Connected</Text>
      </View>

      {/* Alarm Sound */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Alarm Sound</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowAlarmPicker(!showAlarmPicker)}
        >
          <Text style={styles.selectorText}>{alarmSound}</Text>
          <Text style={styles.arrow}>{showAlarmPicker ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showAlarmPicker && ['Gentle Chime', 'Birds Morning', 'Classic Bell'].map(opt => (
          <TouchableOpacity
            key={opt}
            style={styles.option}
            onPress={() => { setAlarmSound(opt); setShowAlarmPicker(false); }}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Language */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Language</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowLangPicker(!showLangPicker)}
        >
          <Text style={styles.selectorText}>{language}</Text>
          <Text style={styles.arrow}>{showLangPicker ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showLangPicker && ['English', 'Ukrainian', 'French'].map(opt => (
          <TouchableOpacity
            key={opt}
            style={styles.option}
            onPress={() => { setLanguage(opt); setShowLangPicker(false); }}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* About */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About WayWake</Text>
        <Text style={styles.aboutText}>Version 1.0.0</Text>
        <Text style={styles.aboutText}>Smart Wake for Travelers</Text>
      </View>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeBtnText}>Back To Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 28, color: '#FFF' },
  title: { fontSize: 28, fontWeight: '700', color: '#FFF' },
  divider: { width: 60, height: 2, backgroundColor: '#7DE7EE', marginVertical: 16 },
  card: { backgroundColor: '#1A2240', borderRadius: 20, padding: 16, marginBottom: 12 },
  cardTitle: { color: '#7DE7EE', fontSize: 13, fontWeight: '600', marginBottom: 12 },
  watchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  watchName: { color: '#FFF', fontSize: 15 },
  connectedDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4ADE80' },
  watchStatus: { color: '#4ADE80', fontSize: 12, marginTop: 4 },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0A0E1A',
    borderRadius: 12,
    padding: 12,
  },
  selectorText: { color: '#FFF', fontSize: 15 },
  arrow: { color: '#7DE7EE' },
  option: { padding: 12, borderTopWidth: 1, borderTopColor: '#0A0E1A' },
  optionText: { color: '#FFF', fontSize: 14 },
  aboutText: { color: '#AAA', fontSize: 13, marginBottom: 4 },
  homeBtn: {
    marginTop: 16,
    backgroundColor: '#435AB4',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  homeBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default SettingsScreen;
