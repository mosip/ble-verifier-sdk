import * as React from 'react';
import { useEffect, useState } from 'react';

import { Button, StyleSheet, Text, View } from 'react-native';
import OVPBLE from 'react-native-ovp-ble';
import QRCode from 'react-native-qrcode-svg';
import { IntermediateState } from '../../src/middleware/types';

const ovpble = new OVPBLE({ deviceName: 'example' });

function IntermediateStateUI(props: { state: IntermediateState }) {
  return (
    <>
      <Text style={styles.state}>State: {props.state.name}</Text>

      {props.state.name === 'Advertising' && (
        <QRCode size={200} value={props.state.data.uri} />
      )}
      {Object.entries(props.state.actions || {}).map(([name, action]) => (
        <Button key={name} title={name} onPress={() => action()} />
      ))}
    </>
  );
}

export default function App() {
  const [state, setState] = useState<IntermediateState>({});
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<any>(null);

  const setupInstance = () => {
    setState(ovpble.UI);
    ovpble.listenForStateChanges((intermediateState) => {
      setState(intermediateState);
    });
  };

  const startTransfer = () => {
    setResult('');
    setError(null);
    ovpble
      .startTransfer()
      .then((vc) => setResult(vc))
      .catch((err) => setError(err));
  };

  useEffect(() => {
    setupInstance();
  }, []);

  return (
    <View style={styles.container}>
      {state.name === 'Idle' && (
        <Button title={'Start Transfer'} onPress={startTransfer} />
      )}
      <IntermediateStateUI state={state} />
      {result && (
        <View>
          <Text style={styles.state}>Received VC</Text>
          <Text style={styles.state}>
            result: {JSON.stringify(result?.verifiableCredential)}
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
});
