import React from 'react';
import { StyleSheet, View, Text,  Image,  TextInput, Alert, ImageBackground, ScrollView } from 'react-native';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import config from '../config.js'
import Toast from 'react-native-simple-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import en from '../model/local_en.json'



const Forget = ({ navigation }) => {

  const [data, setData] = React.useState({
    mail: '',
  });
  const myTextInput = React.createRef();

  const onChange = (textValue) => {
    setData({
      ...data,
      mail: textValue,
    });
  }



  const onsubmit = () => {
    setData({
      mail: ''
    })
  }
  const onForget = () => {
    console.log(data.mail)
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(data.mail) === false) {
      Toast.show('The email format is invalid')
    }
    else {
      axios
        .post(`${config.url}/forgot`, {
          mail: data.mail,
        })
        .then(res => {
          if (res.data == "check your mail") { 
            Toast.show('Verify Your Email'); 
            navigation.navigate('SignInScreen') 
          }else{
            Toast.show('Please verify your email address.')
          }
        })
        .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
      myTextInput.current.value = '';
    }

  }

  return (

    <View style={styles.container} >
      <ImageBackground source={require('../Images/groupe_549.png')} style={styles.image}>
        <View style={{marginTop:hp('23%')}}>

          <Image
            //We are showing the Image from online
            source={config.logo}

            style={styles.logoStyle}

          />

          <View style={styles.textcontainer}>
            <Text style={styles.textblack}>{en.TITLE_FORGET_PW_1}</Text>
            <Text style={styles.textgray}>{en.TITLE_FORGET_PW_2}</Text>
          </View>
          <View style={styles.form} >
          <AntDesign
            name="mail"
            color="black"
            size={20}
          />
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#666666"
            underlineColorAndroid="#00CED1"
            name="mail"
            ref={myTextInput}
            // onSubmitEditing={(e) => { onsubmit(e) }}
            onChangeText={(val) => {onChange(val)}}

          />
          </View>

          <Button style={styles.button} mode="contained" onPress={() => { onForget() }}>
          {en.BUTTON_RECEIVE_MAIL}
            </Button>
        </View>

      </ImageBackground>
    </View>
  )
}


export default Forget;

const styles = StyleSheet.create({
  container: {

    justifyContent: 'center',
    alignItems: 'center',
    height: hp('90%'), // 70% of height device screen
    width: wp('100%'),
    color: '#fff',


  },
  logoStyle: {
    height: Platform.OS === 'ios' ? hp('20%'):hp('25%'), // 70% of height device screen
    width: wp('80 %'),
    marginLeft:wp('8.5%'),
    marginTop:hp('2.5%')

  },

  textcontainer: {
    height: hp('17%'),
    width: wp('85%'),
    alignSelf: "center"

  },
  TextInput: {
    height: Platform.OS === 'ios' ? hp('4%'):hp('8%'), // 70% of height device screen
    // paddingLeft:10,
    // marginTop: Platform.OS === 'ios' ? 0 : -12,
    // margin: 15,
    // borderColor: 'transparent',
    // borderWidth: 1,
    width: hp('40%'),
    // flex: 10,
    // borderBottomWidth:1,
    // borderBottomColor:"#00CED1",
    marginTop: Platform.OS === 'ios' ? -7: -15,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#05375a',
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
    marginTop: 20

  },

  textgray: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    textAlign: "center",
    color: "#3a4047",
    marginTop:hp('1%')
  },
  image: {
    height: hp('120%'), // 70% of height device screen
    width: wp('100%'),   // 80% of width device screen
    // justifyContent: "center",
    alignItems: "center",
    // justifyContent: "center",
  },
  form: {
    flexDirection: 'row',
    marginTop: 10,
    paddingBottom: 5
  },
});