import type { AdvertisingState, IdleState, IntermediateState } from '../types';
import verifierHandler from './BLE/VerifierHandler';
import stateBuilder from './StateBuilder';
import tuvali from 'react-native-tuvali/lib/typescript/types/events';
import type { VerifierDataEvent } from 'react-native-tuvali/lib/typescript/types/events';

const { EventTypes } = tuvali;

class VerifierService {
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

  private onConnected() {
    const connectedState = stateBuilder.createConnectedState(
      this.disconnect.bind(this)
    );

    this.updateIntermediateState(connectedState);
  }

  private handleEvents(event: VerifierDataEvent) {
    switch (event.type) {
      case EventTypes.onConnected:
        this.onConnected();
        break;
    }
  }

  private disconnect() {
    verifierHandler.disconnect();

    // TODO: Set to idle state
  }
}

export default VerifierService;
