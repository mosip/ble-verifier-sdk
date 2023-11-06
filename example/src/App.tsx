import * as React from 'react';
import { useState } from 'react';

import { Button, StyleSheet, Text, View } from 'react-native';
import OVPBLE, { useUI } from '@mosip/react-native-ovp-ble';
import { IntermediateStateUI } from './IntermediateStateUI';

const ovpble = new OVPBLE({ deviceName: 'example' });

export default function App() {
  const { state } = useUI(ovpble);
  const [result, setResult] = useState<any>('');
  const [error, setError] = useState<any>(null);

  const startTransfer = () => {
    setResult('');
    setError(null);

    ovpble
      .startTransfer()
      .then((vc) => {
        setResult(JSON.parse(vc));
      })
      .catch((err) => {
        setError(err);
      });
  };

  const subject = result?.verifiableCredential?.credential?.credentialSubject;

  return (
    <View style={styles.container}>
      {(state.name === 'Idle' || state.name === 'Disconnected') && (
        <Button title={'Start Transfer'} onPress={startTransfer} />
      )}
      {result && (
        <View>
          <Text style={styles.state}>Received VC</Text>
          <Text style={styles.state}>
            VC ID: {subject?.UIN || subject?.VID}
          </Text>
          <Button title={'Restart'} onPress={startTransfer} />
        </View>
      )}
      {error && (
        <View>
          <Text style={styles.state}>Error In Transfer</Text>
          <Text style={styles.state}>error: {JSON.stringify(error)}</Text>
          <Button title={'Restart'} onPress={startTransfer} />
        </View>
      )}

      <IntermediateStateUI state={state} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    color: 'black',
  },
  state: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
  },
  intermediateStateContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
  },
});
