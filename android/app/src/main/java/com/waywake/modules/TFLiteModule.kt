package com.waywake.modules

import android.util.Log
import com.facebook.react.bridge.*

class TFLiteModule(reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext) {

    private val TAG = "WayWake_TFLite"
    private val MOCK_MODE = true

    override fun getName(): String = "TFLiteModel"

    init {
        if (MOCK_MODE) {
            Log.d(TAG, "MOCK режим — реальна модель не потрібна")
        }
    }

    @ReactMethod
    fun predict(inputArray: ReadableArray, promise: Promise) {
        if (MOCK_MODE) {
            val raw = FloatArray(4) { Math.random().toFloat() }
            val sum = raw.sum()
            val probs = raw.map { it / sum }
            val result = Arguments.createArray().apply {
                probs.forEach { pushDouble(it.toDouble()) }
            }
            val phases = listOf("Wake","Light","Deep","REM")
            val maxIdx = probs.indexOf(probs.max()!!)
            Log.d(TAG, "MOCK: ${phases[maxIdx]} W=${"%.2f".format(probs[0])} L=${"%.2f".format(probs[1])} D=${"%.2f".format(probs[2])} R=${"%.2f".format(probs[3])}")
            promise.resolve(result)
            return
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}
}