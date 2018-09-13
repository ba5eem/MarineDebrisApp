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


export default class OptionsScreen extends React.Component {
	state = {
		photos: [],
		locations: []
	}

  static navigationOptions = {
    title: 'Our Cleanup Stats...',
  };








  render() {

    return (
    	<ScrollView style={styles.container}>
        <View style={styles.statsContainer}>
    		 <AnimatedCircularProgress
          size={100}
          width={15}
          fill={0}
          tintColor="blue"
          backgroundColor="red">
            {
              (fill) => (
                <Text style={styles.points}>
                  91
                </Text>
              )
            }
          </AnimatedCircularProgress>
          <Text>Total Clean-Ups</Text>
        </View>
        <View style={styles.statsContainer}>
         <AnimatedCircularProgress
          size={100}
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
          <Text>Volunteers</Text>
        </View>

      </ScrollView>




    	);
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row'
  },
  statsContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20
  },



});

