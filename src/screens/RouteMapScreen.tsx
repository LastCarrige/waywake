import React, { useEffect, useState } from 'react';
import {  ActivityIndicator, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View,  PermissionsAndroid, Platform 
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'RouteMap'>;

export default function RouteMapScreen() {
  const navigation = useNavigation<Nav>();
  const [location, setLocation] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [distance, setDistance] = useState<string>('—');
  const [loading, setLoading] = useState<boolean>(true);
  const { isDark } = useTheme();

  // Кольори для теми
  const textColor = isDark ? '#ffffff' : '#071225';
  const btnBg = isDark ? '#6188DB' : '#071225';
  const btnText = isDark ? '#000' : '#FFF';

  // Функція для запиту дозволу на геолокацію (для чистого Android)
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // Для iOS зазвичай налаштовується в Info.plist
  };

  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const userRegion = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          setLocation(userRegion);
          setLoading(false);
        },
        (error) => {
          console.log(error.code, error.message);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    getLocation();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Радіус Землі в км
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const handleMapPress = (e: any) => {
    const coords = e.nativeEvent.coordinate;
    setDestination(coords);
    if (location) {
      const d = calculateDistance(location.latitude, location.longitude, coords.latitude, coords.longitude);
      setDistance(d);
    }
  };

  return (
    <ImageBackground 
      source={isDark 
        ? require('../../assets/images/background1.png') 
        : require('../../assets/images/background_light.png')
      } 
      style={[styles.container, { backgroundColor: isDark ? '#071225' : '#F0F4F8' }]}
      resizeMode="cover"
    >
      {/* Логотип */}
      <View style={styles.smallLogoContainer}>
        <Image source={require('../../assets/images/logo_bg.png')} style={styles.logoLayer} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_moon.png')} style={[styles.logoLayer, { width: '60%', height: '60%' }]} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_pin.png')} style={[styles.logoLayer, { width: '40%', height: '40%' }]} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_dot.png')} style={[styles.logoLayer, { width: '15%', height: '15%' }]} resizeMode="contain" />
      </View>

      {/* Заголовок */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtnCircle} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Route Map</Text>
        </View>
        <Image source={require('../../assets/images/Header-line.png')} style={[styles.headerLine, { tintColor: textColor }]} resizeMode="stretch" />
      </View>

      {/* Карта */}
      <View style={styles.mapWrapper}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#6188DB" />
            <Text style={{color: textColor, marginTop: 10}}>Finding your location...</Text>
          </View>
        ) : (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={location} 
            showsUserLocation={true}
            onPress={handleMapPress}
            customMapStyle={isDark ? darkMapStyle : []}
          >
            {destination && <Marker coordinate={destination} pinColor="#6188DB" />}
          </MapView>
        )}
      </View>

      {/* Картки з інфо */}
      <View style={styles.infoCards}>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: textColor }]}>Distance</Text>
          <Text style={[styles.infoValue, { color: textColor }]}>{distance} km</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: textColor }]}>Arrival</Text>
          <Text style={[styles.infoValue, { color: textColor }]}>
            {distance !== '—' ? `~ ${(Number(distance) * 1.5).toFixed(0)} min` : '-- : --'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.sleepBtn, { backgroundColor: btnBg }]} 
        onPress={() => navigation.navigate('SleepTracking')}
      >
        <Text style={[styles.sleepBtnText, { color: btnText }]}>Start sleep mode</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }
];

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25, paddingTop: 60, paddingBottom: 30 },
  smallLogoContainer: { position: 'absolute', top: 50, right: 20, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  logoLayer: { position: 'absolute', width: '100%', height: '100%' },
  header: { marginTop: 20, marginBottom: 20 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  backBtnCircle: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#071225', borderWidth: 2, borderColor: '#a7a7a7', alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: 'white', fontSize: 24, marginTop: -3 },
  headerTitle: { fontSize: 32, fontWeight: 'bold' },
  headerLine: { width: '100%', height: 2, marginTop: 20 },
  mapWrapper: { flex: 1, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  map: { width: '100%', height: '100%' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoCards: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 25, padding: 20, marginVertical: 20, justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  infoItem: { alignItems: 'center' },
  infoLabel: { opacity: 0.5, fontSize: 12 },
  infoValue: { fontSize: 18, fontWeight: '600' },
  infoDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
  sleepBtn: { paddingVertical: 18, borderRadius: 30, alignItems: 'center', elevation: 5 },
  sleepBtnText: { fontSize: 18, fontWeight: 'bold' }
});