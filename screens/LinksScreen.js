import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { FileSystem, MapView } from 'expo';

const sealStock = "https://assets.atlasobscura.com/article_images/58631/image.jpg";
const PHOTOS_DIR = FileSystem.documentDirectory + 'photosA';

const getPinColor = type => {
  if(type === 'seal'){
    return 'blue';
  }
  else if(type === 'debris'){
    return 'red';
  }
  else{
    return 'yellow';
  }
};


const createLocations = photos => {
  let locales = [];
  let poi;
  photos.map(e =>{
    let arr = e.split('&');
    let date = arr[0];
    let lat = arr[1];
    let lon = arr[2];
    let type = arr[3].split('.jpg')[0];
    poi = {
      lat: Number(lat),
      lon: Number(lon),
      date: date,
      type: type,
      pinColor: getPinColor(type)
    }
    locales.push(poi);
  });
  return locales;
};

export default class LinksScreen extends React.Component {
  state ={
    photos: [],
    locations: []
  }
  static navigationOptions = {
    title: 'Links',
  };


  componentDidMount = async () => {
    this.refreshImages();
  }

  refreshImages = async () => {
    console.log(this.state.locations);
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    this.setState({
      photos: photos,
      locations: createLocations(photos)
    });
  };



  renderMarkers(){
    return (this.state.locations.map((e,i) => {
      return (
        <MapView.Marker
          key={i}
          pinColor={e.pinColor}
          coordinate={{
            longitude: e.lon,
            latitude: e.lat  
          }}/>
      )
    }))
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
        {this.renderMarkers()}
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
