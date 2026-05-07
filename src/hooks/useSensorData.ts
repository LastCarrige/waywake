// src/hooks/useSensorData.ts
import { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { processPacket } from '../services/SleepProcessor';

export const useSensorData = () => {
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'OnSensorDataReceived',
      (data) => {
        processPacket(data).catch((e) =>
          console.error('processPacket error:', e)
        );
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
};

export const startMockSensorData = (): (() => void) => {
  console.log('MOCK sensor data started');
  const interval = setInterval(() => {
    const mockPacket = {
      heart_rates: Array.from({ length: 8 }, () => 720 + Math.random() * 200),
      accel_x: Array.from({ length: 50 }, () => (Math.random() - 0.5) * 0.05),
      accel_y: Array.from({ length: 50 }, () => (Math.random() - 0.5) * 0.05),
      accel_z: Array.from({ length: 50 }, () => 9.8 + (Math.random() - 0.5) * 0.02),
    };
    processPacket(mockPacket).catch((e) =>
      console.error('mock processPacket error:', e)
    );
  }, 6000);
  return () => clearInterval(interval);
};