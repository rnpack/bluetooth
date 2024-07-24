import type { PropsWithChildren } from 'react';

import { BleManagerContext } from './context';
import { useBleManager } from '../../hooks';

const { Provider } = BleManagerContext;

interface BleManagerProviderProps {}

function BleManagerProvider(props: PropsWithChildren<BleManagerProviderProps>) {
  const { bleManager } = useBleManager();

  return (
    <Provider
      value={{
        bleManager,
      }}
    >
      {props?.children}
    </Provider>
  );
}

export type { BleManagerProviderProps };
export { BleManagerProvider };
