import React, { Component } from 'react';
import { Text, View, NativeModules, Button, ul } from 'react-native';

const RNBoseArManager = NativeModules.RNBoseArManager

export default class App extends Component {
state = {
    pitch: "pitch",
    roll: "roll",
    yaw: "yaw",
    x: "x",
    y: "y",
    z: "z"
  }

	UNSAFE_componentWillMount() {
      try {
        RNBoseArManager.configure()
      } catch (e) {
        console.error(e.message)
      }
  }

  onSearchForDevice = () => {
    RNBoseArManager.searchForDevice()
      .then(res => console.log(res))
      .catch(e => console.log(e))
  }

  onGetSensorData = () => {
    RNBoseArManager.getSensorData(result => {
       const { pitch, roll, yaw, x, y, z } = this.state; 
      this.setState({
        pitch: result["pitch"],
        roll: result["roll"],
        yaw: result["yaw"],
        x: result["x"],
        y: result["y"],
        z: result["z"]
      });
    })
  }


  render() {
    const { pitch, roll, yaw, x, y, z } = this.state; 


    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
        <Button
            onPress={this.onSearchForDevice}
            title="SEARCH FOR DEVICE"
            color="#841584"
        />
        <Button
            onPress={this.onGetSensorData}
            title="Get Sensor Data"
            color="#841584"
        />
        <Text>Pitch: {pitch}</Text>
        <Text>Roll: {roll}</Text>
        <Text>Yaw: {yaw}</Text>
        <Text>X: {x}</Text>
        <Text>Y: {y}</Text>
        <Text>Z: {z}</Text>
      </View>
    );
  }
}