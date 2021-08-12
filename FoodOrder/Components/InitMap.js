import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, Dimensions, Platform, StatusBar, FlatList, PermissionsAndroid } from 'react-native';
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const API_KEY = 'AIzaSyD1lN2ArTGGjhdZrR1JI5bXj58JU9V5iUE';
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../config.js'
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import Geocoder from 'react-native-geocoding';
// import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import moment from 'moment';
import { Modalize } from 'react-native-modalize';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import en from '../model/local_en.json'

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;



const InitMap = ({ navigation }) => {

  const [data, setData] = React.useState({
    error: null,
    Address: null,
    latitude: 36.8549956,
    longitude: 10.2548162,
    favorite: [],
    data: [],
    nameLocation: '',
    errorr: '',
    userId: null,
    searchResults: [],
    isShowingResults: false,
    region: {
      latitude: 36.8549956,
      longitude: 10.2548162,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  });

  const modalizeRefMap = useRef(null);
  const ref = useRef();

  const info = (dataa, details) => {
    const loc = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      nameLocation: dataa.description
    }
    const region = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      llatitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    data.favorite = []
    data.favorite.push(loc)
    setData({ ...data, latitude: details.geometry.location.lat, longitude: details.geometry.location.lng, nameLocation: dataa.description, region: region, favorite: JSON.stringify(data.favorite) })


    map.current.animateToRegion(region, 500);

  }

  const _updatelistlocation = async () => {
    let response = await AsyncStorage.getItem('listofLocation');
    var listofLocation = await JSON.parse(response) || [];
    let donner = { "key": Math.random(), "name": data.nameLocation, "longitude": data.longitude, "latitude": data.latitude }
    listofLocation.push(donner)
    await AsyncStorage.removeItem('listofLocation');
    await AsyncStorage.setItem('listofLocation', JSON.stringify(listofLocation));
  }

  const control = async () => {
    if (data.nameLocation != '') {
      try {
        await AsyncStorage.setItem('location', data.favorite);
      } catch (e) {
        console.log(e);
      }
      searchFilterFunction(data.nameLocation)
    } else {
      Toast.show('Please choose your search area')
    }
  }

  const map = useRef();


  // Function for current position
  ///////////////////////////////////
  const locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        Geocoder.init("AIzaSyD1lN2ArTGGjhdZrR1JI5bXj58JU9V5iUE"); // use a valid API key
        Geocoder.from(position.coords.latitude, position.coords.longitude)
          .then(json => {
            // console.log(json);
            // var addressComponent = json.results[0].address_components;
            const loc = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              nameLocation: json.results[1].formatted_address
            }
            data.favorite = []
            data.favorite.push(loc)
            const region = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            };
            setData({
              ...data,
              nameLocation: json.results[1].formatted_address,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              region: region,
              favorite: JSON.stringify(data.favorite)
            })
            // console.log(addressComponent[2].long_name);
          })
          .catch(error => console.warn(error));
        // const region = {
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        //   latitudeDelta: 0.012,
        //   longitudeDelta: 0.01
        // };
        // map.current.animateToRegion(region, 500);
      },
      (error) => {
        // See error code charts below.
        setData({
          ...data,
          error: error.message
        }),
          console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 100000
      }
    );
  }
  ///////////////////////////////////


  const searchFilterFunction = (text) => {
    const newData = data.data.filter((item) => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    let date =
      moment()
        .utcOffset('+01:00')
        .format('YYYY-MM-DD hh:mm:ss');
    if (newData == '') {
      axios
        .post(`${config.url}/location`, {
          data: date,
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.nameLocation,
          user_id: data.userId
        })
        .then(res => { if (res.data == "location added Succefuly") { _updatelistlocation(); navigation.navigate("HomeDrawer", { itemData: data.favorite }) } })
        .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
    } else {
      navigation.navigate("HomeDrawer", { itemData: data.favorite })
    }
  };


  const getDataFavorite = async (id) => {
    const url = `${config.url}/finduserFavorite/${id}`;
    await fetch(url)
      .then(res => res.json())
      .then(async (res) => {
        setData({
          ...data,
          data: res.location.map((item) => ({ key: item.id, name: item.address, longitude: item.longitude, latitude: item.latitude })),
          favorite: res.user_restaurant_preferences.map((item) => ({ key: item.id, restaurant_id: item.restaurant_id })),
          errorr: res.errorr || null,
          userId: id
        });
        const listofLocation = res.location.map((item) => ({ key: item.id, name: item.address, longitude: item.longitude, latitude: item.latitude }))
        const listoflikes = res.user_restaurant_preferences.map((item) => ({ key: item.id, restaurant_id: item.restaurant_id }))
        try {
          await AsyncStorage.removeItem('listOflikes');
          await AsyncStorage.setItem('listOflikes', JSON.stringify(listoflikes));
          await AsyncStorage.removeItem('listofLocation');
          await AsyncStorage.setItem('listofLocation', JSON.stringify(listofLocation));
        } catch (e) {
          console.log(e);
        }
      })
      .catch(error => {
        setData({
          ...data,
          errorr: 'Error Loading content',
        })
      })
  };

  //Functions allow to take the name of place through coordinates
  ///////////////////////////////////
  const PindragReversegeo = async (region) => {
    Geocoder.init("AIzaSyD1lN2ArTGGjhdZrR1JI5bXj58JU9V5iUE"); // use a valid API key
    Geocoder.from(region.latitude, region.longitude)
      .then(json => {
        console.log(json.results[1].formatted_address);
        // var addressComponent = json.results[0].address_components;
        const loc = {
          latitude: region.latitude,
          longitude: region.longitude,
          nameLocation: json.results[1].formatted_address
        }
        // console.log(addressComponent)
        data.favorite = []
        data.favorite.push(loc)
        setData({
          ...data,
          nameLocation: json.results[1].formatted_address,
          latitude: region.latitude,
          longitude: region.longitude,
          region: region,
          favorite: JSON.stringify(data.favorite)
        })
        // console.log(addressComponent[2].long_name);
      })
      .catch(error => console.warn(error));
  }
  const reversegeo = () => {
    if (Platform.OS == 'ios') {
      Geolocation.requestAuthorization();
      locateCurrentPosition()
    } else {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then((data) => {
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
          if (data == "enabled" || data == "already-enabled") {
            locateCurrentPosition()
          }
        })
        .catch((err) => {
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
        });
    }
  }
  ///////////////////////////////////

  useEffect(() => {
    setTimeout(async () => {
      let user_id;
      user_id = null;
      try {
        user_id = await AsyncStorage.getItem('userid');
      } catch (e) {
        console.log(e);
      }
      // if(Platform.OS == 'android'){
      // }
      // PindragReversegeo(data.region)
      getDataFavorite(parseInt(user_id))
    }, 500);
  }, []);

  const render = () => {
    return (
      <Icon
        name="ios-pin"
        size={30}
        color="#ff914d"
        style={{ marginTop: hp('1%'), marginLeft: wp('4%') }}
      />
    )
  }
  const onRegionChange = (region) => {
    PindragReversegeo(region)
  }
  if (ref.current?.isFocused()) {
    modalizeRefMap.current?.open();
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='transparent' barStyle='dark-content' />
      <View style={{ height: hp('13%'), backgroundColor: 'white', justifyContent: 'flex-start', flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
        <Text style={{ paddingLeft: wp('1%'), color: 'black', top: hp('7%'), fontWeight: 'bold', fontSize: 16, textAlign: 'center', width: wp('80%'), justifyContent: 'center', alignContent: 'center' }}>{en.INITMAP_TITLE}</Text>
      </View>
      <View style={{ flex: 8 }}>
        <MapView
          provider={null}
          style={styles.mapContainer}
          region={data.region}
          minZoomLevel={10}
          maxZoomLevel={20}
          scrollEnabled={true}
          followsUserLocation={true}
          showsMyLocationButton={false}
          showsPointsOfInterest={true}
          onRegionChangeComplete={region => { onRegionChange(region) }}
          ref={map}
        >
          <Marker
            draggable
            coordinate={{
              latitude: data.region.latitude,
              longitude: data.region.longitude,
            }}
          />
        </MapView>
        {/* <View style={styles.location}>
          <MaterialIcons size={23} name="my-location" color='#ff914d' onPress={reversegeo} />
        </View> */}
        <View style={styles.searchBox}>
          <GooglePlacesAutocomplete
            // ref={ref}
            placeholder={en.INITMAP_PLACEHOLDER_SEARCH}
            minLength={2} // minimum length of text to searchs
            autoFocus={false}
            renderLeftButton={() => render()}
            // returnKeyType="search" // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance='light' // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed='auto' // true/false/undefined
            fetchDetails
            renderDescription={row => row.description} // custom description render
            onPress={(data, details) => { info(data, details) }}
            getDefaultValue={() => ''}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: API_KEY,
              language: 'en', // language of the results
              components: 'country:in',
            }}

            textInputProps={{ placeholderTextColor: '#000' }}
            styles={{
              separator: {
                height: hp('0%'),
                backgroundColor: '#fff',
              },
              // listView: {
              //   marginLeft: wp('-5%')
              // },
              textInput: {
                backgroundColor: '#fff',
              },
              textInputContainer: {
                width: wp('60%'),
                marginTop: hp('0.5%')
              },
              description: {
                fontWeight: 'bold'
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              }
            }}

            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance',
              type: 'cafe',
            }}

            GooglePlacesDetailsQuery={{
              // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
              fields: 'formatted_address,geometry',
            }}
            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          // eslint-disable-next-line react/jsx-one-expression-per-line
          />
        </View>
        <View style={{ backgroundColor: 'white', height: hp('30%'), borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: hp('3%'),
            marginBottom: hp('1%'),
            width: wp('60'),
            height: hp('5%'),
            alignSelf: 'center'
          }}>
            <Icon name="ios-location-outline" color={'black'} size={28} />
            <Text style={{
              marginLeft: wp('1%'),
              marginTop: hp('0.5%'),
              fontSize: 13
            }}>{data.nameLocation}</Text>
          </View>
          <View style={{ width: wp('90%'), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginLeft: wp('5%'), marginBottom: hp('2%') }}>
            <Icon name="navigate" color={'black'} size={15} style={{ marginTop: hp('0.4%') }} />
            <Text style={{ fontWeight: 'bold', marginLeft: wp('1.5%') }} onPress={() => { reversegeo() }}>{en.INITMAP_CURRENT_POSITION}</Text>
          </View>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#b4b4b4', width: wp('90%'), alignSelf: 'center' }} />
          <Button style={styles.connectbtn} mode='outlined' onPress={() => { control() }}>
            <Text style={styles.btntext}>{en.INITMAP_BUTTON}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};







