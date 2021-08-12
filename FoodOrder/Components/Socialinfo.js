/* eslint-disable  */
import React, { useRef, useState } from 'react'
import { Text, TextInput, View, StyleSheet, Dimensions, ImageBackground, Image, TouchableOpacity, Linking, StatusBar, Keyboard } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto'
import Foundation from 'react-native-vector-icons/Foundation';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import config from '../config.js'
import Toast from 'react-native-simple-toast';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from './context';
import moment from 'moment';
import { Modalize } from 'react-native-modalize';
import en from '../model/local_en.json'



const Socialinfo = ({ route, navigation }) => {

  const [data, setData] = React.useState({
    age: '',
    sexe: '',
    hearAboutUs: '',
    birthday: '',
    phone: '',
    founduser:' route.params.itemData'
  });
  const { signIn } = React.useContext(AuthContext);
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const modalizeRefsexe = React.useRef(null);
  const modalizeRefHearAbout = React.useRef(null);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (pickeddate) => {
    const exdate = moment(pickeddate).format('DD/MM/YYYY')
    const lol = moment(exdate, "DD/MM/YYYY").fromNow();
    const res = parseInt(lol.split(" ", 1))
    setData({ ...data, age: res, birthday: exdate })
    hideDatePicker();
  };

  
  const AddUser = () => {
    if (data.hearAboutUs == "") {
      Toast.show(`You must choose your answer from the list of heard about us`)
    } else {
      axios
        .put(`${config.url}/users/${data.founduser.username}`, {
          hearAboutUs: data.hearAboutUs,
          birthday: data.birthday,
          age: data.age,
          sexe: data.sexe,
          phone: data.phone
        })
        .then(res => {
          if (res.data == 'User Updated!') {
            const user = {
              username: data.founduser.username,
              userToken: data.founduser.userToken,
              name: data.founduser.name,
              new: data.founduser.new,
              numero: data.phone
            };
            signIn(user)
          }
        })
        .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
    }

  }


  const SexeInputChange = (val) => {
    setData({
      ...data,
      sexe: val
    });
  }
  const PhoneInputChange = (val) => {
    setData({
      ...data,
      phone: val
    });

  }

  const HearInputChange = (val) => {
    setData({
      ...data,
      hearAboutUs: val
    });
  }


  const onOpensexe = () => {
    modalizeRefsexe.current?.open();
  };
  const validersexe = () => {
    if (data.sexe == '') {
      Toast.show('Please select your gender!')
    } else {
      modalizeRefsexe.current?.close();
    }
  }
  const onClosesexe = () => {
    setData({
      ...data,
      sexe: ''
    })
    modalizeRefsexe.current?.close();
  };
  const validerHearAbout = () => {
    if (data.hearAboutUs == '') {
      Toast.show('Please select your choice!')
    } else {
      modalizeRefHearAbout.current?.close();
    }
  }
  const onCloseHearAbout = () => {
    setData({
      ...data,
      hearAboutUs: ''
    })
    modalizeRefHearAbout.current?.close();
  };
  const onOpenHearAbout = () => {
    modalizeRefHearAbout.current?.open();
  };
  const rendersexe = () => (
    <View style={{ flex: 3 }}>
      <View style={{ height: hp('7%'), marginTop: hp('4%'), marginLeft: wp('5%'), flexDirection: 'row', }}>
        <TouchableOpacity onPress={() => { onClosesexe() }}>
          <Text style={{ textAlign: 'left', fontSize: 15, marginTop: hp('0.2%'), color: '#686663', fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', marginLeft: wp('13%'), fontWeight: 'bold', fontSize: 17, color: '#000' }}>Choose Your Gender</Text>
        <TouchableOpacity onPress={() => { validersexe() }}>
          <Text style={{ textAlign: 'right', fontSize: 15, marginTop: hp('0.2%'), marginLeft: wp('12%'), color: '#36b3c9', fontWeight: 'bold' }}>Validate</Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignSelf: "center", marginTop: hp('-4%'), height: hp('20%'), }}>
        <Picker
          selectedValue={data.sexe}
          style={{ height: hp('2%'), width: wp('60%'), marginTop: hp('-5%') }}
          mode={'dropdown'}
          onValueChange={(itemValue, itemIndex) =>
            SexeInputChange(itemValue)
          }>
          <Picker.Item label="Choose Your Gender" value="" />
          <Picker.Item label="Women" value="Women" />
          <Picker.Item label="Man" value="Man" />
        </Picker>
      </View>
    </View>
  )

  const renderHearAbout = () => (
    <View>
      <View style={{ height: hp('7%'), marginTop: hp('4%'), marginLeft: wp('5%'), flexDirection: 'row', width: wp('60%') }}>
        <TouchableOpacity onPress={() => { onCloseHearAbout() }}>
          <Text style={{ textAlign: 'left', fontSize: 15, marginTop: hp('0.2%'), color: '#686663', fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', marginLeft: wp('8%'), fontWeight: 'bold', fontSize: 17, color: '#000' }}>How did you hear about us?</Text>
        <TouchableOpacity onPress={() => { validerHearAbout() }}>
          <Text style={{ textAlign: 'right', fontSize: 15, marginTop: hp('0.2%'), marginLeft: wp('5%'), color: '#36b3c9', fontWeight: 'bold' }}>Validate</Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignSelf: "center", marginTop: hp('-4%'), }}>
        <Picker
          selectedValue={data.hearAboutUs}
          style={{ height: hp('6%'), width: wp('65%'), marginLeft: wp('0%'), marginTop: hp('-4%') }}
          mode={'dropdown'}
          onValueChange={(itemValue, itemIndex) =>
            HearInputChange(itemValue)
          }>
          <Picker.Item label="Heard about us?" value="" />
          <Picker.Item label='Facebook' value='Facebook' />
          <Picker.Item label="Instagram" value="Instagram" />
          <Picker.Item label="Friend" value="Friend" />
        </Picker>
      </View>
    </View>
  )

  return (
    <View style={styles.MainContainer}>
      <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />


      <ImageBackground source={require('../Images/groupe_549.png')} style={styles.image}>
        <Image
          //We are showing the Image from online
          source={config.logo}

          style={styles.logoStyle}
        />

        <View style={styles.form} onPress={() => showDatePicker()}>
          <Feather
            name="calendar"
            color="black"
            style={{ marginTop: hp('2%'), marginRight: wp('3%') }}
            size={20}
          />
          <TextInput
            style={styles.TextInput}
            ref={ref_input2}
            placeholder="Date of birth (optional)"
            placeholderTextColor={'#666666'}
            // underlineColorAndroid="#1074e7"
            onChangeText={showDatePicker}
            onFocus={showDatePicker}
            onKeyPress={() => showDatePicker()}
            value={data.birthday}
            // autoFocus={true}
            blurOnSubmit={false}
          // returnKeyType='next'

          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            mode={'date'}
            display="spinner"
            maximumDate={new Date()}
          />
        </View>
        <View style={styles.form}>
          <Feather name="phone" size={20} style={{ marginTop: hp('2%'), marginRight: wp('3%') }} />
          <TextInput
            style={styles.TextInput}
            placeholder="Phone (optional)"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            onChangeText={value => PhoneInputChange(value)}
            value={data.phone}
          />
        </View>
        <View style={styles.form}>
          <Fontisto
            name="intersex"
            color="black"
            style={{ marginTop: hp('1.5%') }}
            size={20}
          />
           {
            Platform.OS == 'ios' ?
          <TextInput
            style={styles.TextInput1}
            placeholder="Choose Your Gender (optional)"
            underlineColorAndroid="#00CED1"
            placeholderTextColor="#666666"
            autoCapitalize="none"
            onFocus={() => { Keyboard.dismiss(), onOpensexe() }}
            value={data.sexe}
          // onEndEditing={(e) => VerifierPassword(e.nativeEvent.text)}
          />
          :
          <Picker
            selectedValue={data.sexe}
            style={{ height: hp('5%'), width: wp('68%'), marginLeft: wp('2%') }}
            mode={'dropdown'}
            onValueChange={(itemValue, itemIndex) =>
              SexeInputChange(itemValue)
            }>
            <Picker.Item label="Choose Your Gender" value="" />
            <Picker.Item label="Women" value="Women" />
            <Picker.Item label="Man" value="Man" />
          </Picker>
      }
        </View>
        <View style={styles.form}>
          <Foundation
            name="social-myspace"
            color="black"
            style={{ marginTop: hp('1.5%') }}
            size={20}
          />
           {
            Platform.OS == 'ios' ?
          <TextInput
            style={styles.TextInput1}
            placeholder="How did you hear about us? (optional)"
            underlineColorAndroid="#00CED1"
            placeholderTextColor="#666666"
            autoCapitalize="none"
            onFocus={() => { Keyboard.dismiss(), onOpenHearAbout() }}
            value={data.hearAboutUs}
          // onEndEditing={(e) => VerifierPassword(e.nativeEvent.text)}
          />
          :
          <Picker
            selectedValue={data.hearAboutUs}
            style={{ height: hp('5%'), width: wp('68%'), marginLeft: wp('2%'), borderBottomWidth: 2, borderBottomColor: "#1074e7", }}
            mode={'dropdown'}
            onValueChange={(itemValue, itemIndex) =>
              HearInputChange(itemValue)
            }>
            <Picker.Item label="Heard about us?" value="" />
            <Picker.Item label='Facebook' value='Facebook' />
            <Picker.Item label="Instagram" value="Instagram" />
            <Picker.Item label="Friend" value="Friend" />
          </Picker>
      }
        </View>
        <View>

          <Button style={styles.connectbtn} mode='outlined' onPress={AddUser}>
            <Text style={styles.btntext}>{en.SOCIALINFO_BUTTON}</Text>

          </Button>
        </View>

      </ImageBackground>
      {
        Platform.OS === 'ios' ?
          <Modalize ref={modalizeRefsexe} snapPoint={hp('28%')} modalHeight={hp('28%')} closeOnOverlayTap={false} handlePosition='inside'>
            {rendersexe()}
          </Modalize>
          :
          null
      }
      {
        Platform.OS === 'ios' ?
          <Modalize ref={modalizeRefHearAbout} snapPoint={hp('30%')} modalHeight={hp('30%')} closeOnOverlayTap={false} disableScrollIfPossible={false} handlePosition='inside'>
            {renderHearAbout()}
          </Modalize>
          :
          null
      }
    </View>
  )
}

