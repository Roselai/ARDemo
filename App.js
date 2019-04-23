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

  getSensorData = () => {
    RNBoseArManager.getSensorData(result => {
      console.log(result)
      //pitch = result["pitch"]
    })
  }


  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
            onPress={this.searchForDevice}
            title="SEARCH FOR DEVICE"
            color="#841584"
        />
        <Button
            onPress={this.getSensorData}
            title="Get Sensor Data"
            color="#841584"
        />
      </View>
    );
  }
}