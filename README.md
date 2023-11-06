# react-native-ovp-ble

This module facilitates seamless interaction with Tuvali's verifier module for BLE (Bluetooth Low Energy) transfers. It offers a user-friendly API tailored for the verifier App's convenience. Additionally, it maintains essential state data within its context, which the UI module can access and utilize effectively.

Also have React Hooks, Request Util and any other utilities that makes it easier for verifier to integrate.

## Installation

```sh
npm install @mosip/react-native-ovp-ble
```

## Usage

```javascript
import OVP_BLE from "ovp-ble";
import OVP_BLE_Verifier_UI from "ovp-ble-verifier-ui";
const instance = new OVP_BLE({deviceName: "simVerifier"});

const VPShare = ({onSuccess}) => {
	useEffect(() => {
            instance.startTransfer().then((data) => onSuccess(data));
	})

	return <OVPBLE_Verifier_UI instance={instance} theme={theme} />
}
```

Note: The `ovp-ble-verifier-ui` module is yet to be build. If you want to implement your own UI screens, please look at the [documentation](docs/UI-IMPLEMENTATION.md) for internal APIs.

## API Reference
#### 1. `new new OVP_BLE(config)`

Initialize the `ovp-ble` module with the config provided

`const instance = new OVP_BLE({deviceName: "simVerifier"});`

1. `deviceName` : This name is provided in the advertisment payload during the BLE advertisement. This field have a limit of **`11`** characters.

#### 2. `startTransfer()`

This API starts the BLE trasfer with the config provided. This method returns a `Promise<String>`. 

##### Success Case

Promise resolves with the VC.
```
{ vc: string }
```
Note: Once  the specification is completed, this will be returning VP instead.

##### Error Case

Promise rejects with error code and error method. 
```
{
  errorCode: string;
  errorMessage: string;
}
```

Most of the error code are coming from Tuvali. Some of them are from ovp-ble itself. Such as 

* `OVP_001 --> 'Transfer stopped'`
* [Tuvali error codes](//todo)

#### 3. `stopTransfer()`

This API stops the BLE trasfer.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.
