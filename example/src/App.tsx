import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import OVPBLE from 'react-native-ovp-ble';
import { useEffect, useState } from 'react';

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
      <Button
        title={'Start Transfer'}
        onPress={() => instance.startTransfer()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  state: {
    fontSize: 20,
    marginBottom: 10,
  },
});
