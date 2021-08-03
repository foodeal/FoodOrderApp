import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    SafeAreaView,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import config from '../config.js'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { List, ListItem, Avatar } from "react-native-elements";
import StarRating from './StarRating';

const Support = ({ route, navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: hp('7%'), backgroundColor: 'transparent', borderBottomColor: '#b4b4b4b4', borderBottomWidth: 0.2 }}>
                <Icon name="chevron-back-outline" style={{ paddingLeft: wp('1%'), color: 'black', top: hp('2%') }} size={30} onPress={() => { navigation.goBack() }} />
            </View>
            <Image
                //We are showing the Image from online
                source={config.logo}

                style={styles.logoStyle}

            />
            <Text style={{textAlign:'center',marginBottom:hp('4%'),opacity:0.3}}>Version: 1.0.0</Text>
            <ListItem bottomDivider style={{ backgroundColor: 'grey' }}>
                <Icon name="at-outline" color="black" size={20} />
                <ListItem.Content>
                    <ListItem.Title>Email</ListItem.Title>
                    <ListItem.Subtitle>hello@foodOrder.com</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
            <ListItem bottomDivider style={{ backgroundColor: 'grey' }}>
                <Feather color="black" size={20} name="phone-call" />
                <ListItem.Content>
                    <ListItem.Title>Phone</ListItem.Title>
                    <ListItem.Subtitle>+XXX XX XXX XXX</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
            <ListItem bottomDivider style={{ backgroundColor: 'grey' }}>
                <Icon name="location-sharp" color="black" size={20} />
                <ListItem.Content>
                    <ListItem.Title>Address</ListItem.Title>
                    <ListItem.Subtitle>XXXXXXXX</ListItem.Subtitle>
                    {/* <ListItem.Subtitle><StarRating ratings={item.rating} /></ListItem.Subtitle> */}
                </ListItem.Content>
            </ListItem>
            <ListItem bottomDivider style={{ backgroundColor: 'grey' }} onPress={()=>{}}>
                <Icon name="information-circle-sharp" color="black" size={20} />
                <ListItem.Content>
                    <ListItem.Title>Terms and conditions</ListItem.Title>
                    <ListItem.Subtitle>Terms of Sales</ListItem.Subtitle>
                    {/* <ListItem.Subtitle><StarRating ratings={item.rating} /></ListItem.Subtitle> */}
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem bottomDivider style={{ backgroundColor: 'grey' }} onPress={()=>{}}>
                <Icon name="lock-closed-sharp" color="black" size={20} />
                <ListItem.Content>
                    <ListItem.Title>Privacy Policy</ListItem.Title>
                    <ListItem.Subtitle>Confidentiality clauses</ListItem.Subtitle>
                    {/* <ListItem.Subtitle><StarRating ratings={item.rating} /></ListItem.Subtitle> */}
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        </SafeAreaView>

    );
}

export default Support;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    logoStyle: {
        alignSelf:'center',
        height:  Platform.OS === 'ios' ? hp('20%'): hp('25%'), // 70% of height device screen
        width: wp('85%'),
        marginTop:hp('5%'),
        marginBottom:hp('1%')
      },
});