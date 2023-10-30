import tuvali from 'react-native-tuvali';
import type { VerifierDataEvent } from 'react-native-tuvali/lib/typescript/types/events';

const { verifier, VerificationStatus } = tuvali;

const URI_NAME_PREFIX = 'OVP';

class VerifierHandler {
  startAdvertisement(name: string) {
    return verifier.startAdvertisement(URI_NAME_PREFIX + name);
  }

  stopAdvertising() {
    // TODO: Implement this on tuvali
  }

  listenForEvents(callback: (event: VerifierDataEvent) => void) {
    verifier.handleDataEvents((event: VerifierDataEvent) => {
      console.log(
        'VerifierHandler: Received event',
        JSON.stringify(event)?.substring(0, 100)
      );
      callback(event);
    });
  }

  //TODO: Need to remove this once wallet removes it completely
  setVerificationStatus() {
    verifier.sendVerificationStatus(VerificationStatus.ACCEPTED);
  }

  disconnect() {
    verifier.disconnect();
  }
}

const verifierHandler = new VerifierHandler();

export default verifierHandler;
