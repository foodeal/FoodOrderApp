import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView, Dimensions
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import Dialog from "react-native-dialog";
import StarRating from 'react-native-star-rating';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import config from '../../config.js'

const DealsExpiredCard = ({ navigation, itemData }) => {
    const [isvisible, setIsVisible] = React.useState(false);
    const [rating, setRating] = React.useState(0);


    return (
        <SafeAreaView style={{ height: hp('12%'), width: wp('90%'), marginLeft: wp('2%'), marginTop: hp('0.5%'), borderRadius: 15 }}>
            <View style={{ height: null, marginTop: hp('2%'), marginLeft: wp('3%'), marginRight: wp('3%'), borderRadius: 8, marginBottom: hp('1%'), flexDirection: 'row' }} >
                <View style={{ flexDirection: 'row' }} onPress={() => { }}>
                    <View style={styles.overlay}>
                        <Image source={require("../../assets/aaa.jpg")}
                            style={{ width: wp('27%'), height: hp('10%'), resizeMode: 'cover', borderRadius: 8, bottom: hp('1%'), marginTop: hp('1%') }}
                        />
                    </View>
                    <View style={{ height: null, width: wp('10%'), marginTop: hp('4%'), marginLeft: wp('2%') }}>
                        <Text style={{ fontSize: 17, marginLeft: wp('0.5%'), marginBottom: hp('1%'), color: '#000', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-1%') }}>x4</Text>
                    </View>
                    <View style={{ height: null, width: wp('35%'), marginTop: hp('1%'), marginLeft: wp('2%') }}>
                        <Text numberOfLines={2} style={{ fontSize: 17, marginLeft: wp('0.5%'), marginBottom: hp('1%'), color: '#000', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-1%') }}>Couffin N°1</Text>
                        <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('4%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>ID Commande</Text>
                        <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('4%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>Methode de paiment</Text>

                    </View>
                </View>

                <View style={{ marginLeft: wp('2%'),marginTop: hp('4%') }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#b4b4b4' }}>17DT</Text>
                </View>

            </View>

        </SafeAreaView>
    );
}

export default DealsExpiredCard;

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
        marginTop: hp('2%'),
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
        backgroundColor: "red",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 5,
        marginLeft: wp('1%')
    },
    btntext: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 22,
        color: '#fff'
    },
    overlay: {
        // position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        marginBottom: hp('1%'),
        backgroundColor: 'black',
        opacity: 0.3,
        borderRadius: 8,
        // bottom:hp('1%'),
        width: wp('27%'), height: hp('10%')
    },
    connectbtnn: {
        height: hp('7%'), // 70% of height device screen
        width: wp('60%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "red",
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