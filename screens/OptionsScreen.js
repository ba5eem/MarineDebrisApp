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
        <View style={styles.statsContainer}>
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
        <View style={styles.statsContainer}>
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
        <View style={styles.statsContainer}>
         <AnimatedCircularProgress
          size={200}
          width={15}
          fill={0}
          tintColor="#3d5875"
          backgroundColor="lightblue">
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

      </ScrollView>




    	);
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingLeft: 65
  },
  statsContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
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

