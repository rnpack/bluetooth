import { Platform } from 'react-native';
import type { PermissionStatus } from 'react-native';
import type { BleManager, State } from 'react-native-ble-plx';
import {
  hasAndroidBluetoothConnectAuthorized,
  hasAndroidBluetoothScanAuthorized,
  openAndroidBluetoothSettings,
  openIOSBluetoothSettings,
  requestAndroidBluetoothConnectAuthorization,
  requestAndroidBluetoothScanAuthorization,
} from '@rnpack/utils';

import { useBleManagerContext } from '../ble';

interface RequestAndroidBluetoothAuthorizationReturns {
  scanPermissionStatus: PermissionStatus;
  connectPermissionStatus: PermissionStatus;
}

interface UseBluetoothReturnType {
  getBluetoothAdapterState: () => Promise<State>;
  openBluetoothSettings: () => Promise<void>;
  enableAndroidBluetooth: () => Promise<void>;
  requestAndroidBluetoothAuthorization: () => Promise<RequestAndroidBluetoothAuthorizationReturns>;
  checkAndroidBluetoothAuthorization: () => Promise<boolean>;
}

interface UseBluetoothProps {
  bleManager?: BleManager;
}

function useBluetooth(props?: UseBluetoothProps): UseBluetoothReturnType {
  const { bleManager } = useBleManagerContext();

  const bleMgr: BleManager = (props?.bleManager ?? bleManager) as BleManager;

  async function checkAndroidBluetoothAuthorization(): Promise<boolean> {
    if (Platform?.OS !== 'android') {
      return false;
    }

    if (Platform.Version >= 31) {
      try {
        const isBluetoothScanAuthorized =
          await hasAndroidBluetoothScanAuthorized();

        const isBluetoothConnectAuthorized =
          await hasAndroidBluetoothConnectAuthorized();

        if (isBluetoothScanAuthorized && isBluetoothConnectAuthorized) {
          console.info(
            'Checking:: Android bluetooth SCAN & CONNECT permission granted'
          );
          return true;
        } else {
          console.error(
            'Checking:: Android bluetooth SCAN & CONNECT permission not granted'
          );

          return false;
        }
      } catch (error: unknown) {
        const err: Error = error as Error;

        console.error(
          'Checking:: Android bluetooth scan & connect permission error: ',
          err?.message
        );

        return false;
      }
    }

    return true;
  }

  async function requestAndroidBluetoothAuthorization(): Promise<RequestAndroidBluetoothAuthorizationReturns> {
    if (Platform?.OS !== 'android') {
      throw new Error('Device is not Android');
    }

    if (Platform.Version >= 31) {
      try {
        const scanPermissionStatus: PermissionStatus =
          await requestAndroidBluetoothScanAuthorization();

        if (scanPermissionStatus !== 'granted') {
          console.error(
            'Requesting:: Android bluetooth scan permission: ',
            scanPermissionStatus
          );
        }

        const connectPermissionStatus: PermissionStatus =
          await requestAndroidBluetoothConnectAuthorization();

        if (connectPermissionStatus !== 'granted') {
          console.error(
            'Requesting:: Android bluetooth connect permission: ',
            connectPermissionStatus
          );
        }

        return { scanPermissionStatus, connectPermissionStatus };
      } catch (error: unknown) {
        const err: Error = error as Error;

        console.error(
          'Requesting:: Android bluetooth scan & connect permission error: ',
          err?.message
        );

        return {
          scanPermissionStatus: 'never_ask_again',
          connectPermissionStatus: 'never_ask_again',
        };
      }
    }

    return {
      scanPermissionStatus: 'granted',
      connectPermissionStatus: 'granted',
    };
  }

  async function getBluetoothAdapterState(): Promise<State> {
    const state: State = await bleMgr?.state();

    return state;
  }

  async function openBluetoothSettings() {
    if (Platform?.OS === 'android') {
      await openAndroidBluetoothSettings();
    }

    if (Platform?.OS === 'ios') {
      await openIOSBluetoothSettings();
    }
  }

  async function enableAndroidBluetooth() {
    try {
      await bleMgr?.enable();
      console.info('Android bluetooth enabled');
    } catch (error: unknown) {
      const err: Error = error as Error;

      console.error('Enable android bluetooth Error: ', err?.message);
    }
  }

  return {
    getBluetoothAdapterState,
    openBluetoothSettings,
    enableAndroidBluetooth,
    requestAndroidBluetoothAuthorization,
    checkAndroidBluetoothAuthorization,
  };
}

export type {
  UseBluetoothReturnType,
  RequestAndroidBluetoothAuthorizationReturns,
};
export { useBluetooth };
