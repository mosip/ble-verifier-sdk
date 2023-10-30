import VerifierService from '../../../middleware/verifier/VerifierService';
import tuvali, { EventTypes } from 'react-native-tuvali';

jest.mock('react-native-tuvali', () => ({
  verifier: {
    startAdvertisement: jest.fn(() => 'DUMMY_URI'),
    handleDataEvents: jest.fn(),
    sendVerificationStatus: jest.fn(),
  },
  EventTypes: {
    onConnected: 'connected',
    onSecureChannelEstablished: 'onSecureChannelEstablished',
    onDataReceived: 'onDataReceived',
  },
  VerificationStatus: {
    ACCEPTED: 1,
  },
}));

describe('VerifierService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set state to idle state on start', () => {
    const updateUIMock = jest.fn();
    // eslint-disable-next-line no-new
    new VerifierService('test', updateUIMock);

    expect(updateUIMock).toBeCalledWith({
      actions: {
        startAdvertisement: expect.any(Function),
      },
      data: {},
      name: 'Idle',
    });
  });

  it('should start advertisement on start of transfer and update state', () => {
    const updateUIMock = jest.fn();
    const instance = new VerifierService('test', updateUIMock);

    instance.startTransfer();

    expect(updateUIMock).toHaveBeenLastCalledWith({
      actions: {
        stopAdvertising: expect.any(Function),
      },
      data: { uri: 'DUMMY_URI' },
      name: 'Advertising',
    });
  });

  it('should go to connected state on connected event from tuvali', () => {
    const updateUIMock = jest.fn();
    const instance = new VerifierService('test', updateUIMock);

    instance.startTransfer();
    const eventCallback = tuvali.verifier.handleDataEvents.mock.calls[0][0];
    eventCallback({ type: EventTypes.onConnected });

    expect(updateUIMock).toHaveBeenLastCalledWith({
      actions: {
        disconnect: expect.any(Function),
      },
      data: {},
      name: 'Connected',
    });
  });

  it('should go to secured connection state on secure connected event from tuvali', () => {
    const updateUIMock = jest.fn();
    const instance = new VerifierService('test', updateUIMock);

    instance.startTransfer();
    const eventCallback = tuvali.verifier.handleDataEvents.mock.calls[0][0];
    eventCallback({ type: EventTypes.onConnected });
    eventCallback({ type: EventTypes.onSecureChannelEstablished });

    expect(updateUIMock).toHaveBeenLastCalledWith({
      actions: {
        sendRequest: expect.any(Function),
        disconnect: expect.any(Function),
      },
      data: {},
      name: 'SecureConnectionEstablished',
    });
  });

  it('should go to requested state on sending request', () => {
    const updateUIMock = jest.fn();
    const instance = new VerifierService('test', updateUIMock);

    instance.startTransfer();
    const eventCallback = tuvali.verifier.handleDataEvents.mock.calls[0][0];
    eventCallback({ type: EventTypes.onConnected });
    eventCallback({ type: EventTypes.onSecureChannelEstablished });
    updateUIMock.mock.calls[
      updateUIMock.mock.calls.length - 1
    ][0].actions.sendRequest();

    expect(updateUIMock).toHaveBeenLastCalledWith({
      actions: {
        disconnect: expect.any(Function),
      },
      data: {},
      name: 'Requested',
    });
  });

  it('should go to data received state on receiving data received event', () => {
    const updateUIMock = jest.fn();
    const instance = new VerifierService('test', updateUIMock);
    const dummyVC = 'DUMMY_VC';

    instance.startTransfer();

    const eventCallback = tuvali.verifier.handleDataEvents.mock.calls[0][0];
    eventCallback({ type: EventTypes.onConnected });
    eventCallback({ type: EventTypes.onSecureChannelEstablished });
    updateUIMock.mock.calls[
      updateUIMock.mock.calls.length - 1
    ][0].actions.sendRequest();
    eventCallback({ type: EventTypes.onDataReceived, data: dummyVC });

    expect(updateUIMock).toHaveBeenLastCalledWith({
      actions: {},
      data: {
        vc: dummyVC,
      },
      name: 'Received',
    });

    expect(tuvali.verifier.sendVerificationStatus).toHaveBeenLastCalledWith(
      tuvali.VerificationStatus.ACCEPTED
    );
  });

  it('should stop advertisement on calling stopAction and go back to idle state', () => {
    let state = {};
    const updateUIMock = jest.fn((s) => {
      state = s;
    });
    const instance = new VerifierService('test', updateUIMock);

    instance.startTransfer();
    state.actions.stopAdvertising();

    expect(updateUIMock).toHaveBeenLastCalledWith({
      actions: {
        startAdvertisement: expect.any(Function),
      },
      data: {},
      name: 'Idle',
    });
  });
});
