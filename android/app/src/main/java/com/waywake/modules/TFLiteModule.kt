package com.waywake.modules

import android.util.Log
import com.facebook.react.bridge.*
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel

/**
 * Нативний модуль для запуску TFLite моделі класифікації фаз сну.
 *
 * Модель: sleep_model.tflite → помістити в android/app/src/main/assets/
 * Вхід:  float[1][5][7]  — 5 епох по 7 фічей
 * Вихід: float[1][4]     — [pWake, pLight, pDeep, pREM]
 *
 * JS виклик:
 *   import { NativeModules } from 'react-native';
 *   const result = await NativeModules.TFLiteModel.predict(flatArray35);
 */
class TFLiteModule(reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext) {

    private val TAG = "WayWake_TFLite"
    private var interpreter: Interpreter? = null

    override fun getName(): String = "TFLiteModel"

    init {
        try {
            val model = loadModelFromAssets("sleep_model.tflite")
            interpreter = Interpreter(model)
            Log.d(TAG, "✅ TFLite модель завантажена")
        } catch (e: Exception) {
            Log.e(TAG, "Помилка завантаження моделі: ${e.message}")
        }
    }

    /**
     * @param inputArray — WritableArray з 35 float значень (5 епох × 7 фічей, розгорнутий)
     * Повертає Promise з масивом [pWake, pLight, pDeep, pREM]
     */
    @ReactMethod
    fun predict(inputArray: ReadableArray, promise: Promise) {
        try {
            val tflite = interpreter ?: run {
                promise.reject("MODEL_NOT_LOADED", "TFLite модель не ініціалізована")
                return
            }

            // Перетворюємо JS-масив у float[1][5][7]
            val INPUT_EPOCHS  = 5
            val INPUT_FEATURES = 7
            val input = Array(1) { Array(INPUT_EPOCHS) { FloatArray(INPUT_FEATURES) } }

            for (i in 0 until INPUT_EPOCHS) {
                for (j in 0 until INPUT_FEATURES) {
                    input[0][i][j] = inputArray.getDouble(i * INPUT_FEATURES + j).toFloat()
                }
            }

            // Вихідний буфер: [1][4] — 4 класи фаз сну
            val output = Array(1) { FloatArray(4) }
            tflite.run(input, output)

            // Повертаємо результат у JS
            val result = Arguments.createArray().apply {
                output[0].forEach { pushDouble(it.toDouble()) }
            }

            Log.d(TAG, "🧠 Предикція: Wake=${output[0][0]}, Light=${output[0][1]}, Deep=${output[0][2]}, REM=${output[0][3]}")
            promise.resolve(result)

        } catch (e: Exception) {
            Log.e(TAG, "Помилка inference: ${e.message}")
            promise.reject("INFERENCE_ERROR", e.message)
        }
    }

    private fun loadModelFromAssets(filename: String): MappedByteBuffer {
        val assetFileDescriptor = reactApplicationContext.assets.openFd(filename)
        val inputStream = FileInputStream(assetFileDescriptor.fileDescriptor)
        val fileChannel = inputStream.channel
        return fileChannel.map(
            FileChannel.MapMode.READ_ONLY,
            assetFileDescriptor.startOffset,
            assetFileDescriptor.declaredLength
        )
    }

    override fun onCatalystInstanceDestroy() {
        interpreter?.close()
        super.onCatalystInstanceDestroy()
    }
}
