/* eslint-disable */

import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, ImageBackground, StatusBar, Platform } from 'react-native';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../components/context';
import Toast from 'react-native-simple-toast';
import config from '../config.js'


const Signup = ({ navigation }) => {


  const [data, setData] = React.useState({
    mail: '',
    password: '',
    activated: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    id: '',
    username: '',
    accessToken: null
  });

  const { signIn } = React.useContext(AuthContext);
  const { colors } = useTheme();
  const ref_input2 = useRef();


  //fonction qui permet de verifier les coordonnées entrées (si elles ont acceptées redirigé vers interface Scan)
  const controle = async () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (data.mail == "" || data.password == "") {
      Toast.show('You must fill in all the fields')

    }
    else if (data.password.length < 8) {
      Toast.show('Password is too short')

    }
    else if (reg.test(data.mail) === false) {
      Toast.show('The email format is invalid')

    }
    else {

      axios
        .post(`${config.url}/restaurants/login`, {
          mail: data.mail,
          password: data.password,
        })
        .then(res => {
          if (res.data == "Invalid Password!") {
            Toast.show("Your password is invalid")
          }
          else {
            const User = {
              id: res.data.id,
              userToken: res.data.xsrfToken,
              discount: res.data.discount,
              image: res.data.image
            }
            signIn(User)
          }
        })
        .catch(err => Toast.show("Please check your connection!"));
    }

  }

  //fonction qui permet de verifier le champ du email
  const textInputChange = (val) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (val.trim().length >= 4 && reg.test(val.trim()) === true) {
      setData({
        ...data,
        mail: val,
        check_textInputChange: true,
        isValidUser: true
      });
    } else {
      setData({
        ...data,
        mail: val,
        check_textInputChange: false,
        isValidUser: false
      });
    }
  }
  const handleValidUser = (val) => {
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
  const updateSecureTextEntry = () => {
    if (data.secureTextEntry) {
      setData({
        ...data,
        secureTextEntry: false
      });
    } else {
      setData({
        ...data,
        secureTextEntry: true
      });
    }
  }


  //fonction qui permet de verifier le champ de password
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

  return (

    <View style={styles.MainContainer}>
      <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />

      <ImageBackground source={require('../Images/groupe_549.png')} style={styles.image}>

        <Image
          //We are showing the Image from online
          source={config.logo}

          style={styles.logoStyle}

        />
        <View style={styles.form} >
          <FontAwesome
            name="user-o"
            color="black"
            size={20}
          />
          <TextInput style={styles.TextInput}

            placeholder="Email"
            underlineColorAndroid="#00FFFF"
            placeholderTextColor="#666666"
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(val)}
            onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
            onSubmitEditing={() => { ref_input2.current.focus(); }}
            // autoFocus={true}
            blurOnSubmit={false}
            returnKeyType='next'
          />
        </View>
        {data.isValidUser ? null :
          <Animatable.View animation="fadeInLeftBig" duration={500}>
            <Text style={styles.errorMsg}>Email must contain the @ symbol                                       </Text>
          </Animatable.View>
        }
        <View style={styles.form} >
          <Feather
            name="lock"
            color="black"
            size={20}
          />
          <TextInput style={styles.TextInputp}
            placeholder="Password"
            ref={ref_input2}
            underlineColorAndroid="#00FFFF"
            placeholderTextColor="#666666"
            secureTextEntry={data.secureTextEntry ? true : false}
            onChangeText={(val) => handlePasswordChange(val)} />
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
            <Text style={styles.errorMsg}>Password must contain at least 8 characters</Text>
          </Animatable.View>
        }

        <View style={{ marginTop: hp('3%') }}>
          <Button style={styles.connectbtn} mode='outlined' onPress={() => controle()}>
            <Text style={styles.btntext}>Sign In</Text>
          </Button>
        </View>
      </ImageBackground></View>
  )
}

export default Signup

const styles = StyleSheet.create({
  MainContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 10,
    height: hp('90%'), // 70% of height device screen
    width: wp('100%'),
    color: '#fff'
  },

  ImageIconStyle: {
    height: hp('7%'), // 70% of height device screen
    width: wp('34%'),
    borderRadius: 10,

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
    height: Platform.OS === 'ios' ? hp('4%'):hp('8%'), // 70% of height device screen
    // paddingLeft:10,
    // marginTop: Platform.OS === 'ios' ? 0 : -12,
    // margin: 15,
    // borderColor: 'transparent',
    // borderWidth: 1,
    width: hp('42%'),
    // flex: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "#00CED1",
    marginTop: Platform.OS === 'ios' ? 0 : -15,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#05375a',
  },
  TextInputp: {
    // flex: 1,
    height: Platform.OS === 'ios' ? hp('4%'):hp('8%'), // 70% of height device screen
    // paddingLeft:10,
    // marginTop: Platform.OS === 'ios' ? 0 : -12,
    // margin: 15,
    // borderColor: 'transparent',
    // borderWidth: 1,
    width: hp('40%'),
    // flex: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "#00CED1",
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
    borderRadius: 5
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
    color: "#36b3c9",
    lineHeight: 22,


  },
  image: {
    height: hp('120%'), // 70% of height device screen
    width: wp('100%'),   // 80% of width device screen
    justifyContent: "center",
    alignItems: "center",

  },
  logoStyle: {
    height: Platform.OS  === 'ios' ? hp('20%'):hp('25%'), // 70% of height device screen
    width: wp('80%'),
  },
  errorMsg: {
    color: '#FF0000',
    textAlign: "left",
    fontSize: 12,
  },
  form: {
    flexDirection: 'row',
    marginTop: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },


});