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
import { Modal, WebBrowser, Camera, Permissions, Location, FileSystem, Pedometer } from 'expo';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';

const PHOTOS_DIR = FileSystem.documentDirectory + 'photosA';

export default class OptionsScreen extends React.Component {
	state = {
		photos: [],
		locations: [],
    count: 0,
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    currentStepCount: 0
	}

  static navigationOptions = {
    title: 'sustainable coastlines Hawaii',
  };

  componentDidMount = async () => {
    this._subscribe();
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    this.setState({
      count: photos.length
    })
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps
      });
    });

    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result)
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: "Could not get isPedometerAvailable: " + error
        });
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: "Could not get stepCount: " + error
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };






  render() {
    let count = 3021+this.state.currentStepCount;

    return (
    	<ScrollView style={styles.container}>


    {/* count */}
    <Animatable.View animation="shake" easing="ease-out" iterationCount="2" style={{ width: '100%' }}>
        <View style={[styles.statsContainer, {backgroundColor: 'orange'}]}>

         <AnimatedCircularProgress
          size={200}
          width={15}
          fill={0}
          tintColor="blue"
          backgroundColor="red">
            {
              (fill) => (
                <Text style={styles.points}>
                  {this.state.count}
                </Text>
              )
            }
          </AnimatedCircularProgress>

          <Text style={styles.statsHeaders}>Reported via App</Text>

        </View>
        </Animatable.View>


      {/* cleanups */}
      <Animatable.View animation="wobble" easing="ease-in" iterationCount="2" style={{ width: '100%' }}>
        <View style={[styles.statsContainer, {backgroundColor: 'cornflowerblue'}]}>
         <AnimatedCircularProgress
          size={200}
          width={15}
          fill={0}
          tintColor="#3d5875"
          backgroundColor="lightblue">
            {
              (fill) => (
                <Text style={styles.points}>
                  {count}
                </Text>
              )
            }
          </AnimatedCircularProgress>
          <Text style={styles.statsHeaders}>
          Steps taken while saving the world
        </Text>
        </View>
        </Animatable.View>

      {/* volunteers */}
      <Animatable.View animation="swing" easing="ease-in" iterationCount="2" style={{ width: '100%' }}>
        <View style={[styles.statsContainer, {backgroundColor: 'pink'}]}>
         <AnimatedCircularProgress
          size={200}
          width={15}
          fill={0}
          tintColor="#3d5875"
          backgroundColor="lightgreen">
            {
              (fill) => (
                <Text style={styles.points}>
                  19,583
                </Text>
              )
            }
          </AnimatedCircularProgress>
          <Text style={styles.statsHeaders}>Volunteers</Text>
        </View>
        </Animatable.View>

      {/* weights */}
        <View style={[styles.statsContainer, {backgroundColor: 'salmon'}]}>
         <AnimatedCircularProgress
          size={200}
          width={15}
          fill={0}
          tintColor="#3d5875"
          backgroundColor="orange">
            {
              (fill) => (
                <Text style={styles.points}>
                  323,138
                </Text>
              )
            }
          </AnimatedCircularProgress>
          <Text style={styles.statsHeaders}>Weight(lbs.)</Text>
        </View>


         {/* Keiki Educated */}
        <View style={[styles.statsContainer, {backgroundColor: 'lightgreen'}]}>
         <AnimatedCircularProgress
          size={200}
          width={15}
          fill={0}
          tintColor="#3d5875"
          backgroundColor="pink">
            {
              (fill) => (
                <Text style={styles.points}>
                  26,782
                </Text>
              )
            }
          </AnimatedCircularProgress>
          <Text style={styles.statsHeaders}>Keiki Educated</Text>
        </View>

         {/* HI-5 */}
        <View style={[styles.statsContainer, {backgroundColor: 'coral'}]}>
         <AnimatedCircularProgress
          size={200}
          width={15}
          fill={0}
          tintColor="#3d5875"
          backgroundColor="yellow">
            {
              (fill) => (
                <Text style={styles.points}>
                  9,289
                </Text>
              )
            }
          </AnimatedCircularProgress>
          <Text style={styles.statsHeaders}>HI-5</Text>
        </View>

         {/* Ocean Plastic */}
        <View style={[styles.statsContainer, {backgroundColor: 'aqua'}]}>
         <AnimatedCircularProgress
          size={200}
          width={15}
          fill={0}
          tintColor="#3d5875"
          backgroundColor="green">
            {
              (fill) => (
                <Text style={styles.points}>
                  222,283
                </Text>
              )
            }
          </AnimatedCircularProgress>
          <Text style={styles.statsHeaders}>Ocean Plastic</Text>
        </View>


      </ScrollView>




    	);
  }

}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  statsContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 15,
    alignItems: 'center'
  },
  points: {
    fontSize: 50
  },
  statsHeaders: {
    fontSize: 20,
    alignItems: 'center',
    paddingTop: 5
  }



});

