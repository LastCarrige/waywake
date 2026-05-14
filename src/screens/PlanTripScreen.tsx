import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'PlanTrip'>;

const PlanTripScreen = () => {
  const navigation = useNavigation<Nav>();
  const { isDark } = useTheme();

  // Динамічні кольори на основі твоєї логіки
  const textColor = isDark ? '#ffffff' : '#071225';
  const subTextColor = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(7, 18, 37, 0.5)';
  const cardBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const btnBg = isDark ? '#6188DB' : '#071225';
  const btnTextColor = isDark ? '#000' : '#FFF'; 

  return (
    <ImageBackground 
      source={isDark 
        ? require('../assets/images/background1.png')
        : require('../assets/images/background_light.png')
      } 
      style={[styles.container, { backgroundColor: isDark ? '#071225' : '#F0F4F8' }]}
      resizeMode="cover"
    >
      {/* Логотип у кутку */}
      <View style={styles.smallLogoContainer}>
        <Image source={require('../assets/images/logo_bg.png')} style={styles.logoLayer} resizeMode="contain" />
        <Image source={require('../assets/images/logo_moon.png')} style={[styles.logoLayer, { width: '60%', height: '60%' }]} resizeMode="contain" />
        <Image source={require('../assets/images/logo_pin.png')} style={[styles.logoLayer, { width: '40%', height: '40%' }]} resizeMode="contain" />
        <Image source={require('../assets/images/logo_dot.png')} style={[styles.logoLayer, { width: '15%', height: '15%' }]} resizeMode="contain" />
      </View>

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Plan Your Trip</Text>
        <Image source={require('../assets/images/Header-line.png')} style={[styles.headerLine, { tintColor: textColor }]} resizeMode="stretch" />
      </View>

      <View style={styles.inputList}>
        {/* КАРТКА 1: ВІДКИЛЛЯ */}
        <TouchableOpacity style={[styles.inputCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Svg width="35" height="35" viewBox="0 0 35 35" fill="none" style={styles.icon}>
            <Circle cx="17.5" cy="17.5" r="17.5" fill="#3A4E7F"/>
            <Path d="M7 18L26 9L17 28L15 20L7 18Z" stroke="#9FC4FF" strokeWidth="2"/>
          </Svg>
          <View style={styles.inputText}>
            <Text style={[styles.label, { color: subTextColor }]}>From</Text>
            <Text style={[styles.value, { color: textColor }]}>Current location</Text>
          </View>
          <Text style={[styles.arrow, { color: textColor }]}>›</Text>
        </TouchableOpacity>

        {/* КАРТКА 2: КУДИ */}
        <TouchableOpacity style={[styles.inputCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Svg width="35" height="35" viewBox="0 0 35 35" fill="none" style={styles.icon}>
            <Circle cx="17.5" cy="17.5" r="17.5" fill="#3A4E7F"/>
            <Path d="M17.5 10C14.5 10 12 12.5 12 15.5C12 21 17.5 27 17.5 27C17.5 27 23 21 23 15.5C23 12.5 20.5 10 17.5 10ZM17.5 18C16.1 18 15 16.9 15 15.5C15 14.1 16.1 13 17.5 13C18.9 13 20 14.1 20 15.5C20 16.9 18.9 18 17.5 18Z" fill="#9FC4FF"/>
          </Svg>
          <View style={styles.inputText}>
            <Text style={[styles.label, { color: subTextColor }]}>To</Text>
            <Text style={[styles.value, { color: textColor }]}>Lviv Station</Text>
          </View>
          <Text style={[styles.arrow, { color: textColor }]}>›</Text>
        </TouchableOpacity>

        {/* КАРТКА 3: ЧАС ПРИБУТТЯ */}
        <TouchableOpacity style={[styles.inputCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Svg width="35" height="35" viewBox="0 0 35 35" fill="none" style={styles.icon}>
            <Circle cx="17.5" cy="17.5" r="17.5" fill="#3A4E7F"/>
            <Circle cx="17.5" cy="17.5" r="9" stroke="#9FC4FF" strokeWidth="2"/>
            <Path d="M17.5 13V17.5L20.5 20.5" stroke="#9FC4FF" strokeWidth="2" strokeLinecap="round"/>
          </Svg>
          <View style={styles.inputText}>
            <Text style={[styles.label, { color: subTextColor }]}>Arrival Time</Text>
            <Text style={[styles.value, { color: textColor }]}>08:10</Text>
          </View>
          <Text style={[styles.arrow, { color: textColor }]}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.continueBtn, { backgroundColor: btnBg }]} 
        onPress={() => navigation.navigate('RouteMap')}
      >
        <Text style={[styles.btnText, { color: btnTextColor }]}>Continue</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25, paddingTop: 60, paddingBottom: 40 },
  smallLogoContainer: { position: 'absolute', top: 50, right: 20, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
  logoLayer: { position: 'absolute', width: '100%', height: '100%' },
  header: { marginTop: 20, marginBottom: 40 },
  headerTitle: { fontSize: 32, fontWeight: 'bold' },
  headerLine: { width: '100%', height: 2, marginTop: 20 },
  inputList: { flex: 1, gap: 20, justifyContent: 'center' },
  inputCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 25, borderWidth: 1 },
  icon: { marginRight: 15 },
  inputText: { flex: 1 },
  label: { fontSize: 12 },
  value: { fontSize: 18, fontWeight: '600' },
  arrow: { fontSize: 24, opacity: 0.3 },
  continueBtn: { paddingVertical: 18, borderRadius: 30, alignItems: 'center', elevation: 5 },
  btnText: { fontSize: 18, fontWeight: 'bold' },
});

export default PlanTripScreen;