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
import Swipeout from 'react-native-swipeout';
import beaches from '../data/beaches';

const haversine = require('haversine');
const debrisStock = 'http://www.solomonstarnews.com/media/k2/items/cache/9f7bea46670ffcc656accfb2e282ded1_XL.jpg';
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

const getStockImg = type => {
  if(type === 'seal'){
    return {uri: sealStock, width: 60, height: 60};
  }
  else if(type === 'debris'){
    return {uri: debrisStock, width: 60, height: 60};
  }
  else{
    return debrisStock;
  }
};

const findClosest = start => {
  let closest = 100;
  let location;
  beaches.map(e => {
    let end = {
      latitude: e.lat,
      longitude: e.lon
    };
    let distance = haversine(start,end, { unit: 'mile' });
    if(distance < closest){
      closest = distance;
      location = e.name;
    }
  });

  return location;
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
      id: e,
      lat: Number(lat),
      lon: Number(lon),
      date: Date(date),
      type: type,
      pinColor: getPinColor(type),
      src: getStockImg(type),
      beach: findClosest({
        latitude: Number(lat),
        longitude: Number(lon)
      })
    }
    locales.push(poi);
  });
  return locales;
};







// NOTIFICATION SCREEN FYI
export default class SettingsScreen extends React.Component {
	state = {
		photos: [],
		locations: [],
    id: undefined
  }

  static navigationOptions = {
    title: 'Notifications',
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

  resolveIt(id){
    this.setState({
      locations: this.state.locations.filter(e => {
        return e.id !== id;
      })
    })
  };


  renderRow(e,i){
    // Buttons
    var swipeoutBtns = [
      {
        text: 'Resolved',
        onPress: ()=>this.resolveIt(this.state.id)
      }
    ]
    return (
        <Swipeout 
          key={i} 
          onOpen={()=>this.setState({ id: e.id })}
          autoClose={true}
          right={swipeoutBtns}>
          <View style={styles.notificationContainer}>
              <Image style={styles.notificationImg}source={e.src} />
              <View>
                <Text style={styles.notificationTextDate}>{e.type.toUpperCase()} sighted near {e.beach}</Text>
                <Text style={styles.notificationTextDate}>{e.date.toString()}</Text>
              </View>

          </View>
        </Swipeout>)
  }


// return (this.state.locations.map((e,i) => {
//       return this.renderRow(e,i);
//     }))


  render() {
    return (

      <ScrollView>
        {this.state.locations.map((e,i) => {
          return this.renderRow(e,i);
        })}
      </ScrollView>


      )
  }

}


const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    margin:5,
    borderRadius: 10,
    borderColor: '#d6d7da',
    borderWidth: 2,
    overflow: 'hidden',
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: 'black',
    shadowOpacity: 1.0,
    
  },
  notificationTextDate: {
  	padding: 5,
  	color: 'grey'
  }


});