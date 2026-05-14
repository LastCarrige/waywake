import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../context/ThemeContext'; // Переконайся, що цей шлях вірний

const { width } = Dimensions.get('window');
const LOGO_BASE_SIZE = width * 0.95; 

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { isDark } = useTheme(); // Твоя логіка теми

  // Твої динамічні кольори
  const textColor = isDark ? '#ffffff' : '#071225';
  const subTextColor = isDark ? '#d1d5db' : 'rgba(7, 18, 37, 0.6)';
  const iconBg = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
  const btnBg = isDark ? '#AEB9D4' : '#435AB4'; // Трохи зміцнив колір для контрасту
  const btnText = isDark ? '#000' : '#FFF';

  return (
    <ImageBackground 
      source={isDark 
        ? require('../assets/images/background1.png')
        : require('../assets/images/background_light.png')
      } 
      style={[styles.container, { backgroundColor: isDark ? '#071225' : '#F0F4F8' }]}
      resizeMode="cover"
    >
      <View style={styles.topNav}>
        {/* Кнопка налаштувань */}
        <TouchableOpacity 
          style={[styles.iconBtn, { backgroundColor: iconBg }]} 
          onPress={() => navigation.navigate('Settings')}
        >
          <Image 
            source={require('../assets/images/settings-icon.png')}
            style={{ width: 24, height: 24, tintColor: textColor }} 
          />
        </TouchableOpacity>
        
        {/* Кнопка аналітики */}
        <TouchableOpacity 
          style={[styles.iconBtn, { backgroundColor: iconBg }]} 
          onPress={() => navigation.navigate('SleepAnalysis')}
        >
          <Image 
            source={require('../assets/images/analytics-icon.png')}
            style={{ width: 24, height: 24, tintColor: textColor }} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.logoStack}>
          <Image 
            source={require('../assets/images/logo_bg.png')}
            style={styles.bgLayer} 
            resizeMode="contain"
          />
          <View style={styles.iconWrapper}>
            <Image 
              source={require('../assets/images/logo_moon.png')}
              style={[styles.logoLayer, styles.moonLayer]} 
              resizeMode="contain"
            />
            <Image 
              source={require('../assets/images/logo_pin.png')}
              style={[styles.logoLayer, styles.pinLayer]} 
              resizeMode="contain"
            />
            <Image 
              source={require('../assets/images/logo_dot.png')}
              style={[styles.logoLayer, styles.dotLayer]} 
              resizeMode="contain"
            />
          </View>
        </View>

        <Text style={[styles.mainTitle, { color: textColor }]}>WayWake</Text>
        <Text style={[styles.subTitle, { color: subTextColor }]}>Smart Wake for Travelers</Text>
        
        <TouchableOpacity 
          style={[styles.startButton, { backgroundColor: btnBg }]} 
          onPress={() => navigation.navigate('PlanTrip')}
        >
          <Text style={[styles.buttonText, { color: btnText }]}>Get started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topNav: { position: 'absolute', top: 60, right: 20, flexDirection: 'row', zIndex: 10, gap: 15 },
  iconBtn: { width: 45, height: 45, borderRadius: 22.5, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', width: '100%' },
  logoStack: { width: LOGO_BASE_SIZE, height: LOGO_BASE_SIZE, alignItems: 'center', justifyContent: 'center', marginBottom: -10, marginTop: -20 },
  bgLayer: { position: 'absolute', width: '100%', height: '100%' },
  iconWrapper: { width: LOGO_BASE_SIZE * 0.42, height: LOGO_BASE_SIZE * 0.42, alignItems: 'center', justifyContent: 'center' },
  logoLayer: { position: 'absolute' },
  moonLayer: { width: '100%', height: '100%' },
  pinLayer: { width: '65%', height: '65%' },
  dotLayer: { width: '20%', height: '20%' },
  mainTitle: { fontSize: width * 0.12, fontWeight: 'bold', marginTop: 5 },
  subTitle: { fontSize: 18, marginTop: 5, marginBottom: 80 },
  startButton: { paddingVertical: 15, paddingHorizontal: 55, borderRadius: 30, elevation: 10 },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
});