import React, { useRef } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native'
import Button from 'react-native-paper/lib/commonjs/components/Button';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import config from '../config.js'
import Toast from 'react-native-simple-toast';
import en from '../model/local_en.json'

const Reset = ({ navigation,route }) => {

    // console.log(route.params.code)

  const [data, setData] = React.useState({
    password: "",
    repassword: "",
    secureTextEntry: true,
    confirm_secureTextEntry: true,
    isValidPassword: true,
    isValidRePassword: true
  });
  const ref_input2 = useRef();

  const onReset = () => {
    if (data.password != data.repassword) {
      Toast.show("Please verify your password")
    } else {
      axios
        .post(`${config.url}/reset`, {
          password: data.password,
          code: route.params.code
        })
        .then(res => { Toast.show("Your password has been successfully changed !"); navigation.navigate('SignInScreen') }
        )
        .catch(err =>  Toast.show(en.TOAST_CHECK_ERROR));
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
    setData({
      ...data,
      repassword: val
    });
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

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../Images/groupe_549.png')} style={styles.image}>
        <Image
          //We are showing the Image from online
          source={config.logo}

          style={styles.logoStyle}

        />

        <View style={styles.textcontainer}>
          <Text style={styles.textblack}>{en.LINK_PW}</Text>
          <Text style={styles.textgray}>{en.TITLE_RESET_PW}</Text>
        </View>
        <View style={styles.form}>
          <Feather
            name="lock"
            color="black"
            size={20}
          />
          <TextInput
            style={styles.TextInputp}
            placeholder="Password"
            underlineColorAndroid="#00CED1"
            placeholderTextColor="#666666"
            secureTextEntry={data.secureTextEntry ? true : false}
            autoCapitalize="none"
            onChangeText={(val) => { handlePasswordChange(val)}}
            onSubmitEditing={() => { ref_input2.current.focus(); }}
            autoFocus={true}
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
            <Text style={styles.errorMsg}>Mot de passe doit contenir 8 caractères.</Text>
          </Animatable.View>
        }
        <View style={styles.form}>
          <Feather
            name="lock"
            color="black"
            size={20}
          />
          <TextInput
            ref={ref_input2}
            style={styles.TextInputp}
            placeholder="Confirm password"
            underlineColorAndroid="#00CED1"
            placeholderTextColor="#666666"
            secureTextEntry={data.confirm_secureTextEntry ? true : false}
            autoCapitalize="none"
            onChangeText={(val) => handleConfirmPasswordChange(val)}
            onEndEditing={(e) => VerifierPassword(e.nativeEvent.text)}

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
            <Text style={styles.errorMsgc}>Mot de passe n'est pas conforme</Text>
          </Animatable.View>}

        <Button style={styles.button} mode="contained" title={en.BUTTON_RESET_PW} onPress={() => { onReset() }}>
          {en.BUTTON_RESET_PW}
  </Button>
      </ImageBackground>
    </View>
  )
}

export default Reset;
const styles = StyleSheet.create({
  container: {

    justifyContent: 'center',
    alignItems: 'center',
    height: hp('75%'), // 70% of height device screen
    width: wp('100%'),
    color: '#fff',
  },
  form: {
    flexDirection: 'row',
    marginTop: 10,
    paddingBottom: 5
  },
  logoStyle: {
    height: Platform.OS === 'ios' ? hp('20%'):hp('25%'), // 70% of height device screen
    width: wp('60%'),
  },

  textcontainer: {
    height: hp('17%'),
    width: wp('85%')
  },
  TextInput: {
    height: hp('4%'),
    paddingLeft: 6,
    margin: 15,
    borderColor: 'transparent',
    borderWidth: 1,
    width: wp('80%'),
  },
  button: {
    width: wp('80%'),
    height: hp('7%'),
    marginTop: hp('5%'),
    fontFamily: 'Rubik-Regular',
    alignSelf: 'center',
    backgroundColor: "#36b3c9",
    justifyContent: "center",
    alignContent: "center"
  },
  textblack: {
    fontFamily: 'Rubik-Bold',
    fontSize: 24,
    textAlign: "center",
    color: "#3a4047",
    fontWeight: "bold",
    marginTop: hp('1%')

  },

  textgray: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    textAlign: "center",
    color: "#3a4047",
    marginTop:hp('2%')
  },
  image: {
    height: hp('120%'), // 70% of height device screen
    width: wp('100%'),   // 80% of width device screen
    justifyContent: "center",
    alignItems: "center",

  },
  TextInputp: {
    height: Platform.OS === 'ios' ? hp('4%'):hp('8%'), // 70% of height device screen
    width: hp('35%'),
    marginTop: Platform.OS === 'ios' ? -5 : -15,
    paddingLeft: wp('3%'),
    paddingRight:  wp('3%'),
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    textAlign: "left",
    fontSize: 12,
    marginLeft:wp('-15%')
  },
  errorMsgc: {
    color: '#FF0000',
    textAlign: "left",
    fontSize: 12,
    marginLeft:wp('-25%')
  },
});