import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('smart_alarm.db');

export const initDB = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS TripSession (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          destination_lat REAL NOT NULL,           
          destination_lng REAL NOT NULL,           
          minutes_to_destination INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ProcessedSleepData (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp INTEGER NOT NULL,
          avg_heart_rate REAL,
          smoothed_movement REAL,
          sleep_phase TEXT DEFAULT 'unknown'
      );

      CREATE TABLE IF NOT EXISTS SleepPhases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          start_time INTEGER NOT NULL,
          end_time INTEGER,
          phase_name TEXT NOT NULL
      );
    `);
    console.log("База даних успішно ініціалізована!");
  } catch (error) {
    console.error("Помилка при створенні бази даних:", error);
  }
};

// Зберегти запис після отримання фази від сервера
export const saveSleepRecord = (
  avgHeartRate: number,
  smoothedMovement: number,
  sleepPhase: string
) => {
  try {
    db.runSync(
      `INSERT INTO ProcessedSleepData 
       (timestamp, avg_heart_rate, smoothed_movement, sleep_phase)
       VALUES (?, ?, ?, ?)`,
      [Date.now(), avgHeartRate, smoothedMovement, sleepPhase]
    );
  } catch (error) {
    console.error("Помилка збереження:", error);
  }
};

// Отримати всі записи для аналітики
export const getSleepHistory = () => {
  try {
    return db.getAllSync(
      `SELECT * FROM ProcessedSleepData ORDER BY timestamp DESC`
    );
  } catch (error) {
    console.error("Помилка читання:", error);
    return [];
  }
};

export default db;
