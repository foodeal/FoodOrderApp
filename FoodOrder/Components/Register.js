/* eslint-disable  */
import React, { useRef, useState, useEffect } from 'react'
import { Text, TextInput, View, StyleSheet, TouchableWithoutFeedback, ImageBackground, Image, TouchableOpacity, Linking, StatusBar, Keyboard, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import config from '../config.js'
import Toast from 'react-native-simple-toast';
import Fontisto from 'react-native-vector-icons/Fontisto'
import Foundation from 'react-native-vector-icons/Foundation';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import { Modalize } from 'react-native-modalize';
import en from '../model/local_en.json'

const Register = ({ navigation }) => {

  const [data, setData] = React.useState({
    firstname: '',
    lastname: '',
    username: '',
    age: '',
    birthday: '',
    mail: '',
    password: '',
    repassword: '',
    sexe: '',
    hearAboutUs: '',
    phone: '',
    check_textInputChange: false,
    check_textInputChangemail: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    isValidUsername: true,
    isValidRePassword: true
  });
  const ref_input1 = useRef();
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const modalizeRefsexe = React.useRef(null);
  const modalizeRefHearAbout = React.useRef(null);

  useEffect(() => {
    resetdata();
  }, [])

  const resetdata = () => {
    setTimeout(async () => {
      ref_input1.current.clear()
      ref_input2.current.clear()
      ref_input3.current.clear()
      ref_input4.current.clear()
      ref_input5.current.clear()
    }, 1000)
  }
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
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (data.mail == "" || data.password == "" || data.username == "" || data.repassword == "") {
      Toast.show('You must fill in all the fields')
    } else if (data.password != data.repassword) {
      Toast.show('Password is not correct')
    }
    else if (reg.test(data.mail) === false) {
      Toast.show('The email format is invalid')
    }
    else {
      axios
        .post(`${config.url}/register`, {
          username: data.username,
          age: data.age,
          birthday: data.birthday,
          mail: data.mail,
          password: data.password,
          hearAboutUs: data.hearAboutUs,
          sexe: data.sexe,
          phone: data.phone
        })
        .then(res => { if (res.data == "User already exists") { Toast.show(`User already exists`) } else { Toast.show('Your account has been created successfully, Please login'); navigation.navigate('SignInScreen') } })
        .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
    }

  }

  const textInputChange = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUsername: true
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUsername: false
      });
    }
  }
  const handleValidUsername = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUsername: true
      });
    } else {
      setData({
        ...data,
        isValidUsername: false
      });
    }
  }

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false
      });
    }
  }

  const handleConfirmPasswordChange = (val) => {
    if (data.password == val.trim()) {
      setData({
        ...data,
        repassword: val,
        isValidRePassword: true
      });
    } else {
      setData({
        ...data,
        repassword: val,
        isValidRePassword: false
      });
    }
  }
  const VerifierPassword = (val) => {
    if (data.password == val.trim()) {
      setData({
        ...data,
        isValidRePassword: true
      });
    } else {
      setData({
        ...data,
        isValidRePassword: false
      });
    }
  }

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
    });
  }

  const updateConfirmSecureTextEntry = () => {
    setData({
      ...data,
      confirm_secureTextEntry: !data.confirm_secureTextEntry
    })
  }

  const textInputChangemail = (val) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(val.trim()) === true) {
      setData({
        ...data,
        mail: val,
        check_textInputChangemail: true,
        isValidUser: true
      });
    } else {
      setData({
        ...data,
        mail: val,
        check_textInputChangemail: false,
        isValidUser: false
      });
    }
  }

  const handleValidUsermail = (val) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (val.trim().length >= 4 || reg.test(val.trim()) === true || val.trim().length == 0) {
      setData({
        ...data,
        isValidUser: true
      });
    } else {
      setData({
        ...data,
        isValidUser: false
      });
    }
  }
  const SexeInputChange = (val) => {
    setData({
      ...data,
      sexe: val
    });

  }

  const HearInputChange = (val) => {
    setData({
      ...data,
      hearAboutUs: val
    });
  }

  const PhoneInputChange = (val) => {
    setData({
      ...data,
      phone: val
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
          <Text style={{ textAlign: 'right', fontSize: 15, marginTop: hp('0.2%'), marginLeft: wp('8%'), color: '#36b3c9', fontWeight: 'bold' }}>Validate</Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignSelf: "center", marginTop: hp('-4%'), height: hp('20%'), }}>
        <Picker
          selectedValue={data.sexe}
          style={{ height: hp('2%'), width: wp('60%'), marginTop: hp('-4%') }}
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



        <View style={styles.form}>
          <FontAwesome
            name="user-o"
            color="black"
            size={20}
          />
          <TextInput
            style={styles.TextInput}
            ref={ref_input1}
            placeholder="Username"
            underlineColorAndroid="#00CED1"
            placeholderTextColor="#666666"
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(val)}
            onSubmitEditing={() => { ref_input2.current.focus(); }}
            // autoFocus={true}
            blurOnSubmit={false}
            returnKeyType='next'
          // onEndEditing={(e)=>handleValidUsername(e.nativeEvent.text)}/>  
          />
        </View>
        {data.isValidUsername ? null :
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsgu}> Username must be 4 characters long.</Text>
          </Animatable.View>
        }
        <View style={{ flexDirection: "row" }}>
          <View style={styles.form0}>
            <Feather
              name="calendar"
              color="black"
              size={20}
            />
            <TextInput
              style={styles.TextInput0}
              ref={ref_input2}
              placeholder="Date of birth (optional)"
              underlineColorAndroid="#00CED1"
              placeholderTextColor="#666666"
              // onChangeText={(val) => handleAgeChange({ val })}
              onSubmitEditing={() => { ref_input3.current.focus(); }}
              onFocus={() => showDatePicker()}
              value={data.birthday}
              // autoFocus={true}
              blurOnSubmit={false}
              returnKeyType='next'
              showSoftInputOnFocus={false}

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
            <Feather name="phone" size={20} color="black" style={{ marginTop: hp('0.5%') }} />
            <TextInput
              style={styles.TextInput0}
              placeholder="Phone (optional)"
              placeholderTextColor="#666666"
              underlineColorAndroid="#00CED1"
              keyboardType="number-pad"
              autoCorrect={false}
              onChangeText={value => PhoneInputChange(value)}
              value={data.phone}
              showSoftInputOnFocus={false}
            />
          </View>
        </View>
        <View style={styles.form}>
          <Feather
            name="mail"
            color="black"
            size={20}
          />
          <TextInput
            style={styles.TextInput}
            ref={ref_input3}
            placeholder="Email"
            underlineColorAndroid="#00CED1"
            placeholderTextColor="#666666"
            onChangeText={(val) => textInputChangemail(val)}
            onEndEditing={(e) => handleValidUsermail(e.nativeEvent.text)}
            onSubmitEditing={() => { ref_input4.current.focus(); }}
            // autoFocus={true}
            blurOnSubmit={false}
            returnKeyType='next'

          />
        </View>
        {data.isValidUser ? null :
          <Animatable.View animation="fadeInLeftBig" duration={200}>
            <Text style={styles.errorMsgem}>The email format is invalid </Text>
          </Animatable.View>}

        <View style={styles.form}>
          <Feather
            name="lock"
            color="black"
            size={20}
          />
          <TextInput
            style={styles.TextInputp}
            ref={ref_input4}
            placeholder="Password"
            underlineColorAndroid="#00CED1"
            placeholderTextColor="#666666"
            secureTextEntry={data.secureTextEntry ? true : false}
            autoCapitalize="none"
            onChangeText={(val) => handlePasswordChange(val)}
            onSubmitEditing={() => { ref_input5.current.focus(); }}
            // autoFocus={true}
            blurOnSubmit={false}
            returnKeyType='next'
          />
          <TouchableOpacity
            onPress={updateSecureTextEntry}
          >
            {data.secureTextEntry ?
              <Feather
                name="eye-off"
                color="grey"
                size={20}
              />
              :
              <Feather
                name="eye"
                color="grey"
                size={20}
              />
            }
          </TouchableOpacity>
        </View>
        {data.isValidPassword ? null :
          <Animatable.View animation="fadeInLeftBig" duration={500}>
            <Text style={styles.errorMsgp}>Password must contain at least 8 characters</Text>
          </Animatable.View>
        }
        <View style={styles.form}>
          <Feather
            name="lock"
            color="black"
            size={20}
          />
          <TextInput
            style={styles.TextInputp}
            placeholder="Confirm password"
            ref={ref_input5}
            underlineColorAndroid="#00CED1"
            placeholderTextColor="#666666"
            secureTextEntry={data.confirm_secureTextEntry ? true : false}
            autoCapitalize="none"
            onChangeText={(val) => handleConfirmPasswordChange(val)}
          // onEndEditing={(e) => VerifierPassword(e.nativeEvent.text)}

          />
          <TouchableOpacity
            onPress={updateConfirmSecureTextEntry}
          >
            {data.confirm_secureTextEntry ?
              <Feather
                name="eye-off"
                color="grey"
                size={20}
              />
              :
              <Feather
                name="eye"
                color="grey"
                size={20}
              />
            }
          </TouchableOpacity>
        </View>
        {data.isValidRePassword ? null :
          <Animatable.View animation="fadeInLeftBig" duration={200}>
            <Text style={styles.errorMsg}>Password not valid</Text>
          </Animatable.View>}

        <View style={styles.form1}>
          <Fontisto
            name="intersex"
            color="black"
            style={{ marginTop: hp('1.5%') }}
            size={20}
          />
          {
            Platform.OS == 'ios' ?
              <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
                <TextInput
                  style={styles.TextInput}
                  placeholder="Choose Your Gender (optional)"
                  ref={ref_input5}
                  underlineColorAndroid="#00CED1"
                  placeholderTextColor="#666666"
                  autoCapitalize="none"
                  onFocus={() => { Keyboard.dismiss(), onOpensexe() }}
                  value={data.sexe}
                // onEndEditing={(e) => VerifierPassword(e.nativeEvent.text)}
                />
              </TouchableWithoutFeedback>
              :
              <Picker
                selectedValue={data.sexe}
                style={{ height: hp('5%'), width: wp('77%'), marginLeft: wp('2%') }}
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
        <View style={styles.form2}>
          <Foundation
            name="social-myspace"
            color="black"
            style={{ marginTop: hp('1.5%') }}
            size={20}
          />
          {
            Platform.OS == 'ios' ?
              <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <TextInput
                  style={styles.TextInput}
                  placeholder="How did you hear about us? (optional)"
                  ref={ref_input5}
                  underlineColorAndroid="#00CED1"
                  placeholderTextColor="#666666"
                  autoCapitalize="none"
                  onFocus={() => { Keyboard.dismiss(), onOpenHearAbout() }}
                  value={data.hearAboutUs}
                // onEndEditing={(e) => VerifierPassword(e.nativeEvent.text)}
                />
              </TouchableWithoutFeedback>
              :
              <Picker
                selectedValue={data.hearAboutUs}
                style={{ height: hp('5%'), width: wp('77%'), marginLeft: wp('2%'), borderBottomWidth: 2, borderBottomColor: "#1074e7", }}
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

          <Button style={styles.connectbtn} mode='outlined' onPress={() => AddUser()}>
            <Text style={styles.btntext}>{en.BUTTON_SIGNUP}</Text>

          </Button>



        </View>



        <View style={{ top: hp('25%'), width: wp('95%'), alignItems: 'center' }}>
          <View style={styles.seperator}><Text style={styles.text}>{en.LINK_SIGNIN} </Text><Text style={styles.Textblue} onPress={() => { navigation.navigate('SignInScreen') }}>{en.BUTTON_CONNECT}</Text></View>
          <View style={styles.seperator1}>
            <Text style={styles.text}>{en.TEXT_CONDITION}
              <Text style={styles.Textblue} > {en.TEXT_CONDITION_1} </Text>
              <Text> {en.TEXT_CONDITION_2}</Text>
              <Text style={styles.Textblue} > {en.TEXT_CONDITION_3}</Text>
            </Text>
          </View>
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

export default Register;
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
    height: Platform.OS === 'ios' ? hp('4%') : hp('8%'), // 70% of height device screen
    // paddingLeft:10,
    // marginTop: Platform.OS === 'ios' ? 0 : -12,
    // margin: 15,
    // borderColor: 'transparent',
    // borderWidth: 1,
    width: hp('40%'),
    // flex: 10,
    fontSize: 14,
    // borderBottomWidth: 1,
    // borderBottomColor: "#00CED1",
    marginTop: Platform.OS === 'ios' ? hp('0%') : hp('-2%'),
    paddingLeft: 10,
    paddingRight: 10,
    color: 'black',
  },
  TextInput0: {
    // flex: 1,
    height: Platform.OS === 'ios' ? hp('4%') : hp('8%'), // 70% of height device screen
    // paddingLeft:10,
    // marginTop: Platform.OS === 'ios' ? 0 : -12,
    // margin: 15,
    // borderColor: 'transparent',
    // borderWidth: 1,
    width: hp('19%'),
    // flex: 10,
    fontSize: 14,
    // borderBottomWidth: 1,
    // borderBottomColor: "#00CED1",
    marginTop: Platform.OS === 'ios' ? hp('0%') : hp('-2%'),
    paddingLeft: 10,
    paddingRight: 10,
    color: 'black',
  },
  TextInputp: {
    // flex: 1,
    height: Platform.OS === 'ios' ? hp('4%') : hp('8%'), // 70% of height device screen
    // paddingLeft:10,
    // marginTop: Platform.OS === 'ios' ? 0 : -12,
    // margin: 15,
    // borderColor: 'transparent',
    // borderWidth: 1,
    width: hp('38%'),
    // flex: 10,
    fontSize: 14,
    // borderBottomWidth: 1,
    // borderBottomColor: "#00CED1",
    marginTop: Platform.OS === 'ios' ? hp('0%') : hp('-2%'),
    paddingLeft: 10,
    paddingRight: 10,
    color: 'black',
  },
  connectbtn: {
    position: 'absolute',
    height: hp('7%'), // 70% of height device screen
    width: wp('50%'),
    fontFamily: 'Rubik-Regular',
    alignSelf: 'center',
    backgroundColor: "#36b3c9",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    marginTop: hp('17%'),

  },
  btntext: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff'
  },
  pwoublié: {
    alignSelf: "flex-end",
    marginBottom: hp('2%'),
  },
  seperator: {
    marginTop: hp('2%'),
    // top: hp('105%'),
    justifyContent: 'center',
    flexDirection: "row"
  },
  seperator1: {
    // position: 'absolute',
    // top: hp('109%'),
    marginTop: hp('2%'),
    flexDirection: "row"
  },
  text: {
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.07,
    color: "#808080",
    textAlign: 'center',

  },
  textpw: {
    fontSize: 12,
    color: "#808080"
  },
  Textblue: {
    color: "#36b3c9",
    lineHeight: 22,


  },
  image: {
    height: hp('123%'), // 70% of height device screen
    width: wp('100%'),   // 80% of width device screen
    justifyContent: "center",
    alignItems: "center",
  },
  logoStyle: {
    height: Platform.OS === 'ios' ? hp('20%') : hp('25%'), // 70% of height device screen
    width: wp('80%'),
    marginTop: hp('-15%'),
  },
  errorMsg: {
    color: '#FF0000',
    textAlign: "left",
    fontSize: 12,
    marginLeft: wp('-32%')
  },
  errorMsgu: {
    color: '#FF0000',
    textAlign: "left",
    fontSize: 12,
    marginLeft: wp('-13%')
  },
  errorMsgem: {
    color: '#FF0000',
    textAlign: "left",
    fontSize: 12,
    marginLeft: wp('-32%')
  },
  errorMsgp: {
    color: '#FF0000',
    textAlign: "left",
    fontSize: 12,
    marginLeft: wp('-5%')
  },
  form: {
    flexDirection: 'row',
    marginTop: hp('1%'),
    paddingBottom: 5
  },
  form0: {
    flexDirection: 'row',
    marginTop: hp('1%'),
    paddingBottom: 5
  },
  form1: {
    flexDirection: 'row',
    // marginTop: hp('2%'),
    top: Platform.OS === 'ios' ? hp('66%') : hp('79%'),
    borderBottomWidth:  Platform.OS === 'ios' ? null: 2,
    borderBottomColor: Platform.OS === 'ios' ? null:'#f2f2f2',
    paddingBottom: 5,
    // height: hp('20%'),
    position: 'absolute'
  },
  form2: {
    flexDirection: 'row',
    // marginTop: hp('2%'),
    top: Platform.OS === 'ios' ? hp('72%') : hp('86%'),
    borderBottomWidth:  Platform.OS === 'ios' ? null:2,
    borderBottomColor:  Platform.OS === 'ios' ? null:'#f2f2f2',
    paddingBottom: 5,
    // height: hp('20%'),
    position: 'absolute'
  },
});