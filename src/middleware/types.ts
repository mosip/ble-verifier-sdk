export interface Actions {
  [name: string]: any;
}

export enum State {
  IDLE = 'Idle',
}

export interface IntermediateState {
  name: keyof typeof State;
  data: object;
  actions: Actions;
}

export interface IdleState extends IntermediateState {
  name: 'IDLE';
  data: object;
  actions: { startAdvertisement: () => void };
}
