import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import config from '../config.js'
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import OneSignal from 'react-native-onesignal'
import axios from "axios";

const ScanScreen = ({ navigation }) => {

  useEffect(() => {
    setTimeout(async () => {
      let dataa;
      dataa = [];
      let id;
      id = null;
      try {
        await AsyncStorage.setItem('ScannItem', JSON.stringify([]));
        await AsyncStorage.setItem('checkin',JSON.stringify([]));
        await AsyncStorage.setItem('listArticle',JSON.stringify([]));
        await AsyncStorage.setItem('ListCouffins',JSON.stringify([]));
        await AsyncStorage.setItem('MesCouffins',JSON.stringify([]));
        await AsyncStorage.setItem('listCouffin',JSON.stringify([]));
        await AsyncStorage.setItem('id','1');
        id = await AsyncStorage.getItem('userid');
      } catch (e) {
        console.log(e);
      }
      const partnerId = (await OneSignal.getDeviceState()).userId
      postID(partnerId,parseInt(id))
    }, 500);
  }, [])

  const postID = (id,user_id) => {
    axios
    .put(`${config.url}/restaurants/Onesignal/${user_id}`, {
      OnesignalId: id
    })
    .then(res => {console.log("done")})
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={config.logo}
        style={styles.logoStyle}
      />
      <Text style={styles.Text1}>Please scan the Coupon</Text>
      <View>
        <Button style={styles.connectbtn} mode='outlined' onPress={() => {navigation.navigate('QRcodeScanner') }}>
          <Text style={styles.btntext}>SCAN</Text>
        </Button>
      </View>
      <View style={styles.viewimage}>
        <Image
          source={require("../Images/Qrcode.png")}
          style={styles.image}
        />
      </View>

    </SafeAreaView>

  );
}

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  Text1: {
    textAlign: 'center',
    marginTop: hp('7%'),
    fontSize: 20,
    color:'#FF9F54',
    fontWeight: 'bold',
    marginBottom: hp('6%')
  },
  logoStyle: {
    alignSelf: 'center',
    height: Platform.OS  === 'ios' ? hp('20%'):hp('25%'), // 70% of height device screen
    width: wp('85%'),
    marginTop: hp('3%'),
    marginBottom: hp('1%')
  },
  connectbtn: {
    height: hp('7%'), // 70% of height device screen
    width: wp('70%'),
    fontFamily: 'Rubik-Regular',
    alignSelf: 'center',
    backgroundColor: "#36b3c9",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5
  },
  btntext: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff'
  },
  image: {
    alignSelf: 'center',
    height: hp('25%'), // 70% of height device screen
    width: wp('50%'),
    marginTop:hp('5%'),
    borderRadius: 20,
  },
  viewimage:{
    alignSelf: 'center',
    height:hp('45%'),
    marginTop:hp('2%'),
    width: wp('80%'),
    borderRadius: 20,
    // shadowRadius: 0.5,
    // shadowColor: '#b4b4b4',
    // shadowOpacity: 0.5,
    // elevation:5
  }
});