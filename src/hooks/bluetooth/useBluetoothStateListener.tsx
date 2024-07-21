import { useContext, useEffect, useRef } from 'react';
import { State } from 'react-native-ble-plx';
import type { Subscription } from 'react-native-ble-plx';

import { BleManagerContext } from '../../contexts';
import type { BleManagerContextType } from '../../types';

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
}

function useBluetoothListener(
  props?: UseBluetoothListenerProps
): UseBluetoothListenerReturnType {
  const { bleManager } = useContext<BleManagerContextType>(BleManagerContext);

  const bluetoothAdapterStateListener = useRef<Subscription>();

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
    bluetoothAdapterStateListener.current = bleManager?.onStateChange(
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
