import React, { useState, useEffect } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { StyleSheet } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import Profile from './Profile'
import ScanScreen from './ScanScreen'
import DealAE from './MesReservations/DealsAE';
import OffresA from './MesOffres/OffresA';
import EntrerOffresHome from './EntrerOffres/EntrerOffresHome';

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = ({route}) => {
  return (
    <Tab.Navigator initialRouteName={route.params.name} activeColor="#36b3c9" inactiveColor="grey" shifting={false} barStyle={{ backgroundColor: 'white' }} >
      <Tab.Screen
        name="Scan"
        children={(navigation) => <ScanScreen {...navigation}  />}
        options={{
          tabBarLabel: 'Scan',
          tabBarColor: '#fff',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="qr-code-scanner" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="My Baskets"
        children={(navigation) => <OffresA {...navigation} />}
        options={{
          tabBarLabel: 'My Baskets',
          tabBarColor: '#fff',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="shopping-basket" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Booking"
        children={(navigation) => <DealAE {...navigation} />}
        options={{
          tabBarLabel: 'Booking',
          tabBarColor: '#fff',
          tabBarIcon: ({ color }) => (
            <Feather name="bookmark" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Enter Bassinet"
        // children={DealAE}
        children={(navigation) => <EntrerOffresHome {...navigation} />}
        options={{
          tabBarLabel: 'Add',
          tabBarColor: '#fff',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="add-shopping-cart" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        // component={}
        children={(navigation) => <Profile {...navigation} />}
        options={{
          tabBarLabel: 'Account',
          tabBarColor: '#fff',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-alert-outline" color={color} size={29} />
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