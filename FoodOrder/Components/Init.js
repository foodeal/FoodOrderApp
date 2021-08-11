/* eslint-disable */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ImageBackground, StatusBar, Linking, Platform } from 'react-native';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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

const Init = ({ navigation }) => {

  const [data, setData] = React.useState({
    id: '',
    username: '',
    mail: '',
  });


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
  const { signIn, Asguest } = React.useContext(AuthContext);

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
  const signInn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const getToken = await GoogleSignin.getTokens()
      const data_gl = {
        id: userInfo.user.id,
        mail: userInfo.user.email,
        username: userInfo.user.name,
      }
      setData(data_gl);
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
          console.log(res.data)
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
  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!isSignedIn) {
      getCurrentUserInfo()
    } else {
      console.log('Please Login')
    }
  };
  const getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      setUser(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };

  const _authFB = () => {
    const dhis = this
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
    // console.log(tokenData)

    if (datajson.success) {
      console.log(datajson.data);

      // variable para enviar post
      const data_fb = {
        id: datajson.data.id,
        mail: datajson.data.email,
        username: datajson.data.name,
      }
      setData(data_fb);
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

  const GuestAuth = () => {
    Asguest();
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

        <View>
          <Text style={styles.title}>{en.TITLE_3}</Text>
          {/* <Text style={styles.title}>{en.TITLE_2}</Text>
          <Text style={styles.titlelow}>{en.TITLE_3}</Text> */}
          {/* <Text style={styles.titlelow}>{en.TITLE_4}</Text> */}
        </View>


        <View>
          <Button style={styles.connectbtn} mode='outlined' onPress={() => { navigation.navigate('SignInScreen') }}>
            <Text style={styles.btntext}>{en.BUTTON_CONNECT}</Text>
          </Button>
        </View>
        <View>
          <Button style={styles.connectbtnguest} mode='outlined' onPress={() => { GuestAuth() }}>
            <Text style={styles.btntextg}>{en.BUTTON_GUEST}</Text>
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
              source={require('../Images/groupe_580.png')}

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
        <View style={styles.seperator1}>
          <Text style={styles.text2}>{en.TEXT_CONDITION}
           <Text style={styles.Textblue} >{en.TEXT_CONDITION_1}</Text>
            <Text>{en.TEXT_CONDITION_2}</Text>
            <Text style={styles.Textblue} >{en.TEXT_CONDITION_3}</Text>
          </Text>
        </View>
      </ImageBackground></View>
  );

};

export default Init;

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
    height: hp('8%'), // 70% of height device screen
    paddingLeft: 6,
    margin: 15,
    borderColor: 'transparent',
    borderWidth: 1,
    width: 375,
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
    marginTop: wp('7%'),
  },
  connectbtnguest: {
    height: hp('7%'), // 70% of height device screen
    width: wp('70%'),
    fontFamily: 'Rubik-Regular',
    alignSelf: 'center',
    backgroundColor: "#686663",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    marginTop: wp('7%'),
  },
  btntext: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff'
  },
  btntextg: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff'
  },
  pwoublié: {
    alignSelf: "flex-end",
    marginBottom: 19,
  },
  seperator: {
    marginBottom: hp('0.5%'),
    marginTop: hp('1%'),
    flexDirection: "row"
  },
  seperator1: {
    // position: 'absolute',
    // top: hp('109%'),
    marginTop: hp('1%'),
    flexDirection: "row",
    width: wp('95%'),
    alignContent:'center'
  },
  text: {
    fontFamily: "Rubik-Regular",
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.07,
    color: "#808080"
  },
  text2: {
    fontFamily: "Rubik-Regular",
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.07,
    color: "#808080",
    textAlign: 'center'
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
    height: Platform.OS === 'ios' ? hp('20%'):hp('25%'), // 70% of height device screen
    width: wp('80%'),
    marginTop: hp('11%')
  },
  title: {
    fontWeight: "bold",
    marginVertical: 4,
    textAlign: "center",
    fontSize: 20,
  },
  titlelow: {
    fontWeight: "normal",
    marginVertical: 4,
    textAlign: "center",
    fontSize: 15,
    fontStyle: "italic",

  }
});