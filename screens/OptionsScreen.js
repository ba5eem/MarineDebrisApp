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

const debrisStock = 'http://www.solomonstarnews.com/media/k2/items/cache/9f7bea46670ffcc656accfb2e282ded1_XL.jpg';
const sealStock = "https://assets.atlasobscura.com/article_images/58631/image.jpg";


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
    return sealStock;
  }
  else if(type === 'debris'){
    return debrisStock;
  }
  else{
    return debrisStock;
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
      date: Date(date),
      type: type,
      pinColor: getPinColor(type),
      src: getStockImg(type)
    }
    locales.push(poi);
  });
  return locales;
};

const PHOTOS_DIR = FileSystem.documentDirectory + 'photosA';

export default class OptionsScreen extends React.Component {
	state = {
		photos: [],
		locations: []
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

  renderNotifications(){
    return (this.state.locations.map((e,i) => {
      return (
        <View key={i} style={styles.notificationContainer}>
    			<Image source={{uri: e.src, width: 60, height: 60}} />
    			<Text style={styles.notificationTextDate}>{e.date.toString()}</Text>
    		</View>
      )
    }))
  }




  render() {

    return (
    	<ScrollView>
    		{this.renderNotifications()}   
      </ScrollView>




    	);
  }

}


const styles = StyleSheet.create({
  notificationContainer: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 10,
  },
  notificationTextDate: {
  	padding: 5,
  	color: 'grey'
  }


});