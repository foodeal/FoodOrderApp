import React, { useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, Linking, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  useTheme
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Iconn from 'react-native-vector-icons/Ionicons';
import config from '../config.js'
import Dialog from "react-native-dialog";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { AuthContext } from './context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableRipple } from "react-native-paper";
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import en from '../model/local_en.json'
import Toast from 'react-native-simple-toast';

const Profile = ({ navigation, token }) => {


  //this function related to share button
    /////////////////////////////////////
  const myCustomShare = async () => {
    if (Platform.OS) {
      const shareOptions = {
        message: `Bonjour, je vous invite à télécharger Foodealz pour récupérer vos plats et produits préférées en économisant de l'argent` + 'https://onelink.to/qngd9j',
        // urls: [files.image1, files.image2]
      }
      try {
        await Share.open(shareOptions);
        // console.log(JSON.stringify(ShareResponse));
      } catch (error) {
        console.log('Error => ', error);
      }
    } else {
      const shareOptions = {
        message: `Bonjour, je vous invite à télécharger Foodealz pour récupérer vos plats et produits préférées en économisant de l'argent ` + 'https://play.google.com/store/apps/details?id=com.foodealz&hl=fr',
        // url: logo,
        // // urls: [files.image1, files.image2]
      }
      try {
        await Share.open(shareOptions);
      } catch (error) {
        console.log('Error => ', error);
      }
    }
  };
  /////////////////////////////////////



  const [somme, setSomme] = React.useState(0)
  const [loading, setLoading] = React.useState(true);
  const [lengh, setLengh] = React.useState(0)
  // const { LoginToContinu } = React.useContext(AuthContext);
  const { signOut, LoginToContinu } = React.useContext(AuthContext);

  const [data, setData] = React.useState({
    error: '',
    data: [],
    favorite: [],
    reserved: [],
    coupon: [],
  });
  const handleoptionOK = () => {
    LoginToContinu()
  }

  useEffect(() => {
    if (token !== null) {
      setTimeout(async () => {
        let user_id;
        user_id = null;
        try {
          user_id = await AsyncStorage.getItem('userid');
        } catch (e) {
          console.log(e);
        }
        const isFocused = navigation.isFocused();

        if (isFocused) {
          getData(parseInt(user_id))
        }
        const navFocusListener = navigation.addListener('focus', () => {
          getData(parseInt(user_id))
        });

        return navFocusListener

      }, 500);
    } else {
      const isFocused = navigation.isFocused();
      if (isFocused) {
        showDialogguest()
      }
      const navFocusListener = navigation.addListener('focus', () => {
        showDialogguest()
      });
      return navFocusListener

    }
  }, [navigation]);

  const getData = async (id) => {
    const url = `${config.url}/users/${id}`;
    Promise.all([
      await fetch(url)
        .then(res => res.json())
        .then(res => {
          setData({
            ...data,
            data: res,
            favorite: res.user_restaurant_preferences,
            reserved: res.reserved_deal,
            coupon: res.coupon,
            error: res.error || null,
          });
          setLoading(false)
          let sum = res.coupon.reduce((a, v) => a = a + v.earned_money, 0).toFixed(2)
          setSomme(sum)
          setLengh(data.reserved.length)
          // console.log(sum)
          // console.log(Coupon.reduce((a,v) =>  a = a + v.earned_money , 0 ))    
        })
        .catch(error => {
          setData({
            ...data,
            error: 'Error Loading content',
          })
          setLoading(false)
        })
    ])
  };

  const Fbcall = () => {
    Linking.openURL('fb://page/109398583876856');
  };
  const IGcall = () => {
    Linking.openURL('http://instagram.com/_u/foodealztn');
  };
  const Webcall = () => {
    Linking.openURL('https://foodealz.com/');
  };
  const favoritecall = () => {
    navigation.navigate("Favorite", { itemData: data.favorite })
  };
  const supportcall = () => {
    navigation.navigate("Support")
    hideMenu()
  }
  const { colors } = useTheme();
  const [menu, setMenuReff] = React.useState(null);

  const [visible, setVisible] = React.useState(false);
  const [visibleguest, setVisibleguest] = React.useState(false);

  const showDialog = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const showDialogguest = () => {
    setVisibleguest(true);
  };

  const handleCancelguest = () => {
    setVisibleguest(false);
  };
  const setMenuRef = ref => {
    setMenuReff(ref);
  };

  const hideMenu = () => {
    menu.hide();
  };

  const showMenu = () => {
    menu.show();
  };
  const controler = () => {
    signOut();
  }

  const _hidedialog = () => {
    setdata({ isvisible: false })
  };

  const renderguest = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Image source={require('../assets/img-denied.png')} style={{ width: wp('52%'), height: hp('25%'), marginBottom: hp('2%') }} />
        <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: hp("1%") }}>Access denied</Text>
        <Text style={{ width: wp('60%'), textAlign: 'center', color: '#686663' }}>You are logged in as a guest. Please log in to view this page</Text>
      </View>
      <Dialog.Container visible={visibleguest}>
            <Dialog.Title style={{ fontWeight: 'bold' }}>{en.BUTTON_CONNECT}</Dialog.Title>
            <Dialog.Description>
                {en.MUST_CONNECT}
            </Dialog.Description>
            <Dialog.Button color='#36b3c9' bold={true} label="Cancel" onPress={handleCancelguest} />
            <Dialog.Button color='#36b3c9' bold={true} label="Ok" onPress={handleoptionOK} />
        </Dialog.Container>
    </View>
  )
  // Function called when user presson delete account button
  /////////////////////////////////////
  const deleteuser = () => {
    axios
      .delete(`${config.url}/users/${data.data.user_id}`)
      .then(res => { if (res.data == 'User Deleted!') { signOut(), _hidedialog } })
      .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
  }
  /////////////////////////////////////


  if (loading && token !== null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Bubbles size={10} color="#36b3c9" />
      </View>
    )
  } else if (token == null) {
    return (
      renderguest()
    )
  }
  else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: "space-between", height: hp('7%'), borderBottomColor: '#b4b4b4b4', borderBottomWidth: 0.2 }}>
          <View style={{ marginLeft: wp('2%'), marginTop: hp('1%') }}>
            <Icon.Button
              name="account-edit"
              size={25}
              backgroundColor={'#fff'}
              color={colors.text}
              onPress={() => navigation.navigate('EditProfile', { itemData: data.data })}
            />

          </View>
          <View style={{ marginLeft: wp('2%'), marginTop: hp('1%') }}>
            <Menu
              ref={setMenuRef}
              button={
                <Iconn.Button
                  name="settings"
                  size={25}
                  backgroundColor={'#fff'}
                  color={colors.text}
                  onPress={showMenu}
                />
              }>
              <MenuItem onPress={supportcall}>Support</MenuItem>
              <MenuItem onPress={() => { showDialog() }}>Delete account</MenuItem>
              <Dialog.Container visible={visible}>
                <Dialog.Title style={{ fontWeight: 'bold' }}>Delete account</Dialog.Title>
                <Dialog.Description>
                Do you want to delete this account?
                  </Dialog.Description>
                <Dialog.Button color='#36b3c9' bold={true} label="Cancel" onPress={handleCancel} />
                <Dialog.Button color='#36b3c9' bold={true} label="Ok" onPress={deleteuser} />
              </Dialog.Container>
              <MenuDivider />
              <MenuItem onPress={controler}>Logout</MenuItem>
            </Menu>
          </View>
        </View>
        <ScrollView style={{ backgroundColor: 'white' }}>

          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              {data.data.image == null ?
                <Avatar.Image
                  source={require("../assets/avatar.png")}
                  size={80}
                />
                :
                <Avatar.Image
                  source={{ uri: data.data.image }}
                  size={80}
                />
              }

              <View style={{ marginLeft: 20 }}>
                <Title style={[styles.title, {
                  marginTop: 15,
                  marginBottom: 5,
                }]}>{data.data.username}</Title>
                <Caption style={styles.caption}>@{data.data.firstname}</Caption>
              </View>
            </View>
          </View>

          <View style={styles.userInfoSection}>
            <View style={styles.row}>
              <Icon name="map-marker-radius" color="#777777" size={20} />
              <Text style={{ color: "#777777", marginLeft: 20 }}>Tunis, Tunisie</Text>
            </View>
            <View style={styles.row}>
              <Icon name="phone" color="#777777" size={20} />

              <Text style={{ color: "#777777", marginLeft: 20 }}>{data.data.phone != null ? data.data.phone : 'XXXXXXXX'}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="email" color="#777777" size={20} />
              <Text style={{ color: "#777777", marginLeft: 20 }}>{data.data.mail}</Text>
            </View>
          </View>

          <View style={styles.infoBoxWrapper}>
            <View style={[styles.infoBox, {
              borderRightColor: '#dddddd',
              borderRightWidth: 1
            }]}>
              <Title>{somme} $</Title>
              <Caption>gain</Caption>
            </View>
            <View style={[styles.infoBox, {
              borderRightColor: '#dddddd',
              borderRightWidth: 1
            }]}>
              <Title>{data.coupon.length}</Title>
              <Caption>Bassinet saved</Caption>
            </View>
            <View style={styles.infoBox}>
              <Title>{(data.coupon.length * 0.1).toPrecision(2)}</Title>
              <Caption>Don</Caption>
            </View>
          </View>

          <View style={styles.menuWrapper}>
            <TouchableRipple onPress={favoritecall}>
              <View style={styles.menuItem}>
                <Icon name="heart-outline" color="#36b3c9" size={25} />
                <Text style={styles.menuItemText}>My favourites</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={myCustomShare}>
              <View style={styles.menuItem}>
                <Icon name="share-outline" color="#36b3c9" size={25} />
                <Text style={styles.menuItemText}>Invite friends</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={IGcall}>
              <View style={styles.menuItem}>
                <Iconn name="ios-logo-instagram" color="#36b3c9" size={25} />
                <Text style={styles.menuItemText}>Follow us on Instagram</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={Fbcall}>
              <View style={styles.menuItem}>
                <Iconn name="ios-logo-facebook" color="#36b3c9" size={25} />
                <Text style={styles.menuItemText}>Follow us on Facebook</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={Webcall}>
              <View style={styles.menuItem}>
                <Icon name="web" color="#36b3c9" size={25} />
                <Text style={styles.menuItemText}>Visit our website</Text>
              </View>
            </TouchableRipple>
          </View>
        </ScrollView></SafeAreaView>
    );
  }
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: hp('13%'),
  },
  infoBox: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});
