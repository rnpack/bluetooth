import { Fragment, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import { State } from 'react-native-ble-plx';
import type { BleManager } from 'react-native-ble-plx';
import { Dialog } from 'react-native-design';
import type { DialogProps } from 'react-native-design';
import { openAppCustomSettings } from '@rnpack/utils';

import { useBluetooth, useBluetoothListener } from '../hooks';
import type { RequestAndroidBluetoothAuthorizationReturns } from './../hooks';

interface BluetoothHelperProps {
  bleManager?: BleManager;
  onBluetoothOff?: () => void;
  onPressAcceptBluetoothAuthorization?: () => void;
  onPressRejectBluetoothAuthorization?: () => void;
  bluetoothAuthorizationAcceptText?: string;
  bluetoothAuthorizationRejectText?: string;
  bluetoothAuthorizationTitle?: string;
  bluetoothAuthorizationContent?: ReactNode;
  bluetoothAuthorizationDialogProps?: DialogProps;
  onBluetoothAuthorizationChange?: (isAuthorized: boolean) => void;
  onPressAcceptEnableBluetooth?: () => void;
  onPressRejectEnableBluetooth?: () => void;
  enableBluetoothAcceptText?: string;
  enableBluetoothRejectText?: string;
  enableBluetoothTitle?: string;
  enableBluetoothContent?: ReactNode;
  enableBluetoothDialogProps?: DialogProps;
  onBluetoothAdapterStateChange?: (isEnabled: boolean) => void;
}

function BluetoothHelper(props: BluetoothHelperProps) {
  const {
    enableAndroidBluetooth,
    openBluetoothSettings,
    getBluetoothAdapterState,
    requestAndroidBluetoothAuthorization,
    checkAndroidBluetoothAuthorization,
  } = useBluetooth({ bleManager: props?.bleManager });
  const { startBluetoothAdapterStateListener } = useBluetoothListener({
    onBluetoothAdapterStateChange,
    bleManager: props?.bleManager,
  });

  const bluetoothPermissionCheckTimeInterval =
    useRef<NodeJS.Timeout>(undefined);

  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  useEffect(() => {
    mount();

    return () => {
      unmount();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.debug('Bluetooth permission or state changed: ', {
      isAuthorized,
      isEnabled,
    });

    if (!isAuthorized || !isEnabled) {
      props?.onBluetoothOff?.();
    }

    if (!isAuthorized) {
      // startBluetoothPermissionListener();
    }

    if (isAuthorized) {
      // stopBluetoothPermissionListener();
    }

    props?.onBluetoothAuthorizationChange?.(isAuthorized);
    props?.onBluetoothAdapterStateChange?.(isEnabled);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, isAuthorized]);

  async function mount() {
    startBluetoothAdapterStateListener();

    const state: State = await getBluetoothAdapterState();

    onBluetoothAdapterStateChange(state);

    if (Platform?.OS === 'android') {
      await androidInit();
    }
  }

  function unmount() {
    stopBluetoothPermissionListener();
  }

  function startAndroidBluetoothPermissionListener() {
    console.info('Start android bluetooth permission listener...');
    bluetoothPermissionCheckTimeInterval.current = setInterval(async () => {
      await isAndroidBluetoothAuthorized();
    }, 3000);
  }

  async function isAndroidBluetoothAuthorized() {
    const isGranted = await checkAndroidBluetoothAuthorization();
    if (isGranted) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }

  function stopBluetoothPermissionListener() {
    if (Platform?.OS === 'android') {
      console.info('Stop android bluetooth permission listener...');
      clearInterval(bluetoothPermissionCheckTimeInterval?.current);
    }
  }

  async function androidInit() {
    startAndroidBluetoothPermissionListener();

    const isPermission: boolean = await checkAndroidBluetoothAuthorization();

    if (!isPermission) {
      const status: RequestAndroidBluetoothAuthorizationReturns =
        await requestAndroidBluetoothAuthorization();

      if (
        status?.scanPermissionStatus === 'never_ask_again' ||
        status?.connectPermissionStatus === 'never_ask_again'
      ) {
        setIsAuthorized(false);
      }
    }

    await isAndroidBluetoothAuthorized();
  }

  function onBluetoothAdapterStateChange(state: State) {
    switch (state) {
      case 'Unknown':
        setIsAuthorized(false);
        break;

      case 'Resetting':
        setIsEnabled(false);
        break;

      case 'Unsupported':
        setIsAuthorized(false);
        break;

      case 'Unauthorized':
        setIsAuthorized(false);
        break;

      case 'PoweredOff':
        setIsEnabled(false);
        break;

      case 'PoweredOn':
        setIsEnabled(true);

        if (Platform?.OS === 'ios') {
          setIsAuthorized(true);
        }
        break;

      default:
        break;
    }
  }

  async function onPressAcceptEnable() {
    if (props?.onPressAcceptEnableBluetooth) {
      props?.onPressAcceptEnableBluetooth();
      return;
    }

    if (Platform?.OS === 'android') {
      await enableAndroidBluetooth();
    }

    if (Platform?.OS === 'ios') {
      const state: State = await getBluetoothAdapterState();

      if (state === State?.Unauthorized) {
        await openAppCustomSettings();
      }

      if (state === State?.PoweredOff) {
        openBluetoothSettings();
      }
    }
  }

  function onPressRejectEnable() {
    if (props?.onPressRejectEnableBluetooth) {
      props?.onPressRejectEnableBluetooth();
      return;
    }
    Alert.alert('Bluetooth is required');
  }

  async function onPressAcceptPermission() {
    if (props?.onPressAcceptBluetoothAuthorization) {
      props?.onPressAcceptBluetoothAuthorization();
      return;
    }

    await openAppCustomSettings();
  }

  function onPressRejectPermission() {
    if (props?.onPressRejectBluetoothAuthorization) {
      props?.onPressRejectBluetoothAuthorization();
      return;
    }

    Alert.alert('Bluetooth permission is required');
  }

  return (
    <Fragment>
      <Dialog
        isVisible={!isAuthorized}
        onPressAccept={onPressAcceptPermission}
        onPressReject={onPressRejectPermission}
        acceptText={props?.bluetoothAuthorizationAcceptText}
        rejectText={props?.bluetoothAuthorizationRejectText}
        title={props?.bluetoothAuthorizationTitle}
        transparent
        hideClose
        hideReject
        {...props?.bluetoothAuthorizationDialogProps}
      >
        {props?.bluetoothAuthorizationContent}
      </Dialog>
      <Dialog
        isVisible={!isEnabled && isAuthorized}
        onPressAccept={onPressAcceptEnable}
        onPressReject={onPressRejectEnable}
        acceptText={props?.enableBluetoothAcceptText}
        rejectText={props?.enableBluetoothRejectText}
        title={props?.enableBluetoothTitle}
        transparent
        hideClose
        hideReject
        {...props?.enableBluetoothDialogProps}
      >
        {props?.enableBluetoothContent}
      </Dialog>
    </Fragment>
  );
}

export type { BluetoothHelperProps };
export { BluetoothHelper };
