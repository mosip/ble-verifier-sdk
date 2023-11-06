import { useEffect, useState } from 'react';
import type { IntermediateState } from 'react-native-ovp-ble';
import OvpBle from '../OvpBle';

export const useUI = (instance: OvpBle) => {
  const [state, setState] = useState<IntermediateState | {}>({});

  useEffect(() => {
    instance.UI && setState(instance.UI);
    instance.listenForStateChanges((intermediateState) => {
      setState(intermediateState);
    });
  }, [instance]);

  return {
    state,
  };
};
