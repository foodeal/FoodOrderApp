import React, { useState, useEffect } from 'react'
import { StyleSheet, View, SafeAreaView, FlatList, ActivityIndicator, Image, Text } from 'react-native'
import DealsUtilisesCardConfirmer from './DealsUtilisesCardConfirmer'
import AsyncStorage from '@react-native-community/async-storage';
import config from '../config.js'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

const DealsUtilisesConfirmer = ({ navigation }) => {

  const [data, setData] = React.useState({
    error: '',
    data: [],
    reserved: [],
    datadata: []
  });
  const [loading, setLoading] = React.useState(true);


  useEffect(() => {
    setTimeout(async () => {
      let user_id;
      user_id = null;
      try {
        user_id = await AsyncStorage.getItem('userid');
      } catch (e) {
        console.log(e);
      }
      const isFocused = navigation.isFocused();

      if (isFocused) {
        getData(parseInt(user_id))
        console.log('focused section');
      }
      const navFocusListener = navigation.addListener('focus', () => {
        getData(parseInt(user_id))
        console.log('listener section');
      });
      return navFocusListener

    }, 1000);
  }, [navigation]);

  const getData = (id) => {
    const url = `${config.url}/couponsConfi/${id}`;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        setData({
          ...data,
          data: res,
          reserved: res.coupon,
          datadata: res.coupon.map((item) => ({ key: item.coupon_id,voter:item.noter,code: item.foodQR,status_restaurant: item.status_restaurant, start: item.deal_scheduled.startingdate_hours.split(':')[0], end: item.deal_scheduled.expirydate_hours.split(':')[0], nameuser: res.username, rating: item.deal_scheduled.deals.restaurant.rating, name: item.deal_scheduled.deals.restaurant.name, image: item.deal_scheduled.deals.imageurl, time: item.time, name: item.deal_scheduled.deals.restaurant.name, nbre: item.nbre_coupons, discount: item.deal_scheduled.deals.discount, payment: item.payement, user_id: item.user_id, deal_scheduled_id: item.dealScheduled_id, deal_description: item.deal_scheduled.deals.deal_description, restaurant_id: item.deal_scheduled.deals.restaurant_id,description: item.deal_scheduled.deals.description, })),
          error: res.error || null,
        });
        setLoading(false)
      })
      .catch(error => {
        setData({
          ...data,
          error: 'Error Loading content',
        })
        setLoading(false)
      })
  };



  const renderItem = ({ item }) => {
    return (
      <DealsUtilisesCardConfirmer itemData={item} navigation={navigation} />
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Bubbles size={10} color="#36b3c9" />
      </View>
    )
  }
  else {
    return (
      <View style={styles.Container}>
        { data.datadata == '' ?
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Image source={require('../assets/noitemfound.png')} style={{ width: wp('50%'), height: hp('20%'), marginBottom: hp('2%') }} />
            <Text style = {{fontWeight: 'bold', textAlign: 'center', marginBottom: hp ("1%")}}> No reservations used </Text>
             <Text style = {{width: wp ('60%'), textAlign:'center', color:'#686663'}}> The baskets that have been retrieved can be found here </Text>
          </View>
          :
          <FlatList
            data={data.datadata.sort((a, b) => a.key > b.key)}
            renderItem={renderItem}
            keyExtractor={item => item.key.toString()}
          />
        }
      </View>
    )
  }
}

export default DealsUtilisesConfirmer;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "white",
    flex: 1,
    // height: null
  },
})

