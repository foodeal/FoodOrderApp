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
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';


const ScannerOffreEndCard = ({ itemData,navigation }) => {
    // console.log(itemData.qt)
    const [visible, setVisible] = React.useState(false);
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [toggleCheckBoxdlc, setToggleCheckBoxdlc] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dealrestant, setDealrestant] = React.useState(itemData.qt);
    const [data, setData] = React.useState({
        nbre: 0,
        date: null,
        payment: '',
        color: '#b4b4b4',
        colorplus: '#36b3c9',
        birthday: '',
        sexe: '',
        quantité: itemData.qt
    });
//fonction qui permet de verifier le champ du sexe
    const SexeInputChange = (val) => {
        setData({
            ...data,
            sexe: val
        });
        console.log(val)

    }

    const _updatelistinvendu = async (qt) => {
        let response = await AsyncStorage.getItem('listArticle');
        var listOfArticle = await JSON.parse(response) || [];
        listOfArticle.push({ "id": itemData.id,'name': itemData.name,'image':itemData.image,'qt':qt })
        await AsyncStorage.removeItem('listArticle');
        await AsyncStorage.setItem('listArticle', JSON.stringify(listOfArticle));
        console.log(JSON.stringify(listOfArticle))
    }

    const removelistinvendu = async (id) => {
        try {
            const posts = await AsyncStorage.getItem('listArticle');
            let listOfCheck = JSON.parse(posts);
            const postsItems = listOfCheck.filter(function (item) { return item.id !== id });
            await AsyncStorage.removeItem('listArticle');
            await AsyncStorage.setItem('listArticle', JSON.stringify(postsItems));
            // console.log(JSON.stringify(postsItems))

        } catch (error) {
            console.log('error: ', error);
        }
    };

    const checklist = async(qt) => {
            await removelistinvendu(itemData.id);
            _updatelistinvendu(qt)            
    }
    //fonction qui permet d'incrimenter ou diminuer la quantité
    const editOrder = (action) => {

        if (action == "+") {
            if (data.nbre < data.quantité) {
                let qt = data.nbre + 1
                if (qt == data.quantité) {
                    setData({
                        ...data,
                        nbre: qt,
                        colorplus: '#b4b4b4',
                        color: '#36b3c9'
                    })
                    setDealrestant(dealrestant-1)
                    checklist(qt)
                } else {
                    setData({
                        ...data,
                        nbre: qt,
                        colorplus: '#36b3c9',
                        color: '#36b3c9'
                    })
                    setDealrestant(dealrestant-1)
                    checklist(qt)
                }
            }
        }

        if (action == "-") {
            if (data.nbre > 0) {
                let qt = data.nbre - 1
                if (qt == 0) {
                    setData({
                        ...data,
                        nbre: qt,
                        color: '#b4b4b4',
                        colorplus: '#36b3c9',
                    })
                    setDealrestant(dealrestant+1)
                    removelistinvendu(itemData.id)
                } else {
                    setData({
                        ...data,
                        nbre: qt,
                        color: '#36b3c9',
                        colorplus: '#36b3c9',
                    })
                    setDealrestant(dealrestant+1)
                    checklist(qt)
                }
            }
        }
    }
//focntion permet d'ouvrire la calendrier
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
//focntion permet de fermer la calendrier
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
//focntion de confirmation de la date du calendrier
    const handleConfirm = (pickeddate) => {
        const exdate = moment(pickeddate).format('DD/MM/YYYY')
        const lol = moment(exdate, "DD/MM/YYYY").fromNow();
        const res = parseInt(lol.split(" ", 1))
        setData({ ...data, birthday: exdate })
        hideDatePicker();
    };
    return (
        <SafeAreaView style={{ height: hp('15%'), width: wp('100%'), marginTop: hp('0.5%'), backgroundColor: '#ECEAEA' }}>
            <View style={{flexDirection:'column',}}>
                <View style={{ height: null, marginTop: hp('2%'), marginLeft: wp('0%'), marginRight: wp('3%'), borderRadius: 8, marginBottom: hp('1%'), flexDirection: 'row',justifyContent:'space-between'  }} >
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft:wp('0%')  }}>
                        <Text style={{ marginTop: hp('1%'), fontWeight: 'bold',fontSize:16 }}>Name</Text>
                        <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                            <View style={{ height: null, width: wp('20%'), marginTop: hp('1%'), marginLeft: wp('0%') }}>
                                <Text numberOfLines={2} style={{ fontSize: 15, marginLeft: wp('4%'), marginBottom: hp('1%'), color: '#2dbe36', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>{itemData.name}</Text>
                            </View>
                            <Image source={itemData.image}
                                style={{ width: wp('16%'), height: hp('6%'), resizeMode: 'cover', borderRadius: 8, bottom: hp('1%'), marginTop: hp('1%'),marginLeft:wp('1.5%') }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: wp('0%') }}>
                        <Text style={{ fontWeight: 'bold',fontSize:16 }}>Qty</Text>
                        <View
                            style={{
                                marginLeft: wp('2%'),
                                // marginTop: hp('2%'),
                                width: wp('30%'),
                                height: hp('5%'),
                                marginTop: hp('1%'),
                                justifyContent: 'center',
                                flexDirection: 'row',
                                borderBottomColor: "#2dbe36",
                                // borderBottomWidth: 1

                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    width: wp('6%'),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 25,
                                    marginTop: hp('1%'),
                                    backgroundColor: data.color
                                }}
                                onPress={() => editOrder("-")}
                            >
                                <Text style={{ fontFamily: "Roboto-Regular", fontSize: 18, color: 'white', }}>-</Text>
                            </TouchableOpacity>

                            <View
                                style={{
                                    width: wp('10%'),
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text style={{ fontFamily: "Roboto-Bold", fontSize: 20, lineHeight: 30, color: '#05375a', fontWeight: 'bold' }}>{data.nbre}</Text>
                            </View>

                            <TouchableOpacity
                                style={{
                                    width: wp('6%'),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // borderTopRightRadius: 20,
                                    // borderBottomRightRadius: 20,
                                    borderRadius: 25,
                                    marginTop: hp('1%'),
                                    backgroundColor: data.colorplus
                                }}
                                onPress={() => editOrder("+")}
                            >
                                <Text style={{ fontFamily: "Roboto-Regular", fontSize: 18, color: 'white' }}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>               
                 
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: wp('0%') }}>
                        <Text style={{ marginBottom: hp('1%'), fontWeight: 'bold',fontSize:16}}>Qty Remaining</Text>
                        <Text style={{ marginBottom: hp('1%'), fontWeight: 'bold',fontSize:18, color:'#b4b4b4' }}>{dealrestant}</Text>

                    </View>
                </View>
            </View>

        </SafeAreaView>
    );
}

export default ScannerOffreEndCard;

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
        borderColor:'#b4b4b4',
        marginTop: hp('1%'),
        fontSize: 13,
        textAlign:'center',
        fontWeight:'bold'
    }
});