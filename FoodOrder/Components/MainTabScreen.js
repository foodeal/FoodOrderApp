import React, { useState, useEffect } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreenn from './homePage/HomeScreenn';
import Profile from './Profile'
import Map from './Map'
import DealAE from './DealsAE';
import AsyncStorage from '@react-native-community/async-storage';
import en from '../model/local_en.json'

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = ({token,name,neww}) => {
  // const [locationn, setlocationn] = React.useState([]);
  // useEffect(() => {
  //   let location;
  //   location = [];
  //   AsyncStorage.getItem('location').then((value) => {
  //   console.log("ho",JSON.parse(value))
  //   location = value
  //   setlocationn(JSON.parse(location))
  // }); 
  // }, []);
// console.log("hi",token)
  return (
    <Tab.Navigator initialRouteName="Home" activeColor="#36b3c9" inactiveColor="grey" shifting={false} barStyle={{ backgroundColor: 'white' }} >
      <Tab.Screen
        name="Home"
        children={(navigation) => <HomeScreenn {...navigation} token={token} name={name} neww={neww} />}
        options={{
          tabBarLabel: en.BOTTOM_TAB_EXPLORER,
          tabBarColor: '#fff',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-compass-outline" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        children={(navigation) => <Map {...navigation}  token={token}/>}
        options={{
          tabBarLabel: en.BOTTOM_TAB_MAP,
          tabBarColor: '#fff',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-location-outline" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Deals"
        // children={DealAE}
        children={(navigation) => <DealAE {...navigation} token={token} />}
        options={{
          tabBarLabel: en.BOTTOM_TAB_RESERV,
          tabBarColor: '#fff',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-bookmark-outline" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        // component={}
        children={(navigation) => <Profile {...navigation} token={token} />}
        options={{
          tabBarLabel: en.BOTTOM_TAB_PROFIL,
          tabBarColor: '#fff',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-person-outline" color={color} size={28} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabScreen;

const styles = StyleSheet.create({
  bluetext: {
    color: "#0095ff",
    marginLeft: 35,
    marginTop: -47
  },
  placetext: {
    marginLeft: 39,
    marginTop: 3
  }
})