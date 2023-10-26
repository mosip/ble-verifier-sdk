import OvpBle from '../../middleware/OvpBle';

describe('OvpBLE', () => {
  it('should return a promise on startTransfer', () => {
    const instance = new OvpBle();

    expect(instance.startTransfer()).toBeInstanceOf(Promise);
  });
});
