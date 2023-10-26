import OvpBleService from '../../middleware/OvpBleService';

describe('OvpBLEService', () => {
  it('should set state to idle state on start', () => {
    const updateUIMock = jest.fn();
    // eslint-disable-next-line no-new
    new OvpBleService(updateUIMock);

    expect(updateUIMock).toBeCalledWith({
      actions: {
        startAdvertisement: expect.any(Function),
      },
      data: {},
      name: 'IDLE',
    });
  });
});
