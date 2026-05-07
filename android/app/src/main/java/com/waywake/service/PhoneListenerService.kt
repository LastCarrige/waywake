package com.waywake.service
import android.util.Log
import com.google.android.gms.wearable.DataEvent
import com.google.android.gms.wearable.DataEventBuffer
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.WearableListenerService
import com.waywake.modules.SensorBridgeModule

class PhoneListenerService : WearableListenerService() {
    private val TAG = "WayWake_PhoneListener"
    override fun onDataChanged(dataEvents: DataEventBuffer) {
        Log.d(TAG, "📨 onDataChanged викликано! Подій: ${dataEvents.count}")
        dataEvents.forEach { event ->
            Log.d(TAG, "Шлях: ${event.dataItem.uri.path}, тип: ${event.type}")
            if (event.type == DataEvent.TYPE_CHANGED &&
                event.dataItem.uri.path == "/sensor_data") {
                Log.d(TAG, "✅ Отримано пакет!")
                try {
                    val dataMap = DataMapItem.fromDataItem(event.dataItem).dataMap
                    val startTime       = dataMap.getLong("start_time")
                    val endTime         = dataMap.getLong("end_time")
                    val heartRates      = dataMap.getFloatArray("heart_rates")      ?: floatArrayOf()
                    val hrTimestamps    = dataMap.getLongArray("hr_timestamps")     ?: longArrayOf()
                    val accelX          = dataMap.getFloatArray("accel_x_array")   ?: floatArrayOf()
                    val accelY          = dataMap.getFloatArray("accel_y_array")   ?: floatArrayOf()
                    val accelZ          = dataMap.getFloatArray("accel_z_array")   ?: floatArrayOf()
                    val accelTimestamps = dataMap.getLongArray("accel_timestamps") ?: longArrayOf()
                    Log.d(TAG, "📦 HR=${heartRates.size} точок, Accel=${accelX.size} точок")
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
