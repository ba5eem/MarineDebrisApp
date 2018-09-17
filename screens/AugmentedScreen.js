import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GLView, WebBrowser, Camera, Permissions, Location, FileSystem } from 'expo';

import ExpoTHREE from 'expo-three';

console.disableYellowBox = true;

// SERVER SETTINGS:


export default class AugmentedScreen extends React.Component {

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    location: null,
    errorMessage: null,
  };

  static navigationOptions = {
    header: null,
  };



  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location }); // get iPhone location
  };







  render() {

      return (<View></View>);
  }

}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewOfPhotoContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    opacity: 0.9
  },
  takePhotoContainer: {
    flex: 0.3,
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderRadius: 400,
    backgroundColor: "#fefefe",
    marginRight: 20,
    marginLeft: 20,
  },
  takePhotoButton: { 
    fontSize: 23, 
    color: '#2f95dc' , 
    padding:5  
  },
  takePhotoButtonSeal: { 
    fontSize: 23, 
    color: 'red' , 
    padding:5  
  },

});
