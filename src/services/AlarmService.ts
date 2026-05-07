// src/services/AlarmService.ts
import { Vibration, Platform } from 'react-native';

// Якщо використовуєте react-native-sound або expo-av — підключіть тут
// import Sound from 'react-native-sound';

/**
 * Тригер будильника. Викликається з SleepProcessor коли pToWake > порогу.
 * Зараз: вібрація. Розширити: аудіо, нотифікація.
 */
export const triggerAlarm = () => {
  // Патерн вібрації: [затримка, вібрація, пауза, ...] в мс
  const PATTERN = [0, 500, 300, 500, 300, 1000];
  Vibration.vibrate(PATTERN, true); // true = повторювати
};

export const stopAlarm = () => {
  Vibration.cancel();
};