export default Socialinfo;
const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('100%'), // 70% of height device screen
    width: wp('100%'),
    backgroundColor: 'white',
    color: '#fff',
  },

  ImageIconStyle: {
    height: hp('7%'), // 70% of height device screen
    width: wp('34%'),
    borderRadius: 10,
    marginTop: hp('4%')

  },
  ConnectButtons: {
    justifyContent: "space-between",
    alignItems: 'center',

    flexDirection: "row",
    shadowColor: '#000',
    shadowOffset: {
      height: hp('1%'), // 70% of height device screen
      width: wp('0%'),
    },
    shadowOpacity: 0.8,
    shadowRadius: 50,
  },
  TextInput: {
    // flex: 1,
    // height: hp('8%'), // 70% of height device screen
    width: hp('37%'),
    fontSize: 14,
    // flex: 10,
    // marginTop: Platform.OS === 'ios' ? 0 : -15,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'black',
    // fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: "#00CED1",
  },
  TextInput1: {
    // flex: 1,
    height: hp('4%'), // 70% of height device screen
    borderBottomWidth: 2,
    borderBottomColor: "#00CED1",
    width: hp('36.5%'),
    marginLeft: wp('3%'),
    // flex: 10,
    marginTop: Platform.OS === 'ios' ? 0 : -15,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#05375a',
  },
  connectbtn: {
    height: hp('7%'), // 70% of height device screen
    width: wp('70%'),
    fontFamily: 'Rubik-Regular',
    alignSelf: 'center',
    backgroundColor: "#36b3c9",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    marginTop: 20,

  },
  btntext: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff'
  },
  pwoublié: {
    alignSelf: "flex-end",
    marginBottom: 19,
  },
  seperator: {
    marginBottom: 25,
    marginTop: 20,
    flexDirection: "row"
  },
  text: {
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.07,
    color: "#808080"
  },
  textpw: {
    fontSize: 12,
    color: "#808080"
  },
  Textblue: {
    color: "#0095ff",
    lineHeight: 22,


  },
  image: {
    height: hp('122%'), // 70% of height device screen
    width: wp('100%'),   // 80% of width device screen
    justifyContent: "center",
    alignItems: "center",
  },
  logoStyle: {
    height: Platform.OS ==='ios' ? hp('20%'): hp('25%'), // 70% of height device screen
    width: wp('80%'),
    marginTop: 14,
  },
  errorMsg: {
    color: '#FF0000',
    textAlign: "left",
    fontSize: 12,
  },
  form: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },

});