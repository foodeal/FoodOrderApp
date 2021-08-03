import React, { useRef } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import axios from 'axios';
import config from '../config.js'
import Toast from 'react-native-simple-toast';

const Verif = ({ navigation }) => {

  const [data, setData] = React.useState({
    num1: '',
    num2: '',
    num3: '',
    num4: '',
    code: ''
  });
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();

  const handlenum1 = (val) => {
    setData({
      ...data,
      num1: val
    });
  }
  const handlenum2 = (val) => {
    setData({
      ...data,
      num2: val
    });
  }
  const handlenum3 = (val) => {
    setData({
      ...data,
      num3: val
    });
  }
  const handlenum4 = (val) => {
    setData({
      ...data,
      num4: val
    });
  }

  const onVerif = () => {
    let num = data.num1 + data.num2 + data.num3 + data.num4

    if (data.num1 == "" || data.num2 == "" || data.num3 == "" || data.num4 == "") {
      Toast.show('Il faut remplir tous les champs')
    }
    else {
      setData({
        ...data,
        code: num
      })
    }
  }

  const Verify = () => {
    if (data.code != "") {
      axios
        .post(`${config.url}/verify`, {
          code: data.code
        })
        .then(res => {
          if(res.data == 'Account activated') {Toast.show('Account created, please log in');navigation.navigate('SignInScreen')}
          else {
            Toast.show('Check the code you entered')}
          })
        .catch(err => Toast.show("Please check your connection!"));
    }
  }


  return (
    <View style={styles.container}>


      <View style={styles.textcontainer}><Text style={styles.textblack}>We just sent you a verification code on your email, please enter it here!</Text>
      </View>

      <View style={styles.inputscontainer}>
        <TextInput
          style={styles.TextInput}
          placeholder="-"
          placeholderTextColor="white"
          underlineColorAndroid="transparent"
          onChangeText={(val) => { handlenum1(val); if (val) ref_input2.current.focus() }}
          maxLength={1}
          blurOnSubmit={false}
          returnKeyType='next'
          keyboardType={'numeric'}


        />
        <TextInput
          ref={ref_input2}
          style={styles.TextInput}
          placeholder="-"
          placeholderTextColor="white"
          underlineColorAndroid="transparent"
          onChangeText={(val) => { handlenum2(val); if (val) ref_input3.current.focus() }}
          maxLength={1}
          blurOnSubmit={false}
          returnKeyType='next'
          keyboardType={'numeric'}


        />
        <TextInput
          style={styles.TextInput}
          ref={ref_input3}
          placeholder="-"
          placeholderTextColor="white"
          underlineColorAndroid="transparent"
          onChangeText={(val) => { handlenum3(val); if (val) { ref_input4.current.focus() } }}
          maxLength={1}
          blurOnSubmit={false}
          returnKeyType='next'
          keyboardType={'numeric'}

        />
        <TextInput
          style={styles.TextInput}
          ref={ref_input4}
          placeholder="-"
          placeholderTextColor="white"
          underlineColorAndroid="transparent"
          onChangeText={(val) => handlenum4(val)}
          maxLength={1}
          keyboardType={'numeric'}

        />


      </View>


      <Button style={styles.button} mode="contained" onPress={() => {onVerif();Verify()}}>
      Check code
  </Button>


    </View>
  )
}

export default Verif;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    margin: 10,

  },
  logoStyle: {
    height: 90,
    width: 242
  },

  textcontainer: {
    height: 23,
    width: 329
  },
  TextInput: {
    backgroundColor: '#0095ff',
    borderRadius: 60,
    height: 65,
    paddingLeft: 6,
    width: 65,
    fontSize: 28,
    textAlign: 'center',
    color: "#fff",

  },
  button: {
    width: 329,
    height: 50,
    fontFamily: 'Rubik-Regular',
    alignSelf: 'center',
    backgroundColor: "#36b3c9",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 50

  },
  textblack: {
    fontFamily: 'Rubik-Bold',
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    color: "#3a4047",
    fontWeight: "bold",
    marginTop: 20

  },

  inputscontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 340,
    marginTop: 70
  },
});