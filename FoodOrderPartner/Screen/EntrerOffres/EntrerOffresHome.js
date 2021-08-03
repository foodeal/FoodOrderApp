import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import Fontisto from 'react-native-vector-icons/Fontisto';

const EntrerOffresHome = ({ navigation }) => {

    useEffect(() => {
        setTimeout(async () => {
            let dataa;
            dataa = [];
            const isFocused = navigation.isFocused();
            if (isFocused) {
                try {
                    await AsyncStorage.setItem('ScannItem', JSON.stringify([]));
                    await AsyncStorage.setItem('listCouffin', JSON.stringify([]));
                    await AsyncStorage.setItem('listArticle', JSON.stringify([]));
                    await AsyncStorage.setItem('checkin', JSON.stringify([]));
                    await AsyncStorage.setItem('validation', JSON.stringify([]));
                    await AsyncStorage.setItem('days', JSON.stringify([]));
                    await AsyncStorage.setItem('data', JSON.stringify([]));
                } catch (e) {
                    console.log(e);
                } console.log('focused section');
            }
            let navFocusListener = navigation.addListener('focus', async () => {
                try {
                    await AsyncStorage.setItem('ScannItem', JSON.stringify([]));
                    await AsyncStorage.setItem('listCouffin', JSON.stringify([]));
                    await AsyncStorage.setItem('listArticle', JSON.stringify([]));
                    await AsyncStorage.setItem('checkin', JSON.stringify([]));
                    await AsyncStorage.setItem('validation', JSON.stringify([]));
                    await AsyncStorage.setItem('days', JSON.stringify([]));
                    await AsyncStorage.setItem('data', JSON.stringify([]));
                } catch (e) {
                    console.log(e);
                } console.log('listener section');
            });
            return navFocusListener

        }, 500);
    }, [navigation])

    return (
        <View style={styles.Container}>
            <View style={{ height: hp('10%'), backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'grey', borderBottomWidth: 0.3 }}>
                <Text style={{ marginLeft: wp('3%'), color: 'black', top: hp('5%'), fontSize: 22, fontWeight: 'bold' }}>
                Add Baskets
                </Text>
            </View>
            <View style={styles.button}>
                <Image source={require('../../assets/addd.jpg')} style={{ width: wp('70%'), height: hp('40%'), marginBottom: hp('2%') }} />
                <View style={styles.button1}>
                    <Button style={styles.connectbtn} mode='outlined' onPress={() => { navigation.navigate('Etape1') }}>
                        <Fontisto name='shopping-basket-add' size={20} color={"white"} />
                        <Text style={styles.btntext}>Add</Text>
                    </Button>
                </View>
            </View>
        </View>
    )
}

export default EntrerOffresHome;

const styles = StyleSheet.create({
    Container: {
        backgroundColor: "white",
        flex: 1,

        // height: null
    },
    button: {
        backgroundColor: "white",
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center'

        // height: null
    },
    connectbtn: {
        height: hp('5%'), // 70% of height device screen
        width: wp('45%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#36b3c9",
        justifyContent: "center",
        alignContent: "center",
        marginLeft: wp('1%'),
        borderRadius: 5,
        marginTop: hp('1%')
    },
    btntext: {
        fontSize: 14,
        fontWeight: '600',
        // lineHeight: 18,
        color: '#fff',
    },
    button1: {
        marginBottom: hp('5%')
    },
    button2: {
        marginTop: hp('5%')
    }
})

