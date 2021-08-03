import React, { useState, useEffect } from 'react'
import { StyleSheet, View, SafeAreaView, FlatList, ActivityIndicator, Image, Text, ScrollView } from 'react-native'
import DealsExpiredCard from './DealsExpiredCard '
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config.js'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DealsExpired = ({ navigation }) => {

  const [data, setData] = React.useState({
    error: '',
    data: [],
    reserved: [],
    datadata: []
  });

  return (
    <SafeAreaView style={styles.Container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <DealsExpiredCard />
        <DealsExpiredCard />
        <DealsExpiredCard />
        <DealsExpiredCard />
        <DealsExpiredCard />
        <DealsExpiredCard />
        <DealsExpiredCard />
      </ScrollView>
    </SafeAreaView>
  )

}

export default DealsExpired;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "white",
    flex: 1,
    height: null
  },
})

