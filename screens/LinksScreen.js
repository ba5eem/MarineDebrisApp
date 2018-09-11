import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { FileSystem, MapView } from 'expo';


const PHOTOS_DIR = FileSystem.documentDirectory + 'photosA';

export default class LinksScreen extends React.Component {
  state ={
    photos: []
  }
  static navigationOptions = {
    title: 'Links',
  };


  componentDidMount = async () => {
    this.refreshImages();
  }

  refreshImages = async () => {
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    this.setState({
      photos: photos
    })
  }

  

  render() {
    console.log(this.state.photos.length);
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 21.309,
          longitude: -157.808,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {this.state.photos.map((e,i) => {
          let lat = e.split('--')[0];
          let lon;
          let lonWExt = e.split('--')[1];
          if(lonWExt !== undefined){
            lon = lonWExt.substring(0, lonWExt.length-4);
          }

          return (
            <MapView.Marker
              key={i}
              coordinate={{
                longitude: -Number(lon),
                latitude: Number(lat)  
              }}/>
          )
        })}
        <TouchableOpacity
          style={styles.refreshTextContainer}
          onPress={() => this.refreshImages()}>
          <Text
            style={styles.refreshText}>
            refresh
          </Text>
        </TouchableOpacity>



      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  refreshTextContainer: {
    backgroundColor: "#fefefe",
    maxWidth: 85,
    borderRadius: 50,
    padding: 10,
    opacity: 0.5,
    marginTop: 5
  },
  refreshText: {
    padding: 10,
  }

});
