package com.margelo.nitro.rnpackbluetooth
  
import com.facebook.proguard.annotations.DoNotStrip

@DoNotStrip
class RNPackBluetooth : HybridRNPackBluetoothSpec() {
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }
}
