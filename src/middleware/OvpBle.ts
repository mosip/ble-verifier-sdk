import VerifierService from './verifier/VerifierService';
import type { Config, IntermediateState } from './types';

class OvpBle {
  // @ts-ignore
  private resultResolve: (value: PromiseLike<string>) => void;
  // @ts-ignore
  private resultReject: (reason?: any) => void;
  public UI: IntermediateState | undefined;
  private service: VerifierService;

  constructor(config: Config) {
    this.service = new VerifierService(config.deviceName, (state) => {
      this.UI = state;
    });
  }

  startTransfer() {
    this.service.startTransfer();
    return new Promise((res, rej) => {
      this.resultResolve = res;
      this.resultReject = rej;
    });
  }

  stopTransfer() {
    // TODO: need to implement
  }
}

export default OvpBle;
