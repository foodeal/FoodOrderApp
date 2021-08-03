import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, ScrollView } from 'react-native'
import DealsUtilisesCard from './DealsUtilisesCard'
import AsyncStorage from '@react-native-community/async-storage';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import config from '../../config.js'
import moment from 'moment';

const DealsUtilises = ({ navigation }) => {
  const [loading, setLoading] = React.useState(true);

  const [data, setData] = React.useState({
    error: '',
    data: [],
    reserved: [],
    datadata: []
  });

  const getData = async (id) => {
    const url = `${config.url}/restaurants-reserved-deal/${id}`;
    await fetch(url)
      .then(res => res.json())
      .then(res => {
        setData({
          ...data,
          data: res.reserveddeal.filter((item) => {
            let date = moment().format()
            const datenow = moment(date).format("YYYY-MM-DD")
            const createtime = moment(item.createdAt).format("YYYY-MM-DD")
            const sameee = moment(datenow).isSame(createtime)
            if (sameee){
              return item
            }
          }
          ),
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

        getData(parseInt(user_id));
        console.log('focused section');
      }
      let navFocusListener = navigation.addListener('focus', () => {

        getData(parseInt(user_id));
        console.log('listener section');
      });
      return navFocusListener

    }, 500);
  }, [navigation])


  const renderItemdeal = ({ item }) => {
    return (
      <DealsUtilisesCard itemData={item} />
    )
  };
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
        {data.data.length == 0 ?
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Image source={require('../../assets/noitemfound.png')} style={{ width: wp('50%'), height: hp('20%'), marginBottom: hp('2%') }} />
            <Text style = {{fontWeight: 'bold', textAlign: 'center', marginBottom: hp("1%")}}> No current reservations </Text>
            <Text style = {{width: wp('60%'), textAlign:'center', color:'#686663'}}> Carts which are reserved and not paid can be found here </Text>
          </View>
          :
          <FlatList
            data={data.data.sort((a, b) => a > b)}
            renderItem={renderItemdeal}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        }
      </View>
    )
  }

}

export default DealsUtilises;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "white",
    flex: 1,
    // height: null
  },
})

