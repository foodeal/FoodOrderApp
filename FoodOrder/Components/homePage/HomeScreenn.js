import React, { useRef, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Linking, StatusBar, FlatList, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import DealCard from './DealCard'
import Deal from './DealHomeCard'
import Deallast from './Deallast'
import DealLouper from './DealLouper'
import { Modalize } from 'react-native-modalize';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';
import config from '../../config.js'
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { TouchableRipple } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import { List, ListItem, Avatar } from "react-native-elements";
import { LogBox } from 'react-native'
import Dialog from "react-native-dialog";
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import axios from 'axios';
import haversine from 'haversine';
import OneSignal from 'react-native-onesignal'
import en from '../../model/local_en.json'

const API_KEY = 'AIzaSyD1lN2ArTGGjhdZrR1JI5bXj58JU9V5iUE';

const HomeScreenn = ({ itemData, navigation, token, name, neww }) => {
  const [loading, setLoading] = React.useState(true);
  const [refreching, setRefreching] = React.useState(false);
  const [UserId, setUserId] = React.useState(null);
  const [totalDuration, setTotalDuration] = React.useState(0);
  const [newdata, setNewData] = React.useState([]);
  const [empty, setEmpty] = React.useState(false);
  const modalizeRefMap = useRef(null);
  const [isvisible, setIsVisible] = React.useState(false);
  const [fetched, setFetched] = React.useState(false);

  const [data, setData] = React.useState({
    screenHeight: 0,
    error: '',
    data: [],
    Encour: [],
    louper: [],
    last: [],
    populaire: [],
    favorite: [],
    location: [],
    categorie: [],
    latitude: 0,
    longitude: 0,
    address: '',
    errorr: ''
  });
  const hidedialog = () => {
    setIsVisible(false);
  }
  const setToFlasenewuser = async () => {
    try {
      await AsyncStorage.setItem('new', 'false');
    } catch (e) {
      console.log(e);
    }
  }

  const update = () => {
    axios
      .put(`${config.url}/users/${parseInt(UserId)}`, {
        new: false
      })
      .then(res => { if (res.data == 'User Updated!') { hidedialog(), setToFlasenewuser() } })
      .catch(err => err);
  }

  LogBox.ignoreAllLogs()

  useEffect(() => {
    // const isFocused = navigation.isFocused();
    // if (isFocused) {
    navigation.addListener('focus', () => {
      setTimeout(async () => {
        getData()
        let user_id;
        user_id = null;
        let newuser;
        newuser = null;
        try {
          user_id = await AsyncStorage.getItem('userid');
          newuser = await AsyncStorage.getItem('new');
          var response = await AsyncStorage.getItem('listofLocation');
          var listofLocation = await JSON.parse(response);
          // const newCentres = listofLocation.map((item)=>({key: item.key, name: item.name, latitude: item.latitude, longitude: item.longitude }))
          setNewData(listofLocation)
          // console.log(listofLocation)
        } catch (e) {
          console.log(e);
        }
        setUserId(user_id)
        if (newuser == 'true') {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
        if(user_id != null ){
          const partnerId = (await OneSignal.getDeviceState()).userId
          postID(partnerId, parseInt(user_id))
        }
        
      }, 200)
    })
    // }
  }, [navigation]);

  const postID = (id, user_id) => {
    console.log(id)
    axios
      .put(`${config.url}/users/${user_id}`, {
        OnesignalId: id
      })
      .then(res => { console.log("done") })
  }

  const onOpenmap = () => {
    // modalizeRefMap.current?.open();
    navigation.navigate('ChoosePlace', { itemData: newdata });
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

  const getData = async () => {
    const url = `${config.url}/deals`;
    let location;
    location = [];
    Promise.all([
      await fetch(url)
        .then(res => res.json())
        .then(res => {
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
            if ((quantity == 0 || compare) || (quantity == 0 && compare)) {
              return item
            }
          })
          let newdataaa2 = res.filter((item) => {
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
            const result = (quantity == 0 || compare) || (quantity == 0 && compare)
            if (result == false) {
              return item
            }
          })
          let newdataaa3 = res.filter((item) => {
            const qt = item.quantity - item.nbre_redeemed_deal
            let quantity;
            quantity = null;
            if (qt <= 0) {
              quantity = 0
            } else {
              quantity = qt
            }
            const date = moment().format();
            let expirydate = moment(item.expirydate).format();
            let compare = moment(date).isAfter(expirydate)
            let diffr = moment.duration(moment(expirydate).diff(moment(date)));
            let hours2 = parseInt(diffr.asHours())
            let time = hours2 === 0 ? true : false;
            let compare2 = !compare && time;
            let compare3 = quantity < 20 && quantity > 0
            const result = (compare2 && compare3) || (!compare && compare3)
            if (result == true) {
              return item
            }
          })

          let newdataaa4 = res.filter((item) => {
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
            const result = (quantity == 0 || compare) || (quantity == 0 && compare)
            if (item.deals.restaurant.rating == 5 && result == false) {
              return item
            }
          })
          AsyncStorage.getItem('location').then((value) => {
            location = JSON.parse(value)
            setData({
              ...data,
              address: location[0].nameLocation,
              latitude: location[0].latitude,
              longitude: location[0].longitude,
              location: location,
              data: res.filter((item) => {
                let dis = calcDistance2(item.deals.restaurant.latitude, item.deals.restaurant.longitude, location[0].latitude, location[0].longitude)
                if (dis < 30.0) {
                  item.dis = dis
                  return item
                }
              }),
              last: newdataaa3.filter((item) => {
                let dis = calcDistance2(item.deals.restaurant.latitude, item.deals.restaurant.longitude, location[0].latitude, location[0].longitude)
                if (dis < 30.0) {
                  return item
                }
              }),
              populaire: newdataaa4.filter((item) => {
                let dis = calcDistance2(item.deals.restaurant.latitude, item.deals.restaurant.longitude, location[0].latitude, location[0].longitude)
                if (dis < 30.0) {
                  return item
                }
              }),
              categorie: newdataaa2.filter((item) => {
                let dis = calcDistance2(item.deals.restaurant.latitude, item.deals.restaurant.longitude, location[0].latitude, location[0].longitude)
                if (dis < 30.0) {
                  return item
                }
              }),
              louper: newdataaa.filter((item) => {
                let dis = calcDistance2(item.deals.restaurant.latitude, item.deals.restaurant.longitude, location[0].latitude, location[0].longitude)
                if (dis < 30.0) {
                  return item
                }
              }),
              error: res.error || null,
            });
          })
          if (res == '') {
            setEmpty(true)
          } else {
            setEmpty(false)
          }
          setLoading(false)
          setRefreching(false)
        })
        .catch(error => {
          setData({
            ...data,
            error: 'Error Loading content',
          })
          setLoading(false)
          setRefreching(false)
        })
    ]).then(() => setFetched(true))
      .catch(ex => console.error(ex));
  };

  const renderItem = ({ item }) => {
    // const date = moment().format();
    // let expirydate = moment(item.expirydate).format();
    // let compare = moment(date).isAfter(expirydate)
    // const qt = item.quantity - item.nbre_redeemed_deal
    // let quantity;
    // quantity = null;
    // if(qt <= 0){
    //   quantity = 0
    // }else{
    //   quantity = qt
    // }
    // const result = (quantity == 0 || compare) || (quantity == 0 && compare)
    // if (item.deals.restaurant.rating == 5 && result == false) {
    return (
      <DealCard itemData={item} favorite={data.location} token={token} navigation={navigation} />
    );
    //} 
  };
  const renderItemDeallast = ({ item }) => {
    // const qt = item.quantity - item.nbre_redeemed_deal
    // let quantity;
    // quantity = null;
    // if (qt <= 0) {
    //   quantity = 0
    // } else {
    //   quantity = qt
    // }
    // const date = moment().format();
    // let expirydate = moment(item.expirydate).format();
    // let compare = moment(date).isAfter(expirydate)
    // let diffr = moment.duration(moment(expirydate).diff(moment(date)));
    // let hours2 = parseInt(diffr.asHours())
    // let time = hours2 === 0 ? true : false;
    // let compare2 = !compare && time;
    // let compare3 = quantity < 20 && quantity > 0
    // if (compare2 && compare3) {
    return (
      <Deallast itemData={item} favorite={data.location} token={token} navigation={navigation} />
    );
    // } else if (!compare && compare3) {
    //   return <Deallast itemData={item} favorite={data.location} token={token} navigation={navigation} />
    // } else {
    //   return true
    // }
  };

  const renderItemDealLouper = ({ item }) => {
    return (
      <DealLouper itemData={item} favorite={data.location} token={token} navigation={navigation} />
    );
    // }
  };
  const renderItemdeal = ({ item }) => {
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
    } if (quantity == 0 || compare) {
      return true
    } else if (quantity == 0 && compare) {
      return true
    } else {
      return (
        <Deal itemData={item} favorite={data.location} token={token} navigation={navigation} />
      );
    }
  };

  const ContentThatGoesAboveTheFlatList = () => (
    <View style={{ flex: 1 }}>
      <View style={styles.sliderContainer}>
        <Swiper
          autoplay
          horizontal={true}
          height={hp('25%')}
          activeDotColor="#FF6347">
          <TouchableRipple style={styles.slide} onPress={() => { }}>
            <Image
              source={require('../../assets/swiper/food-banner5.jpg')}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </TouchableRipple>
          <TouchableRipple style={styles.slide} onPress={() => {  }}>
            <Image
              source={require('../../assets/swiper/food-banner3.jpg')}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </TouchableRipple>
        </Swiper>
        

      </View>
      <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
        <View style={{ width: wp('1%'), height: hp('2%'), backgroundColor: '#36b3c9', marginLeft: wp('3%'), marginTop: hp('1.5%') }}></View>
        <Text style={styles.textDealp}>{en.HOME_CATEGORIE}</Text>
      </View>
      <View style={styles.Categorie}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <TouchableRipple style={styles.pizza} onPress={() => { navigation.navigate("CategorieListitem", { itemData: data.categorie, name: 'Restaurant', favorite: data.location, totalDuration: totalDuration, token: token }) }}><View style={styles.categorie}><Image source={require('../../assets/restaurant_v.png')} style={styles.logoStyle} />
            <Text style={styles.textCategorie}>{en.HOME_RESTAURANT}</Text></View></TouchableRipple>
          <TouchableRipple style={styles.Pâtisserie} onPress={() => { navigation.navigate("CategorieListitem", { itemData: data.categorie, name: 'Pâtisserie', favorite: data.location, totalDuration: totalDuration, token: token }) }}><View style={styles.categorie}><Image source={require('../../assets/patisserie_v.png')} style={styles.logoStyle} />
            <Text style={styles.textCategorie}>{en.HOME_PASTRY}</Text></View></TouchableRipple>
          <TouchableRipple style={styles.Volailles} onPress={() => { navigation.navigate("CategorieListitem", { itemData: data.categorie, name: 'Supermarché', favorite: data.location, totalDuration: totalDuration, token: token }) }}><View style={styles.categorie}><Image source={require('../../assets/supermarche_v.png')} style={styles.logoStyle} />
            <Text style={styles.textCategorie}>{en.HOME_SUPERMARKET}</Text></View></TouchableRipple>
          <TouchableRipple style={styles.Fruits} onPress={() => { navigation.navigate("CategorieListitem", { itemData: data.categorie, name: 'Fruits légumes', favorite: data.location, totalDuration: totalDuration, token: token }) }}><View style={styles.categorie}><Image source={require('../../assets/fruit_legume_v.png')} style={styles.logoStyle} />
            <Text style={styles.textCategorie}>{en.HOME_FRUIT}</Text></View></TouchableRipple>
          <TouchableRipple style={styles.Epicerie} onPress={() => { navigation.navigate("CategorieListitem", { itemData: data.categorie, name: 'Epicerie', favorite: data.location, totalDuration: totalDuration, token: token }) }}><View style={styles.categorie}><Image source={require('../../assets/epicerie-v.png')} style={styles.logoStyle} />
            <Text style={styles.textCategorie}>{en.HOME_GROCERY}</Text></View></TouchableRipple>
        </ScrollView>
      </View>
      {data.data.length == 0 ?
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#6a5acd', width: wp('90%'), alignSelf: 'center', borderRadius: 8 ,top: hp('2%')}}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: hp("1%"), fontSize: 18, width: wp('75%'), marginTop: hp('4%'), color: 'white', lineHeight: 24 }}>{en.HOME_EMPTY_DATA_1}</Text>
          <Text style={{ width: wp('75%'), textAlign: 'center', color: '#686663', marginBottom: hp('3%'), color: 'white', lineHeight: 24 }}>{en.HOME_EMPTY_DATA_2}</Text>
        </View>
        :
        <View>
          {data.last.length != 0 ?
            <View style={styles.Dealsasauver}>
              <View style={{ flex: 1, flexDirection: 'row', marginTop: hp('1%') }}>
                <View style={{ width: wp('1%'), height: hp('2%'), backgroundColor: '#36b3c9', marginLeft: wp('3%'), marginTop: hp('1.5%') }}></View>
                <Text style={styles.textDealp}>{en.HOME_1}</Text>
                {/* <Text style={styles.textDealr}>Réinitialiser</Text> */}
              </View>
              <FlatList
                data={data.last.sort((a, b) => a.dis - b.dis)}
                renderItem={renderItemDeallast}
                keyExtractor={item => item.deal_id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            :
            null
          }

          {data.populaire.length != 0 ?
            <View style={styles.Dealsp}>
              <View style={{ flex: 1, flexDirection: 'row', marginTop: hp('1%') }}>
                <View style={{ width: wp('1%'), height: hp('2%'), backgroundColor: '#36b3c9', marginLeft: wp('3%'), marginTop: hp('1.5%') }}></View>
                <Text style={styles.textDealp}>{en.HOME_2}</Text>
                {/* <Text style={styles.textDealr}>Réinitialiser</Text> */}
              </View>
              <FlatList
                data={data.populaire.sort((a, b) => a.dis - b.dis)}
                renderItem={renderItem}
                keyExtractor={item => item.deal_id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            :
            null
          }
          {data.louper.length != 0 ?
            <View style={styles.Dealsasauver}>
              <View style={{ flex: 1, flexDirection: 'row', marginTop: hp('1%') }}>
                <View style={{ width: wp('1%'), height: hp('2%'), backgroundColor: '#36b3c9', marginLeft: wp('3%'), marginTop: hp('1.5%') }}></View>
                <Text style={styles.textDealp}>{en.HOME_3}</Text>
                {/* <Text style={styles.textDealr}>Réinitialiser</Text> */}
              </View>
              <FlatList
                data={data.louper}
                renderItem={renderItemDealLouper}
                keyExtractor={item => item.deal_id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            :
            null
          }
          <View style={styles.Dealsc}>
            <View style={{ flex: 1, flexDirection: 'row', marginTop: hp('1%') }}>
              <View style={{ width: wp('1%'), height: hp('2%'), backgroundColor: '#36b3c9', marginLeft: wp('3%'), marginTop: hp('3%') }}></View>
              <Text style={styles.textDealc}>{en.HOME_4}</Text>
              {/* <Text style={styles.textDealall}>Voir tout (48)</Text> */}
            </View>
          </View>
        </View>
      }
    </View>

  );

  const ChoisirEmplacement = async (item) => {
    const loc = {
      latitude: item.latitude,
      longitude: item.longitude,
      nameLocation: item.name
    }
    // console.log(addressComponent)
    data.favorite = []
    data.favorite.push(loc)
    try {
      await AsyncStorage.setItem('location', JSON.stringify(data.favorite));
    } catch (e) {
      console.log(e);
    }
    setData({
      ...data,
      address: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      region: loc,
      location: data.favorite
    })
    modalizeRefMap.current?.close();
  }
  const renderItemlOCATION = ({ item }) => {
    return (
      <ListItem bottomDivider style={{ backgroundColor: 'grey' }} button onPress={() => { ChoisirEmplacement(item) }}>
        <Avatar source={require('../../assets/logolocation.png')} />
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
          <ListItem.Subtitle>{item.latitude},{item.longitude}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

    );
  };
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  const renderInnermap = () => (
    <View>
      <View style={{ marginTop: hp('2%') }}>
        <Text style={styles.panelTitle}>{en.HOME_CHOOSE_LOCATION}</Text>
      </View>
      <View style={{ height: hp('60%'), marginBottom: hp('1%') }}>
        <FlatList
          data={newdata}
          renderItem={renderItemlOCATION}
          keyExtractor={item => item.key.toString()}
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
      <Button style={styles.connectbtn} mode='outlined' onPress={() => { navigation.navigate('InitMap'); modalizeRefMap.current?.close() }}>
        <Text style={styles.btntext}>{en.BUTTON_CHOOSELOCATION}</Text>
      </Button>
    </View>
  );

  const handleRefrech = () => {
    setRefreching(true)
    getData()
  }
  const dialog = () => (
    <View style={{ width: wp('80%') }}>
      <View >
        <Image source={require('../../Images/bienvenue.png')} style={{ alignSelf: 'center', width: wp('60%'), height: hp('20%') }} />
      </View>
      <View style={{ width: wp('80%'), marginBottom: hp('1%') }}>
        <Text style={{ textAlign: 'center', fontWeight: "normal", fontSize: 18, lineHeight: 24 }}>{en.HOME_DIALOG_1} <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 18, lineHeight: 24 }}>{name} </Text><Text>{'\n'}{en.HOME_DIALOG_2}</Text></Text>
      </View>
      <View>
        <Button style={styles.connectbtnn} mode='outlined' onPress={() => { update() }}>
          <Text style={styles.btntextt}>{en.SOCIALINFO_BUTTON}</Text>
        </Button>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* <ActivityIndicator size="large" color="#36b3c9" /> */}
        <Bubbles size={10} color="#36b3c9" />
      </View>
    )
  }
  else {
    return (
      <View style={styles.Container}>
        <StatusBar
          backgroundColor='white'
          barStyle='dark-content'
        />
        <View style={{ flex: 1 }}>
          <View style={{ height:  Platform.OS === 'ios' ? hp('11%'):hp('11%'), width: wp('100%'), backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: '#b4b4b4b4', borderBottomWidth: 0.2 }}>
            <TouchableOpacity style={{ left: wp('3%'), top: Platform.OS == 'ios' ? hp('6%'): hp('4%'), backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'flex-start' }} onPress={onOpenmap}>
              <Icon
                name="ios-locate-outline"
                size={30}
                color="#36b3c9"
                backgroundColor='transparent'
              />
              <View style={{ marginTop: hp('5.2%'), marginLeft: wp('-8%') }}>
                <Text style={styles.bluetext}>{en.HOME_MY_LOCATION}</Text>
                <View style={{ flexDirection: 'row', width: wp('60%') }}>
                  <Text numberOfLines={1} style={styles.placetext}>{data.address}</Text>
                  <Icon name="ios-chevron-down-sharp" size={15} style={{ marginLeft: wp('1%'), marginTop: hp('0.5%') }} />
                </View>

              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ left: wp('-5%'), top:  Platform.OS == 'ios' ? hp('6%'): hp('4%') }} onPress={() => { navigation.navigate("SearchBar", { itemData: data.categorie, favorite: data.location, totalDuration: totalDuration, token: token }) }}>
              <Icon
                name="search"
                size={28}
                color='black'
                backgroundColor='transparent'
              />
            </TouchableOpacity>
          </View>
          <SafeAreaView style={styles.contentContainer}>
            <FlatList
              data={data.data.sort((a, b) => a.dis - b.dis)}
              renderItem={renderItemdeal}
              ListHeaderComponent={ContentThatGoesAboveTheFlatList}
              keyExtractor={item => item.deal_id.toString()}
              refreshing={refreching}
              onRefresh={handleRefrech}
              showsVerticalScrollIndicator={false}
            />


          </SafeAreaView >
          <Modalize ref={modalizeRefMap} snapPoint={hp('85%')} modalHeight={hp('85%')} withHandle={false} >
            {renderInnermap()}
          </Modalize>
        </View>

        <Dialog.Container visible={isvisible} onBackdropPress={hidedialog} contentStyle={{ borderRadius: 20, width: wp('80%'), alignItems: 'center', height: hp('42%') }} headerStyle={{}}>
          {dialog()}
        </Dialog.Container>
      </View>
    )
  }
}
export default HomeScreenn;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff"
  },
  categorie: {
    marginLeft: wp('3%'),
    marginRight: wp('2.5%'),
    alignItems: 'center',
  },
  pizza: {
    // backgroundColor: '#FFF8DC',
    borderRadius: 10,
    marginLeft: wp('1%')
  },
  fastfood: {
    // backgroundColor: '#F8F8FF',
    borderRadius: 10,
    marginLeft: wp('1%')

  },
  Pâtisserie: {
    // backgroundColor: '#F0E68C',
    borderRadius: 10,
    marginLeft: wp('1%')

  },
  Traiteur: {
    // backgroundColor: '#00CED1',
    borderRadius: 10,
    marginLeft: wp('1%')

  },
  Bar: {
    // backgroundColor: '#E6E6FA',
    borderRadius: 10,
    marginLeft: wp('1%')
  },
  Produits: {
    // backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginLeft: wp('1%')
  },
  Epicerie: {
    // backgroundColor: '#EEE8AA',
    borderRadius: 10,
    marginLeft: wp('1%')
  },
  Fruits: {
    // backgroundColor: '#FFDAB9',
    borderRadius: 10,
    marginLeft: wp('1%')
  },
  Café: {
    // backgroundColor: '#FFDEAD',
    borderRadius: 10,
    marginLeft: wp('1%')
  },
  Snacks: {
    // backgroundColor: '#FFE4E1',
    borderRadius: 10,
    marginLeft: wp('1%')
  },
  Volailles: {
    // backgroundColor: '#FFB6C1',
    borderRadius: 10,
    marginLeft: wp('1%')
  },
  Tunisien: {
    // backgroundColor: '#FAFAD2',
    borderRadius: 10,
    marginLeft: wp('1%')
  },
  Asiatique: {
    // backgroundColor: '#E0FFFF',
    borderRadius: 10,
    marginLeft: wp('1%')
  },
  Italien: {
    // backgroundColor: '#FFF0F5',
    borderRadius: 10,
    marginLeft: wp('1%')
  },
  dropShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    zIndex: 100,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  contentContainer: {
    flex: 1
  },
  Navbar: {
    flexDirection: "row",
    width: wp('100%'),
    height: hp('10%'),
    justifyContent: "space-around",
    alignItems: 'center',
    backgroundColor: "#fff",
    marginTop: 20


  },
  Nav: {
    flexDirection: "row",
    width: wp('65%'),
  },
  bluetext: {
    color: "#36b3c9"
  },

  Categorie: {
    backgroundColor: "transparent",
    flexDirection: "row",
    width: wp('98%'),
    height: Platform.OS === 'ios' ? hp('12%'): hp('14%'),
    justifyContent: "space-between",
    alignSelf: 'center',
    marginTop: hp('2%'),
  },
  textCategorie: {
    position: 'absolute',
    textAlign: "center",
    fontFamily: "Rubik-Regular",
    fontSize: 11,
    lineHeight: 24,
    color: "black",
    // fontWeight:'bold',
    backgroundColor: 'transparent',
    marginTop: hp('7%'),
    width: wp('22%')
  },
  logoStyle: {
    height: hp('6%'), // 70% of height device screen
    width: wp('13%'),
    // borderRadius: 2
  },
  logoS: {
    height: hp('5%'), // 70% of height device screen
    width: wp('7%'),
  },
  Searchbar: {
    borderColor: '#e8e8e8',
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf:"center",
    borderWidth: 0.5,
    marginLeft: 21,
    height: hp('6.5%'),
    borderRadius: 8,
    marginTop: 10

  },
  textDealp: {
    textAlign: "left",
    fontFamily: "Rubik-Regular",
    fontSize: 18,
    lineHeight: 22,
    color: "#3a4047",
    marginLeft: wp('4%'),
    marginTop: wp('2%'),
    fontWeight: 'bold',
  },
  textDealc: {
    textAlign: "left",
    fontFamily: "Rubik-Regular",
    fontSize: 18,
    lineHeight: 22,
    color: "#3a4047",
    marginLeft: 15,
    marginTop: 20,
    fontWeight: 'bold',
  },
  textDealr: {
    textAlign: "right",
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    color: "#808080",
    marginLeft: 15,
    marginRight: 15,
    marginTop: -20,
    fontWeight: 'normal',
  },
  textDealall: {
    textAlign: "right",
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    lineHeight: 22,
    color: "#808080",
    marginLeft: 15,
    marginRight: 15,
    marginTop: -20,
    fontWeight: 'normal',
  },
  economie: {
    width: 110,
    height: 30,
    backgroundColor: "#00CED1",
    marginLeft: 20,
    position: 'absolute',
    top: 30,
    left: 5
  },
  teconomie: {
    textAlign: "center",
    marginTop: 6,
    color: '#ffffff',
    fontFamily: "Rubik-Medium",
    fontSize: 13,
  },
  logo: {
    width: 110,
    height: 30,
    marginLeft: 20,
    position: 'absolute',
    top: 20,
    left: 50
  },
  bluetext: {
    color: "#36b3c9",
    marginLeft: wp('7%'),
    marginTop: hp('-6%')
  },
  placetext: {
    marginLeft: wp('8%'),
    // marginTop: hp('1%')
  },
  header: {
    backgroundColor: '#F4F3F2',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: hp('1%'),
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  panelTitle: {
    fontSize: 27,
    height: hp('7%'),
    marginLeft: wp('4%'),
    fontWeight: 'bold',
    textAlign: 'left'
  },
  panelSousTitle: {
    fontSize: 20,
    height: hp('7%'),
    marginLeft: wp('2%'),
    fontWeight: 'bold',
    textAlign: 'left',
    opacity: 0.7,
    marginTop: hp('2%')
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 28,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    elevation: 6,
    marginTop: hp('4%'),
    backgroundColor: '#00CED1',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  panelButtonTitleP: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  panelButtonr: {
    padding: 3,
    borderRadius: 28,
    // shadowColor: 'black',
    // shadowOpacity: 0.8,
    // elevation: 6,
    // backgroundColor: '#00CED1',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitler: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#3a4047',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  sliderContainer: {
    height: hp('25%'),
    width: wp('97%'),
    marginTop: hp('2%'),
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    shadowOffset: { width: 1, height: -3 },
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    elevation: 8
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  sliderImage: {
    height: hp('25%'),
    width: wp('97%'),
    // alignSelf: 'center',
    borderRadius: 8,
  },
  connectbtn: {
    // position: 'absolute',
    marginTop: Platform.OS === 'ios' ? hp('40%') : hp('1%'),
    padding: 5,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 1,
    height: hp('7%'), // 70% of height device screen
    width: wp('85%'),
    fontFamily: 'Rubik-Regular',
    alignSelf: 'center',
    backgroundColor: "#36b3c9",
    justifyContent: "center",
    alignContent: "center",
    // borderRadius: 5,
  },
  btntext: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff'
  },
  connectbtnn: {
    height: hp('5%'), // 70% of height device screen
    width: wp('60%'),
    fontFamily: 'Rubik-Regular',
    alignSelf: 'center',
    backgroundColor: "#36b3c9",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    marginTop: hp('2%')
  },
  btntextt: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff',
    letterSpacing: 0.08
  },


});