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
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import config from '../config.js'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import en from '../model/local_en.json'

const DealsActifsCard = ({ itemData, navigation }) => {

    const [data, setData] = React.useState({
        error: '',
        data: [],
        reserved: [],
        datadata: [],
        userid: null,
        motif: ''
    });
    const [isvisible, setIsVisible] = React.useState(false);

    const showDialog = () => {
        setIsVisible(true);
    };
    const handleCancel = () => {
        setIsVisible(false);
    };

    const MotifInputChange = (val) => {
        setData({
            ...data,
            motif: val
        });
    }
    const onFinich = () => {
        if (data.motif == '') {
            Toast.show('Veuillez Choisir le motif de votre Annulation')
        }
        else {
            axios
                .put(`${config.url}/reservedCouponUpdate/${itemData.key}`, {
                    type: 'expire',
                    motif: data.motif
                })
                .then(res => handleCancel(),Toast.show("Your Reservation has been canceled! Please refresh the page to remove it from the list"))
                .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
        }
    }

    return (
        <SafeAreaView style={{ height: hp('12%'), width: wp('68%'), marginLeft: wp('0%'), marginTop: hp('0.5%'), borderRadius: 15 }}>
            <View style={{ height: null, marginTop: hp('2%'), marginLeft: wp('1%'), marginRight: wp('3%'), borderRadius: 8, marginBottom: hp('1%'), flexDirection: 'row' }} >
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate("VaucherScreen", { itemData: itemData,code: itemData.code })}>
                    <Image source={{ uri: itemData.image }}
                        style={{ width: wp('27%'), height: hp('10%'), resizeMode: 'cover', borderRadius: 8, bottom: hp('1%'), marginTop: hp('1%') }}
                    />
                    <View style={{ height: null, width: wp('38%'), marginTop: hp('1.5%'), marginLeft: wp('1%') }}>
                        <Text numberOfLines={1} style={{ fontSize: 14, marginLeft: wp('0.5%'), marginBottom: hp('1%'), color: '#000', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-1%') }}>{itemData.description}</Text>
                        <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('2%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>{itemData.name}</Text>
                        <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('2%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>Quantity: {itemData.nbre}</Text>
                    </View>
                </TouchableOpacity>
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
        backgroundColor: "#00CED1",
        marginLeft: wp('5%'),
        position: 'absolute',
        marginTop: hp('5%'),
        // left: 4,
        borderRadius: 4

    },
    connectbtnS: {
        height: hp('4%'), // 70% of height device screen
        width: wp('25%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "red",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 5,
        marginLeft: wp('1%'),
        marginTop: hp('1%')
    },
    btntext: {
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 22,
        color: '#fff'
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
        backgroundColor: "#00CED1",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 5,
        marginLeft: wp('2%')
    },

    connectbtnn: {
        height: hp('7%'), // 70% of height device screen
        width: wp('60%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#00CED1",
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