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
import { AR } from 'expo';
// Let's alias ExpoTHREE.AR as ThreeAR so it doesn't collide with Expo.AR.
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';
// Let's also import `expo-graphics`
// expo-graphics manages the setup/teardown of the gl context/ar session, creates a frame-loop, and observes size/orientation changes.
// it also provides debug information with `isArCameraStateEnabled`
import { View as GraphicsView } from 'expo-graphics';
import { WebBrowser, Camera, Permissions, Location, FileSystem } from 'expo';
import beaches from '../data/beaches';
console.disableYellowBox = true;

const PHOTOS_DIR = FileSystem.documentDirectory + 'photosA';
const haversine = require('haversine');


const _latLongToMerc=(lat_deg, lon_deg) => {
   // Mercator projection is a cylindrical map projection
   let lon_rad = (lon_deg / 180.0 * Math.PI)
   // (longitude radius / 180.0 * 3.14)
   let lat_rad = (lat_deg / 180.0 * Math.PI)
   // (latitude radius / 180.0 * 3.14)
   let sm_a = 6378137.0 // Earth Radius
   let xmeters  = sm_a * lon_rad;
   // earth radius * lon_rad
   let ymeters = sm_a * Math.log((Math.sin(lat_rad) + 1) / Math.cos(lat_rad))
   return ({x:xmeters, y:ymeters});

}

const transformPointToAR = (lat, long, deviceLatitude, deviceLongitude) => {
  // lat = vessel GPS lat position
  // long = vessel GPS lon position
  // deviceLatitude = oberserver latitude / iphone/samsung location
  // deviceLongitude = observer long / iphone/samsung location
  let objPoint = _latLongToMerc(lat, long);
  let devicePoint = _latLongToMerc(deviceLatitude, deviceLongitude);
  let objFinalPosZ = objPoint.y - devicePoint.y;
  let objFinalPosX = objPoint.x - devicePoint.x;
  return ({x:objFinalPosX, z:-objFinalPosZ});
}

const findClosest = start => {
  let closest = 100;
  let location;
  beaches.map(e => {
    let end = {
      latitude: e.lat,
      longitude: e.lon
    };
    let distance = haversine(start,end, { unit: 'mile' });
    if(distance < closest){
      closest = distance;
      location = e.name;
    }
  });

  return location;
};

const createLocations = (photos,device) => {
  let locales = [];
  let poi;
  photos.map(e =>{
    let arr = e.split('&');
    let date = arr[0];
    let lat = arr[1];
    let lon = arr[2];
    let type = arr[3].split('.jpg')[0];
    poi = {
      id: e,
      lat: Number(lat),
      lon: Number(lon),
      date: Date(date),
      beach: findClosest({
        latitude: Number(lat),
        longitude: Number(lon)
      }),
      type: type,
      color: "#fefefe",
      x: transformPointToAR(lat,lon,device.lat,device.lon).x,
      z: transformPointToAR(lat,lon,device.lat,device.lon).z
    }
    //console.log(poi);
    locales.push(poi);
  });
  return locales;
};


export default class AugmentedScreen extends React.Component {
  state = {
    type: Camera.Constants.Type.back,
    location: null,
    errorMessage: null,
    locations: []
  };

  static navigationOptions = {
    header: null,
  };


  async componentDidMount() {
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    this.setState({
      locations: photos
    })
    // Turn off extra warnings
    THREE.suppressExpoWarnings()
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
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    this.setState({
      photos: photos,
      locations: createLocations(photos,{
        lat: location.coords.latitude,
        lon: location.coords.longitude
      })
    });
  };




  render() {
    //console.log(this.state.location);
    // You need to add the `isArEnabled` & `arTrackingConfiguration` props.
    // `isArRunningStateEnabled` Will show us the play/pause button in the corner.
    // `isArCameraStateEnabled` Will render the camera tracking information on the screen.
    // `arTrackingConfiguration` denotes which camera the AR Session will use.
    // World for rear, Face for front (iPhone X only)
    return (

      <GraphicsView
        style={{ flex: 1 }}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
        isArEnabled
        isArRunningStateEnabled
        isArCameraStateEnabled
        arTrackingConfiguration={AR.TrackingConfigurations.World}
      />

    );
  }

  // When our context is built we can start coding 3D things.
  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {


    // This will allow ARKit to collect Horizontal surfaces
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // Create a 3D renderer
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height,
    });

    // We will add all of our meshes to this scene.
    this.scene = new THREE.Scene();
    // This will create a camera texture and use it as the background for our scene
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    // Now we make a camera that matches the device orientation.
    // Ex: When we look down this camera will rotate to look down too!
    this.camera = new ThreeAR.Camera(width, height, 0.0001, 1000);
    // Make a cube - notice that each unit is 1 meter in real life, we will make our box 0.1 meters
    const geometry = new THREE.ConeGeometry(0.1, 0.4, 0.5);

    // Simple color material
    const material = new THREE.MeshPhongMaterial({
      color: "red",
    });
    // Combine our geometry and material
    this.cube = new THREE.Mesh(geometry, material);





    setTimeout(() => {
      this.state.locations.map((e,i) => {
        this.i = new THREE.Mesh(geometry, material);
        this.i.position.x = e.x;
        this.i.position.z = e.z;
        this.i.rotation.z = 3;
        this.scene.add(this.i);
      })
    },2000);

    // Setup a light so we can see the cube color
    // AmbientLight colors all things in the scene equally.
    this.scene.add(new THREE.AmbientLight(0xffffff));
  };

  // When the phone rotates, or the view changes size, this method will be called.
  onResize = ({ x, y, scale, width, height }) => {
    // Let's stop the function if we haven't setup our scene yet
    if (!this.renderer) {
      return;
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  // Called every frame.
  onRender = () => {
    // Finally render the scene with the AR Camera
    this.renderer.render(this.scene, this.camera);
  };
}
