import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter
} from 'react-native';
import { AR, Constants, Location, Permissions } from 'expo';
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';
import { View as GraphicsView } from 'expo-graphics';
import { WebBrowser, Camera, FileSystem } from 'expo';
import TouchableView from '../components/TouchableView';
console.disableYellowBox = true;




const device = {
  lat: 21.309014,
  lon: -157.808651
}

const poi = {
  lat: 21.308756,
  long: -157.808663
}

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

const transformPointToAR = (poi, device) => {
  let { lat, long } = poi;
  let deviceLatitude = device.lat;
  let deviceLongitude = device.lon;
  let objPoint = _latLongToMerc(lat, long);
  let devicePoint = _latLongToMerc(deviceLatitude, deviceLongitude);
  let objFinalPosZ = objPoint.y - devicePoint.y;
  let objFinalPosX = objPoint.x - devicePoint.x;
  return ({x:objFinalPosX, z:-objFinalPosZ});
}

let { x, z } = transformPointToAR(poi, device);
console.log(x, z);




export default class AugmentedScreen extends React.Component {
  state = {
    type: Camera.Constants.Type.back,
    location: null,
    errorMessage: null,
    locations: [],
    heading: '',
    text: ''
  };

  static navigationOptions = {
    header: null,
  };


  async componentDidMount(){
    THREE.suppressExpoWarnings(true)
    
  }

  componentWillMount(){
    this._getLocationAsync();


  }


  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    
    
  };

  onRunning = () => {
    console.log('fired');
  }


  renderAR = () => {
    return (
        <GraphicsView
          style={{ flex: 1 }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          isArEnabled
          isArCameraStateEnabled
          arTrackingConfiguration={AR.TrackingConfigurations.World}
        />

    );
  }









  render() {
    return (
      <TouchableView
        style={{ flex: 1 }}
        shouldCancelWhenOutside={false}
        onTouchesBegan={this.onTouchesBegan}>
        {this.renderAR()}
      </TouchableView>

    );
  }


   onTouchesBegan = async ({ locationX: x, locationY: y }) => {
    if (!this.renderer) {
      return;
    }
    const size = this.renderer.getSize();

  };

  // When our context is built we can start coding 3D things.
  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    AR.setWorldAlignment(AR.WorldAlignmentTypes.GravityAndHeading);
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
    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);
    // Make a cube - notice that each unit is 1 meter in real life, we will make our box 0.1 meters
    const geometry = new THREE.ConeGeometry(
      /* radius */ 1,
      /* float */ 4,
      /* radialSegments */ 20,
      /* heighSegments */ 1,
      /* openEnded */ false,
      /* thetaStart */ 5,
      /* thetaLength */ 6.3);

    // Simple color material
    const material = new THREE.MeshBasicMaterial( {color: 'red'} );
    // Combine our geometry and material
    this.cone = new THREE.Mesh(geometry, material);
    this.cone.position.z = z;
    this.cone.position.y = 0;
    this.cone.position.x = x;
    this.cone.rotation.z = 3.2;
    console.log(this.scene);

    this.scene.add(this.cone);



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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});