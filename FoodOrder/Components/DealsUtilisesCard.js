import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity } from "react-native-gesture-handler";


const DealsUtilisesCard = ({ itemData, navigation }) => {

    return (
        <SafeAreaView style={{ height: hp('12%'), width: wp('68%'), marginLeft: wp('0%'), marginTop: hp('0.5%'), borderRadius: 15 }}>
            <View style={{ height: null, marginTop: hp('2%'), marginLeft: wp('1%'), marginRight: wp('3%'), borderRadius: 8, marginBottom: hp('1%'), flexDirection: 'row' }} >
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate("VaucherScreen", { itemData: itemData, code: itemData.code })}>
                    <View style={styles.overlay}>
                        <Image source={{ uri: itemData.image }}
                            style={{ width: wp('27%'), height: hp('10%'), resizeMode: 'cover', borderRadius: 8 }}
                        />
                    </View>
                    <View style={{ height: null, width: wp('38%'), marginTop: hp('2%'), marginLeft: wp('1%') }}>
                        <Text numberOfLines={1} style={{ fontSize: 14, marginLeft: wp('0%'), marginBottom: hp('1%'), color: '#000', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-1%') }}>{itemData.description}</Text>
                        <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('1%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>{itemData.name}</Text>
                        <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('1%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>Quantity: {itemData.nbre}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default DealsUtilisesCard;

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
        backgroundColor: "#36b3c9",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 5,
        marginLeft: wp('2%')
    },
    connectbtnd: {
        height: hp('8%'), // 70% of height device screen
        width: null,
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#36b3c9",
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
    // overlay: {
    //     // position: 'absolute',
    //     top: 0,
    //     right: 0,
    //     left: 0,
    //     marginBottom: hp('1%'),
    //     backgroundColor: 'black',
    //     opacity: 0.3,
    //     borderRadius: 8,
    //     // bottom:hp('1%'),
    //     width: wp('27%'), height: hp('10%')
    // },
});