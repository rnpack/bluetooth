import { BleManager } from 'react-native-ble-plx';
import type { BleRestoredState } from 'react-native-ble-plx';

interface UseBleManagerReturnType {
  bleManager: BleManager;
}

function useBleManager(): UseBleManagerReturnType {
  const bleManager: BleManager = new BleManager({
    restoreStateFunction,
    restoreStateIdentifier: '',
  });

  function restoreStateFunction(restoredState: BleRestoredState | null) {
    console.info('Ble manger restore state function: ', { restoredState });
  }

  return { bleManager };
}

export type { UseBleManagerReturnType };
export { useBleManager };