const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: hp('60%'),
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? hp('6%') : hp('2%'),
    flexDirection: "row",
    backgroundColor: '#fff',
    width: wp('80%'),
    alignSelf: 'center',
    borderRadius: 30,
    // padding: 10,
    // shadowColor: '#ccc',
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.5,
    // shadowRadius: 5,
    // elevation: 10,
  },
  btntext: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff'
  },
  searchResultsContainer: {
    width: 340,
    height: 200,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 50,
  },
  resultItem: {
    width: '100%',
    justifyContent: 'center',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15,
  },
  location: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? hp('40%') : hp('35%'),
    right: wp('5%'),
    flexDirection: "row",
    backgroundColor: '#fff',
    width: wp('9.5%'),
    alignSelf: 'center',
    borderRadius: 20,
    padding: 7,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  connectbtn: {
    // position: 'absolute',
    marginTop: Platform.OS === 'ios' ? hp('3%') : hp('1%'),
    padding: 5,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 1,
    borderRadius: 30,
    height: hp('7%'), // 70% of height device screen
    width: wp('85%'),
    fontFamily: 'Rubik-Regular',
    alignSelf: 'center',
    backgroundColor: "#36b3c9",
    justifyContent: "center",
    alignContent: "center",
    // borderRadius: 5,
  },
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 80,
    paddingHorizontal: 10
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection: "row",
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    alignItems: 'center',
    marginTop: 5
  },
  signIn: {
    width: '100%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});


export default InitMap;