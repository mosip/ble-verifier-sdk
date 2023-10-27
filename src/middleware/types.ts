export interface Actions {
  [name: string]: any;
}

export enum State {
  IDLE = 'Idle',
  ADVERTISING = 'Advertising',
  CONNECTED = 'Connected',
}

export interface IntermediateState {
  name: State;
  data: object;
  actions: Actions;
}

export interface IdleState extends IntermediateState {
  name: State.IDLE;
  data: object;
  actions: { startAdvertisement: () => void };
}

export interface AdvertisingState extends IntermediateState {
  name: State.ADVERTISING;
  data: { uri: string };
  actions: { stopAdvertising: () => void };
}

export interface ConnectedState extends IntermediateState {
  name: State.CONNECTED;
  data: {};
  actions: { disconnect: () => void };
}

export interface Config {
  deviceName: string;
}
