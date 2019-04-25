import React, { Component } from 'react';
import { 
  Text, 
  View, 
  NativeModules, 
  TouchableOpacity, 
  NativeEventEmitter,
  StyleSheet } from 'react-native';


const RNBoseArManager = NativeModules.RNBoseArManager;
const ARManagerEvents = new NativeEventEmitter(RNBoseArManager);

export default class App extends Component {
state = {
    isConfigured: false,
    isComponentMounted: false,
    receivedSensorData: false,
    pitch: "",
    roll: "",
    yaw: "",
    x: "",
    y: "",
    z: ""
  }


  componentDidMount() {
    this.configure()

    //Uncomment the bottom lines to add listeners
    //this.onReceivedRotationListener()
    //this.onReceivedAccelerometerListener()
    this.setState({
        isComponentMounted: true,
        receivedSensorData: true
      })
  }

  configure = () => {
    RNBoseArManager.configure()

      this.setState({
        isConfigured: true
      });
  }

  onReceivedRotationListener = () => {
    ARManagerEvents.addListener("onReceivedRotation", 
      res => 
      this.setState({
        pitch: res["pitch"],
        roll: res["roll"],
        yaw: res["yaw"]
      })
    )
  }

  onReceivedAccelerometerListener = () => {
    ARManagerEvents.addListener("onReceivedAccelerometer", 
      res => 
      this.setState({
        x: res["x"],
        y: res["y"],
        z: res["z"],
      })
    )
  }

  onSearchForDevice = () => {
    if (this.state.isConfigured) {
      RNBoseArManager.searchForDevice()
        .then(res => console.log(res))
        .catch(e => console.log(e))
      } else {
        this.configure()
      }
  }


  /*onGetSensorData = () => {
    
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
  }*/


  render() {
    const { pitch, 
      roll, 
      yaw, 
      x, 
      y, 
      z, 
      isComponentMounted, 
      receivedSensorData } = this.state; 

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

      
          <TouchableOpacity
            disabled={!isComponentMounted}
            style={styles.button}
            onPress={this.onSearchForDevice}
          >
           <Text style={{ color: '#FFFFFF'}}> SEARCH FOR DEVICE </Text>
          </TouchableOpacity>
      
        
        <View 
          style={{justifyContent: "center", alignItems: "flex-start"}}
          disabled={!receivedSensorData}
        >
          <Text>Pitch: {pitch}</Text>
          <Text>Roll:  {roll}</Text>
          <Text>Yaw:   {yaw}</Text>
          <Text>X:     {x}</Text>
          <Text>Y:     {y}</Text>
          <Text>Z:     {z}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#121940',
    padding: 10
  }
})
