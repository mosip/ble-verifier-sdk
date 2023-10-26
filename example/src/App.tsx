import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import OVPBLE from 'react-native-ovp-ble';
import { useEffect, useState } from 'react';

export default function App() {
  const [instance, setInstance] = useState({ UI: { name: 'Loading' } });

  useEffect(() => {
    setInstance(new OVPBLE({ deviceName: 'example' }));
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {instance.UI}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
