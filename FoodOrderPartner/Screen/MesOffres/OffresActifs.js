import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, FlatList, Image } from 'react-native'
import MesOffresCard from './MesOffresCard'
import AsyncStorage from '@react-native-community/async-storage';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import config from '../../config.js'
import Dialog from "react-native-dialog";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import { Bubbles } from 'react-native-loader';
const OffresActifs = ({ navigation }) => {

  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const [data, setData] = React.useState({
    error: null,
    data: [],
    temp: [],
    reserved: [],
    dataa: [],
    datadata: []
  });




  const handleRemove = async (id) => {
    let user_id;
    user_id = null;
    try {
      user_id = await AsyncStorage.getItem('userid');
    } catch (e) {
      console.log(e)
    }
    axios
      .delete(`${config.url}/dealscheduled/${id}`)
      .then(res => {
        if (res.data == 'dealscheduled Deleted!') {
          handleCancel()
          getData(parseInt(user_id));
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const showDialog = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };



  const getData = async (id) => {
    const url = `${config.url}/ActiveDealRestaurant/${id}`;
    await fetch(url)
      .then(res => res.json())
      .then(res => {
        setData({
          ...data,
          data: res.dealScheduled,
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

  // console.log(data.data)
  const renderItemdeal = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <MesOffresCard itemData={item} />
        <View style={{ flexDirection: 'column', marginTop: hp('6%'), marginLeft: wp('1%') }}>
          <Button style={styles.connectbtnS} mode='outlined' onPress={() => { showDialog() }}>
            <Text style={styles.btntext}>Remove</Text>
          </Button>
        </View>
        <Dialog.Container visible={visible}>
          <Dialog.Title style={{ fontWeight: 'bold' }}>Delete this Basket</Dialog.Title>
          <Dialog.Description>
          Do you want to delete this Basket?
                  </Dialog.Description>
          <Dialog.Button color='#36b3c9' bold={true} label="No" onPress={handleCancel} />
          <Dialog.Button color='#36b3c9' bold={true} label="Yes" onPress={() => { handleRemove(item.id) }} />
        </Dialog.Container>


      </View>
    )
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
        {data.data.length == 0 ?
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Image source={require('../../assets/noitemfound.png')} style={{ width: wp('50%'), height: hp('20%'), marginBottom: hp('2%') }} />
            <Text style = {{fontWeight: 'bold', textAlign: 'center', marginBottom: hp ("1%")}}> No Baskets in progress </Text>
            <Text style = {{width: wp ('60%'), textAlign:'center', color:'#686663'}}> The Baskets that are active today can be found here </Text>
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
}

export default OffresActifs;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "white",
    flex: 1,
    // height: null
  },
  connectbtnS: {
    height: hp('5%'), // 70% of height device screen
    width: null,
    fontFamily: 'Rubik-Regular',
    alignSelf: 'center',
    backgroundColor: "#36b3c9",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    marginLeft: wp('0%'),
    width: wp('30%'),
    marginTop: hp('1%')
  },
  btntext: {
    fontSize: 12,
    fontWeight: '600',
    // lineHeight: 22,
    color: '#fff'
  },
})

