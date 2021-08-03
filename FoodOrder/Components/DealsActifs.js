import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image } from 'react-native'
import DealsActifsCard from './DealsActifsCard'
import AsyncStorage from '@react-native-community/async-storage';
import config from '../config.js'
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity } from "react-native-gesture-handler";
import CountDown from 'react-native-countdown-component';
import Dialog from "react-native-dialog";
import axios from 'axios';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-simple-toast';
import { Modalize } from 'react-native-modalize';
import en from '../model/local_en.json'

const DealsActifs = ({ navigation }) => {

  const [data, setData] = React.useState({
    error: '',
    key: null,
    data: [],
    reserved: [],
    datadata: [],
    userid: null,
    motif: ''
  });
  const modalizeRef = React.useRef(null);

  const [loading, setLoading] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  const [refreching, setRefreching] = React.useState(false);
  const [isvisible, setIsVisible] = React.useState(false);

  const timer = (item) => {
    const createdtime = moment(item.timepickup, 'YYYY/MM/DD')
    const datee = moment().format()
    const date = moment(datee, 'YYYY/MM/DD')
    // console.log(createdtime,'fg',date)
    if (moment(date).isSame(createdtime) == false) {
      // console.log(moment(createdtime).isSame(date))
      onFinich1(item)
    } else {
    }
  }

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
      let navFocusListener = navigation.addListener('focus', () => {
        getData(parseInt(user_id))
        console.log('listener section');
      });
      return navFocusListener

    }, 1000);
  }, [navigation]);

  const handleRefrech = () => {
    setRefreching(true)
    getData(data.userid)
  }

  const getData = async (id) => {
    const url = `${config.url}/ActiveResCou/${id}`;
    await fetch(url)
      .then(res => res.json())
      .then((res) => {

        setData({
          ...data,
          data: res,
          userid: id,
          reserved: res.reserved_deal,
          datadata: res.reserved_deal.map((item) => ({ key: item.id, createtime: item.timepickup, prix: (item.PriceAfterDiscount * item.nbre_coupons).toFixed(1), code: item.foodQR, type: item.type, expirydate: item.deal_scheduled.expirydate, startinghours: item.deal_scheduled.startingdate_hours, startminu: item.deal_scheduled.startingdate_hours.split(':')[1], endminu: item.deal_scheduled.expirydate_hours.split(':')[1], start: item.deal_scheduled.startingdate_hours.split(':')[0], end: item.deal_scheduled.expirydate_hours.split(':')[0], startminu: item.deal_scheduled.startingdate_hours.split(':')[1], endminu: item.deal_scheduled.expirydate_hours.split(':')[1], nameuser: res.username, rating: item.deal_scheduled.deals.restaurant.rating, name: item.deal_scheduled.deals.restaurant.name, image: item.deal_scheduled.deals.imageurl, time: item.time, name: item.deal_scheduled.deals.restaurant.name, nbre: item.nbre_coupons, discount: item.deal_scheduled.deals.discount, payment: item.payement, user_id: item.user_id, deal_scheduled_id: item.deal_scheduled_id, deal_description: item.deal_scheduled.deals.deal_description, description: item.deal_scheduled.deals.description, restaurant_id: item.deal_scheduled.deals.restaurant_id })),
          error: res.error || null,
          motif: '',
        });
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
  };

  const onFinich1 = (item) => {
    axios
      .put(`${config.url}/reservedCouponUpdate/${item.id}`, {
        type: 'expire',
        motif: 'Panier expiré'
      })
      .then(res => getData(data.userid), handleCancel())
      .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
  }

  const showDialog = () => {
    setIsVisible(true);
  };
  const handleCancel = () => {
    setIsVisible(false);
  };
  const MotifInputChange = (val) => {
    setData({
      ...data,
      motif: val
    });
  }

  const onFinich = (key) => {
    if (data.motif == '') {
      Toast.show('Please Choose the reason for your Cancellation')
    }
    else {
      axios
        .put(`${config.url}/reservedCouponUpdate/${key}`, {
          type: 'expire',
          motif: data.motif
        })
        .then(res => { if (res.data == 'coupon reserved updated!') { getData(parseInt(data.userid)), setLoading(true), valider(), Toast.show("Your Reservation has been canceled!") } })
        .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
    }
  }


  const onOpen = (e) => {
    setData({
      ...data,
      key: e
    })
    modalizeRef.current?.open();
  };

  const valider = () => {
    modalizeRef.current?.close();
  }

  const onClose = () => {
    modalizeRef.current?.close();
    setData({
      ...data,
      motif: ''
    })
  };

  const render = () => (
    <View>
      <View style={{ height: hp('7%'), marginTop: hp('4%'), marginLeft: wp('2%'), flexDirection: 'row', width: wp('67%') }}>
        <TouchableOpacity onPress={() => { onClose() }}>
          <Text style={{ textAlign: 'left', fontSize: 15, marginTop: hp('0.2%'), color: '#686663', fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', marginLeft: wp('4%'), fontWeight: 'bold', fontSize: 17, color: '#000' }}>Do you want to cancel this reservation?</Text>
        <TouchableOpacity onPress={() => { onFinich(data.key) }}>
          <Text style={{ textAlign: 'right', fontSize: 15, marginTop: hp('0.5%'), marginLeft: wp('2%'), color: '#36b3c9', fontWeight: 'bold' }}>Confirm</Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignSelf: "center", marginTop: hp('-3%'), width: wp('100%') }}>
        <Picker
          selectedValue={data.motif}
          style={{ height: hp('5%'), width: wp('100%'), marginLeft: wp('0%') }}
          mode={'dropdown'}
          onValueChange={(itemValue, itemIndex) =>
            MotifInputChange(itemValue)
          }>
          <Picker.Item label="Choose the Reason for Your Cancellation" value="" />
          <Picker.Item label="Badly packed basket" value="Badly packed basket" />
          <Picker.Item label="Cart expired" value="Cart expired" />
          <Picker.Item label="I can't pick up my order" value="I can't pick up my order" />
          <Picker.Item label="Quality of the degraded basket" value="Quality of the degraded basket" />
          <Picker.Item label="I changed my review" value="I changed my review" />
        </Picker>
      </View>
    </View>
  )

  const renderItem = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <DealsActifsCard itemData={item} navigation={navigation} />
        <View style={{ marginLeft: wp('0%'), marginTop: hp('3%') }}>
          <View style={{ flexDirection: 'row' }}>
            <FontAwesome name='clock-o' size={15} />
            <Text style={{ marginLeft: wp('1%'), fontSize: 12 }}> {item.start}h{item.startminu} to {item.end}h{item.endminu}</Text>
          </View>
          <Button style={styles.connectbtnS} mode='outlined' onPress={() => { onOpen(item.key) }}>
            <Text style={styles.btntext}>Cancel</Text>
          </Button>
        </View>
        {/* <Dialog.Container visible={isvisible}>
          <Dialog.Title style={{ fontWeight: 'bold', fontSize: 16 }}>Voulez-vous Annuler cette réservation ?</Dialog.Title>
          
          <Dialog.Button color='#36b3c9' bold={true} label="Non" onPress={handleCancel} />
          <Dialog.Button color='#36b3c9' bold={true} label="Oui" onPress={() => { onFinich(item.key) }} />
        </Dialog.Container> */}
      </View>
    );
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
        {data.datadata.length === 0 ?
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Image source={require('../assets/noitemfound.png')} style={{ width: wp('50%'), height: hp('20%'), marginBottom: hp('2%') }} />
            <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: hp("1%") }}> No current reservations </Text>
            <Text style={{ width: wp('60%'), textAlign: 'center', color: '#686663' }}> Bassinets that have not yet been retrieved can be found here </Text>
          </View>
          :
          <FlatList
            data={data.datadata}
            renderItem={renderItem}
            keyExtractor={item => item.key.toString()}
            refreshing={refreching}
            onRefresh={handleRefrech}
          />
        }
        <Modalize ref={modalizeRef} snapPoint={hp('37%')} modalHeight={hp('37%')} closeOnOverlayTap={false} disableScrollIfPossible={false} handlePosition='inside'>
          {render()}
        </Modalize>
      </View>
    )
  }
}

export default DealsActifs;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "white",
    flex: 1,
    // height: null
  },
  connectbtnS: {
    height: hp('4%'), // 70% of height device screen
    width: wp('25%'),
    fontFamily: 'Rubik-Regular',
    alignSelf: 'center',
    backgroundColor: "red",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    marginLeft: wp('1%'),
    marginTop: hp('1%')
  },
  btntext: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 18,
    color: '#fff'
  },
})

