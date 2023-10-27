import * as React from 'react';
import { useEffect, useState } from 'react';

import { Button, StyleSheet, Text, View } from 'react-native';
import OVPBLE from 'react-native-ovp-ble';
import QRCode from 'react-native-qrcode-svg';

export default function App() {
  const [instance, setInstance] = useState({});
  const [state, setState] = useState('Loading');

  useEffect(() => {
    const ovpble = new OVPBLE({ deviceName: 'example' });

    setState(ovpble.UI);
    ovpble.listenForStateChanges((intermediateState) => {
      setState(intermediateState);
    });

    setInstance(ovpble);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.state}>State: {state.name}</Text>
      <Text style={styles.state}>Data: {JSON.stringify(state.data)}</Text>
      {state.name === 'Idle' && (
        <Button
          title={'Start Transfer'}
          onPress={() => instance.startTransfer()}
        />
      )}
      {state.name === 'Advertising' && (
        <QRCode size={200} value={state.data.uri} />
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
