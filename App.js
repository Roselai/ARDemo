import React, { Component } from 'react';
import {
  Text,
  View,
  NativeModules,
  NativeEventEmitter,
  StyleSheet} from 'react-native';
import { Button } from 'react-native-elements';

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
    this.onReceivedRotationListener()
    this.onReceivedAccelerometerListener()
    this.setState({
        isComponentMounted: true,
        receivedSensorData: true
      })
  }

  componentWillUnmount() {
  	RNBoseArManager.stopListeningForSensors()
  	//window.removeEventListener('onReceivedRotation', this.onReceivedRotationListener, false);
  	//window.removeEventListener('onReceivedAccelerometer', this.onReceivedAccelerometer, false);
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

  renderSectionList = () => {
    return(
      <View style={styles.container}>
      <SectionList
       sections={[
         { title: 'Rotation', data: ['Pitch', 'Roll', 'Yaw'] },
         { title: 'Accelerometer', data: ['x', 'y', 'z'] },
       ]}
       renderSectionHeader={ ({section}) => <Text style={styles.SectionHeader}> { section.title } </Text> }
       renderItem={ ({item}) => <Text style={styles.SectionListItemS}> { item } </Text> }
       keyExtractor={ (item, index) => index }
     />
      </View>
      )
  }

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

      <Button
        title="SEARCH FOR DEVICE"
        type="solid"
        raised={true}
        disabled={!isComponentMounted}
        onPress={this.onSearchForDevice}
      />

      {this.renderSectionList()}

      

      {/*
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
      */}
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "#e5e5e5"
    },
    SectionHeader:{
      backgroundColor : '#64B5F6',
      fontSize : 20,
      padding: 5,
      color: '#fff',
      fontWeight: 'bold'
   },
    SectionListItemS:{
      fontSize : 16,
      padding: 6,
      color: '#000',
      backgroundColor : '#F5F5F5'
  }
})
