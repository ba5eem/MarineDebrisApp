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
import { WebBrowser, Camera, Permissions, Location, FileSystem } from 'expo';
import { MonoText } from '../components/StyledText';



// SERVER SETTINGS:
const axios = require('axios');
const url = 'http:192.168.2.205:9000/save';






export default class HomeScreen extends React.Component {

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    location: null,
    errorMessage: null,
  };

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    //FileSystem.deleteAsync(FileSystem.documentDirectory + 'photosA');
    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photosA').catch(e => {
      console.log(e, 'Directory exists');
    });
  }


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


  snapDebris = async () => {
    console.log("fired");
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({
        quality: 0, // 1 is highest quality
        base64: false,
        exif: false,
        onPictureSaved: this.onDebrisSaved
      })
    }
  };

  onDebrisSaved = async photo => {
    console.log('debris saved');
    let lat = this.state.location.coords.latitude;
    let lon = this.state.location.coords.longitude;
    let poi = `${Date.now()}&${lat}&${lon}&debris`;
    await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photosA/${poi}.jpg`, 
    });
  };

  snapSeal = async () => {
    console.log("fired");
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({
        quality: 0, // 1 is highest quality
        base64: false,
        exif: false,
        onPictureSaved: this.onSealSaved
      })
    }
  };

  onSealSaved = async photo => {
    console.log('seal saved');
    let lat = this.state.location.coords.latitude;
    let lon = this.state.location.coords.longitude;
    let poi = `${Date.now()}&${lat}&${lon}&seal`;
    await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photosA/${poi}.jpg`, 
    });
  };


  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera ref={ref => { this.camera = ref; }} style={{ flex: 1 }} type={this.state.type}>
            <View
              style={styles.viewOfPhotoContainer}>
              <TouchableOpacity
                style={styles.takePhotoContainer}
                onPress={() => this.snapDebris()}>
                <Text
                  style={styles.takePhotoButton}>
                  {' '}Snap{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.takePhotoContainer}
                onPress={() => this.snapSeal()}>
                <Text
                  style={styles.takePhotoButton}>
                  {' '}Seal{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
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

});
