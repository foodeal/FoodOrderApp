import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image } from 'react-native'
import AjouterPanierCard from './Etape2Card'
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config.js'
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import CountDown from 'react-native-countdown-component';
import axios from 'axios';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import Dialog from "react-native-dialog";
import PanierAPublier from './Etape3';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import { LogBox } from 'react-native'

const ScannerOffreEnd = ({  }) => {
  const navigation = useNavigation(); 

  const [data, setData] = React.useState({
    error: '',
    data: [],
    ListCouffins: [],
    datadata: []
  });
  LogBox.ignoreAllLogs()

  const exdate = moment().format('YYYY/MM/DD')

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const getData = async () => {
    let response = await AsyncStorage.getItem('ScannItem');
    var listOfCheck = await JSON.parse(response) || [];
    let response2 = await AsyncStorage.getItem('listCouffin');
    var listOfCouffins = await JSON.parse(response2) || [];
    setData({
      ...data,
      data: listOfCheck,
      ListCouffins: listOfCouffins

    })
  }

  const newCouffin = async () => {
    let id = await AsyncStorage.getItem('id');
    let nextId = parseInt(id)+1;
    let response = await AsyncStorage.getItem('listCouffin');
    var listDeCouffin = await JSON.parse(response) || [];
    let response2 = await AsyncStorage.getItem('listArticle');
    var listOfitems = await JSON.parse(response2) || [];
    listDeCouffin.push({ "id": parseInt(id), dateCreation: exdate, 'data': listOfitems })
    await AsyncStorage.setItem('listCouffin',JSON.stringify(listDeCouffin) );
    await AsyncStorage.setItem('id',nextId.toString())
    setData({
      ...data,
      ListCouffins: listDeCouffin
    })
    console.log(listDeCouffin)
  }

  const PublierCouffin = async () => {
    let response = await AsyncStorage.getItem('MesCouffins');
    var listDeCouffin = await JSON.parse(response) || [];
    let response2 = await AsyncStorage.getItem('listCouffin');
    var listOfitems = await JSON.parse(response2) || [];
    listOfitems.map((item)=>{
      listDeCouffin.push(item)
    })
    await AsyncStorage.setItem('MesCouffins',JSON.stringify(listDeCouffin) );
    await AsyncStorage.setItem('listCouffin',JSON.stringify([]) );
    setData({
      ...data,
      ListCouffins: []
    })
    navigation.navigate('HomeDrawer')
    // navigation.goBack()
    // navigation.goBack()
  }

  // const getCouffin = async () => {
  //   let response = await AsyncStorage.getItem('ListCouffins');
  //   var listOfCouffins = await JSON.parse(response) || [];
  //   setData({
  //     ...data,
  //     ListCouffins: listOfCouffins
  //   })
  //   // console.log(listOfCheck)
  // }
  // console.log(data.ListCouffins)


  useEffect(() => {
    setTimeout(async () => {
      const isFocused = navigation.isFocused();
      if (isFocused) {
        getData()
        console.log('focused section');
      }
      let navFocusListener = navigation.addListener('focus', () => {
      getData()
        console.log('listener section');
      });
      return navFocusListener

    }, 500);
  }, [navigation])


  const renderItemdeal = ({ item }) => {
    return (
      <AjouterPanierCard itemData={item} navigation={navigation} />
    )
  };
  const renderCouffin = ({ item }) => {
    return (
      <PanierAPublier itemData={item} navigation={navigation} />
    )
  };

  const ContentThatGoesAboveTheFlatList = () => { }

  return (
    <View style={styles.Container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" nestedScrollEnabled={false}>

        <View style={{ height: hp('45%'), marginBottom: hp('1%') }}>
          <Text style={{ marginTop: hp('2%'), marginLeft: wp('3%'), marginBottom: hp('1%'), fontWeight: 'bold', fontSize: 18 }}>Bassinet composition</Text>
          {/* <ScrollView nestedScrollEnabled={true}>
            <AjouterPanierCard />
            <AjouterPanierCard />
            <AjouterPanierCard />
            <AjouterPanierCard />
          </ScrollView> */}
          <FlatList
            data={data.data}
            renderItem={renderItemdeal}
            // ListHeaderComponent={ContentThatGoesAboveTheFlatList}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          />
          <View style={styles.footer}>
            <Button style={styles.connectbtn} mode='outlined' onPress={() => { Toast.show('Couffin créer avec succées !!'), newCouffin() }}>
              <Text style={styles.btntext}>créer Couffin</Text>
            </Button>
          </View>
        </View>

        <View style={{ height: hp('45%'), marginBottom: hp('1%') }}>
          <Text style={{ marginLeft: wp('3%'), marginBottom: hp('1%'), fontWeight: 'bold', fontSize: 18 }}>Basket To Publish</Text>
          {/* <ScrollView nestedScrollEnabled={true}>
            <PanierAPublier />
            <PanierAPublier />
            <PanierAPublier />
            <PanierAPublier />
          </ScrollView> */}
          <FlatList
            data={data.ListCouffins}
            renderItem={renderCouffin}
            // ListHeaderComponent={ContentThatGoesAboveTheFlatList}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          />
          <View style={styles.footer}>
            <Button style={styles.connectbtn} mode='outlined' onPress={() => { Toast.show('Couffin(s) publier avec succés !!'),PublierCouffin() }}>
              <Text style={styles.btntext}>Publish Bassinet (s)</Text>
            </Button>
          </View>
        </View>


        {/* <View style={styles.footer}>
        <Button style={styles.connectbtn} mode='outlined' onPress={() => {showDialog()}}>
          <Text style={styles.btntext}>Ajouter Inventaire</Text>
        </Button>
      </View>
      <Dialog.Container visible={visible}>
        <Dialog.Title style={{ fontWeight: 'bold' }}>Confirmer le Panier</Dialog.Title>
        <Dialog.Description>
          Voulez-vous Ajouter cette offre?
                  </Dialog.Description>
        <Dialog.Button color='#36b3c9' bold={true} label="Annuler" onPress={handleCancel} />
        <Dialog.Button color='#36b3c9' bold={true} label="Confimer" onPress={() => {navigation.navigate('HomeDrawer'),handleCancel()}} />
      </Dialog.Container> */}
      </ScrollView>
    </View>
  )
}

export default ScannerOffreEnd;

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
    backgroundColor: "#2dbe36",
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
    height: hp('5%'),
    marginTop: hp('1%'),
  }
})

