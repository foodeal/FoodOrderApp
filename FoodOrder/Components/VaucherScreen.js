import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    BackHandler,
} from "react-native";
import { CardItem } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';

const VaucherScreen = ({ route, navigation, }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isvisible, setIsVisible] = useState(false);
    const [data, setData] = React.useState({
        heure: '',
        data: route.params.itemData,
        username: '',
        payment: route.params.payement,
        codeFoodorder: route.params.code
    });

    useEffect(() => {
        setTimeout(async () => {
            let username;
            username = null;
            let code;
            code = null;
            try {
                username = await AsyncStorage.getItem('username');
                code = await AsyncStorage.getItem('code');
            } catch (e) {
                console.log(e);
            }
            setData({ ...data, username: username, codeFoodorder: route.params.code })
            Toast.show("Please find your coupon in the reservations section")
            const handleBackPress = () => {
                navigator.popToTop()
                return true
            }
            BackHandler.addEventListener('hardwareBackPress', handleBackPress)
            return BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
        }, 500)

    }, [])

    let logoFromFile = require('../Images/logo.png');


    return (
        <View style={styles.container}>
            <View style={{ height: hp('10%'), backgroundColor: 'transparent', justifyContent: 'flex-end', flexDirection: 'row' }}>
                <Icon name="home" style={{ color: 'black', top: hp('6%'), marginRight: wp('6%') }} size={30} onPress={() => { navigation.navigate("HomeDrawer") }} />
            </View>
            <View style={{ borderBottomColor: '#b4b4b4', borderBottomWidth: 1, width: wp('100%'), height: hp('100%'), }} >
                <CardItem style={{ marginTop: hp('3%') }} >
                    <View style={{ flexDirection: 'column', alignItems: 'center', width: wp('90%') }}>
                        <View style={{ width: wp('85%') }}>
                            <Text style={{ textAlign: 'center', fontSize: 25, marginLeft: wp('0.5%'), marginBottom: hp('1%'), color: '#00CED1', fontFamily: 'Rubik-Bold', fontWeight: 'bold' }}>Economize {data.data.discount}</Text>
                            <Text style={{ textAlign: 'center', fontSize: 18, marginLeft: wp('0.5%'), marginBottom: hp('1.5%'), color: '#000', fontFamily: 'Rubik-Regular', fontWeight: 'bold' }}>Valid from {data.data.start}h{data.data.startminu} to {data.data.end}h{data.data.endminu}</Text>
                        </View>
                    </View>
                </CardItem>
                <CardItem style={{ flexDirection: 'column', marginTop: hp('1%'), height: hp('63%'), width: wp('80%'), shadowColor: 'black', shadowRadius: 10, shadowOpacity: 0.8, shadowOffset: { width: -1, height: -3 }, elevation: 8, borderRadius: 20, alignSelf: 'center' }}>
                    <Text style={{ width: wp('58%'), color: '#3a4047', fontWeight: 'bold', fontFamily: "Rubik-Medium", fontSize: 18, textAlign: 'center', marginTop: hp('2%') }}>{data.data.description} for {data.data.prix} dollar </Text>
                    <View style={{ marginTop: hp('2%'), flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={{ marginBottom: hp('1%') }}>{data.username}</Text>
                        <Text style={styles.text}> {data.data.name}</Text>
                    </View>
                   
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', top: hp('2%'), bottom: hp('0.5%'), width: wp('80%') }}>
                        <Text style={{ top: hp('0.5%'), left: wp('1%'), color: '#e2e2e2', fontSize: 19, textAlign: 'center' }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - </Text>
                    </View>
                    <View style={{ marginTop: hp('5%') }}>
                        <QRCode
                            value={data.codeFoodorder}
                            size={hp('22%')}
                            logo={logoFromFile}
                            logoSize={50} />
                    </View>
                    <View  style={{ marginTop: hp('2%'), alignItems: 'center'}}>
                        <Text style={{fontSize:17, fontWeight:'bold'}}>To be scanned at the partner's.</Text>
                    </View>

                </CardItem>
            </View>

        </View>
    );
}

export default VaucherScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
    },
    connectbtn: {
        height: hp('7%'), // 70% of height device screen
        width: wp('90%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#00CED1",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 5,
        marginTop: hp('9%')
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
    TextInput: {
        height: hp('8%'), // 70% of height device screen
        width: wp('44%'),
        marginTop: Platform.OS === 'ios' ? 0 : -15,
        paddingLeft: wp('2%'),
        paddingRight: wp('4%'),
        textAlign: 'center',
        marginLeft: wp('27%'),
        marginTop: hp('2%'),
        color: '#05375a',
    },
});