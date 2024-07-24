import { createContext } from 'react';

import type { BleManagerContextType } from '../../types';

const defaultBleManagerContextValue: BleManagerContextType = {
  bleManager: undefined,
};

const BleManagerContext = createContext<BleManagerContextType>(
  defaultBleManagerContextValue
);

export { BleManagerContext };
