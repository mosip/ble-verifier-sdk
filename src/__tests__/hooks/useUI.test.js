import { renderHook, waitFor, act } from '@testing-library/react';
import { useUI } from '../../hooks';
import OvpBle from '../../OvpBle';

jest.mock('react-native-tuvali', () => ({
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

describe('use UI Hook', function () {
  it('should return with UI at idle state in starting', function () {
    const instance = new OvpBle({ deviceName: 'test' });

    const { result } = renderHook(() => useUI(instance));
    const { state } = result.current;

    expect(state).toEqual({
      name: 'Idle',
      data: {},
      actions: {
        startAdvertisement: expect.any(Function),
      },
    });
  });

  it('should update state whenever instance UI changes', async function () {
    const instance = new OvpBle({ deviceName: 'test' });

    const { result } = renderHook(() => useUI(instance));

    act(() => {
      instance.startTransfer();
    });

    await waitFor(() =>
      expect(result.current.state).toEqual({
        name: 'Advertising',
        data: {
          uri: 'DUMMY_URI',
        },
        actions: {
          stopAdvertising: expect.any(Function),
        },
      })
    );
  });
});
