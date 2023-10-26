import type { IdleState, IntermediateState } from './types';

class OvpBleService {
  private readonly updateIntermediateState: (state: IntermediateState) => void;

  constructor(updateIntermediateState: (state: IntermediateState) => void) {
    const idleState: IdleState = {
      name: 'IDLE',
      data: {},
      actions: {
        startAdvertisement: () => {},
      },
    };

    this.updateIntermediateState = updateIntermediateState;
    this.updateIntermediateState(idleState);
  }
}

export default OvpBleService;
