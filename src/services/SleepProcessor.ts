import { NativeModules } from 'react-native';
import { useSleepStore, SleepPhase } from '../store/useSleepStore';

const { TFLiteModel } = NativeModules;

// --- КОНСТАНТИ (відповідають логіці тренування моделі) ---
const PACKETS_PER_EPOCH = 5;  // 5 пакетів × 6 сек = 30 сек = 1 епоха
const EPOCHS_FOR_AI = 5;      // Вікно 5 епох (2.5 хв) для CNN
const ALARM_THRESHOLD = 0.45; // pWake + pLight > 0.45 → будити

// Буфери (поза React state — не потребують ре-рендеру)
let packetBuffer: Array<{ rr: number[]; enmo: number[] }> = [];
let epochBuffer: number[][] = [];

// --- ДОПОМІЖНІ ФУНКЦІЇ ---

const calcRMSSD = (rrArray: number[]): number => {
  if (rrArray.length < 2) return 0;
  let sumDiffSq = 0;
  for (let i = 1; i < rrArray.length; i++) {
    sumDiffSq += Math.pow(rrArray[i] - rrArray[i - 1], 2);
  }
  return Math.sqrt(sumDiffSq / (rrArray.length - 1));
};

const calcStd = (arr: number[], mean: number): number => {
  if (arr.length === 0) return 0;
  const variance = arr.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
};

const getCyclicalTime = (): { sinTime: number; cosTime: number } => {
  const now = new Date();
  const hourDecimal =
    now.getHours() + now.getMinutes() / 60.0 + now.getSeconds() / 3600.0;
  return {
    sinTime: Math.sin((2 * Math.PI * hourDecimal) / 24),
    cosTime: Math.cos((2 * Math.PI * hourDecimal) / 24),
  };
};

const getPhaseName = (probs: number[]): SleepPhase => {
  const labels: SleepPhase[] = ['wake', 'light', 'deep', 'rem'];
  const maxIdx = probs.indexOf(Math.max(...probs));
  return labels[maxIdx] ?? 'unknown';
};

// --- ГОЛОВНА ФУНКЦІЯ ОБРОБКИ ПАКЕТУ ---

/**
 * Виклик з useSensorData.ts при кожній події 'OnSensorDataReceived'.
 * data — об'єкт переданий нативним SensorBridgeModule.
 */
export const processPacket = async (data: {
  heart_rates: number[];
  accel_x: number[];
  accel_y: number[];
  accel_z: number[];
}) => {
  // 1. Обробка HR: raw значення → BPM, клемування
  const processedRR = data.heart_rates.map((hr) =>
    60000 / Math.min(Math.max(hr, 35), 170)
  );

  // 2. Обробка акселерометра → ENMO
  const processedENMO = data.accel_x.map((x, i) => {
    const mag = Math.sqrt(
      x ** 2 + data.accel_y[i] ** 2 + data.accel_z[i] ** 2
    );
    return Math.max(0, mag - 1.0);
  });

  packetBuffer.push({ rr: processedRR, enmo: processedENMO });

  // 3. Кожні 5 пакетів (30 сек) = 1 епоха
  if (packetBuffer.length === PACKETS_PER_EPOCH) {
    const allRR = packetBuffer.flatMap((p) => p.rr);
    const allENMO = packetBuffer.flatMap((p) => p.enmo);
    const { sinTime, cosTime } = getCyclicalTime();

    const meanENMO = allENMO.reduce((a, b) => a + b, 0) / allENMO.length;

    // 7 фічей для моделі (порядок відповідає тренуванню!)
    const epochFeatures: number[] = [
      calcRMSSD(allRR),                                           // rr_norm_diff
      (Math.max(...allRR) || 0) - (Math.min(...allRR) || 0),     // rr_delta
      meanENMO,                                                   // mean_enmo
      Math.max(...allENMO) || 0,                                  // max_enmo
      calcStd(allENMO, meanENMO),                                 // std_enmo
      sinTime,                                                    // sin_time
      cosTime,                                                    // cos_time
    ];

    epochBuffer.push(epochFeatures);
    packetBuffer = [];

    // Sliding window: тримаємо тільки останні 5 епох
    if (epochBuffer.length > EPOCHS_FOR_AI) {
      epochBuffer.shift();
    }

    // 4. Вікно заповнене → запускаємо AI
    if (epochBuffer.length === EPOCHS_FOR_AI) {
      await runInference(epochBuffer);
    }
  }
};

// --- INFERENCE ---

const runInference = async (inputMatrix: number[][]) => {
  try {
    // Розгортаємо 5×7 у плаский масив 35 значень для нативного модуля
    const flatInput = inputMatrix.flat();

    const predictionArray: number[] = await TFLiteModel.predict(flatInput);

    const probs = Array.from(predictionArray); // [pWake, pLight, pDeep, pREM]
    const phase = getPhaseName(probs);
    const pToWake = probs[0] + probs[1]; // Wake + Light

    const { setCurrentPhase, addEpoch, triggerAlarm, alarmTriggered } =
      useSleepStore.getState();

    setCurrentPhase(phase, probs);
    addEpoch({ timestamp: Date.now(), phase, probabilities: probs });

    // Тригер будильника: якщо ймовірність легкого/пробудження > порогу
    if (pToWake > ALARM_THRESHOLD && !alarmTriggered) {
      console.log(`🔔 SMART ALARM: pToWake=${pToWake.toFixed(2)}, phase=${phase}`);
      triggerAlarm();
    }
  } catch (e) {
    console.error('AI Inference error:', e);
  }
};

// Скинути буфери при зупинці запису
export const resetProcessor = () => {
  packetBuffer = [];
  epochBuffer = [];
};
