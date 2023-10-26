import OvpBleService from './OvpBleService';
import type { IntermediateState } from './types';

class OvpBle {
  private resultResolve: (value: PromiseLike<string>) => void;
  private resultReject: (reason?: any) => void;
  public UI: IntermediateState;
  private service: OvpBleService;

  constructor() {
    this.service = new OvpBleService((state) => {
      this.UI = state;
    });
  }

  startTransfer() {
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
