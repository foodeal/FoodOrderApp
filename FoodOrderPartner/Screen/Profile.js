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
import config from '../config.js';
import Dialog from "react-native-dialog";
import { AuthContext } from '../components/context';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableRipple } from "react-native-paper";
import { clockRunning } from 'react-native-reanimated';

const Profile = ({ navigation, token }) => {

  const [somme, setSomme] = React.useState(0)
  const [loading, setLoading] = React.useState(true);
  const [lengh, setLengh] = React.useState(0)
  // const { LoginToContinu } = React.useContext(AuthContext);
  const [fetched, setFetched] = React.useState(false);
  const [data, setData] = React.useState({
    error: '',
    data: [],
    favorite: [],
    reserved: [],
    vendu: null,
    deal:[],
    CA : null
  });


  const { signOut } = React.useContext(AuthContext);
  const handleoptionOK = () => {
    LoginToContinu()
  }

  useEffect(() => {
    setTimeout(async () => {
      let user_id;
      user_id = null;
      try {
        user_id = await AsyncStorage.getItem('userid');
      } catch (e) {
        console.log(e);
      }
      const ac = new AbortController();
      const isFocused = navigation.isFocused();

      if (isFocused) {
        getData(parseInt(user_id))
      }
      const navFocusListener = navigation.addListener('focus', () => {
        getData(parseInt(user_id))
      });
      return () => navFocusListener,ac.abort();

    }, 200);
  }, [navigation]);

  const getData = async (id) => {
    const url = `${config.url}/restaurants/${id}`;
    Promise.all([
      await fetch(url)
        .then(res => res.json())
        .then(res => {
          console.log(res.logourl);
          setData({
            ...data,
            data: res,
            deal: res.dealScheduled,
            vendu: res.coupon.reduce((a, v) => a = a + (v.nbre_coupons), 0),
            CA: res.coupon.reduce((a, v) => a = a + (v.nbre_coupons * v.deal_scheduled.deals.PriceAfterDiscount), 0).toFixed(1),
            error: res.error || null,
          });
          setLoading(false)  
        })
        .catch(error => {
          setData({
            ...data,
            error: 'Error Loading content',
          })
          setLoading(false)
        })
    ]).then(() => setFetched(true))
      .catch(ex => console.error(ex));  

  };


  const Fbcall = () => {
    // Linking.openURL('fb://page/XXXXXXXX');
  };
  const IGcall = () => {
    // Linking.openURL('http://instagram.com/_u/XXXXXXXx');
  };
  const Webcall = () => {
    // Linking.openURL('https://XXXXXXXX.com/');
  };
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
    hideMenu()
  }


  const _hidedialog = () => {
    setdata({ isvisible: false })
  };

  const deleteuser = () => {
    axios
      .delete(`${config.url}/users/${data.data.user_id}`)
      .then(res => { if (res.data == 'User Deleted!') { _hidedialog } })
      .catch(err => Toast.show("Please check your connection!"));
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: "space-between", height: hp('6%'), borderBottomColor: '#b4b4b4b4', borderBottomWidth: 0.2 }}>
        <View style={{ marginLeft: wp('2%'), marginTop: hp('0') }}>
          <Icon.Button
            name="account-edit"
            size={25}
            backgroundColor={'#fff'}
            color={colors.text}
            onPress={() => { navigation.navigate('EditProfile', { itemData: data.data }) }}
          />

        </View>
        <View style={{ marginLeft: wp('2%'), marginTop: hp('0%') }}>
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
            {/* <Dialog.Container visible={visible}>
              <Dialog.Title style={{ fontWeight: 'bold' }}>Delete account</Dialog.Title>
              <Dialog.Description>
              Do you want to delete this account?
                  </Dialog.Description>
              <Dialog.Button color='#36b3c9' bold={true} label="Cancel" onPress={handleCancel} />
              <Dialog.Button color='#36b3c9' bold={true} label="Ok" onPress={deleteuser} />
            </Dialog.Container> */}
            <MenuDivider />
            <MenuItem onPress={() => { controler() }}>Logout</MenuItem>
          </Menu>
        </View>
      </View>
      <ScrollView style={{ backgroundColor: 'white' }}>

        <View style={styles.userInfoSection}>
          <View style={{ flexDirection: 'row', marginTop: 15 }}>
            {data.data.logourl == null ?
              <Avatar.Image
                source={require("../assets/avatar.png")}
                size={80}
              />
              :
              <Avatar.Image
                source={{ uri: data.data.logourl }}
                size={80}
              />
            }

            <View style={{ marginLeft: 20 }}>
              <Title style={[styles.title, {
                marginTop: 15,
                marginBottom: 5,
              }]}>{data.data.name}</Title>
              <Caption style={styles.caption}>@{data.data.name}</Caption>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="map-marker-radius" color="#777777" size={20} />
            <Text style={{ color: "#777777", marginLeft: 20 }}>{data.data.address}</Text>
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
            <Title>{data.vendu}</Title>
            <Caption>Cart Sold</Caption>
          </View>
          <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }]}>
            <Title>{data.deal.length}</Title>
            <Caption>Offer(s)</Caption>
          </View>
          <View style={[styles.infoBox]}>
            <Title>{data.CA}</Title>
            <Caption>Turnover ($)</Caption>
          </View>
        </View>

        <View style={styles.menuWrapper}>
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
    width:hp('30%')
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
    width: '33.3%',
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
