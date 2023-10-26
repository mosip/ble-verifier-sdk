import type { AdvertisingState, IdleState, IntermediateState } from '../types';
import verifierHandler from './BLE/VerifierHandler';
import stateBuilder from './StateBuilder';

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
}

export default VerifierService;
