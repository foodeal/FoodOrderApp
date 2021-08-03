import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';


const MesOffresCard = ({ itemData }) => {

    let start = itemData.startingdate_hours.split(':')[0]
    let end = itemData.expirydate_hours.split(':')[0]
    let startmin = itemData.startingdate_hours.split(':')[1]
    let endmin = itemData.expirydate_hours.split(':')[1]
    let dlc = moment(itemData.deals.expirydate).format("DD/MM/YYYY")
   
    return (
        <SafeAreaView style={{ height: hp('15%'), width: wp('65%'), marginTop: hp('0.5%'), borderRadius: 15 }}>
            <View style={{ height: null, marginTop: hp('2%'),  marginRight: wp('2%'), borderRadius: 8, marginBottom: hp('1%'), flexDirection: 'row' }} >
                <View style={{ flexDirection: 'row', marginLeft:wp('1%') }} onPress={() => { }}>
                    <Image source={{uri: itemData.deals.imageurl}}
                        style={{ width: wp('25%'), height: hp('10%'), resizeMode: 'cover', borderRadius: 8, bottom: hp('1%'), marginTop: hp('3%') }}
                    />
                    <View style={{ height: null, width: wp('45%'), marginTop: hp('2%'), marginLeft: wp('-1%') }}>
                        <Text numberOfLines={1} style={{ fontSize: 13, marginLeft: wp('4%'), marginBottom: hp('1%'), color: '#36b3c9', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-1%') }}>{itemData.deals.description}</Text>
                        <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('4%'), marginBottom: hp('1%'), color: '#ff914d', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>of {start}h{startmin} to {end}h{endmin}</Text>
                        <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('4%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>Remaining quantity: {itemData.quantity - itemData.nbre_redeemed_deal} </Text>
                        <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('4%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>DLC: {dlc} </Text>
                    </View>
                </View>

                
            </View>

        </SafeAreaView>
    );
}

export default MesOffresCard;

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
        height: hp('4%'), // 70% of height device screen
        width: wp('26%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#2dbe36",
        justifyContent: "center",
        alignContent: "center",
        marginLeft: wp('1%'),
        borderRadius: 5,
    },
    connectbtnS: {
        height: hp('4%'), // 70% of height device screen
        width: null,
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#36b3c9",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 5,
        marginLeft: wp('0%'),
        width: wp('30%'),
        marginTop: hp('1%')
    },
    btntext: {
        fontSize: 12,
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