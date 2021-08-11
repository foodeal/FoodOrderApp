import React, { useState, useEffect,useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Keyboard
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity } from "react-native-gesture-handler";
import CheckBox from '@react-native-community/checkbox';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';


const Etape1Card = ({ itemData, navigation, check }) => {
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [toggleCheckBoxdlc, setToggleCheckBoxdlc] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dealrestant, setDealrestant] = React.useState(200);
    const ref_input1 = useRef();

    const [data, setData] = React.useState({
        nbre: 1,
        nbre2: "1",
        date: null,
        payment: '',
        color: '#b4b4b4',
        colorplus: '#36b3c9',
        dlc: '',
        sexe: '',
        startingDat: moment().format(),
        expiryDat: moment().format(),
        minimumDate: new Date()
    });

    const _updatechecklist = async (qt, expirye, dlcc) => {
        let response = await AsyncStorage.getItem('checkin');
        var listOfCheck = await JSON.parse(response) || [];
        let user_id = await AsyncStorage.getItem('userid');
        let image = await AsyncStorage.getItem('image');
        let quantité = null;
        let expiry = null;
        let dlc = null
        let imagee = null;
        if (itemData.image == null) {
            imagee = image
        } else {
            imagee = itemData.image
        }
        if (qt == null) {
            quantité = data.nbre
        } else {
            quantité = qt
        }
        if (expirye == null) {
            expiry = data.expiryDat
        } else {
            expiry = expirye
        }
        if (dlcc == null) {
            dlc = data.dlc
        } else {
            dlc = dlcc
        }
        listOfCheck.push({ "id": itemData.id, "partnerId": user_id, "discount": itemData.discount.split('%')[0], "description": itemData.description, 'name': itemData.nom, 'image': imagee, 'qt': quantité, "PriceBeforeDiscount": itemData.PriceBeforeDiscount, "PriceAfterDiscoun": itemData.PriceAfterDiscoun, "dlc": dlc, "start": `Today`, startingDat: data.startingDat, expiryDat: expiry })
        await AsyncStorage.removeItem('checkin');
        await AsyncStorage.setItem('checkin', JSON.stringify(listOfCheck));
        console.log(JSON.stringify(listOfCheck))
    }

    const removeCheckList = async (id) => {
        try {
            const posts = await AsyncStorage.getItem('checkin');
            let listOfCheck = JSON.parse(posts);
            const postsItems = listOfCheck.filter(function (item) { return item.id !== id });
            await AsyncStorage.removeItem('checkin');
            await AsyncStorage.setItem('checkin', JSON.stringify(postsItems));
            console.log(JSON.stringify(postsItems))

        } catch (error) {
            console.log('error: ', error);
        }
    };
  

    const dlccheck = async (newValue) => {
        if (newValue) {
            setToggleCheckBoxdlc(newValue)
            setDatePickerVisibility(true)
        } else {
            setToggleCheckBoxdlc(newValue)
            setData({
                ...data,
                dlc: '',
                expiryDat: moment().format()
            })
            await removeCheckList(itemData.id);
            _updatechecklist(null, moment().format(), '')
        }
    }

    const checkin = (newValue) => {
        if (newValue === true) {
            _updatechecklist()
        } else {
            removeCheckList(itemData.id)
            setToggleCheckBoxdlc(false)
            setData({
                ...data,
                dlc: '',
                nbre2:"1",
                nbre:1,
                expiryDat: moment().format()
            })
        }
    }
    const changeqt = async(e) => {
        if (data.nbre <= 0) {
            const nb = 1;
            setData({
                ...data,
                nbre: 1,
                nbre2: "1",
                color: '#b4b4b4',
                colorplus: '#36b3c9',
            })
            if (toggleCheckBox === true) {
                await removeCheckList(itemData.id);
                _updatechecklist(nb)
            }  
        }else if (data.nbre2 == ""){
            const nb = 1;
            setData({
                ...data,
                nbre: 1,
                nbre2: "1",
                color: '#b4b4b4',
                colorplus: '#36b3c9',
            })
            if (toggleCheckBox === true) {
                await removeCheckList(itemData.id);
                _updatechecklist(nb)
            }  
        }else{
            if (toggleCheckBox === true) {
                await removeCheckList(itemData.id);
                _updatechecklist(data.nbre)
            }
        }

       
    }

    //fonction qui permet d'incrimenter ou diminuer la quantité
    const editOrder = async (action) => {

        if (action == "+") {
            let quantite = data.nbre + 1
            // if (quantite == dealrestant) {
            //     setData({
            //         ...data,
            //         nbre: quantite,
            //         colorplus: '#b4b4b4',
            //         color: '#36b3c9'
            //     })
            //     if (toggleCheckBox === true) {
            //         await removeCheckList(itemData.id);
            //         _updatechecklist(quantite, null, null)
            //     }
            // } else {
            setData({
                ...data,
                nbre: quantite,
                nbre2: quantite.toString(),
                colorplus: '#36b3c9',
                color: '#36b3c9'
            })
            if (toggleCheckBox === true) {
                await removeCheckList(itemData.id);
                _updatechecklist(quantite, null, null)
            }
            //}
        }

        if (action == "-") {
            if (data.nbre > 1) {
                let quantite = data.nbre - 1
                if (quantite == 1) {
                    setData({
                        ...data,
                        nbre: quantite,
                        nbre2: quantite.toString(),
                        color: '#b4b4b4',
                        colorplus: '#36b3c9',
                    })
                    if (toggleCheckBox === true) {
                        await removeCheckList(itemData.id);
                        _updatechecklist(quantite)
                    }
                } else {
                    setData({
                        ...data,
                        nbre: quantite,
                        nbre2: quantite.toString(),
                        color: '#36b3c9',
                        colorplus: '#36b3c9',
                    })
                    if (toggleCheckBox === true) {
                        await removeCheckList(itemData.id);
                        _updatechecklist(quantite)
                    }
                }
            }
        }
    }
    console.log(isDatePickerVisible)
    //focntion permet d'ouvrire la calendrier
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    //focntion permet de fermer la calendrier
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    //focntion de confirmation de la date du calendrier
    const handleConfirm = async (pickeddate) => {
        const exdate = moment(pickeddate).format("DD/MM/YYYY")
        const expiry = moment(pickeddate).format()
        const lol = moment(exdate, "DD/MM/YYYY").fromNow();
        setData({ ...data, dlc: exdate, expiryDat: expiry });
        await removeCheckList(itemData.id);
        _updatechecklist(null, expiry, exdate)
        hideDatePicker();
    };
    return (
        <SafeAreaView style={{ height: hp('15%'), width: wp('100%'), marginTop: hp('0.5%'), backgroundColor: '#ECEAEA' }}>

            <View style={{ flexDirection: 'column', }}>
                <View style={{ height: null, marginTop: hp('2%'), marginLeft: wp('2%'), marginRight: wp('3%'), borderRadius: 8, marginBottom: hp('1%'), flexDirection: 'row', justifyContent: 'space-between', alignContent: 'space-between' }} >
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: wp('1%') }}>
                        <Text style={{ marginBottom: hp('1%'), fontWeight: 'bold' }}>Choice</Text>
                        <CheckBox
                            disabled={false}
                            value={toggleCheckBox}
                            onValueChange={(newValue) => { setToggleCheckBox(newValue), checkin(newValue) }}
                        />
                    </View>


                    <View style={{ flexDirection: 'row', marginTop: hp('3%'), width: wp('20%') }}>
                        <View style={{ height: null, width: wp('24%'), marginTop: hp('1%'), marginLeft: wp('0%') }}>
                            <Text numberOfLines={2} style={{ fontSize: 13, marginLeft: wp('1%'), marginBottom: hp('1%'), color: '#36b3c9', fontWeight: 'bold', marginTop: hp('1%') }}>{itemData.nom}</Text>
                        </View>

                    </View>

                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  }}>
                        <Text style={{ marginBottom: hp('1%'), fontWeight: 'bold' }}>DLC</Text>
                        <CheckBox
                            disabled={!toggleCheckBox}
                            value={toggleCheckBoxdlc}
                            onValueChange={(newValue) => { dlccheck(newValue) }}
                        />
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: hp('1%'),marginLeft: wp('-2%') }}>
                        <Text style={{ fontWeight: 'bold' }}>Date DLC</Text>
                        <TextInput style={styles.TextInputp}
                            placeholder=""
                            // onFocus={()=> showDatePicker()}
                            // onBlur={()=> {Keyboard.dismiss(),hideDatePicker()}}
                            value={data.dlc}
                            blurOnSubmit={false}
                            editable={false}
                            onChangeText={() => showDatePicker()}

                        />
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            onConfirm={(e)=>{Keyboard.dismiss(),handleConfirm(e)}}
                            onCancel={()=>{Keyboard.dismiss(),hideDatePicker()}}
                            mode={'date'}
                            display="spinner"
                            minimumDate={data.minimumDate}
                        />
                    </View>

                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginRight: wp('6%'),marginLeft:wp('1%') }}>
                        <Text style={{ fontWeight: 'bold' }}>Qty</Text>
                        <View
                            style={{
                                marginLeft: wp('2%'),
                                // marginTop: hp('2%'),
                                width: wp('10%'),
                                height: hp('4%'),
                                marginTop: hp('1%'),
                                justifyContent: 'center',
                                flexDirection: 'row',
                                borderBottomColor: "#2dbe36",
                                // borderBottomWidth: 1

                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    width: wp('5%'),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 25,
                                    marginTop: hp('1%'),
                                    backgroundColor: data.color
                                }}
                                onPress={() => editOrder("-")}
                            >
                                <Text style={{ fontFamily: "Roboto-Regular", fontSize: 15, color: 'white' }}>-</Text>
                            </TouchableOpacity>

                            <View
                                style={{
                                    width: wp('12%'),
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <TextInput style={styles.TextInputqt}
                                    placeholder=""
                                    value={data.nbre2}
                                    blurOnSubmit={false}
                                    ref={ref_input1}
                                    returnKeyType='done'
                                    editable={toggleCheckBox}
                                    keyboardType='numeric'
                                    onChangeText={(val) => {setData({
                                        ...data,
                                        nbre: parseInt(val),
                                        nbre2: val
                                    })}}
                                    onEndEditing={(e) => {changeqt(e.nativeEvent.text)}}
                                    

                                />
                                {/* <Text style={{ fontFamily: "Roboto-Bold", fontSize: 15, lineHeight: 30, color: '#05375a', fontWeight: 'bold' }}>{data.nbre}</Text> */}
                            </View>

                            <TouchableOpacity
                                style={{
                                    width: wp('5%'),
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
                                <Text style={{ fontFamily: "Roboto-Regular", fontSize: 15, color: 'white' }}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>



        </SafeAreaView>
    );
}

export default Etape1Card;

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
        width: wp('22%'),
        height: hp('6%'),
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#b4b4b4',
        marginTop: hp('1%'),
        fontSize: 13,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    TextInputqt: {
        width: wp('12%'),
        height: hp('7%'),
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#b4b4b4',
        marginTop: hp('1%'),
        fontSize: 13,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});