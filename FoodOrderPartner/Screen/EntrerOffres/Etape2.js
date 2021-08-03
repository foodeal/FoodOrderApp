import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, StatusBar, SafeAreaView, FlatList, ActivityIndicator, Image } from 'react-native'
import AjouterPanierCard from './Etape2Card'
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config.js'
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import CountDown from 'react-native-countdown-component';
import axios from 'axios';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import CheckBox from '@react-native-community/checkbox';
import Dialog from "react-native-dialog";
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';
// import PanierAPublier from './PanierAPublier';
import Toast from 'react-native-simple-toast';

const Etape2 = ({ navigation }) => {

  const [data, setData] = React.useState({
    error: '',
    data: [],
    ListCouffins: [],
    datadata: [],
    id_panier: 1,
    description: '',
    id_partner: '',
    date: '',
    id: 0,
    qt: 0,
    prix: '',
    expireddate: '',
    startingdate: '',
    startingdatee: '',
    expireddatee: '',
    hourd: '',
    hourf: ''

  });
  const [userid, setUserid] = React.useState(0);

  // const exdate = moment().format()

  // const [visible, setVisible] = React.useState(false);
  // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // const [toggleCheckBox, setToggleCheckBox] = useState(false);
  // const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);

  // const showDialog = () => {
  //   setVisible(true);
  // };
  // const handleCancel = () => {
  //   setVisible(false);
  // };
  // const showDatePicker = () => {
  //   setDatePickerVisibility(true);
  // };
  // const showDatePicker2 = () => {
  //   setDatePickerVisibility2(true);
  // };
  const getData = async () => {
    let response = await AsyncStorage.getItem('checkin');
    var listOfCheck = await JSON.parse(response) || [];
    let response2 = await AsyncStorage.getItem('listCouffin');
    var listOfCouffins = await JSON.parse(response2) || [];
    setData({
      ...data,
      data: listOfCheck,
      ListCouffins: listOfCouffins

    })

  };


  const renderHeader = () => (
    <View>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle='dark-content'
      />
      <View style={{ marginTop: hp('6%'), marginBottom: hp('1%'), justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ justifyContent: 'center', color: '#36b3c9', fontWeight: 'bold', fontSize: 20 }}>2nd step</Text>
      </View>
    </View>

  )

  const renderFooter = () => (
    <View style={{ flexDirection: 'row', marginTop: hp('2%'), justifyContent: 'space-between' }}>
      <View style={{ height: hp('6%'), backgroundColor: 'white', flexDirection: 'row', marginLeft: wp('3%'), marginTop: hp('1%') }}>

        <AntDesign name="leftcircle" style={{ paddingLeft: wp('1%'), color: 'black', }} size={30} onPress={() => { navigation.navigate('Etape1') }} />
        <Text style={{ marginLeft: wp('2%'), color: 'black', fontSize: 17 }}>
          Back
          </Text>
      </View>
      <View style={{ height: hp('6%'), backgroundColor: 'white', flexDirection: 'row', marginRight: wp('3%'), marginTop: hp('1%') }}>
        <Text style={{ marginLeft: wp('2%'), color: 'black', fontSize: 17, marginTop: 5 }}>
          Next
          </Text>
        <AntDesign name="rightcircle" style={{ paddingLeft: wp('1%'), color: 'black' }} size={30} onPress={() => { navigation.navigate('Etape3') }} />

      </View>
    </View>

  )


  useEffect(() => {
    setTimeout(async () => {

      const isFocused = navigation.isFocused();
      if (isFocused) {
        let user_id;
        user_id = null;
        try {
          user_id = await AsyncStorage.getItem('userid');
        } catch (e) {
          console.log(e);
        }
        setUserid(parseInt(user_id))
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

  const _updatechecklist = async (qt) => {
    let response = await AsyncStorage.getItem('checkin');
    var listOfCheck = await JSON.parse(response) || [];
    let quantité = null;
    if (qt == null) {
      quantité = data.nbre
    } else {
      quantité = qt
    }
    console.log(itemData)
    listOfCheck.push({ "id": itemData.id, 'name': itemData.nom, 'qt': quantité, "prix": itemData.prix })
    await AsyncStorage.removeItem('checkin');
    await AsyncStorage.setItem('checkin', JSON.stringify([]));
    console.log(JSON.stringify(listOfCheck))
  }

  const removeCheckList = async (id) => {
    try {
      const posts = await AsyncStorage.getItem('checkin');
      let listOfCheck = JSON.parse(posts);
      const postsItems = listOfCheck.filter(function (item) { return item.id !== id });
      await AsyncStorage.removeItem('checkin');
      await AsyncStorage.setItem('checkin', JSON.stringify([]));
      console.log(JSON.stringify(postsItems))

    } catch (error) {
      console.log('error: ', error);
    }
  };
  const checkin = (newValue) => {
    if (newValue === true) {
      _updatechecklist()
    } else {
      removeCheckList(itemData.entreroffres_id)
    }
  }

  const handleConfirmStarting = (pickeddate) => {
    const exdate = moment(pickeddate).format("DD/MM/YYYY HH:MM")
    const exdatee = moment(pickeddate).format()

    const startingdate = moment(exdate, "DD/MM/YYYY").fromNow();
    const res = parseInt(startingdate.split(" ", 1))
    setData({ ...data, startingdate: exdate, startingdatee: exdatee })
    hideDatePicker();
  };
  const handleConfirmExpired = (pickeddate) => {
    const exdate = moment(pickeddate).format("DD/MM/YYYY HH:MM")
    const exdatee = moment(pickeddate).format()

    const expireddate = moment(exdate, "DD/MM/YYYY").fromNow();
    const res = parseInt(expireddate.split(" ", 1))
    setData({ ...data, expireddate: exdate, expireddatee: exdatee })
    hideDatePicker2();
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };



  return (
    <View style={styles.Container}>
      {renderHeader()}
      <View style={{ height: hp('75%') }}>
        {
          data.data.length == 0 ?
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Image source={require('../../assets/noitemfound.png')} style={{ width: wp('50%'), height: hp('20%'), marginBottom: hp('2%') }} />
              <Text style = {{fontWeight: 'bold', textAlign: 'center', marginBottom: hp("1%")}}> No Unsold selected </Text>
              <Text style = {{width: wp('60%'), textAlign:'center', color:'#686663'}}> Selected unsold items can be found here </Text>
            </View>
            :
            <FlatList
              data={data.data}
              renderItem={renderItemdeal}
              keyExtractor={item => item.name.toString()}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            />
        }
      </View>
      {renderFooter()}
    </View>
  )
}

export default Etape2;

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
    height: hp('5%'),
    marginTop: hp('1%'),
  },
  TextInput: {
    // flex: 1,
    height: hp('8%'), // 70% of height device screen
    // paddingLeft:10,
    // marginTop: Platform.OS === 'ios' ? 0 : -12,
    // margin: 15,
    // borderColor: 'transparent',
    // borderWidth: 1,
    width: hp('44%'),
    // flex: 10,
    marginTop: Platform.OS === 'ios' ? 0 : -15,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#36b3c9',
  },
  TextInputp: {
    width: wp('60%'),
    height: hp('5%'),
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#b4b4b4',
    marginTop: hp('1%'),
    fontSize: 13,
    textAlign: 'center',
    fontWeight: 'bold'
  }
})

