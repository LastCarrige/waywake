import { create } from 'zustand';

export type SleepPhase = 'wake' | 'light' | 'deep' | 'rem' | 'unknown';

export interface SleepEpoch {
  timestamp: number;
  phase: SleepPhase;
  probabilities: number[]; // [pWake, pLight, pDeep, pREM]
}

interface SleepState {
  // Поточна фаза сну
  currentPhase: SleepPhase;
  currentProbabilities: number[];

  // Історія епох (для графіка в WakeAlarm/SleepAnalysis)
  epochHistory: SleepEpoch[];

  // Флаг будильника
  alarmTriggered: boolean;

  // Час прибуття (встановлюється на PlanTrip)
  arrivalTime: Date | null;

  // Чи активне відстеження
  isTracking: boolean;

  // Дії
  setCurrentPhase: (phase: SleepPhase, probs: number[]) => void;
  addEpoch: (epoch: SleepEpoch) => void;
  triggerAlarm: () => void;
  resetAlarm: () => void;
  setArrivalTime: (time: Date) => void;
  setTracking: (active: boolean) => void;
  resetSession: () => void;
}

export const useSleepStore = create<SleepState>((set) => ({
  currentPhase: 'unknown',
  currentProbabilities: [0, 0, 0, 0],
  epochHistory: [],
  alarmTriggered: false,
  arrivalTime: null,
  isTracking: false,

  setCurrentPhase: (phase, probs) =>
    set({ currentPhase: phase, currentProbabilities: probs }),

  addEpoch: (epoch) =>
    set((state) => ({
      epochHistory: [...state.epochHistory.slice(-50), epoch], // тримаємо останні 50
    })),

  triggerAlarm: () => set({ alarmTriggered: true }),
  resetAlarm: () => set({ alarmTriggered: false }),

  setArrivalTime: (time) => set({ arrivalTime: time }),

  setTracking: (active) => set({ isTracking: active }),

  resetSession: () =>
    set({
      currentPhase: 'unknown',
      currentProbabilities: [0, 0, 0, 0],
      epochHistory: [],
      alarmTriggered: false,
      isTracking: false,
    }),
}));
