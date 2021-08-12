import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView, Dimensions
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DealsExpiredCard = ({ navigation, itemData }) => {

    return (
        <SafeAreaView style={{ height: hp('13%'), width: wp('90%'), marginLeft: wp('2%'), marginTop: hp('1%'), borderRadius: 15 }}>
            <View style={{ height: hp('13%'), marginTop: hp('2%'), marginLeft: wp('3%'), marginRight: wp('3%'), borderRadius: 8, marginBottom: hp('1%'), flexDirection: 'row' }} >
                <View style={{ marginTop: hp('-0.5%') }}>
                    <View style={styles.overlay}>
                        <Image source={{ uri: itemData.image }}
                            style={{ width: wp('27%'), height: hp('12%'), resizeMode: 'cover', borderRadius: 8 }}
                        />
                    </View>
                </View>
                <View style={{ height: hp('13%'), width: wp('60%'),marginTop:hp('-1%'),marginLeft:wp('2%') }}>
                    <Text numberOfLines={1} style={{ fontSize: 15, marginLeft: wp('0.5%'), marginBottom: hp('1%'), color: '#000', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-1%') }}>{itemData.description}</Text>
                    <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('3%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>{itemData.name}</Text>
                    <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('3%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>Pattern: {itemData.motif}</Text>
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
        backgroundColor: "#00CED1",
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
        width: wp('27%'), height: hp('12%')
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