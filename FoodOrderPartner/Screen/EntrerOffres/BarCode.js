import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
} from "react-native";
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
    Header,
    Colors,
} from 'react-native/Libraries/NewAppScreen';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import CheckBox from '@react-native-community/checkbox';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { set } from "react-native-reanimated";
import AsyncStorage from '@react-native-community/async-storage';


const BarCode = ({ navigation }) => {
    const [scan, setScan] = useState(false)
    const [result, setResult] = useState()
    const [dealrestant, setDealrestant] = React.useState(20);
    const [toggleCheckBoxdlc, setToggleCheckBoxdlc] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [data, setData] = React.useState({
        nbre: 1,
        date: [],
        list: [],
        payment: '',
        color: '#b4b4b4',
        colorplus: '#36b3c9',
        birthday: '',
        data: [{
            id: 1,
            name: 'Coca Cola',
            // image: require('../../Images/coca.jpg'),
            qt: 20,
            barecode: 5449000054227
        },
        {
            id: 2,
            name: 'Sablito',
            // image: require('../../Images/SABLITO.jpg'),
            qt: 15,
            barecode: 6194008533999
        },
        {
            id: 3,
            name: 'Biscuits Smile',
            // image: require('../../Images/BISCUITS-SMILE.jpg'),
            qt: 20,
            barecode: 6194002510194
        }
        ]
    });
    const checkitem = async (e) => {
        try {
            const postsItems = data.data.filter(function (item) {
                if (item.barecode == parseInt(e.data)) {
                    return setData({
                        ...data,
                        date: item
                    })

                }
            });
        } catch (error) {
            console.log('error: ', error);
        }
    };
    const onSuccess = (e) => {
        checkitem(e)
        setResult(e.data)
        setScan(false)
        // console.log(data.date)
    }

    const startScan = () => {
        setScan(true)
        setResult()
    }
    const ReScan = () => {
        _updatechecklist()
        setScan(true)
        setResult()
    }

    const editOrder = (action) => {

        if (action == "+") {
            if (data.nbre < dealrestant) {
                let qt = data.nbre + 1
                if (qt == dealrestant) {
                    setData({
                        ...data,
                        nbre: qt,
                        colorplus: '#b4b4b4',
                        color: '#36b3c9'
                    })
                } else {
                    setData({
                        ...data,
                        nbre: qt,
                        colorplus: '#36b3c9',
                        color: '#36b3c9'
                    })
                }
            }
        }

        if (action == "-") {
            if (data.nbre > 1) {
                let qt = data.nbre - 1
                if (qt == 1) {
                    setData({
                        ...data,
                        nbre: qt,
                        color: '#b4b4b4',
                        colorplus: '#36b3c9',
                    })
                } else {
                    setData({
                        ...data,
                        nbre: qt,
                        color: '#36b3c9',
                        colorplus: '#36b3c9',

                    })
                }
            }
        }
    }
    const endScan = () => {
        _updatechecklist()
        setScan(false)
        setResult()
        navigation.navigate('ScannerOffreEndAj', { itemData: data.list })
    }
    const _updatechecklist = async (qt) => {
        let response = await AsyncStorage.getItem('ScannItem');
        var listOfCheck = await JSON.parse(response) || [];

        listOfCheck.push({ "id": data.date.id, 'name': data.date.name, 'image': data.date.image, 'qt': data.nbre })
        await AsyncStorage.removeItem('ScannItem');
        await AsyncStorage.setItem('ScannItem', JSON.stringify(listOfCheck));
        setData({
            ...data,
            nbre: 1,
            list: listOfCheck
        })
        console.log(JSON.stringify(listOfCheck))
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (pickeddate) => {
        const exdate = moment(pickeddate).format('DD/MM/YYYY')
        const lol = moment(exdate, "DD/MM/YYYY").fromNow();
        const res = parseInt(lol.split(" ", 1))
        setData({ ...data, birthday: exdate })
        hideDatePicker();
    };
    const checkdlc = (newValue) => {
        setToggleCheckBoxdlc(newValue)
        if (!newValue) {
            setData({
                ...data,
                birthday: ''
            })
        }
    }

    useEffect(() => {
        startScan()
    }, [])

    return (

        <View styel={styles.container}>
            <View style={{ height: hp('10%'), backgroundColor: 'white', borderBottomColor: '#b4b4b4b4', borderBottomWidth: 0.2 }}>
                <Icon name="chevron-back-outline" style={{ paddingLeft: wp('1%'), color: 'black', top: hp('5%') }} size={30} onPress={() => { navigation.goBack() }} />
            </View>
            <View style={styles.scrollView}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.Text1}>Scanner le Barcode de produit à ajouter</Text>
                </View>
                <View style={styles.body}>
                    {result &&
                        <View style={styles.sectionContainer1}>
                            {/* <Text style={styles.centerText}>{result}</Text> */}
                            <View style={{ width: wp('90%'), alignSelf: 'center', height: hp('90%'), marginTop: hp('2%') }}>
                                <View style={{ marginBottom: hp('3%'), width: wp('35%'), height: hp('20%'), shadowRadius: 0.5, shadowColor: 'black', shadowOpacity: 0.5, elevation: 5, borderRadius: 20, alignSelf: 'center' }}>
                                    <Image source={data.date.image} style={{ alignSelf: 'center', width: wp('35%'), height: hp('20%'), }} />
                                </View>
                                <View style={{ marginBottom: hp('3%'), }}>
                                    <Text style={{ textAlign: 'left', fontWeight: "bold", fontSize: 15, lineHeight: 24 }}>Nom de produit: <Text style={{ fontWeight: 'normal', fontSize: 15 }}>{data.date.name}</Text></Text>
                                </View>
                                <View style={{ marginBottom: hp('3%'), flexDirection: 'row' }}>
                                    <Text style={{ textAlign: 'left', fontWeight: "bold", fontSize: 15, lineHeight: 24 }}>Quantité: </Text>
                                    <View
                                        style={{
                                            marginLeft: wp('12%'),
                                            // marginTop: hp('2%'),
                                            width: wp('50%'),
                                            height: hp('4%'),
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                            borderBottomColor: "#2dbe36",
                                            // borderBottomWidth: 1

                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                width: wp('7%'),
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 25,
                                                backgroundColor: data.color
                                            }}
                                            onPress={() => editOrder("-")}
                                        >
                                            <Text style={{ fontFamily: "Roboto-Regular", fontSize: 27, lineHeight: 36, color: 'white', marginTop: hp('-0.7%') }}>-</Text>
                                        </TouchableOpacity>

                                        <View
                                            style={{
                                                width: wp('20%'),
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Text style={{ fontFamily: "Roboto-Bold", fontSize: 25, lineHeight: 30, color: '#05375a', fontWeight: 'bold' }}>{data.nbre}</Text>
                                        </View>

                                        <TouchableOpacity
                                            style={{
                                                width: wp('7%'),
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                // borderTopRightRadius: 20,
                                                // borderBottomRightRadius: 20,
                                                borderRadius: 25,
                                                backgroundColor: data.colorplus
                                            }}
                                            onPress={() => editOrder("+")}
                                        >
                                            <Text style={{ fontFamily: "Roboto-Regular", fontSize: 25, color: 'white', marginTop: hp('-0.3%') }}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{ marginBottom: hp('3%'), flexDirection: 'row' }}>
                                    <Text style={{ textAlign: 'left', fontWeight: "bold", fontSize: 15, lineHeight: 24 }}>DLC: </Text>
                                    <CheckBox
                                        disabled={false}
                                        value={toggleCheckBoxdlc}
                                        onValueChange={(newValue) => checkdlc(newValue)}
                                        style={{
                                            marginLeft: wp('40%'),
                                        }}
                                    />
                                </View>
                                <View style={{ marginBottom: hp('3%'), flexDirection: 'row' }}>
                                    <Text style={{ textAlign: 'left', fontWeight: "bold", fontSize: 15, lineHeight: 24 }}>Date: </Text>
                                    <TextInput style={styles.TextInputp}
                                        placeholder="Date"
                                        onFocus={() => showDatePicker()}
                                        value={data.birthday}
                                        blurOnSubmit={false}
                                        editable={toggleCheckBoxdlc}
                                    />
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePicker}
                                        mode={'date'}
                                        display="spinner"
                                    />
                                </View>
                                <View>
                                    <Button style={styles.connectbtnn} mode='outlined' onPress={() => { ReScan() }}>
                                        <Text style={styles.btntext}>Scanner Nouveau Article</Text>
                                    </Button>
                                    <Text style={{ justifyContent: 'center', alignSelf: 'center', marginTop: hp('2%') }}> ou Bien</Text>
                                    <Button style={styles.connectbtnn} mode='outlined' onPress={() => { endScan() }}>
                                        <Text style={styles.btntext}>Terminer l'offre</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    }

                    {scan &&
                        <View style={styles.sectionContainer}>
                            <QRCodeScanner
                                reactivate={true}
                                showMarker={true}
                                onRead={onSuccess}
                                containerStyle={{ height: hp('70%') }}
                                markerStyle={{ height: hp('12%') }}
                            />
                        </View>
                    }
                </View>
            </View>
        </View>
    );
}

export default BarCode;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    Text1: {
        textAlign: 'center',
        marginTop: hp('2%'),
        fontSize: 20,
        fontWeight: 'bold',
        width: wp('70%'),
        marginBottom: hp('2.5%')
    },
    logoStyle: {
        alignSelf: 'center',
        height: hp('10%'), // 70% of height device screen
        width: wp('85%'),
        marginTop: hp('10%'),
        marginBottom: hp('1%')
    },
    connectbtn: {
        height: hp('7%'), // 70% of height device screen
        width: wp('70%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#36b3c9",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 5
    },
    btntext: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
        color: '#fff'
    },
    image: {
        alignSelf: 'center',
        height: hp('39%'), // 70% of height device screen
        width: wp('70%'),
        marginTop: hp('5%'),
        borderRadius: 20,
    },
    viewimage: {
        alignSelf: 'center',
        height: hp('45%'),
        marginTop: hp('2%'),
        width: wp('80%'),
        borderRadius: 20,
        // shadowRadius: 0.5,
        // shadowColor: '#b4b4b4',
        // shadowOpacity: 0.5,
        // elevation:5
    },
    scrollView: {
        backgroundColor: 'white',
    },
    body: {
        backgroundColor: 'white',
    },
    sectionContainer: {
        marginTop: hp('12%'),
        backgroundColor: '#fff'
    },
    sectionContainer1: {
        backgroundColor: '#fff'
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: hp('1%'),
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
    TextInputp: {
        width: wp('40%'),
        height: hp('5%'),
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#b4b4b4b4',
        fontSize: 15,
        marginLeft: wp('25%'),
        marginTop: hp('-0.5%'),
        textAlign: 'center'
    },
    connectbtnn: {
        height: hp('7%'), // 70% of height device screen
        width: wp('90%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#36b3c9",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 30,
        marginTop: hp('2%')
    },
    btntext: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
        color: '#fff'
    },
});