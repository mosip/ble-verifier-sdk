import { State } from '../types';
import type { ConnectedState, AdvertisingState, IdleState } from '../types';

class StateBuilder {
  createIdleState(startAdvertisement: any): IdleState {
    return {
      name: State.IDLE,
      data: {},
      actions: {
        startAdvertisement,
      },
    };
  }

  createAdvertisingState(uri: string, stopAdvertising: any): AdvertisingState {
    return {
      name: State.ADVERTISING,
      data: { uri },
      actions: {
        stopAdvertising,
      },
    };
  }

  createConnectedState(disconnect: any): ConnectedState {
    return {
      name: State.CONNECTED,
      data: {},
      actions: { disconnect },
    };
  }
}

const stateBuilder = new StateBuilder();

export default stateBuilder;
