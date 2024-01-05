import type {
  AdvertisingState,
  ConnectedState,
  ErrorState,
  IdleState,
  ReceivedState,
  RequestedState,
  SecureConnectionEstablishedState,
  DisconnectState,
} from '../types';
import { State } from './State';

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

  createErrorState(errorCode: string, errorMessage: string): ErrorState {
    return {
      name: State.ERROR,
      data: { errorCode, errorMessage },
      actions: {},
    };
  }

  createDisconnectedState(): DisconnectState {
    return {
      name: State.DISCONNECTED,
      data: {},
      actions: {},
    };
  }
}

const stateBuilder = new StateBuilder();

export default stateBuilder;
