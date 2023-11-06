import * as React from 'react';

import { Button, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { IntermediateState } from '@mosip/react-native-ovp-ble';

export function IntermediateStateUI(props: { state: IntermediateState }) {
  return (
    <View style={styles.intermediateStateContainer}>
      <Text style={styles.state}>Intermediate Screens</Text>
      <Text style={styles.state}>State: {props.state.name}</Text>

      {props.state.name === 'Advertising' && (
        <QRCode size={200} value={props.state.data.uri} />
      )}
      {Object.entries(props.state.actions || {}).map(([name, action]) => (
        <Button key={name} title={name} onPress={() => action()} />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  intermediateStateContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
  },
  state: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
  },
});
