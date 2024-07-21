
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNBluetoothSpec.h"

@interface Bluetooth : NSObject <NativeBluetoothSpec>
#else
#import <React/RCTBridgeModule.h>

@interface Bluetooth : NSObject <RCTBridgeModule>
#endif

@end
