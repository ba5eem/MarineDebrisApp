import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl
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
      color: "#fefefe",
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








export default class NotificationScreen extends React.Component {
	state = {
		photos: [],
		locations: [],
    id: undefined,
    refreshing: false
  }

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
      title: `Notifications${state.params && state.params.title ? state.params.title : '(0)'}`,
    };
  };



  componentDidMount = async () => {
    this.refreshImages();
  }


  _onRefresh(){
    this.setState({ refreshing: true });
    this.refreshImages();
    this.setState({ refreshing: false })
  }

  refreshImages = async () => {
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    this.setState({
      photos: photos,
      locations: createLocations(photos)
    });
    let title = `(${this.state.locations.length})`;
    this.props.navigation.setParams({ title });
  };

  resolveIt(id){
    this.setState({
      locations: this.state.locations.filter(e => {
        return e.id !== id;
      })
    })
    let title = `(${this.state.locations.length})`;
    this.props.navigation.setParams({ title });
  };

  vipIt(id){
    let arr = this.state.locations;
    arr.map(e => {
      if(e.id === id){
        e.color = 'red';
      }
    });
    this.setState({ locations: arr })
  }


  renderRow(e,i){

    // Buttons
    var rightButtons = [
      {
        text: 'Resolved',
        onPress: ()=>this.resolveIt(this.state.id),
        backgroundColor: 'red'
      }
    ]
    var leftButtons = [
      {
        text: 'VIP',
        onPress: ()=>this.vipIt(this.state.id),
        backgroundColor: 'green'
      }
    ]
    return (
        <Swipeout 
          key={i} 
          onOpen={()=>this.setState({ id: e.id })}
          autoClose={true}
          sensitivity={1}
          left={leftButtons}
          right={rightButtons}>
          <View style={[styles.notificationContainer, { borderColor: e.color }]}>
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

      <ScrollView
      refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
        {this.state.locations.map((e,i) => {
          return this.renderRow(e,i);
        })}
      </ScrollView>


      )
  }

}


const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: "#fefefe", 
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