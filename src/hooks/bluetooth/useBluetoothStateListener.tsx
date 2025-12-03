import { useEffect, useRef } from 'react';
import { State } from 'react-native-ble-plx';
import type { BleManager, Subscription } from 'react-native-ble-plx';

import { useBleManagerContext } from '../ble';

interface StartBluetoothAdapterStateListenerArgs {
  emitCurrentState?: boolean;
}

interface UseBluetoothListenerReturnType {
  startBluetoothAdapterStateListener: (
    args?: StartBluetoothAdapterStateListenerArgs
  ) => void;
  stopBluetoothAdapterStateListener: () => void;
}

interface UseBluetoothListenerProps {
  onBluetoothAdapterStateChange?: (state: State) => void;
  bleManager?: BleManager;
}

function useBluetoothListener(
  props?: UseBluetoothListenerProps
): UseBluetoothListenerReturnType {
  const { bleManager } = useBleManagerContext();

  const bleMgr: BleManager = (props?.bleManager ?? bleManager) as BleManager;

  const bluetoothAdapterStateListener = useRef<Subscription>(null);

  useEffect(() => {
    return () => {
      stopBluetoothAdapterStateListener();
    };
  }, []);

  function onBluetoothAdapterStateChange(state: State) {
    console.info('On bluetooth adapter state change: ', state);

    props?.onBluetoothAdapterStateChange?.(state);

    switch (state) {
      case State?.Unknown:
        break;

      case State?.Resetting:
        break;

      case State?.Unsupported:
        break;

      case State?.Unauthorized:
        break;

      case State?.PoweredOff:
        break;

      case State?.PoweredOn:
        break;

      default:
        break;
    }
  }

  function startBluetoothAdapterStateListener(
    args?: StartBluetoothAdapterStateListenerArgs
  ): void {
    bluetoothAdapterStateListener.current = bleMgr?.onStateChange(
      onBluetoothAdapterStateChange,
      args?.emitCurrentState ?? false
    );
  }

  function stopBluetoothAdapterStateListener(): void {
    bluetoothAdapterStateListener?.current?.remove();
  }

  return {
    startBluetoothAdapterStateListener,
    stopBluetoothAdapterStateListener,
  };
}

export { useBluetoothListener };
