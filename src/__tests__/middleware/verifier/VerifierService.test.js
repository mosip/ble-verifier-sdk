import VerifierService from '../../../middleware/verifier/VerifierService';

jest.mock('react-native-tuvali', () => ({
  verifier: { startAdvertisement: jest.fn(() => 'DUMMY_URI') },
}));

describe('VerifierService', () => {
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
