#include <jni.h>
#include "rnpackbluetoothOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::rnpackbluetooth::initialize(vm);
}
