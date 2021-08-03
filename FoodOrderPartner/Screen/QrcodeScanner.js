import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView
} from "react-native";
import config from '../config.js'
import AsyncStorage from '@react-native-community/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
    Header,
    Colors,
} from 'react-native/Libraries/NewAppScreen';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

const QrcodeScanner = ({ navigation }) => {
    const [scan, setScan] = useState(false)
    const [result, setResult] = useState([])
    const [fail, setfail] = useState(false)
    const [failqr, setfailqr] = useState(false)
    const [loading, setLoading] = React.useState(false);

    const onSuccess = (e) => {
        setLoading(true)
        verifier(e.data)
        setScan(false)
    }

    const getData = async (code) => {
        let user_id;
        user_id = null;
        try {
          user_id = await AsyncStorage.getItem('userid');
        } catch (e) {
          console.log(e)
        }
        const url = `${config.url}/verifyQRcode`;
        if(code.startsWith('food')){
            axios.post(url,{
                foodQR : code,
                id: user_id
            })
            .then(res => {
                console.log(res.data)
                if(res.data != "Coupon not valid for this partner"){
                    setResult(res.data)
                    setLoading(false)
                }else{
                    Toast.show("This coupon does not belong to you!")
                    setfail(true)
                    setLoading(false)
                }
            })
            .catch(error => {
                setLoading(false)
            })
        }else{
            Toast.show("This coupon is not valid!")
            setfailqr(true)
            setLoading(false)
        }
    };
    const verifier = (dataa) => {
        getData(dataa)
    }
    const startScan = () => {
        setScan(true)
        setResult([])
        setfail(false)
        setfailqr(false)

    }

    const endScan = () => {
        setScan(false)
        navigation.goBack()
    }

    useEffect(() => {
        startScan()
    }, [])

    const confirmed = () => {
        axios.post(`${config.url}/ConfirmedCom`, {
            status: result.payement,
            id: result.payement == "Sur place" ? result.id : result.coupon_id,
            PriceAfterDiscount: result.deal_scheduled.deals.PriceAfterDiscount
        })
        .then((res) => {
            if (res.data == "done") {
                Toast.show("Bassinet Successfully confirm!")
                navigation.navigate('HomeDrawer')
            }else{
                Toast.show("Coupon already used!")
                navigation.navigate('HomeDrawer')

            }
        })
            .catch(err => Toast.show("Please check the reservation!"));
    }

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView styel={styles.container}>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <Image
                        //We are showing the Image from online
                        source={config.logo}

                        style={styles.logoStyle}

                    />
                    <Text style={styles.Text1}>Please scan the Coupon</Text>

                    {loading ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Bubbles size={10} color="#36b3c9" />
                        </View>
                        :
                        <View style={styles.body}>
                            {result.length !== 0 &&
                                <View style={styles.sectionContainer1}>
                                    {/* <Text style={styles.centerText}>{result}</Text> */}
                                    <View style={{ width: wp('90%'), alignSelf: 'center', height: hp('90%'), marginTop: hp('2%') }}>

                                        <View style={{ marginBottom: hp('3%'), }}>
                                            <Text style={{ textAlign: 'left', fontWeight: "bold", fontSize: 15, lineHeight: 24 }}>Bassinet name: <Text style={{ fontWeight: 'normal', fontSize: 15 }}>{result.deal_scheduled.deals.description}</Text></Text>
                                        </View>
                                        <View style={{ marginBottom: hp('3%') }}>
                                            <Text style={{ textAlign: 'left', fontWeight: "bold", fontSize: 15, lineHeight: 24 }}>Quantity: <Text style={{ fontWeight: 'normal', fontSize: 15 }}>{result.nbre_coupons}</Text></Text>
                                        </View>
                                        <View style={{ marginBottom: hp('3%') }}>
                                            <Text style={{ textAlign: 'left', fontWeight: "bold", fontSize: 15, lineHeight: 24 }}>Username: <Text style={{ fontWeight: 'normal', fontSize: 15 }}>{result.user.username}</Text></Text>
                                        </View>
                                        <View style={{ marginBottom: hp('3%') }}>
                                            <Text style={{ textAlign: 'left', fontWeight: "bold", fontSize: 15, lineHeight: 24 }}>Status: <Text style={{ fontWeight: 'normal', fontSize: 15 }}>{result.payement == "Sur place" ? "Non payé" : "Payé"}</Text></Text>
                                        </View>
                                        <View style={{ marginBottom: hp('3%') }}>
                                            <Text style={{ textAlign: 'left', fontWeight: "bold", fontSize: 15, lineHeight: 24 }}>Sum: <Text style={{ fontWeight: 'normal', fontSize: 15 }}>{result.nbre_coupons * result.deal_scheduled.deals.PriceAfterDiscount}</Text></Text>
                                        </View>

                                        <View>
                                            <Button style={styles.connectbtnn} mode='outlined' onPress={() => { confirmed() }}>
                                                <Text style={styles.btntext}>Confirm reservation</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            }
                            {
                                fail && 
                                <View style={styles.sectionContainer1}>
                                    {/* <Text style={styles.centerText}>{result}</Text> */}
                                    <View style={{ width: wp('90%'), alignSelf: 'center', height: hp('90%'), marginTop: hp('2%') }}>

                                        <View style={{ marginBottom: hp('3%'), }}>
                                            <Text style={{ textAlign: 'left', fontWeight: "bold", fontSize: 15, lineHeight: 24 }}>This coupon does not belong to you!</Text>
                                        </View>

                                        <View>
                                            <Button style={styles.connectbtnn} mode='outlined' onPress={() => {startScan() }}>
                                                <Text style={styles.btntext}>ReScan</Text>
                                            </Button>
                                        </View>
                                        <View>
                                            <Button style={styles.connectbtnn} mode='outlined' onPress={() => {navigation.navigate('HomeDrawer')}}>
                                                <Text style={styles.btntext}>Cancel</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            }
                            {
                                failqr && 
                                <View style={styles.sectionContainer1}>
                                    <View style={{ width: wp('90%'), alignSelf: 'center', height: hp('90%'), marginTop: hp('2%') }}>

                                        <View style={{ marginBottom: hp('3%'), }}>
                                            <Text style={{ textAlign: 'left', fontWeight: "bold", fontSize: 15, lineHeight: 24 }}>This coupon is not valid!</Text>
                                        </View>

                                        <View>
                                            <Button style={styles.connectbtnn} mode='outlined' onPress={() => {startScan() }}>
                                                <Text style={styles.btntext}>ReScan</Text>
                                            </Button>
                                        </View>
                                        <View>
                                            <Button style={styles.connectbtnn} mode='outlined' onPress={() => {navigation.navigate('HomeDrawer')}}>
                                                <Text style={styles.btntext}>Cancel</Text>
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
                                        containerStyle={{ height: hp('90%') }}

                                    />
                                </View>

                            }
                        </View>



                    }

                </ScrollView>
            </SafeAreaView>
        </>

    );
}

export default QrcodeScanner;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    Text1: {
        textAlign: 'center',
        marginTop: hp('5%'),
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF9F54',
        marginBottom: hp('2.5%')
    },
    logoStyle: {
        alignSelf: 'center',
        height: Platform.OS  === 'ios' ? hp('10%'):hp('25%'), // 70% of height device screen
        width: wp('85%'),
        marginTop: hp('5%'),
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
        backgroundColor: Colors.white,
        height: null
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: hp('-10%'),
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
    sectionContainer1: {
        backgroundColor: '#fff'
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