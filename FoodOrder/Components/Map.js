import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, Image, Button, ScrollView, StyleSheet, Dimensions, Platform, } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const API_KEY = 'AIzaSyD1lN2ArTGGjhdZrR1JI5bXj58JU9V5iUE';
import Carousel from 'react-native-snap-carousel';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geocoder from 'react-native-geocoding';
import config from '../config.js'
import StarRating from './StarRating';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { TouchableRipple } from "react-native-paper";
import haversine from 'haversine';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import moment from 'moment';
import en from '../model/local_en.json'

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;


const Map = ({ navigation, token }) => {

  const [data, setData] = React.useState({
    error: null,
    latitude: 0,
    longitude: 0,
    Address: null,
    markers: [],
    data: [],
    test: [],
    coordinates: [],
    errorr: null,
    nameLocation: '',
  });
  const [empty, setEmpty] = React.useState(false);
  const [favorite, setfavorite] = React.useState(false);

  const map = useRef();
  const carousel = useRef();

  const calcDistance = (item) => {
    const start = {
      latitude: data.latitude,
      longitude: data.longitude
    }
    const end = {
      latitude: item.latitude,
      longitude: item.longitude
    }
    return haversine(start, end).toFixed(1);
  };
  const calcDistance2 = (latdes, longdes, latorg, longorig) => {
    const start = {
      latitude: latorg,
      longitude: longorig
    }
    const end = {
      latitude: latdes,
      longitude: longdes
    }
    return haversine(start, end).toFixed(1);
  };

  const navig = (item) => {
    var kilo = calcDistance(item.deals.restaurant)
    navigation.navigate('CardItemDetails', { itemData: item, kilo: kilo, token: token })
  }


  useEffect(() => {
    setTimeout(async () => {
      const isFocused = navigation.isFocused();

      if (isFocused) {
        getData()
      }
      const navFocusListener = navigation.addListener('focus', () => {
        getData()
      });

      return navFocusListener

    }, 500);
  }, [navigation])


  // Function for current position
  ///////////////////////////////////
  const locationenable = () => {
    if (Platform.OS == 'ios') {
      Geolocation.requestAuthorization();
      reversegeo()
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
            reversegeo()
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


  //Functions allow to take the name of place through coordinates
  ///////////////////////////////////
  const reversegeo = async () => {
    Geolocation.getCurrentPosition(
      (position) => {
        Geocoder.init("AIzaSyD1lN2ArTGGjhdZrR1JI5bXj58JU9V5iUE"); // use a valid API key
        Geocoder.from(position.coords.latitude, position.coords.longitude)
          .then(json => {
            // console.log(json);
            var addressComponent = json.results[0].address_components;
            const loc = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              nameLocation: addressComponent[2].long_name
            }
            data.favorite = []
            data.favorite.push(loc)
            setData({ ...data, favorite: JSON.stringify(data.favorite) })
            const newdata = data.coordinates.filter((item) => {
              if (calcDistance2(item.deals.restaurant.latitude, item.deals.restaurant.longitude, position.coords.latitude, position.coords.longitude) < 30.0) {
                console.log('loc', item.id)
                return item;
              }
            });
            setData({
              ...data,
              nameLocation: addressComponent[2].long_name,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              test: newdata,
            })
            console.log(addressComponent[2].long_name);
          })
          .catch(error => console.warn(error));
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.01
        };
        map.current.animateToRegion(region, 500);
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
    const newdata = data.coordinates.filter((item) => {
      if (calcDistance(item.deals.restaurant) < 5) {
        return item;
      }
    })
    setData({
      ...data,
      coordinates: newdata
    })
  }
  ///////////////////////////////////
  const getData = async () => {
    const url = `${config.url}/deals`;
    let location;
    location = []
    await fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res == '') {
          setEmpty(true)
        } else {
          setEmpty(false)
        }
        let newdataaa = res.filter((item) => {
          const date = moment().format();
          let expirydate = moment(item.expirydate).format();
          let compare = moment(date).isAfter(expirydate)
          const qt = item.quantity - item.nbre_redeemed_deal
          let quantity;
          quantity = null;
          if (qt <= 0) {
            quantity = 0
          } else {
            quantity = qt
          }
          if (quantity != 0) {
            return item
          } else if (quantity != 0 && !compare) {
            return item
          }
        })
        AsyncStorage.getItem('location').then((value) => {
          location = JSON.parse(value)
          setData({
            ...data,
            nameLocation: location[0].nameLocation,
            latitude: location[0].latitude,
            longitude: location[0].longitude,
            data: res,
            test: newdataaa.filter((item) => {
              const date = moment().format();
              let expirydate = moment(item.expirydate).format();
              let compare = moment(date).isAfter(expirydate)
              if (!compare) {
                return item
              }
            }),
            coordinates: newdataaa.filter((item) => {
              const date = moment().format();
              let expirydate = moment(item.expirydate).format();
              let compare = moment(date).isAfter(expirydate)
              if (!compare) {
                return item
              }
            }),
            errorr: res.error || null,
          });
          let resss = newdataaa.filter((item) => {
            const date = moment().format();
            let expirydate = moment(item.expirydate).format();
            let compare = moment(date).isAfter(expirydate)
            if (!compare) {
              return item
            }
          })
          if (resss == '') {
            setEmpty(true)
          } else {
            setEmpty(false)
          }
        })
      })
      .catch(error => {
        setData({
          ...data,
          errorr: 'Error Loading content',
        })
        // setLoading(false)
        // setRefreching(false)
      })
  };


  const info = (dataa, details) => {
    const newdata = data.coordinates.filter((item) => {
      if (calcDistance2(item.deals.restaurant.latitude, item.deals.restaurant.longitude, details.geometry.location.lat, details.geometry.location.lng) < 30.0) {
        // console.log('rest', item.id)
        return item;
      }
    });
    if (newdata.length == 0) {
      setEmpty(true)
    } else {
      setEmpty(false)
      setData({ ...data, latitude: details.geometry.location.lat, longitude: details.geometry.location.lng, nameLocation: dataa.description, test: newdata })
    }
    const region = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      latitudeDelta: 0.012,
      longitudeDelta: 0.01
    };
    map.current.animateToRegion(region, 500);
  }


  const renderCarouselItem = ({ item }) => (
    <TouchableRipple onPress={() => { navig(item) }} >
      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>{item.deals.restaurant.name}</Text>
        <Text numberOfLines={1} style={styles.cardDescription}>{item.deals.description}</Text>
        <View style={styles.cardStarRating}>
          <StarRating ratings={item.deals.restaurant.rating} style={19} />
        </View>
        <Image style={styles.cardImage} source={{ uri: item.deals.imageurl }} />
        <Text style={styles.cardTime}>{en.TODAY} from {item.startingdate_hours} to {item.expirydate_hours} </Text>

      </View>
    </TouchableRipple>
  );

  const onCarouselItemChange = (index) => {
    let location = data.test[index];
    map.current.animateToRegion({
      latitude: location.deals.restaurant.latitude,
      longitude: location.deals.restaurant.longitude,
      latitudeDelta: 0.012,
      longitudeDelta: 0.01
    })

    data.markers[index].showCallout()
  }

  const onMarkerPressed = (location, index) => {
    map.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.012,
      longitudeDelta: 0.01
    });
    carousel.current.snapToItem(index);
  }
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


  return (
    <View style={styles.container}>
      <View style={{ flex: 8 }}>
        <MapView
          provider={null}
          style={styles.mapContainer}
          onMapReady={() => map.current.fitToElements(true)}
          region={{
            latitude: data.latitude,
            longitude: data.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          // showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={false}
          showsPointsOfInterest={true}
          ref={map}
        // onPress={(coordinate) => console.log(coordinate.nativeEvent.coordinate)}
        // onMarkerDrag={(e) => console.log(e.nativeEvent.coordinate)}
        >
          {/* <Marker
            draggable
            coordinate={{
              latitude: data.latitude,
              longitude: data.longitude,
            }}
            onDragEnd={(e) => {
              console.log(e.nativeEvent.coordinate)
            }}
            pointerEvents='auto'

          /> */}
          {
            data.test.map((marker, index) => (
              <Marker
                key={marker.id}
                ref={ref => data.markers[index] = ref}
                onPress={() => onMarkerPressed(marker, index)}
                coordinate={{ latitude: marker.deals.restaurant.latitude, longitude: marker.deals.restaurant.longitude }}

              >
                <Callout>
                  <Text>{marker.deals.restaurant.name}</Text>
                </Callout>

              </Marker>
            ))
          }
        </MapView>

        <View style={styles.location}>
          <MaterialIcons size={23} name="my-location" color='#ff914d' onPress={locationenable} />
        </View>
        <View style={styles.searchBox}>
          <GooglePlacesAutocomplete
            //  currentLocation={true}
            //  currentLocationLabel='Current location'
            placeholder={en.INITMAP_PLACEHOLDER_SEARCH}
            minLength={2} // minimum length of text to search
            autoFocus={false}
            renderLeftButton={() => render()}
            returnKeyType="search" // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance='light' // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed='auto' // true/false/undefined
            // returnKeyType={'default'}
            fetchDetails={true}

            renderDescription={row => row.description} // custom description render
            onPress={(data, details) => { info(data, details); }}

            getDefaultValue={() => ''}

            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: API_KEY,
              language: 'en', // language of the results
              components: 'country:tn',
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
                marginTop: hp('0.5%'),
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
              type: 'cafe'
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
        <View>
          {!empty ?
            (<Carousel
              ref={carousel}
              data={data.test}
              containerCustomStyle={styles.carousel}
              renderItem={renderCarouselItem}
              sliderWidth={wp('100%')}
              itemWidth={wp('75%')}
              removeClippedSubviews={false}
              onSnapToItem={(index) => onCarouselItemChange(index)}
            />)
            :
            <View style={{
              position: 'absolute',
              bottom: hp('8%'),
              marginBottom: hp('3%'),
              width: wp('90'),
              height: hp('20%'),
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 20,
              shadowColor: 'black',
              shadowOffset: { width: 2, height: 5 },
              shadowOpacity: 0.7,
              shadowRadius: 5,
              elevation: 15,
            }}>
              <Text style={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: hp("1%"),
                fontSize: 13,
                width: wp('75%'),
                marginTop: hp('4%'),
                color: '#000',
                lineHeight: 24
              }}>
                No offer for the moment or in this area!
              </Text>
              <Text style={{
                width: wp('80%'),
                textAlign: 'center',
                marginBottom: hp('3%'),
                color: '#000',
                lineHeight: 24,
                fontSize: 13,
              }}>Try changing your location or stay tuned as traders add deals during the day!</Text>
            </View>
          }
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
    height: hp('100%'),
  },
  carousel: {
    position: 'absolute',
    bottom: hp('10%'),
    marginBottom: hp('3%'),

  },
  cardContainer: {
    backgroundColor: 'white',
    height: hp('32%'),
    width: wp('75%'),
    padding: 25,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 20,
  },
  cardImage: {
    height: hp('16%'),
    width: wp('75%'),
    top: hp('0%'),
    position: 'absolute',
  },
  cardTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    top: hp('14%'),
    left: wp('-2%')
  },
  cardDescription: {
    color: 'black',
    left: wp('-2%'),
    fontSize: 15,
    fontFamily: "Rubik-Regular",
    fontWeight: 'normal',
    top: hp('15%')
  },
  cardStarRating: {
    top: hp('16%'),
    left: wp('-2%'),
  },
  cardTime: {
    top: hp('14%'),
    left: wp('-2%'),
    color: '#b4b4b4'
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? hp('6%') : hp('3%'),
    flexDirection: "row",
    backgroundColor: '#fff',
    width: wp('80%'),
    alignSelf: 'center',
    borderRadius: 30,
    // padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  location: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? hp('40%') : hp('35%'),
    right: wp('5%'),
    flexDirection: "row",
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: wp('10%'),
    alignSelf: 'center',
    borderRadius: 20,
    padding: 7,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
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
  textContent: {
    flex: 2,
    padding: 10,
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


export default Map;