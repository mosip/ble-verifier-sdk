import OvpBle from '../OvpBle';
import VerifierService from '../verifier/VerifierService';
import { State } from '../verifier/State';

const mockStartTransfer = jest.fn();
const mockStopTransfer = jest.fn();

jest.mock('../verifier/VerifierService', () => {
  return jest.fn().mockImplementation(() => {
    return {
      startTransfer: mockStartTransfer,
      stopTransfer: mockStopTransfer,
    };
  });
});

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  VerifierService.mockClear();
  mockStartTransfer.mockClear();
});

describe('OvpBLE', () => {
  it('should call startTransfer of service and return a promise on startTransfer', () => {
    const instance = new OvpBle({ deviceName: 'test' });

    expect(instance.startTransfer()).toBeInstanceOf(Promise);
    expect(mockStartTransfer).toBeCalled();
  });

  it('should update UI on call of OVP_BLE service first param', () => {
    const instance = new OvpBle({ deviceName: 'test' });
    const dummyState = { state: 'dummy' };

    instance.startTransfer();

    const updateUIFromConstructorParams = VerifierService.mock.calls[0][1];
    const deviceNameFromConstructorParams = VerifierService.mock.calls[0][0];

    updateUIFromConstructorParams(dummyState);
    expect(instance.UI).toEqual(dummyState);
    expect(deviceNameFromConstructorParams).toEqual('test');
  });

  it('should call disconnect on stop transfer', (done) => {
    const instance = new OvpBle({ deviceName: 'test' });

    instance.startTransfer().catch(async (e) => {
      await expect(e).toEqual({
        errorCode: 'OVP_001',
        errorMessage: 'Transfer stopped',
      });
      done();
    });
    instance.stopTransfer();

    expect(mockStopTransfer).toBeCalled();
  });

  it('should resolve Promise on received state', async () => {
    const instance = new OvpBle({ deviceName: 'test' });
    const receivedState = { name: State.RECEIVED, data: { vc: 'some vc' } };

    const promise = instance.startTransfer();
    const updateUIFromConstructorParams = VerifierService.mock.calls[0][1];
    updateUIFromConstructorParams(receivedState);

    await expect(promise).resolves.toBe(receivedState.data.vc);
  });

  it('should reject Promise on error state', async () => {
    const instance = new OvpBle({ deviceName: 'test' });
    const receivedState = {
      name: State.ERROR,
      data: { errorCode: '123', errorMessage: 'some error' },
    };

    const promise = instance.startTransfer();
    const updateUIFromConstructorParams = VerifierService.mock.calls[0][1];
    updateUIFromConstructorParams(receivedState);

    await expect(promise).rejects.toBe(receivedState.data);
  });

  it('should reject Promise if device name is larger than 11 characters', async () => {
    const instance = new OvpBle({ deviceName: 'very_long_device_name' });
    const expectedError = {
      errorCode: 'OVP_002',
      errorMessage: 'Device name length exceeded limit of 11 characters',
    };

    const promise = instance.startTransfer();

    await expect(promise).rejects.toEqual(expectedError);
  });
});
