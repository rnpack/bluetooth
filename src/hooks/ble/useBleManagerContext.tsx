import { useContext } from 'react';

import { BleManagerContext } from './../../contexts';
import type { BleManagerContextType } from './../../types';

function useBleManagerContext(): BleManagerContextType {
  const { bleManager } = useContext<BleManagerContextType>(BleManagerContext);

  return { bleManager };
}

export { useBleManagerContext };
