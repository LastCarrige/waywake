import * as SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase | null = null;

export const initDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'smart_alarm.db', location: 'default' });

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS TripSession (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          destination_lat REAL NOT NULL,          
          destination_lng REAL NOT NULL,          
          minutes_to_destination INTEGER NOT NULL
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS ProcessedSleepData (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp INTEGER NOT NULL,
          avg_heart_rate REAL,
          smoothed_movement REAL,
          sleep_phase TEXT DEFAULT 'unknown'
      );
    `);

    await db.executeSql(`
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

// Зберегти запис
export const saveSleepRecord = async (
  avgHeartRate: number,
  smoothedMovement: number,
  sleepPhase: string
) => {
  try {
    if (!db) throw new Error("База даних ще не ініціалізована!");
    
    await db.executeSql(
      `INSERT INTO ProcessedSleepData 
       (timestamp, avg_heart_rate, smoothed_movement, sleep_phase)
       VALUES (?, ?, ?, ?)`,
      [Date.now(), avgHeartRate, smoothedMovement, sleepPhase]
    );
  } catch (error) {
    console.error("Помилка збереження:", error);
  }
};

// Отримати всі записи
export const getSleepHistory = async () => {
  try {
    if (!db) throw new Error("База даних ще не ініціалізована!");

    const [results] = await db.executeSql(`SELECT * FROM ProcessedSleepData ORDER BY timestamp DESC`);
    
    let history = [];
    for (let i = 0; i < results.rows.length; i++) {
      history.push(results.rows.item(i));
    }
    return history;
  } catch (error) {
    console.error("Помилка читання:", error);
    return [];
  }
};

export const getDB = () => {
  if (!db) console.warn("Увага: звернення до БД до її ініціалізації!");
  return db;
};