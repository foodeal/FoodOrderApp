import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, FlatList, StatusBar,Image } from 'react-native'
import EntrerOffresCard from './Etape1Card'
import { SearchBar } from "react-native-elements";
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config.js';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { Bubbles } from 'react-native-loader';

const Etape1 = ({ navigation, route }) => {
  const [loading, setLoading] = React.useState(true);

  const [data, setData] = React.useState({
    error: '',
    data: [],
    temp: [],
    reserved: [],
    datadata: [],
    loading: false,
    error: null,
    search: null,
    toggleC: false,
    toggleE: false,
    distance: null,
    check: false

  });
  const renderHeader = () => (
    <View>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle='dark-content'
      />

      <View style={{ marginTop: hp('5%'), justifyContent: 'center', alignItems: 'center', marginBottom: hp('1%') }}>
        <Text style={{ justifyContent: 'center', color: '#36b3c9', fontWeight: 'bold', fontSize: 20 }}>Step 1: Add basket</Text>
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 0.5, borderBottomColor: '#b4b4b4b4b4' }} >

        <SearchBar placeholder="An inventory"
          lightTheme
          containerStyle={{ backgroundColor: 'white', width: wp('100%'), height: hp('9%'), borderBottomColor: 'white', borderTopColor: 'white' }}
          clearIcon round editable={true}
          value={data.search}
          onChangeText={(text) => searchFilterFunction(text)}
        />


      </View>
    </View>

  )
  useEffect(() => {
    setTimeout(async () => {
      let user_id;
      user_id = null;
      try {
        user_id = await AsyncStorage.getItem('userid');
      } catch (e) {
        console.log(e)
      }
      const isFocused = navigation.isFocused();
      if (isFocused) {
        getData(parseInt(user_id));
        console.log('focused section');
      }
      let navFocusListener = navigation.addListener('focus', async () => {
        getData(parseInt(user_id));
        console.log('listener section');
      });
      return navFocusListener
    }, 500);
  }, [])
  const getData = async (id) => {
    const url = `${config.url}/Invendus/${id}`;
    let inventaire;
    inventaire = [];
    await fetch(url)
      .then(res => res.json())
      .then(res => {
        setData({
          ...data,
          data: res,
          temp: res,
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

  const searchFilterFunction = (text) => {
    const newData = data.temp.filter((item) => {
      const itemData = `${item.nom.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setData({
      ...data,
      data: newData
    })
  };


  const renderItemdeal = ({ item }) => {
    return (
      <EntrerOffresCard itemData={item} navigation={navigation} check={false} />
    )
  };

  const renderFooter = () => (
    <View style={{ flexDirection: 'row', marginTop: hp('2%'), justifyContent: 'space-between' }}>
      <View style={{ height: hp('6%'), backgroundColor: 'white', flexDirection: 'row', marginLeft: wp('3%'), marginTop: hp('1%') }}>

        <AntDesign name="leftcircle" style={{ paddingLeft: wp('1%'), color: 'black', }} size={30} onPress={() => { navigation.navigate('HomeDrawer') }} />
        <Text style={{ marginLeft: wp('2%'), color: 'black', fontSize: 17 }}>
          Cancel
        </Text>
      </View>
      <View style={{ height: hp('6%'), backgroundColor: 'white', flexDirection: 'row', marginRight: wp('3%'), marginTop: hp('1%') }}>
        <Text style={{ marginLeft: wp('2%'), color: 'black', fontSize: 17, marginTop: 5 }}>
          Next
        </Text>
        <AntDesign name="rightcircle" style={{ paddingLeft: wp('1%'), color: 'black' }} size={30} onPress={() => { navigation.navigate('Etape2') }} />

      </View>
    </View>
  )
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
        {renderHeader()}
        <View style={{ height: hp('70%') }}>
          {data.data.length == 0 ?
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Image source={require('../../assets/noitemfound.png')} style={{ width: wp('50%'), height: hp('20%'), marginBottom: hp('2%') }} />
              <Text style = {{fontWeight: 'bold', textAlign: 'center', marginBottom: hp("1%")}}> No Unsold </Text>
              <Text style = {{width: wp('60%'), textAlign:'center', color:'#686663'}}> The unsold products of your brand can be found here </Text>
            </View>
            :
            <FlatList
              data={data.data}
              renderItem={renderItemdeal}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={false}
            />
          }
        </View>
        {renderFooter()}
      </View>
    )
  }
}

export default Etape1;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "white",
    flex: 1,
    // height: null
  },
  connectbtn: {
    height: hp('5%'), // 70% of height device screen
    width: wp('60%'),
    fontFamily: 'Rubik-Regular',
    alignSelf: 'center',
    backgroundColor: "#36b3c9",
    justifyContent: "center",
    alignContent: "center",
    marginLeft: wp('1%'),
    borderRadius: 5,
  },
  btntext: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff'
  },
  footer: {
    height: hp('20%'),
    left: 0,
    right: 0,
    bottom: 0,
  }
})

