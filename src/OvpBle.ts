import VerifierService from './verifier/VerifierService';
import type { Config, IntermediateState } from './types';

class OvpBle {
  // @ts-ignore
  private resultResolve: (value: PromiseLike<string>) => void;
  // @ts-ignore
  private resultReject: (reason?: any) => void;
  public UI: IntermediateState | undefined;
  private service: VerifierService;
  private stateChangeCallback: (state: IntermediateState) => void = () => {};

  constructor(config: Config) {
    this.service = new VerifierService(config.deviceName, (state) => {
      console.log('Updating UI + ' + JSON.stringify(state));
      this.UI = state;
      this.stateChangeCallback(state);
    });
  }

  listenForStateChanges(callback: (state: IntermediateState) => void) {
    this.stateChangeCallback = callback;
  }

  startTransfer() {
    this.service.startTransfer();

    return new Promise((res, rej) => {
      this.resultResolve = res;
      this.resultReject = rej;
    });
  }

  stopTransfer() {
    this.service.disconnect();
  }
}

export default OvpBle;
