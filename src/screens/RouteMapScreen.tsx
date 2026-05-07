// src/screens/RouteMapScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Якщо є react-native-maps: import MapView, { Marker } from 'react-native-maps';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RouteMap'>;

const RouteMapScreen = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Route Map</Text>

      {/* Замініть на <MapView> коли підключите react-native-maps */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️ Map View</Text>
        <Text style={styles.mapSubtext}>react-native-maps тут</Text>
      </View>

      <View style={styles.infoCards}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Distance</Text>
          <Text style={styles.infoValue}>— km</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Arrival</Text>
          <Text style={styles.infoValue}>08:10</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.sleepBtn}
        onPress={() => navigation.navigate('SleepTracking')}
      >
        <Text style={styles.sleepBtnText}>Start sleep mode</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A', padding: 24, paddingTop: 60 },
  backBtn: { position: 'absolute', top: 56, left: 24, zIndex: 10 },
  backText: { fontSize: 28, color: '#FFF' },
  title: { fontSize: 22, fontWeight: '700', color: '#FFF', textAlign: 'center', marginBottom: 16 },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#1A2240',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mapText: { fontSize: 48 },
  mapSubtext: { color: '#7DE7EE', marginTop: 8 },
  infoCards: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  infoCard: { flex: 1, backgroundColor: '#1A2240', borderRadius: 16, padding: 16, alignItems: 'center' },
  infoLabel: { color: '#AAA', fontSize: 12 },
  infoValue: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  sleepBtn: { backgroundColor: '#435AB4', padding: 18, borderRadius: 30, alignItems: 'center' },
  sleepBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default RouteMapScreen;
