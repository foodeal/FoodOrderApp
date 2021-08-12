import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  ScrollView
} from 'react-native';

import { useTheme } from 'react-native-paper';
import Iconn from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import config from '../config.js'
import { Modalize } from 'react-native-modalize';
// import ImagePicker from 'react-native-image-crop-picker';
import en from '../model/local_en.json'

const EditProfileScreen = ({ route, navigation }) => {

  const { colors } = useTheme();
  const [data, setData] = React.useState({
    data: route.params.itemData,
    photo: null,
  });
  const modalizeRef = React.useRef(null);
  const [mail, setMail] = useState(data.data.mail);
  const [lastname, setLastname] = useState(data.data.lastname);
  const [firstname, setFirstname] = useState(data.data.firstname);
  const [pays, setPays] = useState(data.data.pays);
  const [ville, setVille] = useState(data.data.ville);
  const [phone, setPhone] = useState(`${data.data.phone}`);
  const [image, setImage] = useState(data.data.image);


  // this function called when user press on update button 
  //////////////////////////////////
  const update = () => {
    if (mail == "" || lastname == "" || firstname == "" || pays == "" || ville == "" || phone == "") {
      Toast.show('Il faut remplir tous les champs')
    }
    else {
      axios
        .put(`${config.url}/users/${data.data.user_id}`, {
          mail: mail,
          lastname: lastname,
          firstname: firstname,
          pays: pays,
          ville: ville,
          phone: phone
        })
        .then(res => { if (res.data == 'User Updated!') { Toast.show('Your profile has been updated successfully') } })
        .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
    }
  }
  //////////////////////////////////

  return (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'ios' ? hp('10%') : hp('7%'), backgroundColor: 'white', elevation: 3 }}>
        <Iconn name="chevron-back-outline" style={{ paddingLeft: wp('4%'), color: 'black', marginTop: Platform.OS === 'ios' ? hp('6%') : hp('3%') }} size={30} onPress={() => { navigation.goBack() }} />
      </View>
      <ScrollView>
        <View style={{ margin: hp('3%') }}>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity>
              <View
                style={{
                  height: hp('13%'),
                  width: wp('90%'),
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {data.data.image == null ?
                  <ImageBackground
                    source={require("../assets/avatar.png")}
                    style={{ height: hp('15%'), width: wp('29%') }}
                    imageStyle={{ borderRadius: 15 }}>
                  </ImageBackground>
                  :
                  <ImageBackground
                    source={{ uri: image }}
                    style={{ height: hp('15%'), width: wp('29%') }}
                    imageStyle={{ borderRadius: 15 }}>
                  </ImageBackground>
                }
              </View>
            </TouchableOpacity>
            <Text style={{ marginTop: hp('2%'), fontSize: 18, fontWeight: 'bold' }}>
              {data.data.username}
            </Text>
          </View>

          <View style={styles.action}>
            <FontAwesome name="user-o" color={colors.text} size={20} />
            <TextInput
              placeholder="Lastname"
              placeholderTextColor="#666666"
              autoCorrect={false}
              onChangeText={value => setLastname(value)}
              value={lastname}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          <View style={styles.action}>
            <FontAwesome name="user-o" color={colors.text} size={20} />
            <TextInput
              placeholder="Firstname"
              placeholderTextColor="#666666"
              autoCorrect={false}
              onChangeText={value => setFirstname(value)}
              value={firstname}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          <View style={styles.action}>
            <Feather name="phone" color={colors.text} size={20} />
            <TextInput
              placeholder="Phone"
              placeholderTextColor="#666666"
              keyboardType="number-pad"
              autoCorrect={false}
              onChangeText={value => setPhone(value)}
              value={phone}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          <View style={styles.action}>
            <FontAwesome name="envelope-o" color={colors.text} size={20} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#666666"
              keyboardType="email-address"
              autoCorrect={false}
              onChangeText={value => setMail(value)}
              value={mail}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          <View style={styles.action}>
            <FontAwesome name="globe" color={colors.text} size={20} />
            <TextInput
              placeholder="Country"
              placeholderTextColor="#666666"
              autoCorrect={false}
              onChangeText={value => setPays(value)}
              value={pays}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          <View style={styles.action}>
            <Icon name="map-marker-outline" color={colors.text} size={20} />
            <TextInput
              placeholder="City"
              placeholderTextColor="#666666"
              autoCorrect={false}
              onChangeText={value => setVille(value)}
              value={ville}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          <TouchableOpacity style={styles.commandButton} onPress={() => { update() }}>
            <Text style={styles.panelButtonTitle}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>

  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  commandButton: {
    padding: hp('2%'),
    borderRadius: 10,
    backgroundColor: '#36b3c9',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#36b3c9',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  action: {
    flexDirection: 'row',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: hp('0.5%'),
  },
  actionError: {
    flexDirection: 'row',
    marginTop: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: wp('2%'),
    color: '#05375a',
  },
});
