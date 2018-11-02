import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Image } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { AR, Constants, Location, Permissions } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import AugmentedScreen from './screens/AugmentedScreen';



export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    locations: [],
    heading: '',
    errorMessage: ''
  };


  async componentDidMount() {
    THREE.suppressExpoWarnings(true);
  }

  async componentWillMount() {
    this._getLocationAsync();
    Location.watchHeadingAsync(this.headingChanged);
  }



  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }   
  };

  headingChanged = (data) => {
    this.setState({
      heading: parseInt(data.magHeading)
    })
  }


 // TODO!!!! resizemode -didnt work, find something else

  render() {
    let target =  Number(this.state.heading);

    return (
        <View style={styles.container}>
          <View style={{ flex: 1, backgroundColor: 'grey'}}>
            <AugmentedScreen />
          </View>
          <View>
            <Text style={styles.targetPoint}>
            V
            </Text>
            <Image 
              style={{resizeMode: 'repeat' ,transform: ([{ translateX:target }])}} 
              source={require('./assets/images/compass.png')}/>
          </View>    
        </View>
      );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    flexDirection:'row',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'grey'
  },
  heading: {
    position: 'absolute',
    left: '45%',
    bottom: 20,
    color: 'white',
    backgroundColor: 'grey',
    paddingRight: 20,
    paddingLeft: 20,
    maxWidth: 100,
    fontSize: 30
  },
  compass: {
    left: 20
  },
  targetPoint: {
    color: 'red', 
    fontWeight: '900', 
    position: 'absolute'
  }
});
