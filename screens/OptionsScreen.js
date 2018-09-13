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
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const PHOTOS_DIR = FileSystem.documentDirectory + 'photosA';

export default class OptionsScreen extends React.Component {
	state = {
		photos: [],
		locations: [],
    count: 0
	}

  static navigationOptions = {
    title: 'Our Cleanup Stats...',
  };

  componentDidMount = async () => {
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    this.setState({
      count: photos.length
    })
  }







  render() {

    return (
    	<ScrollView style={styles.container}>


    {/* count */}
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

      {/* cleanups */}
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
                  91
                </Text>
              )
            }
          </AnimatedCircularProgress>
          <Text style={styles.statsHeaders}>Total Cleanups</Text>
        </View>

      {/* volunteers */}
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

      {/* weights */}
        <View style={styles.statsContainer}>
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
        <View style={styles.statsContainer}>
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
        <View style={styles.statsContainer}>
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
        <View style={styles.statsContainer}>
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

