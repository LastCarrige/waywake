// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import PlanTripScreen from '../screens/PlanTripScreen';
import RouteMapScreen from '../screens/RouteMapScreen';
import SleepTrackingScreen from '../screens/SleepTrackingScreen';
import TimeWakeUpScreen from '../screens/TimeWakeUpScreen';
import WakeAlarmScreen from '../screens/WakeAlarmScreen';
import SleepAnalysisScreen from '../screens/SleepAnalysisScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Типи для типобезпечної навігації
export type RootStackParamList = {
  Home: undefined;
  PlanTrip: undefined;
  RouteMap: undefined;
  SleepTracking: undefined;
  TimeWakeUp: undefined;
  WakeAlarm: undefined;
  SleepAnalysis: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }} // весь UI — кастомний
    >
      <Stack.Screen name="Home"          component={HomeScreen} />
      <Stack.Screen name="PlanTrip"      component={PlanTripScreen} />
      <Stack.Screen name="RouteMap"      component={RouteMapScreen} />
      <Stack.Screen name="SleepTracking" component={SleepTrackingScreen} />
      <Stack.Screen name="TimeWakeUp"    component={TimeWakeUpScreen} />
      <Stack.Screen name="WakeAlarm"     component={WakeAlarmScreen} />
      <Stack.Screen name="SleepAnalysis" component={SleepAnalysisScreen} />
      <Stack.Screen name="Settings"      component={SettingsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
