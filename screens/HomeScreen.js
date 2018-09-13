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
//const axios = require('axios');
//const url = 'http:localhost:9000/save';






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


  snap = async () => {
    console.log("fired");
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({
        quality: 0, // 1 is highest quality
        base64: true,
        exif: false,
        onPictureSaved: this.onPictureSaved
      })
    }
    // POST img to server
    // let formData = new FormData();
    // formData.append('capturedImage', photo);
    // axios.post(url, formData)
    // .then(img => {
    //   console.log(img);
    // }).catch(err => console.log('error, server down'));







  };

  onPictureSaved = async photo => {
    console.log('fired2');
    let lat = this.state.location.coords.latitude;
    let lon = this.state.location.coords.longitude;
    let poi = `${lat}-${lon}`
    await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photosA/${poi}.jpg`, 
    });

    console.log(photo);
  }


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
                onPress={() => this.snap()}>
                <Text
                  style={styles.takePhotoButton}>
                  {' '}Snap{' '}
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
  },
  takePhotoButton: { 
    fontSize: 23, 
    color: '#2f95dc' , 
    padding:5
     
  },

});
