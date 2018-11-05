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
            <Text style={styles.heading}>{this.state.heading}</Text>
            <Text style={styles.headingP10}>{this.state.heading+30}</Text>
            <Text style={styles.headingM10}>{this.state.heading-30}</Text>
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
    bottom: 10,
    color: 'grey',
    paddingRight: 5,
    paddingLeft: 5,
    maxWidth: '100%',
    fontSize: 30,
    backgroundColor: 'rgba(255,255,250, 0.9)'
  },
  headingM10: {
    position: 'absolute',
    left: '10%',
    bottom: 10,
    color: 'grey',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 30,
    opacity: 90,
    backgroundColor: 'rgba(255,255,250, 0.9)'
  },
  headingP10: {
    position: 'absolute',
    left: '80%',
    bottom: 10,
    color: 'grey',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 30,
    opacity: 90,
    backgroundColor: 'rgba(255,255,250, 0.9)'
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
