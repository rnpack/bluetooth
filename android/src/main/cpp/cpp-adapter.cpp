#include <jni.h>
#include "RNPackBluetoothOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::RNPackBluetooth::initialize(vm);
}
