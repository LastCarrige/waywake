package com.waywake.modules

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * Нативний міст: Kotlin → JavaScript.
 * Надсилає події 'OnSensorDataReceived' в React Native через NativeEventEmitter.
 *
 * JS-сторона слухає через:
 *   const emitter = new NativeEventEmitter(NativeModules.SensorBridge);
 *   emitter.addListener('OnSensorDataReceived', (data) => { ... });
 */
class SensorBridgeModule(reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext) {

    private val TAG = "WayWake_Bridge"

    override fun getName(): String = "SensorBridge"

    companion object {
        // Зберігаємо контекст для статичного виклику з PhoneListenerService
        private var reactContext: ReactApplicationContext? = null

        fun setContext(ctx: ReactApplicationContext) {
            reactContext = ctx
        }

        /**
         * Викликається з PhoneListenerService коли приходить пакет від годинника.
         * Перетворює Kotlin-масиви у WritableMap і надсилає подію в JS.
         */
        fun sendSensorPacketToJS(
            startTime: Long,
            endTime: Long,
            heartRates: FloatArray,
            hrTimestamps: LongArray,
            accelX: FloatArray,
            accelY: FloatArray,
            accelZ: FloatArray,
            accelTimestamps: LongArray
        ) {
            val ctx = reactContext ?: run {
                Log.w("WayWake_Bridge", "ReactContext не ініціалізовано, подія скинута")
                return
            }

            try {
                val params = Arguments.createMap().apply {
                    putDouble("start_time", startTime.toDouble())
                    putDouble("end_time", endTime.toDouble())

                    // Масив пульсу → WritableArray
                    putArray("heart_rates", Arguments.createArray().also { arr ->
                        heartRates.forEach { arr.pushDouble(it.toDouble()) }
                    })
                    putArray("hr_timestamps", Arguments.createArray().also { arr ->
                        hrTimestamps.forEach { arr.pushDouble(it.toDouble()) }
                    })

                    // Масиви акселерометра → WritableArray
                    putArray("accel_x", Arguments.createArray().also { arr ->
                        accelX.forEach { arr.pushDouble(it.toDouble()) }
                    })
                    putArray("accel_y", Arguments.createArray().also { arr ->
                        accelY.forEach { arr.pushDouble(it.toDouble()) }
                    })
                    putArray("accel_z", Arguments.createArray().also { arr ->
                        accelZ.forEach { arr.pushDouble(it.toDouble()) }
                    })
                    putArray("accel_timestamps", Arguments.createArray().also { arr ->
                        accelTimestamps.forEach { arr.pushDouble(it.toDouble()) }
                    })
                }

                ctx
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("OnSensorDataReceived", params)

                Log.d("WayWake_Bridge", "✅ Подія надіслана в JS")

            } catch (e: Exception) {
                Log.e("WayWake_Bridge", "Помилка надсилання події: ${e.message}")
            }
        }
    }

    // Ініціалізація: зберігаємо контекст для статичного companion object
    init {
        setContext(reactContext)
    }


    // Метод для JS — перевірити чи міст живий (опціонально)
    @ReactMethod
    fun isConnected(promise: Promise) {
        promise.resolve(true)
    }

    // Обов'язкові для нової архітектури RN
    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}

}
