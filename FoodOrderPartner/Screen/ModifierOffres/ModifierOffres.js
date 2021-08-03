import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image } from 'react-native'
import ModifierOffresCard from './ModifierOffresCard'
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config.js'
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import CountDown from 'react-native-countdown-component';
import axios from 'axios';
import Button from 'react-native-paper/lib/commonjs/components/Button';

const ModifierOffres = ({ navigation }) => {

  const [data, setData] = React.useState({
    error: '',
    data: [],
    reserved: [],
    datadata: []
  });

  return (
    <View style={styles.Container}>
      <View style={{ height: hp('75%'), marginBottom: hp('1%') }}>
        <ScrollView>
        <ModifierOffresCard />
        <ModifierOffresCard />
        <ModifierOffresCard />
        <ModifierOffresCard />
        <ModifierOffresCard />
        <ModifierOffresCard />
        </ScrollView>
      
      </View>

      <View style={styles.footer}>
        <Button style={styles.connectbtn} mode='outlined' onPress={() => {}}>
          <Text style={styles.btntext}>Envoyer</Text>
        </Button>
      </View>
    </View>
  )
}

export default ModifierOffres;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "white",
    flex: 1,
    // height: null
  },
  connectbtn: {
    height: hp('5%'), // 70% of height device screen
    width: wp('40%'),
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
    left: 0,
    right: 0,
    bottom: 0
  }
})

