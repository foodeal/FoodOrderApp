import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image } from 'react-native'
import HistoriqueOffresCard from './HistoriqueOffresCard'
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config.js'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HistoriqueOffres = ({ navigation }) => {

  const [data, setData] = React.useState({
    error: '',
    data: [],
    reserved: [],
    datadata: []
  });

  const getData = async (id) => {
    const url = `${config.url}/InactiveDealRestaurant/${id}`;
    await fetch(url)
      .then(res => res.json())
      .then(res => {
        setData({
          ...data,
          data: res.dealScheduled,
        });
      })
      .catch(error => {
        setData({
          ...data,
          error: 'Error Loading content',
        })
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
      <HistoriqueOffresCard itemData={item} />
    )
  };





  return (
    <View style={styles.Container}>
      {data.data.length == 0 ?
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Image source={require('../../assets/noitemfound.png')} style={{ width: wp('50%'), height: hp('20%'), marginBottom: hp('2%') }} />
          <Text style = {{fontWeight: 'bold', textAlign: 'center', marginBottom: hp ("1%")}}> No Baskets </Text>
          <Text style = {{width: wp ('60%'), textAlign:'center', color:'#686663'}}> The Baskets that have been published can be found here </Text>
        </View>
        :
        <FlatList
          data={data.data}
          renderItem={renderItemdeal}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      }
    </View>
  )
}

export default HistoriqueOffres;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "white",
    flex: 1,
    // height: null
  },
})

