import * as React from 'react';
import { useEffect, useState } from 'react';

import { Button, StyleSheet, Text, View } from 'react-native';
import OVPBLE from 'react-native-ovp-ble';
import QRCode from 'react-native-qrcode-svg';
import { IntermediateState } from '../../src/middleware/types';

export default function App() {
  const [instance, setInstance] = useState({});
  const [state, setState] = useState<IntermediateState>({});

  const setupInstance = () => {
    const ovpble = new OVPBLE({ deviceName: 'example' });

    setState(ovpble.UI);
    ovpble.listenForStateChanges((intermediateState) => {
      setState(intermediateState);
    });

    setInstance(ovpble);
  };

  useEffect(() => {
    setupInstance();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.state}>State: {state.name}</Text>
      <Text style={styles.state}>
        Data: {JSON.stringify(state.data)?.substring(0, 100)}...
      </Text>
      {state.name === 'Idle' && (
        <Button
          title={'Start Transfer'}
          onPress={() => instance.startTransfer()}
        />
      )}
      {state.name === 'Advertising' && (
        <QRCode size={200} value={state.data.uri} />
      )}
      {Object.entries(state.actions || {}).map(([name, action]) => (
        <Button key={name} title={name} onPress={() => action()} />
      ))}
      {state.name === 'Received' && (
        <Button title={'Restart'} onPress={() => setupInstance()} />
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
