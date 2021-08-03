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
        codeFoodealzz: route.params.code
    });

    // console.log(data.prix)
    const _showdialog = () => {
        setIsVisible(true);
    };

    const _hidedialog = () => {
        setIsVisible(false);
    };

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
            setData({ ...data, username: username, codeFoodealzz: route.params.code })
            Toast.show("Veuillez trouver votre coupon dans la rubrique réservations")
            const handleBackPress = () => {
                navigator.popToTop()
                return true
            }
            BackHandler.addEventListener('hardwareBackPress', handleBackPress)
            return BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
        }, 500)

    }, [])

    let logoFromFile = require('../Images/logo.png');

    const qrdata = {
        deal_description: data.data.deal_description,
        nombre_de_personne: data.data.nbre,
        user_id: data.data.user_id,
        payment: route.params.payement,
        deal_scheduled_id: data.data.deal_scheduled_id,
        name_restaurant: data.data.name
    }

    return (
        <View style={styles.container}>
            <View style={{ height: hp('10%'), backgroundColor: 'transparent', justifyContent: 'flex-end', flexDirection: 'row' }}>
                {/* <Icon name="chevron-back-outline" style={{ paddingLeft: wp('1%'), color: 'black', top: hp('2%') }} size={30} onPress={() => { navigation.goBack() }} /> */}
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
                {/* <Card style={{borderRadius:10}}> */}
                <CardItem style={{ flexDirection: 'column', marginTop: hp('1%'), height: hp('63%'), width: wp('80%'), shadowColor: 'black', shadowRadius: 10, shadowOpacity: 0.8, shadowOffset: { width: -1, height: -3 }, elevation: 8, borderRadius: 20, alignSelf: 'center' }}>
                    <Text style={{ width: wp('58%'), color: '#3a4047', fontWeight: 'bold', fontFamily: "Rubik-Medium", fontSize: 18, textAlign: 'center', marginTop: hp('2%') }}>{data.data.description} for {data.data.prix} dollar </Text>
                    <View style={{ marginTop: hp('2%'), flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={{ marginBottom: hp('1%') }}>{data.username}</Text>
                        <Text style={styles.text}> {data.data.name}</Text>
                    </View>
                    {/* <View style={{ flexDirection: 'row', marginTop: hp('1%'), marginBottom: hp('0.5%') }}>
                        <Text style={{ marginTop: hp('0.5%'), marginLeft: wp('0.5%'), color: '#19d825', fontSize: 16, textDecorationLine: 'underline' }}>Modifier infos</Text>
                    </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', top: hp('2%'), bottom: hp('0.5%'), width: wp('80%') }}>
                        {/* <View style={{ width: wp('3%'), height: hp('3%'), backgroundColor: '#e2e2e2', borderTopRightRadius: 150, borderBottomRightRadius: 150, top: hp('1%'), right: wp('0.1%')}} /> */}
                        <Text style={{ top: hp('0.5%'), left: wp('1%'), color: '#e2e2e2', fontSize: 19, textAlign: 'center' }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - </Text>
                        {/* <View style={{ width: wp('3%'), height: hp('3%'), backgroundColor: '#e2e2e2', borderTopLeftRadius: 150, borderBottomLeftRadius: 150, top: hp('1%'), marginLeft: wp('1.5%') }} /> */}
                    </View>
                    <View style={{ marginTop: hp('5%') }}>
                        <QRCode
                            value={data.codeFoodealzz}
                            size={hp('22%')}
                            logo={logoFromFile}
                            logoSize={50} />
                    </View>
                    <View  style={{ marginTop: hp('2%'), alignItems: 'center'}}>
                        <Text style={{fontSize:17, fontWeight:'bold'}}>To be scanned at the partner's.</Text>
                    </View>

                </CardItem>
                {/* </Card> */}
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