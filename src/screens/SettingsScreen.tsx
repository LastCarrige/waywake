import React, { useState } from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { isDark, toggleTheme } = useTheme();

  const [alarmSound, setAlarmSound] = useState('Gentle Chime');
  const [language, setLanguage] = useState('English');
  const [showAlarmPicker, setShowAlarmPicker] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  // Динамічні кольори залежно від теми
  const textColor = isDark ? '#FFF' : '#071225';
  const subTextColor = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(7, 18, 37, 0.6)';
  const cardBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const selectBg = isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)';

  return (
    <ImageBackground 
      source={isDark ? require('../../assets/images/background1.png') : require('../../assets/images/background_light.png')} 
      style={[styles.container, { backgroundColor: isDark ? '#071225' : '#F0F4F8' }]}
      resizeMode="cover"
    >
      <View style={styles.fixedHeader}>
        <View style={styles.smallLogoContainer}>
          <Image source={require('../../assets/images/logo_bg.png')} style={styles.logoLayer} />
          <Image source={require('../../assets/images/logo_moon.png')} style={[styles.logoLayer, { width: '60%', height: '60%' }]} />
          <Image source={require('../../assets/images/logo_pin.png')} style={[styles.logoLayer, { width: '40%', height: '40%' }]} />
          <Image source={require('../../assets/images/logo_dot.png')} style={[styles.logoLayer, { width: '15%', height: '15%' }]} />
        </View>

        <View style={styles.headerContent}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity 
                style={[styles.backBtnCircle, { borderColor: isDark ? '#a7a7a7' : '#071225' }]} 
                onPress={() => navigation.goBack()}
            >
              <Text style={[styles.backArrow, { color: textColor }]}>‹</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
          </View>
          <Image source={require('../../assets/images/Header-line.png')} style={[styles.headerLine, { tintColor: textColor }]} resizeMode="stretch" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. THEME SECTION */}
        <View style={[styles.settingsCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.cardRow}>
            <View>
              <Text style={[styles.cardLabel, { color: textColor }]}>Theme</Text>
              <Text style={[styles.cardSub, { color: subTextColor }]}>Choose your preferred theme</Text>
            </View>
            <View style={styles.themeToggle}>
              <TouchableOpacity 
                style={[styles.themeBtn, !isDark && styles.activeBtn]} 
                onPress={() => isDark && toggleTheme()}
              >
                <Image source={require('../../assets/images/sun-icon.png')} style={[styles.themeIcon, { tintColor: !isDark ? '#000' : '#FFF' }]} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.themeBtn, isDark && styles.activeBtn]} 
                onPress={() => !isDark && toggleTheme()}
              >
                <Image source={require('../../assets/images/moon-icon.png')} style={[styles.themeIcon, { tintColor: isDark ? '#000' : '#FFF' }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2. ALARM SOUND SECTION */}
        <View style={[styles.settingsCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[styles.cardLabel, { color: textColor }]}>Alarm Sound</Text>
          <TouchableOpacity 
            style={[styles.selectTrigger, { backgroundColor: selectBg }]}
            onPress={() => setShowAlarmPicker(!showAlarmPicker)}
          >
            <Text style={[styles.selectText, { color: textColor }]}>{alarmSound}</Text>
            <Text style={[styles.selectArrow, { color: textColor }]}>{showAlarmPicker ? '▴' : '▾'}</Text>
          </TouchableOpacity>
          {showAlarmPicker && ['Gentle Chime', 'Birds Morning', 'Classic Bell'].map(opt => (
            <TouchableOpacity key={opt} style={styles.option} onPress={() => { setAlarmSound(opt); setShowAlarmPicker(false); }}>
              <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. SMARTWATCH SECTION */}
        <View style={[styles.settingsCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[styles.cardLabel, { color: textColor }]}>Smartwatch</Text>
          <View style={styles.watchRow}>
            <View style={styles.watchLeft}>
              <Image source={require('../../assets/images/watch-icon.png')} style={[styles.watchIcon, { tintColor: isDark ? undefined : '#071225' }]} />
              <View>
                <Text style={[styles.watchName, { color: textColor }]}>Samsung Watch</Text>
                <Text style={styles.watchStatus}>Connected</Text>
              </View>
            </View>
            <View style={styles.statusDot} />
          </View>
        </View>

        {/* 4. LANGUAGE SECTION */}
        <View style={[styles.settingsCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[styles.cardLabel, { color: textColor }]}>Language</Text>
          <TouchableOpacity 
            style={[styles.selectTrigger, { backgroundColor: selectBg }]}
            onPress={() => setShowLangPicker(!showLangPicker)}
          >
            <Text style={[styles.selectText, { color: textColor }]}>{language}</Text>
            <Text style={[styles.selectArrow, { color: textColor }]}>{showLangPicker ? '▴' : '▾'}</Text>
          </TouchableOpacity>
          {showLangPicker && ['English', 'Ukrainian', 'French'].map(opt => (
            <TouchableOpacity key={opt} style={styles.option} onPress={() => { setLanguage(opt); setShowLangPicker(false); }}>
              <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 5. ABOUT SECTION */}
        <View style={[styles.settingsCard, styles.aboutCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[styles.cardLabel, { color: textColor }]}>About WayWake</Text>
          <Text style={[styles.cardSub, { color: subTextColor }]}>Version 1.0.0</Text>
          <Text style={[styles.cardSub, { color: subTextColor }]}>Smart Wake for Travelers</Text>
        </View>

        <TouchableOpacity 
          style={[styles.continueBtn, { backgroundColor: isDark ? '#6188DB' : '#071225' }]} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[styles.btnText, { color: isDark ? '#000' : '#FFF' }]}>Back To Home</Text>
        </TouchableOpacity>
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
  backBtnCircle: { width: 35, height: 35, borderRadius: 17.5, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 24, marginTop: -3 },
  headerTitle: { fontSize: 32, fontWeight: 'bold' },
  headerLine: { width: '100%', height: 2, marginTop: 15 },
  scrollContent: { paddingHorizontal: 25, paddingTop: 20, paddingBottom: 40 },
  settingsCard: { borderRadius: 24, padding: 18, borderWidth: 1, marginBottom: 16 },
  cardLabel: { fontSize: 16, fontWeight: '600' },
  cardSub: { fontSize: 12, marginTop: 4 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  themeToggle: { flexDirection: 'row', backgroundColor: 'rgba(128,128,128,0.2)', padding: 4, borderRadius: 10 },
  themeBtn: { padding: 8, borderRadius: 7 },
  activeBtn: { backgroundColor: '#FFF', elevation: 3 },
  themeIcon: { width: 18, height: 18 },
  selectTrigger: { marginTop: 12, borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  selectText: { fontSize: 14 },
  selectArrow: { fontSize: 14 },
  option: { padding: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  optionText: { fontSize: 14 },
  watchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  watchLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  watchIcon: { width: 28, height: 28, resizeMode: 'contain' },
  watchName: { fontSize: 14 },
  watchStatus: { color: '#46d1ff', fontSize: 12, fontWeight: '600' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00ffcc' },
  aboutCard: { alignItems: 'center' },
  continueBtn: { paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  btnText: { fontSize: 18, fontWeight: 'bold' },
});