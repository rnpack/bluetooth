import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package '@rnpack/bluetooth' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const Bluetooth = NativeModules.Bluetooth
  ? NativeModules.Bluetooth
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function multiply(a: number, b: number): Promise<number> {
  return Bluetooth.multiply(a, b);
}

export * from './contexts';
export * from './helpers';
export * from './hooks';
export * from './types';
