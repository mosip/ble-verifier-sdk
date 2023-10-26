import tuvali from 'react-native-tuvali';

const { verifier } = tuvali;

const URI_NAME_PREFIX = 'OVP';

class VerifierHandler {
  startAdvertisement(name: string) {
    return verifier.startAdvertisement(URI_NAME_PREFIX + name);
  }

  stopAdvertising() {
    // TODO: Implement this on tuvali
  }
}

const verifierHandler = new VerifierHandler();

export default verifierHandler;
