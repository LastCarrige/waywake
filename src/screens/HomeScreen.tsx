// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      {/* Верхні іконки навігації */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.navIcon}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SleepAnalysis')}>
          <Text style={styles.navIcon}>📊</Text>
        </TouchableOpacity>
      </View>

      {/* Лого і назва */}
      <Text style={styles.title}>WayWake</Text>
      <Text style={styles.subtitle}>Smart Wake for Travelers</Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('PlanTrip')}
      >
        <Text style={styles.startButtonText}>Get started</Text>
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
  topNav: {
    position: 'absolute',
    top: 52,
    right: 24,
    flexDirection: 'row',
    gap: 16,
  },
  navIcon: { fontSize: 22 },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#7DE7EE',
    marginTop: 8,
    marginBottom: 48,
  },
  startButton: {
    backgroundColor: '#435AB4',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
  },
  startButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default HomeScreen;
