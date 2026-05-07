// src/hooks/useSensorData.ts
import { useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { processPacket } from '../services/SleepProcessor';

const { SensorBridge } = NativeModules;

/**
 * Хук підключається до нативного SensorBridgeModule і
 * передає кожен 6-секундний пакет у SleepProcessor.
 *
 * Використовувати в SleepTrackingScreen:
 *   useSensorData();
 */
export const useSensorData = () => {
  useEffect(() => {
    if (!SensorBridge) {
      console.warn('SensorBridge native module not found. Running in dev mode?');
      return;
    }

    const emitter = new NativeEventEmitter(SensorBridge);

    const subscription = emitter.addListener(
      'OnSensorDataReceived',
      (data) => {
        // data структура (з SensorBridgeModule.kt):
        // { heart_rates: number[], accel_x: number[], accel_y: number[], accel_z: number[] }
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
