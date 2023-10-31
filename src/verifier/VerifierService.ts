import type {
  AdvertisingState,
  DisconnectState,
  IdleState,
  IntermediateState,
} from '../types';
import verifierHandler from './BLE/VerifierHandler';
import stateBuilder from './StateBuilder';
import tuvali from 'react-native-tuvali';
import type { VerifierDataEvent } from 'react-native-tuvali/lib/typescript/types/events';
import type { IVerifierService } from './IVerifierService';

const { EventTypes } = tuvali;

class VerifierService implements IVerifierService {
  private readonly updateIntermediateState: (state: IntermediateState) => void;
  private deviceName: string;

  // TODO: Have to limit deviceName length to 11 bytes
  constructor(
    deviceName: string,
    updateIntermediateState: (state: IntermediateState) => void
  ) {
    const idleState: IdleState = stateBuilder.createIdleState(
      this.startAdvertisement.bind(this, deviceName)
    );

    this.updateIntermediateState = updateIntermediateState;
    this.deviceName = deviceName;
    this.updateIntermediateState(idleState);
    verifierHandler.listenForEvents(this.handleEvents.bind(this));
  }

  startTransfer() {
    this.startAdvertisement(this.deviceName);
  }

  stopTransfer() {
    this.disconnect();

    const idleState: IdleState = stateBuilder.createIdleState(
      this.startAdvertisement.bind(this, this.deviceName)
    );

    this.updateIntermediateState(idleState);
  }

  // Actions
  private startAdvertisement(name: string) {
    const uri = verifierHandler.startAdvertisement(name);
    const advertisingState: AdvertisingState =
      stateBuilder.createAdvertisingState(uri, this.stopAdvertising.bind(this));

    this.updateIntermediateState(advertisingState);
  }

  private stopAdvertising() {
    verifierHandler.stopAdvertising();

    const idleState: IdleState = stateBuilder.createIdleState(
      this.startAdvertisement.bind(this, this.deviceName)
    );

    this.updateIntermediateState(idleState);
  }

  private disconnect() {
    verifierHandler.disconnect();
  }

  private sendRequest() {
    // TODO: Implement this after Tuvali supports this
    const requestedState = stateBuilder.createRequestedState(
      this.onDisconnect.bind(this)
    );

    this.updateIntermediateState(requestedState);
  }

  // Event Handling
  private handleEvents(event: VerifierDataEvent) {
    switch (event.type) {
      case EventTypes.onConnected:
        this.onConnected();
        break;
      case EventTypes.onSecureChannelEstablished:
        this.onSecureConnectionEstablished();
        break;
      case EventTypes.onDataReceived:
        this.onDataReceived(event.data);
        break;
      case EventTypes.onError:
        this.onError(event.message, event.code);
        break;
    }
  }

  private onConnected() {
    const connectedState = stateBuilder.createConnectedState(
      this.onDisconnect.bind(this)
    );

    this.updateIntermediateState(connectedState);
  }

  private onSecureConnectionEstablished() {
    const securelyConnectedState =
      stateBuilder.createSecureConnectionEstablishedState(
        this.sendRequest.bind(this),
        this.onDisconnect.bind(this)
      );

    this.updateIntermediateState(securelyConnectedState);
  }

  private onDataReceived(vc: string) {
    const receivedState = stateBuilder.createReceivedState(vc);

    verifierHandler.setVerificationStatus();
    this.updateIntermediateState(receivedState);
  }

  private onError(message: string, code: string) {
    const errorState = stateBuilder.createErrorState(code, message);

    this.updateIntermediateState(errorState);
  }

  private onDisconnect() {
    this.disconnect();

    const disconnectedState: DisconnectState =
      stateBuilder.createDisconnectedState();

    this.updateIntermediateState(disconnectedState);
  }
}

export default VerifierService;
