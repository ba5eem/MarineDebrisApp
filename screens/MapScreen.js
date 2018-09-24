import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text, ScrollView, TabBarIcon } from 'react-native';
import { FileSystem, MapView } from 'expo';
import beaches from '../data/beaches';
import { Platform } from 'react-native';

const haversine = require('haversine');
let beachIcon = '../assets/icons/beachIcon.png';
let refreshIcon = '../assets/icons/refreshIcon.png';
let sealIcon = '../assets/icons/sealIcon.png';
let debrisIcon = '../assets/icons/debrisIcon.png';
let markIcon = '../assets/icons/markIcon.png';

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


export default class MapScreen extends React.Component {
  state ={
    photos: [],
    locations: [],
    showBeaches: false,
    showSeals: true,
    showDebris: true
  }
  static navigationOptions = {
    title: 'Oahu',
  };


  componentDidMount = async () => {
    this.refreshImages();
  }

  refreshImages = async () => {
    //console.log(this.state.locations);
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    this.setState({
      photos: photos,
      locations: createLocations(photos)
    });
  };



  renderSealMarkers(){
    return (this.state.locations.map((e,i) => {
      if(e.type === 'seal'){
        return (
        <MapView.Marker
          key={i}
          pinColor={e.pinColor}
          coordinate={{
            longitude: e.lon,
            latitude: e.lat
          }}/>
      )
      }
    }))
  }

  renderDebrisMarkers(){
    return (this.state.locations.map((e,i) => {
      if(e.type === 'debris'){
        return (
        <MapView.Marker
          key={i}
          pinColor={e.pinColor}
          coordinate={{
            longitude: e.lon,
            latitude: e.lat
          }}/>
      )
      }
    }))
  }

  renderBeaches(){
    return (beaches.map((e,i) => {
      return (
        <MapView.Marker
          key={i}
          pinColor={'green'}
          coordinate={{
            longitude: e.lon,
            latitude: e.lat
          }}>
          <MapView.Callout>
            <View>
              <Text>{e.name}</Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      )
    }))
  }






  render() {
    console.log(this.state.photos.length);
    return (

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 21.297,
          longitude: -157.855,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {this.state.showSeals && this.renderSealMarkers()}
        {this.state.showDebris && this.renderDebrisMarkers()}
        {this.state.showBeaches && this.renderBeaches()}
        <View style={styles.refreshTextContainer}>

          <TouchableOpacity
            style={{maxWidth:100}}
            onPress={() => this.refreshImages()}>
            <Image source={require(refreshIcon)} style={styles.refreshIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{maxWidth:100}}
            onPress={() => this.setState({ showSeals: !this.state.showSeals })}>
            <Image source={require(sealIcon)} style={styles.sealIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{maxWidth:70}}
            onPress={() => this.setState({ showDebris: !this.state.showDebris })}>
            <Image source={require(debrisIcon)} style={styles.debrisIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{maxWidth:100}}
            onPress={() => this.setState({ showBeaches: !this.state.showBeaches })}>
            <Image source={require(beachIcon)} style={styles.beachIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{maxWidth:100}}
            onPress={() => console.log('other')}>
            <Image source={require(markIcon)} style={styles.otherIcon} />
          </TouchableOpacity>

        </View>


      </MapView>


    );
  }
}

const styles = StyleSheet.create({

  refreshTextContainer: {
    flex: 0.07,
    flexDirection: 'row',
    backgroundColor: "#fefefe",
    width: '100%',
  },
  refreshIcon: {
    margin: 10,
    width: 30,
    height: 30,
    marginLeft: 20
  },
  sealIcon: {
    margin: 10,
    width: 30,
    height: 30,
    marginLeft: 90
  },
  debrisIcon: {
    margin: 10,
    width: 30,
    height: 30,
    marginLeft: 160,
  },
  beachIcon: {
    margin: 10,
    width: 30,
    height: 30,
    marginLeft: 230,
  },
  otherIcon: {
    margin: 10,
    width: 30,
    height: 30,
    marginLeft: 300,
  },

});
