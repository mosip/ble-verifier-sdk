import type {
  AdvertisingState,
  ConnectedState,
  IdleState,
  ReceivedState,
} from '../types';
import type {
  RequestedState,
  SecureConnectionEstablishedState,
} from '../types';
import { State } from './VerifierService';

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

  createSecureConnectionEstablishedState(
    sendRequest: any,
    disconnect: any
  ): SecureConnectionEstablishedState {
    return {
      name: State.SECURE_CONNECTION_ESTABLISHED,
      data: {},
      actions: { sendRequest, disconnect },
    };
  }

  createRequestedState(disconnect: any): RequestedState {
    return {
      name: State.REQUESTED,
      data: {},
      actions: { disconnect },
    };
  }

  createReceivedState(vc: any): ReceivedState {
    return {
      name: State.RECEIVED,
      data: { vc },
      actions: {},
    };
  }
}

const stateBuilder = new StateBuilder();

export default stateBuilder;
