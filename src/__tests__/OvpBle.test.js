import OvpBle from '../OvpBle';
import VerifierService from '../verifier/VerifierService';

const mockStartTransfer = jest.fn();
const mockDisconnect = jest.fn();

jest.mock('../verifier/VerifierService', () => {
  // Works and lets you check for constructor calls:
  return jest.fn().mockImplementation(() => {
    return { startTransfer: mockStartTransfer, disconnect: mockDisconnect };
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

  it('should call disconnect on stop transfer', () => {
    const instance = new OvpBle({ deviceName: 'test' });

    instance.stopTransfer();

    expect(mockDisconnect).toBeCalled();
  });
});
