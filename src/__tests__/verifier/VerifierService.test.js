import VerifierService from '../../verifier/VerifierService';
import tuvali, { EventTypes } from '@mosip/tuvali';

jest.mock('@mosip/tuvali', () => ({
  verifier: {
    startAdvertisement: jest.fn(() => 'DUMMY_URI'),
    handleDataEvents: jest.fn(),
    sendVerificationStatus: jest.fn(),
    disconnect: jest.fn(),
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
    const service = new VerifierService('test', updateUIMock);

    service.startTransfer();

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
    const service = new VerifierService('test', updateUIMock);

    service.startTransfer();
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
    const service = new VerifierService('test', updateUIMock);

    service.startTransfer();
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
    const service = new VerifierService('test', updateUIMock);

    service.startTransfer();
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
    const service = new VerifierService('test', updateUIMock);
    const dummyVC = 'DUMMY_VC';

    service.startTransfer();

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

  it('should disconnect go back to idle state on disconnect action', () => {
    const updateUIMock = jest.fn();
    const service = new VerifierService('test', updateUIMock);

    service.startTransfer();

    const eventCallback = tuvali.verifier.handleDataEvents.mock.calls[0][0];
    eventCallback({ type: EventTypes.onConnected });

    expect(updateUIMock).toHaveBeenLastCalledWith({
      actions: {
        disconnect: expect.any(Function),
      },
      data: {},
      name: 'Connected',
    });

    updateUIMock.mock.calls[
      updateUIMock.mock.calls.length - 1
    ][0].actions.disconnect();

    expect(updateUIMock).toHaveBeenLastCalledWith({
      actions: {},
      data: {},
      name: 'Disconnected',
    });

    expect(tuvali.verifier.disconnect).toHaveBeenCalled();
  });

  it('should got to error state on error', () => {
    const updateUIMock = jest.fn();
    const service = new VerifierService('test', updateUIMock);
    const errorMessage = 'Error happened';
    const errorCode = '123';

    service.startTransfer();

    const eventCallback = tuvali.verifier.handleDataEvents.mock.calls[0][0];
    eventCallback({
      type: EventTypes.onError,
      code: errorCode,
      message: errorMessage,
    });

    expect(updateUIMock).toHaveBeenLastCalledWith({
      actions: {},
      data: {
        errorCode,
        errorMessage,
      },
      name: 'Error',
    });
  });

  it('should go to idle state and disconnect on stop transfer', () => {
    const updateUIMock = jest.fn();
    const service = new VerifierService('test', updateUIMock);

    service.startTransfer();

    expect(updateUIMock).toHaveBeenLastCalledWith({
      actions: { stopAdvertising: expect.any(Function) },
      data: { uri: 'DUMMY_URI' },
      name: 'Advertising',
    });

    service.stopTransfer();

    expect(updateUIMock).toHaveBeenLastCalledWith({
      actions: { startAdvertisement: expect.any(Function) },
      data: {},
      name: 'Idle',
    });
  });

  it('should stop advertisement on calling stopAction and go back to idle state', () => {
    let state = {};
    const updateUIMock = jest.fn((s) => {
      state = s;
    });
    const service = new VerifierService('test', updateUIMock);

    service.startTransfer();
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
