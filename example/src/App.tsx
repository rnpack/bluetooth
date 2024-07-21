import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, responsive, Text } from 'react-native-design';

import { BleManagerProvider, BluetoothHelper } from '@rnpack/bluetooth';

export default function App() {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);

  function onBluetoothAuthorizationChange(_isAuthorized: boolean) {
    setIsAuthorized(_isAuthorized);
  }
  function onBluetoothAdapterStateChange(_isEnabled: boolean) {
    setIsEnabled(_isEnabled);
  }

  return (
    <BleManagerProvider>
      <View style={styles.container}>
        <Text>
          Bluetooth Authorization:{' '}
          {isAuthorized ? 'Authorized' : 'Not Authorized'}
        </Text>
        <Text>Bluetooth Mode: {isEnabled ? 'On' : 'Off'}</Text>
        <BluetoothHelper
          bluetoothAuthorizationTitle="Allow Bluetooth Permisison"
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
        />
      </View>
    </BleManagerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors?.white?.normal?.main,
    paddingTop: responsive.height(30),
  },
});
