import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import Dialog from "react-native-dialog";
import StarRating from 'react-native-star-rating';
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import config from '../../config.js'
import CountDown from 'react-native-countdown-component';
import moment from 'moment';

const DealsActifsCard = ({ navigation,itemData }) => {

    return (
        <SafeAreaView style={{ height: hp('12%'), width: wp('90%'), marginLeft: wp('1%'), marginTop: hp('0.5%'), borderRadius: 15 }}>
            <View style={{ height: null, marginTop: hp('2%'), marginLeft: wp('1%'), marginRight: wp('3%'), borderRadius: 8, marginBottom: hp('1%'), flexDirection: 'row' }} >
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() =>{}}>
                    <Image source={{uri: itemData.deal_scheduled.deals.imageurl}}
                        style={{ width: wp('24%'), height: hp('10%'), resizeMode: 'cover', borderRadius: 8, bottom: hp('1%'), marginTop: hp('1%') }}
                    />
                     <View style={{ height: null, width: wp('10%'), marginTop: hp('4%'), marginLeft: wp('1%'),flexDirection:'column',alignItems:'center' }}>
                        <Text style={{ fontSize: 14, marginLeft: wp('0.5%'), marginBottom: hp('1%'), color: '#000', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-1%') }}>Qty</Text>
                        <Text style={{ fontSize: 14, marginLeft: wp('0.5%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', marginTop: hp('-0.5%') }}>{itemData.nbre_coupons}</Text>
                    </View>
                    <View style={{ height: null, width: wp('35%'), marginTop: hp('3%'), marginLeft: wp('2%') ,alignItems:'center'}}>
                        <Text numberOfLines={2} style={{ fontSize: 14, marginLeft: wp('0.5%'), marginBottom: hp('1%'), color: '#36b3c9', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-1%') }}>{itemData.deal_scheduled.deals.description}</Text>
                        <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('1%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>Order ID {itemData.coupon_id}</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ marginLeft: wp('3%'),marginTop: hp('3%'), flexDirection:'column', height: null,alignItems:'center'}}>
                   <Text style={{fontSize:14, fontWeight: 'bold', color:'black'}}>Status:</Text>
                   <Text style={{fontSize:12, color:'#36b3c9'}}>Paid</Text>
                </View>

            </View>

        </SafeAreaView>
    );
}

export default DealsActifsCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    economie: {
        width: wp('10%'),
        height: hp('10%'),
        backgroundColor: "#2dbe36",
        marginLeft: wp('5%'),
        position: 'absolute',
        marginTop: hp('5%'),
        // left: 4,
        borderRadius: 4

    },
    teconomie: {
        textAlign: "center",
        marginTop: 6,
        color: '#ffffff',
        fontFamily: "Rubik-Medium",
        fontSize: 13,
    },
    text: {
        width: wp('70%'),
        height: hp('20%'),
        // marginLeft:20,
        position: 'absolute',
        lineHeight: 24,
        top: 60,
        left: 20
    },
    textt: {
        marginTop: 6,
        color: '#fff',
        fontFamily: "Rubik-Medium",
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "left",
        lineHeight: 24
    },
    foot: {
        flexDirection: 'row',
        width: wp(('50%')),
        height: hp('5%'),
        position: 'absolute',
        top: hp('17%'),
        left: wp('4%'),
        // justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7
    },
    footer: {
        marginTop: hp('1%'),
        color: '#fff',
        fontFamily: "Rubik-Regular",
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'justify',
        lineHeight: 24

    },
    connectbtn: {
        height: hp('8%'), // 70% of height device screen
        width: null,
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#2dbe36",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 5,
        marginLeft: wp('2%')
    },
    btntext: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
        color: '#fff'
    },
    connectbtnn: {
        height: hp('7%'), // 70% of height device screen
        width: wp('60%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#2dbe36",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 5,
        marginTop: hp('5%')
    },
    btntextt: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
        color: '#fff',
        letterSpacing: 0.08
    },
});