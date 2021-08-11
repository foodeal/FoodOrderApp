import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    TextInput,
    ScrollView
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity } from "react-native-gesture-handler";
import Dialog from "react-native-dialog";
import CheckBox from '@react-native-community/checkbox';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment, { now } from 'moment';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';


const Etape2Card = ({ itemData, navigation }) => {
    // console.log(itemData.qt)
    const [visible, setVisible] = React.useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dealrestant, setDealrestant] = React.useState(itemData.qt);
    const [data, setData] = React.useState({
        nbre: 0,
        date: null,
        payment: '',
        color: '#b4b4b4',
        colorplus: '#36b3c9',
        dlc: '',
        sexe: '',
        quantité: itemData.qt,
        fin: itemData.dlc == "" ? `Today` : itemData.dlc,
        minimumDate: new Date(),
    });

    const checkin = (newValue, text) => {
        if (newValue === true) {
            _updatecheckvalidation(text)
        } else {
            removeCheckvalidation(text)
        }
    }

  

    const updatedlc = async (fin, expiry) => {
        let response = await AsyncStorage.getItem('checkin');
        var listOfCheck = await JSON.parse(response) || [];
        const preitem = listOfCheck.filter(function (item) { return item.id === itemData.id });
        const postsItems = listOfCheck.filter(function (item) { return item.id !== itemData.id });
        postsItems.push({ "id": itemData.id, "partnerId": preitem[0].partnerId, "discount": preitem[0].discount, "description": preitem[0].description, 'name': preitem[0].name, 'image': preitem[0].image, 'qt': preitem[0].qt, "PriceBeforeDiscount": preitem[0].PriceBeforeDiscount, "PriceAfterDiscoun": preitem[0].PriceAfterDiscoun, "dlc": fin, "start": `Today`, startingDat: preitem[0].startingDat, expiryDat: expiry })
        await AsyncStorage.removeItem('checkin');
        await AsyncStorage.setItem('checkin', JSON.stringify(postsItems));
        // console.log(JSON.stringify(postsItems))
    }

    const _updatecheckvalidation = async (text) => {
        let response = await AsyncStorage.getItem('validation');//list de 3 éme étape
        var listofValidation = await JSON.parse(response) || [];//list de 3 éme étape
        let days = await AsyncStorage.getItem('days');
        var listOfDays = await JSON.parse(days) || [];
        let data = await AsyncStorage.getItem('data');
        var listOfData = await JSON.parse(data) || [];
        if (listOfData == []) {
            console.log('vide')
            var donner = [{ 'day': text }]
            listOfData.push({ "id": itemData.id, 'data': donner })
        } else {
            console.log('pliean')

            const preItem = listOfData.filter(function (item) { return item.id === itemData.id });
            if (preItem) {
                listOfData = listOfData.filter(function (item) { return item.id !== itemData.id });
                listOfData.push({ "id": itemData.id, 'data': donner })
            } else {
                var donner = [{ 'day': text }]
                listOfData.push({ "id": itemData.id, 'data': donner })
            }
        }
        await AsyncStorage.removeItem('data');
        await AsyncStorage.setItem('data', JSON.stringify(listOfData));
    }

    const removeCheckvalidation = async (text) => {
        try {
            const posts = await AsyncStorage.getItem('validation');
            var listofValidation = await JSON.parse(posts) || [];
            let days = await AsyncStorage.getItem('days');
            var listOfDays = await JSON.parse(days);
            const postsItems = listOfDays.filter(function (item) { return item.day !== text });
            await AsyncStorage.removeItem('days');
            await AsyncStorage.setItem('days', JSON.stringify(postsItems));
            const validation = listofValidation.filter(function (item) { return item.id !== itemData.id });
            validation.push({ "id": itemData.id, 'name': itemData.nom, 'qt': itemData.qt, 'data': postsItems })
            await AsyncStorage.removeItem('validation');
            await AsyncStorage.setItem('validation', JSON.stringify(validation));
            console.log(JSON.stringify(validation))

        } catch (error) {
            console.log('error: ', error);
        }
    };
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    //focntion de confirmation de la date du calendrier
    const handleConfirm = (pickeddate) => {
        const exdate = moment(pickeddate).format("DD/MM/YYYY")
        const expiry = moment(pickeddate).format()
        const lol = moment(exdate, "DD/MM/YYYY").fromNow();
        const res = parseInt(lol.split(" ", 1))
        setData({ ...data, fin: exdate })
        updatedlc(exdate, expiry)
        hideDatePicker();
    };
    return (
        <SafeAreaView style={{ height: hp('16%'), width: wp('100%'), marginTop: hp('1%'), backgroundColor: '#ECEAEA' }}>
            <View style={{ marginLeft: wp('5%'), marginTop: hp('2%') }}>
                <View style={{ flexDirection: 'row', width: wp('100%') }}>
                    <View style={{ height: null, width: wp('70%'), marginLeft: wp('1%') }}>
                        <Text numberOfLines={2} style={{ fontSize: 18, marginLeft: wp('4%'), marginBottom: hp('1%'), color: '#36b3c9', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>{itemData.name}</Text>
                    </View>
                    <View style={{ width: wp('20%'), flexDirection: 'row', marginLeft: wp('1%'), }} >
                        <Text style={{ fontFamily: "Roboto-Bold", fontSize: 20, lineHeight: 30, color: '#000', fontWeight: 'bold' }}>Qty:</Text>
                        <Text style={{ fontFamily: "Roboto-Bold", fontSize: 20, lineHeight: 30, color: '#000', fontWeight: 'bold' }}>{itemData.qt}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp('80%'), marginLeft: wp('5%') }}>
                    <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                        <Text style={{ marginBottom: hp('1%'), fontWeight: 'bold', marginTop: hp('1%') }}>Start: Today</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                        <Text style={{ marginBottom: hp('1%'), fontWeight: 'bold', marginTop: hp('1%') }}>End: </Text>
                        {/* {
                            itemData.dlc == "" ? */}
                        <Text style={{ marginBottom: hp('1%'), marginTop: hp('1%') }}>{data.fin}</Text>

                        <Text style={{ marginLeft: wp('2%'), marginTop: hp('1%'), color: '#36b3c9', fontWeight: 'bold', textDecorationLine: 'underline' }} onPress={showDatePicker}>Edit</Text>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                            mode={'date'}
                            display="spinner"
                            minimumDate={data.minimumDate}
                        />
                    </View>
                </View>
            </View>

        </SafeAreaView>
    );
}

export default Etape2Card;

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