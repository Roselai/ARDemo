import React, { Component } from 'react';
import { Text, View, NativeModules, Button } from 'react-native';

const RNBoseArManager = NativeModules.RNBoseArManager

export default class App extends Component {
 
	UNSAFE_componentWillMount() {
      try {
        RNBoseArManager.configure()
      } catch (e) {
        console.error(e.message)
      }
  }

  searchForDevice = () => {
    RNBoseArManager.searchForDevice()
      .then(res => console.log(res))
      .catch(e => console.log(e))
  }


  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Hello, world!</Text>
        <Button
            onPress={this.searchForDevice}
            title="SEARCH FOR DEVICE"
            color="#841584"
        />
      </View>
    );
  }
}