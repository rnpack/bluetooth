import { NitroModules } from 'react-native-nitro-modules';
import type { RNPackBluetooth } from './RNPackBluetooth.nitro';

const RNPackBluetoothHybridObject =
  NitroModules.createHybridObject<RNPackBluetooth>('RNPackBluetooth');

export function multiply(a: number, b: number): number {
  return RNPackBluetoothHybridObject.multiply(a, b);
}

export * from './contexts';
export * from './helpers';
export * from './hooks';
export * from './types';
