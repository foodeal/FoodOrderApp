import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const Etape3Card = ({ itemData, navigation }) => {
  
    const [data, setData] = React.useState({
        nbre: 0,
        date: null,
        payment: '',
        color: '#b4b4b4',
        colorplus: '#36b3c9',
        birthday: '',
        sexe: '',
        quantité: itemData.qt,
        fin: itemData.dlc == "" ? "Today":itemData.dlc
    });


    return (
        <SafeAreaView style={{ height: hp('19%'), width: wp('100%'), marginTop: hp('1%'), backgroundColor: '#ECEAEA' }}>
            <View style={{ marginLeft: wp('5%'), marginTop: hp('2%') }}>
                <View style={{ flexDirection: 'row', width: wp('100%') }}>
                    <View style={{ height: null, width: wp('70%'), marginTop: hp('2%'), marginLeft: wp('0%') }}>
                        <Text numberOfLines={2} style={{ fontSize: 18, marginLeft: wp('4%'), marginBottom: hp('1%'), color: '#36b3c9', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>Basket : {itemData.name}</Text>
                    </View>
                    <View style={{ width: wp('20%'), flexDirection: 'row', marginLeft: wp('1%'), marginTop: hp('1%'), }} >
                        <Text style={{ fontFamily: "Roboto-Bold", fontSize: 20, lineHeight: 30, color: '#000', fontWeight:'bold' }}>Qty:</Text>
                        <Text style={{ fontFamily: "Roboto-Bold", fontSize: 20, lineHeight: 30, color: '#000' }}>{itemData.qt}</Text>
                    </View>
                </View>

            </View>
            <View style={{  marginTop: hp('1%'),justifyContent:'center',alignItems:'center' }}>
                <View style={{ marginLeft: wp('3%'), marginTop: hp('1%'), flexDirection:'row' }}>
                    <Text style={{ fontFamily: "Roboto-Bold", fontSize: 20, lineHeight: 30, color: 'black', fontWeight: 'bold' }}>Availability: </Text>
                    <Text style={{fontFamily: "Roboto-Bold", fontSize: 17,lineHeight: 30, color: 'black',}}>{itemData.start} - {data.fin}</Text>

                </View>
            </View>


        </SafeAreaView>
    );
}

export default Etape3Card;

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
    TextInputp: {
        width: wp('20%'),
        height: hp('5%'),
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#b4b4b4',
        marginTop: hp('1%'),
        fontSize: 13,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});