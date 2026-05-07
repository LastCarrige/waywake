package com.waywake.service

import android.util.Log
import com.google.android.gms.wearable.DataEvent
import com.google.android.gms.wearable.DataEventBuffer
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.WearableListenerService
import com.waywake.modules.SensorBridgeModule

/**
 * Слухає пакети даних від годинника через Wearable Data Layer API.
 * Кожен пакет (6 сек) передається в SensorBridgeModule → JavaScript.
 *
 * Потрібно зареєструвати в AndroidManifest.xml:
 *
 * <service android:name=".service.PhoneListenerService" android:exported="true">
 *     <intent-filter>
 *         <action android:name="com.google.android.gms.wearable.DATA_CHANGED" />
 *         <data android:scheme="wear" android:host="*" android:pathPrefix="/sensor_data" />
 *     </intent-filter>
 * </service>
 */
class PhoneListenerService : WearableListenerService() {

    private val TAG = "WayWake_PhoneListener"

    override fun onDataChanged(dataEvents: DataEventBuffer) {
        dataEvents.forEach { event ->
            if (event.type == DataEvent.TYPE_CHANGED &&
                event.dataItem.uri.path == "/sensor_data"
            ) {
                try {
                    val dataMap = DataMapItem.fromDataItem(event.dataItem).dataMap

                    // Розпаковуємо пакет від годинника
                    val startTime       = dataMap.getLong("start_time")
                    val endTime         = dataMap.getLong("end_time")
                    val heartRates      = dataMap.getFloatArray("heart_rates")      ?: floatArrayOf()
                    val hrTimestamps    = dataMap.getLongArray("hr_timestamps")     ?: longArrayOf()
                    val accelX          = dataMap.getFloatArray("accel_x_array")   ?: floatArrayOf()
                    val accelY          = dataMap.getFloatArray("accel_y_array")   ?: floatArrayOf()
                    val accelZ          = dataMap.getFloatArray("accel_z_array")   ?: floatArrayOf()
                    val accelTimestamps = dataMap.getLongArray("accel_timestamps") ?: longArrayOf()

                    Log.d(TAG, "📦 Отримано пакет: HR=${heartRates.size} точок, Accel=${accelX.size} точок")

                    // Передаємо в JS через нативний міст
                    SensorBridgeModule.sendSensorPacketToJS(
                        startTime       = startTime,
                        endTime         = endTime,
                        heartRates      = heartRates,
                        hrTimestamps    = hrTimestamps,
                        accelX          = accelX,
                        accelY          = accelY,
                        accelZ          = accelZ,
                        accelTimestamps = accelTimestamps
                    )

                } catch (e: Exception) {
                    Log.e(TAG, "Помилка обробки пакету: ${e.message}")
                }
            }
        }
    }
}
