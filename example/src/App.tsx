import { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-design';

import { multiply, BleManagerProvider, BluetoothHelper } from '../../src';
import {
  openAndroidBluetoothSettings,
  openIOSBluetoothSettings,
} from '@rnpack/utils';

const result = multiply(3, 7);

export default function App() {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);

  function onBluetoothAuthorizationChange(_isAuthorized: boolean) {
    setIsAuthorized(_isAuthorized);
  }

  function onBluetoothAdapterStateChange(_isEnabled: boolean) {
    setIsEnabled(_isEnabled);
  }

  function onPressAcceptEnableBluetooth() {
    if (Platform.OS === 'android') {
      openAndroidBluetoothSettings();
    }

    if (Platform.OS === 'ios') {
      openIOSBluetoothSettings();
    }
  }

  return (
    <View style={styles.container}>
      <BleManagerProvider>
        <View style={styles.container}>
          <Text>
            Bluetooth Authorization:{' '}
            {isAuthorized ? 'Authorized' : 'Not Authorized'}
          </Text>
          <Text>Bluetooth Mode: {isEnabled ? 'On' : 'Off'}</Text>
          <BluetoothHelper
            bluetoothAuthorizationTitle="Allow Bluetooth Permission"
            bluetoothAuthorizationContent={
              <Text variant="label">
                Bluetooth Permission is required to detect bluetooth permission
                status. Please allow bluetooth permission.
              </Text>
            }
            bluetoothAuthorizationAcceptText="Allow"
            onBluetoothAuthorizationChange={onBluetoothAuthorizationChange}
            enableBluetoothTitle="Enable Bluetooth"
            enableBluetoothAcceptText="Enable"
            enableBluetoothContent={
              <Text variant="label">
                Bluetooth is required to detect bluetooth adapter state. Please
                enable bluetooth.
              </Text>
            }
            onBluetoothAdapterStateChange={onBluetoothAdapterStateChange}
            onPressAcceptEnableBluetooth={onPressAcceptEnableBluetooth}
          />
        </View>
      </BleManagerProvider>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
