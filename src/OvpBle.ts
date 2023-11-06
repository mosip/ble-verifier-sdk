import VerifierService from './verifier/VerifierService';
import type {
  IntermediateState,
  ErrorInfo,
  ReceivedState,
  ConfigOptions,
} from './types';
import type { IOvpBle } from './IOvpBle';
import type { IVerifierService } from './verifier/IVerifierService';
import { State } from './verifier/State';
import { ErrorCodes, ErrorMessages } from './error';
import { Config } from './Config';

class OvpBle implements IOvpBle {
  // @ts-ignore
  private resultResolve: (value: string) => void;
  // @ts-ignore
  private resultReject: (reason?: ErrorInfo) => void;
  public UI: IntermediateState | undefined;
  private service: IVerifierService;
  private config: Config;
  private stateChangeCallback: (state: IntermediateState) => void = () => {};

  constructor(configOptions: ConfigOptions) {
    this.config = new Config(configOptions);
    this.service = new VerifierService(
      configOptions.deviceName,
      this.onStateUpdate.bind(this)
    );
  }

  onStateUpdate(state: IntermediateState) {
    console.log('Updating UI + ' + JSON.stringify(state));
    this.UI = state;
    this.stateChangeCallback(state);

    switch (this.UI?.name) {
      case State.RECEIVED:
        const receivedState: ReceivedState = this.UI as ReceivedState;
        this.resultResolve(receivedState.data.vc);
        break;
      case State.ERROR:
        this.resultReject(this.UI?.data as ErrorInfo);
        break;
    }
  }

  listenForStateChanges(callback: (state: IntermediateState) => void) {
    this.stateChangeCallback = callback;
  }

  startTransfer() {
    const error = this.config.validate();

    if (error) return Promise.reject(error);

    this.service.startTransfer();

    return new Promise<string>((res, rej) => {
      this.resultResolve = res;
      this.resultReject = rej;
    });
  }

  stopTransfer() {
    if (!this.resultReject) {
      // Transfer not started
      return;
    }

    this.service.stopTransfer();
    this.resultReject({
      errorMessage: ErrorMessages.OVP_001,
      errorCode: ErrorCodes.OVP_001,
    });
  }
}

export default OvpBle;
