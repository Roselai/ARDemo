import React, { Component } from "react";
import {
  Text,
  View,
  NativeModules,
  NativeEventEmitter,
  StyleSheet,
  SectionList
} from "react-native";
import { Card, CardSection, Button, Spinner } from "./components";

const RNBoseArManager = NativeModules.RNBoseArManager;
const ARManagerEvents = new NativeEventEmitter(RNBoseArManager);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.pressed = false;
  }

  state = {
    isConfigured: false,
    isComponentMounted: false,
    receivedSensorData: false,
    pitch: "",
    roll: "",
    yaw: "",
    x: "",
    y: "",
    z: "",
    buttonPressed: false
  };

  componentDidMount() {
    this.configure();

    //Uncomment the bottom lines to add listeners
    this.onReceivedRotationListener();
    this.onReceivedAccelerometerListener();
    this.setState({
      isComponentMounted: true
    });
  }

  componentWillUnmount() {
    RNBoseArManager.stopListeningForSensors();
    //window.removeEventListener('onReceivedRotation', this.onReceivedRotationListener, false);
    //window.removeEventListener('onReceivedAccelerometer', this.onReceivedAccelerometer, false);
  }

  configure = () => {
    RNBoseArManager.configure();

    this.setState({
      isConfigured: true
    });
  };

  onReceivedRotationListener = () => {
    ARManagerEvents.addListener("onReceivedRotation", res =>
      this.setState({
        pitch: res["pitch"],
        roll: res["roll"],
        yaw: res["yaw"],
        receivedSensorData: true
      })
    );
  };

  onReceivedAccelerometerListener = () => {
    ARManagerEvents.addListener("onReceivedAccelerometer", res =>
      this.setState({
        x: res["x"],
        y: res["y"],
        z: res["z"],
        receivedSensorData: true
      })
    );
  };

  onSearchForDevice = () => {
    if (this.state.isConfigured) {
      RNBoseArManager.searchForDevice()
        .then(res => console.log(res))
        .catch(e => console.log(e));
    } else {
      this.configure();
    }
    //this.pressed = true;
    this.setState({
      buttonPressed: true
    });
  };

  renderSectionList = () => {
    const {
      pitch,
      roll,
      yaw,
      x,
      y,
      z,
      receivedSensorData,
      buttonPressed
    } = this.state;

    if (!receivedSensorData && buttonPressed) {
      return <Spinner size="large" />;
    } else {
      return (
        <SectionList
          sections={[
            {
              title: "Rotation",
              data: [`Pitch : ${pitch}`, `Roll : ${roll}`, `Yaw : ${yaw}`]
            },
            {
              title: "Accelerometer",
              data: [`X : ${x}`, `Y : ${y}`, `Z : ${z}`]
            }
          ]}
          renderSectionHeader={({ section }) => (
            <Text style={styles.SectionHeader}> {section.title} </Text>
          )}
          renderItem={({ item }) => (
            <Text style={styles.SectionListItemS}> {item} </Text>
          )}
          keyExtractor={(item, index) => index}
        />
      );
    }
  };

  renderButton = () => {
    var buttonText = "SEARCH FOR DEVICE";

    if (this.state.buttonPressed) {
      buttonText = "SENSOR DATA";
    }
    return (
      <Button
        onPress={this.onSearchForDevice}
        disabled={this.state.buttonPressed}
        style={styles.buttonStyle}
      >
        {buttonText}
      </Button>
    );
  };

  render() {
    return (
      <Card>
        <CardSection>{this.renderButton()}</CardSection>

        <CardSection>{this.renderSectionList()}</CardSection>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#e5e5e5"
  },
  SectionHeader: {
    backgroundColor: "#000000",
    fontSize: 20,
    padding: 5,
    color: "#fff",
    fontWeight: "bold"
  },
  SectionListItemS: {
    fontSize: 16,
    padding: 6,
    color: "#000",
    backgroundColor: "#F5F5F5"
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000000",
    marginLeft: 10,
    marginRight: 10
  }
});
