import OvpBle from '../../middleware/OvpBle';
import OvpBleService from '../../middleware/OvpBleService';

jest.mock('../../middleware/OvpBleService', () => {
  // Works and lets you check for constructor calls:
  return jest.fn().mockImplementation(() => {
    return 'Constructor';
  });
});

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  OvpBleService.mockClear();
});

describe('OvpBLE', () => {
  it('should return a promise on startTransfer', () => {
    const instance = new OvpBle();

    expect(instance.startTransfer()).toBeInstanceOf(Promise);
  });

  it('should update UI on call of OVP_BLE service first param', () => {
    const instance = new OvpBle();
    const dummyState = { state: 'dummy' };

    instance.startTransfer();

    const updateUIFromConstructorParams = OvpBleService.mock.calls[0][0];

    updateUIFromConstructorParams(dummyState);
    expect(instance.UI).toEqual(dummyState);
  });
});
