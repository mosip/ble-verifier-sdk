import { ErrorCodes, ErrorMessages } from './error';
import type { ErrorInfo, ConfigOptions } from './types';

export class Config {
  private deviceName: string;
  private DEVICE_NAME_MAX_LENGTH: number = 11;

  constructor(configOptions: ConfigOptions) {
    this.deviceName = configOptions.deviceName;
  }
  validate(): ErrorInfo | void {
    if (this.deviceName.length > this.DEVICE_NAME_MAX_LENGTH) {
      return {
        errorMessage: ErrorMessages.OVP_002,
        errorCode: ErrorCodes.OVP_002,
      };
    }
  }
}
