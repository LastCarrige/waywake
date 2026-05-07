// src/screens/PlanTripScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PlanTrip'>;

const PlanTripScreen = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan Your Trip</Text>

      <View style={styles.inputList}>
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>From</Text>
          <Text style={styles.inputValue}>Current location</Text>
        </View>
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>To</Text>
          <Text style={styles.inputValue}>Lviv Station</Text>
        </View>
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Arrival Time</Text>
          <Text style={styles.inputValue}>08:10</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() => navigation.navigate('RouteMap')}
      >
        <Text style={styles.continueBtnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A', padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFF', marginBottom: 32 },
  inputList: { gap: 12 },
  inputCard: {
    backgroundColor: '#1A2240',
    borderRadius: 16,
    padding: 16,
  },
  inputLabel: { color: '#7DE7EE', fontSize: 12 },
  inputValue: { color: '#FFF', fontSize: 16, fontWeight: '600', marginTop: 4 },
  continueBtn: {
    marginTop: 40,
    backgroundColor: '#435AB4',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default PlanTripScreen;
