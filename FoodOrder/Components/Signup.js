/* eslint-disable */

import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, ImageBackground, StatusBar } from 'react-native';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { AuthContext } from './context';
import config from '../config.js'
import Toast from 'react-native-simple-toast';
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
  AppleRequestResponse
} from '@invertase/react-native-apple-authentication';
import en from '../model/local_en.json'

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
  const { colors } = useTheme();
  const { signIn } = React.useContext(AuthContext);
  const ref_input2 = useRef();


  //Google Configuration Authentification
  ////////////////////////////////////
  if (Platform.OS === 'android') {
    GoogleSignin.configure({
      forceCodeForRefreshToken: true,
    })
  } else {
    GoogleSignin.configure({
      webClientId: config.webClientId,
      forceCodeForRefreshToken: true,
      iosClientId: config.iosClientId
    })
  }
////////////////////////////////////


  // Facebook Authentification
  ////////////////////////////////////
  const _authFB = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
            result.grantedPermissions.toString()
          );
          _setDataFB()
        }
      },
      function (error) {
        console.log("Login fail with error: " + error);
      }
    );
  }
  const _setDataFB = async () => {
    // get token from facebook
    const tokenData = await AccessToken.getCurrentAccessToken().then(
      (data) => {
        return data.accessToken.toString()
      }
    )
    // get data about profile from api graph
    const datajson = await apiGraphFace(tokenData)

    if (datajson.success) {
      console.log(datajson.data);

      // variable para enviar post
      const data_fb = {
        id: datajson.data.id,
        mail: datajson.data.email,
        username: datajson.data.name,
      }
      setData({ ...data }, data_fb);
      axios
        .post(`${config.url}/fb`, {
          username: datajson.data.name,
          email: datajson.data.email,
          id: datajson.data.id,
          firstname: datajson.data.first_name,
          lastname: datajson.data.last_name,
          image: datajson.data.picture.data.url
        })
        .then(res => {
          const userr = {
            username: res.data.id,
            userToken: tokenData,
            name: res.data.username,
            new: res.data.new
          };
          if (res.data.user == 'new') { navigation.navigate("Socialinfo", { itemData: userr }); }
          else {
            const foundUser = {
              username: res.data.id,
              userToken: tokenData,
              name: res.data.username,
              new: res.data.new,
              numero: res.data.phone
            };
            signIn(foundUser)
          }
        })
        .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
    }
    else {
      console.log("Error get data");
    }
  }
  const apiGraphFace = async (token) => {

    const resface = await fetch('https://graph.facebook.com/v2.10/me?fields=id,name,email,first_name,last_name,picture.type(large).width(500)&access_token=' + token)
      .then((response) => response.json())
      .then((json) => {
        const data = {
          data: json,
          success: true
        }
        return data;
      })
      .catch((error) => {
        const data = {
          message: error,
          success: false
        }
        return data;
      })

    return resface;
  }
  ////////////////////////////////////


  // Local Authentification (Sign In)
  ////////////////////////////////////
  const controle = async () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (data.mail == "" || data.password == "") {
      Toast.show('You must fill in all the fields')

    }
    // else if (data.password.length < 8) {
    //   Toast.show('Mot de passe est trop court')

    // }
    else if (reg.test(data.mail) === false) {
      Toast.show('The email format is invalid')

    }
    else {
      axios
        .post(`${config.url}/login`, {
          mail: data.mail,
          password: data.password,
        })
        .then(res => {
          if (res.data.message == "reset password") {
            navigation.navigate('Reset', { code: res.data.code })
          }
          else if (res.data == "Invalid Password!") {
            Toast.show("Your password is invalid")
          }
          else {
            const foundUser = {
              username: res.data.id,
              userToken: res.data.xsrfToken,
              name: res.data.username,
              new: res.data.new,
              numero: res.data.phone
            };
            signIn(foundUser)
          }

        })
        .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
    }

  }
  ////////////////////////////////////


  // Google Authentification
  ////////////////////////////////////
  const signInn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo)
      const getToken = await GoogleSignin.getTokens()
      const data_gl = {
        id: userInfo.user.id,
        mail: userInfo.user.email,
        username: userInfo.user.name,
      }
      setData({ ...data }, data_gl);
      axios
        .post(`${config.url}/fb`, {
          id: userInfo.user.id,
          email: userInfo.user.email,
          username: userInfo.user.name,
          firstname: userInfo.user.givenName,
          lastname: userInfo.user.familyName,
          image: userInfo.user.photo
        })
        .then(res => {
          const userr = {
            username: res.data.id,
            userToken: toString(getToken),
            name: res.data.username,
            new: res.data.new
          };
          if (res.data.user == 'new') { navigation.navigate("Socialinfo", { itemData: userr }) }
          else {
            const foundUser = {
              username: res.data.id,
              userToken: toString(getToken),
              name: res.data.username,
              new: res.data.new,
              numero: res.data.phone
            };
            signIn(foundUser)
          }
        })
        .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };
  ////////////////////////////////////


  // Apple Authentification
  ////////////////////////////////////
  const AppleSignIn = async () => {
    const userInfo = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [
        appleAuth.Scope.EMAIL,
        appleAuth.Scope.FULL_NAME,
      ],
    })
      .then(
        res => {
          return res;
        },
        error => {
          console.log(error);
        }
      );
    console.log(userInfo)
    axios
      .post(`${config.url}/fb`, {
        email: userInfo.email,
        username: `${userInfo.fullName.familyName} ${userInfo.fullName.givenName}`,
        firstname: userInfo.fullName.familyName,
        lastname: userInfo.fullName.givenName,
        // image: userInfo.user.photo
      })
      .then(res => {
        const userr = {
          username: res.data.id,
          userToken: toString(userInfo.identityToken),
          name: res.data.username,
          new: res.data.new
        };
        if (res.data.user == 'new') { navigation.navigate("Socialinfo", { itemData: userr }) }
        else {
          const foundUser = {
            username: res.data.id,
            userToken: toString(userInfo.identityToken),
            name: res.data.username,
            new: res.data.new,
            numero: res.data.phone
          };
          signIn(foundUser)
        }
      })
      .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
    // console.log(token);
    // TODO: Send the token to backend
  };
  ////////////////////////////////////

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

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
      isValidPassword: true
    })
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

            placeholder="Mail"
            underlineColorAndroid="#00CED1"
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
            <Text style={styles.errorMsg}>Le format de l'e-mail est invalide</Text>
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
            underlineColorAndroid="#00CED1"
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
        <View style={styles.pwoublie} >
          <Text style={styles.textpw} onPress={() => { navigation.navigate('Forget') }}>{en.LINK_PW}
          </Text>
        </View>

        <View>
          <Button style={styles.connectbtn} mode='outlined' onPress={() => controle()}>
            <Text style={styles.btntext}>{en.BUTTON_CONNECT}</Text>
          </Button>
        </View>

        <View style={styles.seperator}><Text style={styles.text}>{en.TEXT_OR}</Text></View>
        <View style={styles.ConnectButtons}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.FacebookStyle} activeOpacity={0.5} onPress={() => _authFB()}>
              <Image
                //We are showing the Image from online
                source={require('../Images/groupe_545.png')}

                style={styles.ImageIconStyle}

              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.GooglePlusStyle} activeOpacity={0.5} onPress={() => { signInn() }}>
              <Image
                //We are showing the Image from local
                source={require('../Images/groupe_544.jpg')}

                style={styles.ImageIconStyle}
              />
              <View style={styles.SeparatorLine} />

            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity style={styles.GooglePlusStyle} activeOpacity={0.5} onPress={() => { AppleSignIn() }}>
            <Image
              //We are showing the Image from local
              source={require('../Images/groupe_581.png')}

              style={styles.ImageIconStyleapple}
            />
          </TouchableOpacity> */}
          {
            Platform.OS === 'ios' ?
              <AppleButton
                buttonStyle={AppleButton.Style.BLACK}
                buttonType={AppleButton.Type.DEFAULT}
                style={styles.ImageIconStyleapple}
                onPress={() => AppleSignIn()}
              />
              :
              null
          }

        </View>
        <View style={styles.seperator}><Text style={styles.text}>{en.LINK_SIGNUP} </Text><Text style={styles.Textblue} onPress={() => { navigation.navigate('SignUpScreen') }}>{en.BUTTON_SIGNUP}</Text></View>
      </ImageBackground>

    </View>
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
  ImageIconStyleapple: {
    height: hp('5%'), // 70% of height device screen
    width: wp('34%'),

  },
  ConnectButtons: {
    justifyContent: "space-between",
    alignItems: 'center',

    flexDirection: "column",
    shadowColor: '#000',

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
    // borderBottomWidth: 1,
    // borderBottomColor: "#00CED1",
    marginTop: Platform.OS === 'ios' ? 0 : -15,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#05375a',
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
  pwoublie: {
    alignSelf: "flex-end",
    marginRight: wp('3%'),
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
    height: Platform.OS === 'ios' ? hp('20%') : hp('25%'), // 70% of height device screen
    width: wp('80%'),
    marginTop: Platform.OS === 'ios' ? hp('0%') : hp('6%'), // 70% of height device screen
  },
  errorMsg: {
    color: '#FF0000',
    textAlign: "left",
    fontSize: 12,
    marginLeft: wp('-25%')
  },
  form: {
    flexDirection: 'row',
    marginTop: 10,
    paddingBottom: 5
  },


});