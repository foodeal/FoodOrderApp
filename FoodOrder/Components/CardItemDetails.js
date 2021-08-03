import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking,
    TextInput,
    StatusBar, SafeAreaView, FlatList, Animated
} from "react-native";
import { List, ListItem, Avatar } from "react-native-elements";
import { CardItem, Thumbnail, Body, Left, Right, Header } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import StarRating from './StarRating';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';
import Toast from 'react-native-simple-toast';
import config from '../config.js'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { ScrollView } from "react-native-gesture-handler";
import { Modalize } from 'react-native-modalize';
import moment from 'moment';
import CountDown from 'react-native-countdown-component';
import Dialog from "react-native-dialog";
import { AuthContext } from './context';
import { sha256 } from 'react-native-sha256';
import CheckBox from '@react-native-community/checkbox';
import { Platform } from "react-native";
import OneSignal from 'react-native-onesignal'
import en from '../model/local_en.json'

const CardItemDetails = ({ navigation, route }) => {
    let itemdata = route.params.itemData;
    const [favorites, setfavorites] = React.useState([]);
    const [dealrestant, setDealrestant] = React.useState(0);
    const [favorite, setfavorite] = React.useState(false);
    const [userid, setUserid] = React.useState(0);
    const [username, setusername] = React.useState('');
    const [Numero, setNumero] = React.useState('');
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [visiblecoupon, setVisiblecoupon] = React.useState(false);

    const modalizeRef = React.useRef(null);
    const [totalDuration, settotalDuration] = React.useState(0);
    const [codee, setCodee] = React.useState('');
    const [codep, setCodep] = React.useState('');


    const modalizeRefPay = React.useRef(null);
    const modalizeRefReserveConfir = React.useRef(null);
    const [newdataqr, setNewDataqr] = React.useState([]);
    const fadeAnim = React.useRef(new Animated.Value(0)).current
    const fadeAnimalert = React.useRef(new Animated.Value(0)).current
    const [visibleguest, setVisibleguest] = React.useState(false);
    const { LoginToContinu } = React.useContext(AuthContext);

    const showDialogguest = () => {
        setVisibleguest(true);
    };
    const handleCancelguest = () => {
        setVisibleguest(false);
    };
    const handleoptionOK = () => {
        LoginToContinu()
    }

    const handleCancelcoupon = () => {
        setToggleCheckBox(false)
        setData({
            ...data,
            code: '',
            reduce: false
        })
        setVisiblecoupon(false);
    };
    const handleoptionOKcoupon = () => {
        if (data.code == "FOODZ21") {
            setData({
                ...data,
                reduce: true,
                code: ''
            })
            setVisiblecoupon(false);
        } else {
            setData({
                ...data,
                reduce: false,
                code: ''
            })
            setVisiblecoupon(false);
            setToggleCheckBox(false);
            Toast.show('Discount code is invalid')

        }

    }


    const [data, setData] = React.useState({
        nbre: 1,
        date: null,
        payment: '',
        prix: itemdata.deals.PriceAfterDiscount,
        color: '#b4b4b4',
        colorplus: '#36b3c9',
        codeFoodOrder: '',
        code: '',
        reduce: false
    });
    let start = itemdata.startingdate_hours.split(':')[0]
    let startminu = itemdata.startingdate_hours.split(':')[1]
    let end = itemdata.expirydate_hours.split(':')[0]
    let endminu = itemdata.expirydate_hours.split(':')[1]

    const newdata = [
        {
            "id": 1,
            "name": "Bank card"
        },
        {
            "id": 2,
            "name": "Reservation and payment on site"
        }
    ]

    useEffect(() => {
        const ac = new AbortController();
        setTimeout(async () => {
            let user_id;
            user_id = null;
            let usernamee;
            usernamee = null;
            let numero;
            numero = null;
            try {
                user_id = await AsyncStorage.getItem('userid');
                usernamee = await AsyncStorage.getItem('username');
                numero = await AsyncStorage.getItem('numero');

            } catch (e) {
                console.log(e);
            }
            setusername(usernamee)
            setNumero(numero)
            setUserid(parseInt(user_id))
            if (route.params.token !== null) {
                searchFilterFunction()
            }
            quantity()
            const date = moment().format();
            let expirydate = moment(route.params.itemData.expirydate).format();
            let diffr = moment.duration(moment(expirydate).diff(moment(date)));
            // Difference of the expiry date-time
            var hours = parseInt(diffr.asHours());
            var minutes = parseInt(diffr.minutes());
            var seconds = parseInt(diffr.seconds());
            const d = hours * 60 * 60 + minutes * 60 + seconds;
            settotalDuration(d)
            if (hours == 0 && d > 0) {
                Animated.timing(fadeAnimalert, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true
                }).start()
            }
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start()
            const codeFoodOrder = `${route.params.itemData.user_id}${new Date(Date.now())}`

            sha256(codeFoodOrder).then((hash) => {
                setCodee(`foodr-${hash}`)
                setCodep(`foodp-${hash}`)
            });

            // console.log(itemdata.deals.restaurant.OnesignalId.split(","))
        }, 200);
        return () => ac.abort();
    }, [totalDuration]);

    const Checkcoupon = async (newValue) => {
        if (newValue) {
            setToggleCheckBox(newValue)
            setVisiblecoupon(newValue)
        } else {
            setToggleCheckBox(newValue)
            setData({
                ...data,
                reduce: false
            })
        }
    }

    const searchFilterFunction = async () => {
        var response = await AsyncStorage.getItem('listOflikes');
        var listOfLikes = await JSON.parse(response);
        setfavorites(
            listOfLikes
        );
        if (listOfLikes) {
            const newData = listOfLikes.filter((item) => {
                const itemData = `${item.restaurant_id}`;
                const textData = parseInt(itemdata.deals.restaurant.restaurant_id);
                return itemData.indexOf(textData) > -1;
            });
            if (newData == '') {
                setfavorite(false)
            } else {
                setfavorite(true)
            }
        }
    };

    const quantity = () => {
        const quantity = itemdata.quantity - itemdata.nbre_redeemed_deal
        if (quantity >= 0) {
            setDealrestant(quantity)
        } else {
            setDealrestant(0)
        }
    }

    const _updatefavorite = async () => {
        let response = await AsyncStorage.getItem('listOflikes');
        var listOfLikes = await JSON.parse(response) || [];
        listOfLikes.push({ "restaurant_id": itemdata.deals.restaurant.restaurant_id })
        await AsyncStorage.removeItem('listOflikes');
        await AsyncStorage.setItem('listOflikes', JSON.stringify(listOfLikes));
        setfavorites(
            listOfLikes
        );
        // console.log(favorites);
    }

    const ConditionCall = () => {
        Linking.openURL('https://foodealz.com/conditions-generales-de-vente/');
    };

    const dialCall = () => {

        let phoneNumber = '';

        if (Platform.OS === 'android') {
            phoneNumber = `tel:${itemdata.deals.restaurant.phone}`;
        }
        else {
            phoneNumber = `telprompt:${itemdata.deals.restaurant.phone}`;
        }

        Linking.openURL(phoneNumber);
    };

    const myCustomShare = async () => {
        if (Platform.OS) {
            const shareOptions = {
                message: itemdata.deals.deal_description + ' ' + `Vous pouvez avoir cette offre grâce à l'application FoodOrder `,
                // urls: [files.image1, files.image2]
            }
            try {
                await Share.open(shareOptions);
                // console.log(JSON.stringify(ShareResponse));
            } catch (error) {
                console.log('Error => ', error);
            }
        } else {
            const shareOptions = {
                message: itemdata.deals.deal_description + ' ' + ` Vous pouvez avoir cette offre grâce à l'application FoodOrder `,
                // urls: [files.image1, files.image2]
            }
            try {
                await Share.open(shareOptions);
                // console.log(JSON.stringify(ShareResponse));
            } catch (error) {
                console.log('Error => ', error);
            }
        }
    };

    const latitude = itemdata.deals.restaurant.latitude;
    const longitude = itemdata.deals.restaurant.longitude;
    const label = itemdata.deals.restaurant.name;
    const dialmap = () => {
        const url = Platform.select({
            ios: "maps:" + "?ll=" + latitude + "," + longitude + "?q=" + label,
            android: "geo:" + latitude + "," + longitude + "?q=" + label
        });

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                return Linking.openURL(url);
            } else {
                browser_url =
                    "https://www.google.fr/maps/@" +
                    latitude +
                    "," +
                    longitude +
                    "?q=" +
                    label;
                return Linking.openURL(browser_url);
            }
        });
    }

    const removeFavorit = async (id) => {
        // console.log(id)
        try {
            const posts = await AsyncStorage.getItem('listOflikes');
            let listOfLikes = JSON.parse(posts);
            const postsItems = listOfLikes.filter(function (item) { return item.restaurant_id !== id });
            //   console.log( JSON.stringify(postsItems))
            // updating 'posts' with the updated 'postsItems'
            await AsyncStorage.removeItem('listOflikes');
            await AsyncStorage.setItem('listOflikes', JSON.stringify(postsItems));

        } catch (error) {
            console.log('error: ', error);
        }
    };

    const favoritecall = async () => {
        console.log("lool")
        if (route.params.token === null) {
            showDialogguest()
        } else {
            let user_id;
            user_id = null;
            try {
                user_id = await AsyncStorage.getItem('userid');
            } catch (e) {
                console.log(e);
            }
            if (favorite) {
                axios
                    .delete(`${config.url}/deleteFavorite`, {
                        data: {
                            user_id: parseInt(user_id),
                            restaurant_id: parseInt(itemdata.deals.restaurant.restaurant_id)
                        }
                    })
                    .then(res => { if (res.data == "favorite Deleted!") { removeFavorit(itemData.deals.restaurant.restaurant_id); Toast.show(en.TOAST_FAVORITE); setfavorite(false) } })
                    .catch(err => alert(err));
            } else {
                axios
                    .post(`${config.url}/users/favorite`, {
                        user_id: parseInt(user_id),
                        restaurant_id: parseInt(itemdata.deals.restaurant.restaurant_id)
                    })
                    .then(res => { if (res.data == "favorite added Succefuly created") { _updatefavorite(); Toast.show(en.TOAST_FAVORITE_1); setfavorite(true); } else if (res.data == "favorite already exists") { Toast.show(en.TOAST_FAVORITE_2) } })
                    .catch(err => alert(err));
            }
        }
    }

    const reserver = async () => {
        await AsyncStorage.setItem('code', codee)
        let price;
        price = null;
        if (data.reduce && data.prix <= 5) {
            price = 0
        } else if (data.reduce && data.prix > 5) {
            price = itemdata.deals.PriceAfterDiscount - 5
        }
        else {
            price = itemdata.deals.PriceAfterDiscount
        }
        axios
            .post(`${config.url}/reservedCoupon`, {
                PriceAfterDiscount: price,
                earned_money: earnedmoney.toFixed(2),
                user_id: userid,
                restaurant_id: itemdata.deals.restaurant.restaurant_id,
                dealScheduled_id: itemdata.id,
                nbre_coupons: data.nbre,
                commission_rate: itemdata.deals.restaurant.commission_rate,
                payement: 'Sur place',
                type: "active",
                nomPartner: itemdata.deals.restaurant.name,
                reduce: data.reduce,
                username: username,
                numero: Numero,
                typee: "Non payé",
                description: itemdata.deals.description,
                detail: itemdata.deals.deal_description,
                createtime: new Date(Date.now()),
                foodQR: codee
            })
            .then(res => {
                if (res.data == "Reserved coupon added Succefuly") {
                    navigation.navigate('VaucherScreen', { itemData: newdataqr, payement: 'Sur place', code: codee })
                    modalizeRefReserveConfir.current?.close()
                    const notificationObj = {
                        app_id: 'f750576c-4163-4a7c-8fe4-3b501b921ad0',
                        contents: { en: "Vous avez une nouvelle réservation non payée" },
                        headings: { en: "Nouvelle Réservation non payée" },
                        include_player_ids: itemdata.deals.restaurant.OnesignalId.split(",")
                    };
                    console.log(`${itemdata.deals.restaurant.OnesignalId}`)
                    const jsonString = JSON.stringify(notificationObj);

                    OneSignal.postNotification(jsonString, (success) => {
                        console.log("Success:", success);
                    }, (error) => {
                        console.log("Error:", error);
                    });
                } else { }
            })
            .catch(err => Toast.show(en.TOAST_CHECK_ERROR));

    }

    const _dialog = () => (
        <View style={{ width: wp('90%'), justifyContent: 'center', alignSelf: 'center' }}>
            <View style={{ marginBottom: hp('3%'), marginTop: hp('4%'), }}>
                <Image source={require('../assets/groupe_1.png')} style={{ alignSelf: 'center', width: wp('40%'), height: hp('25%') }} />
                <Icon name="close" style={{ position: 'absolute', alignSelf: 'flex-end', marginLeft: wp('-5%') }} size={35} onPress={() => { modalizeRefReserveConfir.current?.close() }} />

            </View>
            <View style={{ marginBottom: hp('3%') }}>
                <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 18, lineHeight: 24 }}> {en.DETAIL_ITEM_CONDITION}</Text>
            </View>
            <View style={{}}>
                <Text style={{ textAlign: 'center', fontSize: 15, lineHeight: 24 }}>{en.DETAIL_ITEM_CONDITION_1} <Text style={{ fontWeight: 'bold' }}>{en.DETAIL_ITEM_CONDITION_2} </Text> {en.DETAIL_ITEM_CONDITION_3} <Text style={{ fontWeight: 'bold' }}>{en.DETAIL_ITEM_CONDITION_4}</Text> {en.DETAIL_ITEM_CONDITION_5} <Text style={{ fontWeight: 'bold' }}>{en.DETAIL_ITEM_CONDITION_6}</Text></Text>
            </View>
            <View>
                <Button style={styles.connectbtnn} mode='outlined' onPress={() => { reserver() }}>
                    <Text style={styles.btntext}>Compris</Text>
                </Button>
            </View>
        </View>
    );

    const renderguest = () => (
        <Dialog.Container visible={visibleguest}>
            <Dialog.Title style={{ fontWeight: 'bold' }}>{en.BUTTON_CONNECT}</Dialog.Title>
            <Dialog.Description>
                {en.MUST_CONNECT}
            </Dialog.Description>
            <Dialog.Button color='#36b3c9' bold={true} label="Cancel" onPress={handleCancelguest} />
            <Dialog.Button color='#36b3c9' bold={true} label="Ok" onPress={handleoptionOK} />
        </Dialog.Container>
    )
    const renderCoupon = () => (
        <Dialog.Container visible={visiblecoupon}>
            <Dialog.Title style={{ fontWeight: 'bold' }}>{en.DISCOUNT_CODE}</Dialog.Title>
            <TextInput style={styles.TextInputqt}
                placeholder="Discount code"
                placeholderTextColor="#666666"
                value={data.code}
                blurOnSubmit={false}
                onChangeText={(val) => { ChangeCode(val) }}

            // onEndEditing={(val) => {ChangeCode(val)}}
            />
            <Dialog.Button color='#36b3c9' bold={true} label="Cancel" onPress={handleCancelcoupon} />
            <Dialog.Button color='#36b3c9' bold={true} label="Confirm" onPress={handleoptionOKcoupon} />
        </Dialog.Container>
    )
    const action = () => {
        if (route.params.token === null) {
            showDialogguest()
        } else if (dealrestant == 0 && token !== null) {
            Toast.show('No offer remaining for this deal')
        } else {
            modalizeRef.current?.open();
        }
    }

    const ChangeCode = async (val) => {
        setData({
            ...data,
            code: val
        })
    }
    const onOpen = () => {
        if (data.reduce && data.prix <= 5) {
            let newCentresqr = { key: itemdata.id, numero: Numero, nomPartner: itemdata.deals.restaurant.name, nbre: data.nbre, username: username, prix: 0, user_id: userid, deal_scheduled_id: itemdata.id, deal_description: itemdata.deals.deal_description, name: itemdata.deals.restaurant.name, discount: itemdata.deals.discount, start: start, end: end, startminu: startminu, endminu: endminu, description: itemdata.deals.description, commission_rate: itemdata.deals.restaurant.commission_rate, reduce: data.reduce };
            setNewDataqr(newCentresqr)
            modalizeRef.current?.close();
            modalizeRefPay.current?.open();
        } else if (data.reduce && data.prix > 5) {
            let newCentresqr = { key: itemdata.id, numero: Numero, nomPartner: itemdata.deals.restaurant.name, nbre: data.nbre, username: username, prix: data.prix - 5, user_id: userid, deal_scheduled_id: itemdata.id, deal_description: itemdata.deals.deal_description, name: itemdata.deals.restaurant.name, discount: itemdata.deals.discount, start: start, end: end, startminu: startminu, endminu: endminu, description: itemdata.deals.description, commission_rate: itemdata.deals.restaurant.commission_rate, reduce: data.reduce };
            setNewDataqr(newCentresqr)
            modalizeRef.current?.close();
            modalizeRefPay.current?.open();
        }
        else {
            let newCentresqr = { key: itemdata.id, numero: Numero, nomPartner: itemdata.deals.restaurant.name, nbre: data.nbre, username: username, prix: data.prix, user_id: userid, deal_scheduled_id: itemdata.id, deal_description: itemdata.deals.deal_description, name: itemdata.deals.restaurant.name, discount: itemdata.deals.discount, start: start, end: end, startminu: startminu, endminu: endminu, description: itemdata.deals.description, commission_rate: itemdata.deals.restaurant.commission_rate, reduce: data.reduce };
            setNewDataqr(newCentresqr)
            modalizeRef.current?.close();
            modalizeRefPay.current?.open();
        }

    };
    const onOpenconfirm = () => {
        modalizeRefPay.current?.close();
        modalizeRefReserveConfir.current?.open();
    };

    let earnedmoney = itemdata.deals.PriceBeforeDiscount - itemdata.deals.PriceAfterDiscount
    let nbreincrement = itemdata.nbre_redeemed_deal + parseInt(data.nbre)

    const paymee = (id) => {
        if (id == 2) {
            onOpenconfirm()
        } else {

            if (data.reduce && data.prix <= 5) {
                // var datapaymee = {
                //     "vendor": 11388,
                //     "amount": 0,
                //     "note": "Order #1000132"
                // }
                onOpenconfirm()
            } else if (data.reduce && data.prix > 5) {
                var datapaymee = {
                    "vendor": 11388,
                    "amount": data.prix - 5,
                    "note": "Order #1000132"
                }
                let axiosConfig = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token 5a1097feecd252a40732220910c88dd2c1242465'
                    }
                };
                axios.post('https://app.paymee.tn/api/v1/payments/create', datapaymee, axiosConfig)
                    .then((res) => {
                        navigation.navigate('Webvieww', { token: res.data.data.token, itemData: route.params.itemData, list: newdataqr, status: true, payement: 'online', code: codep })
                    })
                    .catch((err) => {
                        console.log("AXIOS ERROR: ", err);
                    })
            }
            else {
                var datapaymee = {
                    "vendor": 11388,
                    "amount": data.prix,
                    "note": "Order #1000132"
                }
                let axiosConfig = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token 5a1097feecd252a40732220910c88dd2c1242465'
                    }
                };
                axios.post('https://app.paymee.tn/api/v1/payments/create', datapaymee, axiosConfig)
                    .then((res) => {
                        navigation.navigate('Webvieww', { token: res.data.data.token, itemData: route.params.itemData, list: newdataqr, status: true, payement: 'online', code: codep })
                    })
                    .catch((err) => {
                        console.log("AXIOS ERROR: ", err);
                    })
            }
        }

    }
    const editOrder = (action) => {

        if (action == "+") {
            if (data.nbre < dealrestant) {
                let qt = data.nbre + 1
                let prix = (itemdata.deals.PriceAfterDiscount * qt).toFixed(1)
                if (qt == dealrestant) {
                    setData({
                        ...data,
                        nbre: qt,
                        prix: prix,
                        colorplus: '#b4b4b4',
                        color: '#36b3c9'
                    })
                } else {
                    setData({
                        ...data,
                        nbre: qt,
                        prix: prix,
                        colorplus: '#36b3c9',
                        color: '#36b3c9'
                    })
                }
            }
        }

        if (action == "-") {
            if (data.nbre > 1) {
                let qt = data.nbre - 1
                let prix = (itemdata.deals.PriceAfterDiscount * qt).toFixed(1)
                if (qt == 1) {
                    setData({
                        ...data,
                        nbre: qt,
                        prix: prix,
                        color: '#b4b4b4',
                        colorplus: '#36b3c9',
                    })
                } else {
                    setData({
                        ...data,
                        nbre: qt,
                        prix: prix,
                        color: '#36b3c9',
                        colorplus: '#36b3c9',

                    })
                }
            }
        }
    }

    const codereduc = () => {
        if (data.reduce && data.prix <= 5) {
            return <Text style={{ fontSize: 15, padding: 10 }}>0 $</Text>
        } else if (data.reduce && data.prix > 5) {
            return <Text style={{ fontSize: 15, padding: 10 }}>{data.prix - 5} $</Text>
        }
        else {
            return <Text style={{ fontSize: 15, padding: 10 }}>{data.prix} $</Text>

        }
    }
    const renderInnerReserve = () => (
        <View style={{ height: hp('60%') }}>
            <View style={{ borderBottomColor: '#b4b4b4', borderBottomWidth: 1, width: wp('100%'), height: hp('100%'), }} >
                <CardItem >
                    <View style={{ flexDirection: 'column', alignItems: 'center', width: wp('90%'), borderBottomColor: '#b4b4b4', borderBottomWidth: 1 }}>
                        <View style={{ width: wp('85%') }}>
                            <Text style={{ textAlign: 'center', fontSize: 24, marginLeft: wp('0.5%'), marginBottom: hp('1%'), color: '#00CED1', fontFamily: 'Rubik-Bold', fontWeight: 'bold' }}>Economize {itemdata.deals.discount}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Icon name="ios-time-outline" style={{ color: '#3a4047' }} size={20} />
                                <Text style={{ textAlign: 'center', fontSize: 13, marginLeft: wp('1%'), marginBottom: hp('1.5%'), marginTop: hp('0.2%'), color: '#686663', fontFamily: 'Rubik-Regular', fontWeight: 'bold' }}>{en.TODAY} {itemdata.startingdate_hours} - {itemdata.expirydate_hours}</Text>
                            </View>
                        </View>
                    </View>
                </CardItem>
                <View>
                    <Text style={{ textAlign: 'center', fontSize: 15, marginLeft: wp('1%'), marginBottom: hp('3%'), marginTop: hp('0.2%'), color: 'black', fontFamily: 'Rubik-Regular', fontWeight: 'bold' }}>{en.CHOOSE_QT}</Text>
                </View>
                <View
                    style={{
                        marginLeft: wp('28%'),
                        // marginTop: hp('2%'),
                        width: wp('43%'),
                        height: hp('4%'),
                        justifyContent: 'center',
                        flexDirection: 'row',
                        borderBottomColor: "#00CED1",
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
                <CardItem style={{ flexDirection: "column" }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('1%'), borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#b4b4b4b4', width: wp('90%'), alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, padding: 10 }}> Total</Text>
                        {codereduc()}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('0%'), borderBottomWidth: 1, borderColor: '#b4b4b4b4', width: wp('90%'), alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, padding: 10 }}>Discount code</Text>
                        <CheckBox
                            disabled={false}
                            value={toggleCheckBox}
                            onValueChange={(newValue) => { Checkcoupon(newValue) }}
                        />
                        {/* <Text style={{ fontSize: 15, padding: 10 }}>{data.prix} DT</Text> */}
                    </View>
                </CardItem >

                <View style={{ flexDirection: 'row', marginTop: hp('0%') }}>
                    <Text style={{ textAlign: 'center', fontSize: 13, marginLeft: wp('1%'), marginTop: hp('0.2%'), color: '#686663', fontFamily: 'Rubik-Regular' }}>By reserving this basket, you accept the
                    <Text style={{ textDecorationLine: 'underline' }} onPress={ConditionCall}> General Conditions of Use</Text> of FoodOrder</Text>
                </View>

                <View>
                    <Button style={styles.connectbtnreserve} mode='outlined' onPress={() => { onOpen() }}>
                        <Text style={styles.btntext}>{en.BUTTON_RESERVE}</Text>
                    </Button>
                </View>
            </View>
        </View >
    )

    const renderpaymentview = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => { paymee(item.id) }}>
                <ListItem bottomDivider style={{ backgroundColor: 'grey' }}>
                    {/* <Avatar source={{ uri: item.logo }} /> */}
                    <ListItem.Content>
                        <ListItem.Title>{item.name}</ListItem.Title>
                        {/* <ListItem.Subtitle>{item.address}</ListItem.Subtitle> */}
                        {/* <ListItem.Subtitle><StarRating ratings={item.rating} /></ListItem.Subtitle> */}
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </TouchableOpacity>
        );
    };

    const Headerrender = () => (
        <View style={{ height: hp('7%'), marginTop: hp('4%'), marginLeft: wp('5%'), flexDirection: 'row', }}>
            <TouchableOpacity onPress={() => { modalizeRefPay.current?.close() }}>
                <Text style={{ textAlign: 'left', fontSize: 15, marginTop: hp('0.2%'), color: '#686663', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', marginLeft: wp('10%'), fontWeight: 'bold', fontSize: 17, color: '#686663' }}> Payment methods</Text>
        </View>
    )

    const renderpayment = () => (
        <SafeAreaView style={{ height: wp('50%') }}>
            <FlatList
                data={newdata}
                renderItem={renderpaymentview}
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={Headerrender}
            />
        </SafeAreaView>
    )

    return (
        <View style={styles.container} >
            <StatusBar
                backgroundColor={'transparent'}
                barStyle='dark-content'
            />
            <View style={{ top: hp('-0.8%') }}>
                <CardItem cardBody >
                    {route.params.status == false ?
                        <View style={styles.overlay}>
                            <Image source={{ uri: itemdata.deals.imageurl }}
                                style={{ flex: 1, width: null, height: hp('30%'), resizeMode: 'cover', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
                            />
                        </View>
                        :
                        <Image source={{ uri: itemdata.deals.imageurl }}
                            style={{ flex: 1, width: null, height: hp('30%'), resizeMode: 'cover', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
                        />
                    }
                    {
                        Platform.OS ?
                            <Icon name="chevron-back-outline" style={{ color: 'black', padding: 5, top: hp('6%'), left: wp('5%'), position: 'absolute', zIndex: 1, borderRadius: 30, backgroundColor: '#fff' }} size={30} onPress={() => { navigation.goBack() }} />
                            :
                            <Icon name="chevron-back-outline" style={{ color: 'black', position: 'absolute', top: hp('3%'), left: wp('5%'), padding: 5, borderRadius: 30, backgroundColor: '#fff' }} size={30} onPress={() => { navigation.goBack() }} />
                    }
                    <TouchableOpacity style={{ position: 'absolute', left: wp('85%'), top: hp('6%') }}>
                        <Icon style={{ color: 'black', padding: 5, borderRadius: 30, backgroundColor: '#fff' }} size={30} name="share-social-outline" onPress={myCustomShare} />
                    </TouchableOpacity>
                    <View style={styles.economie}>
                        <Text style={styles.teconomie}>{dealrestant} remaining</Text>
                    </View>
                    {/* <Thumbnail source={{ uri: itemdata.deals.restaurant.logourl }} style={styles.logo} /> */}
                    {
                        Platform.OS ?
                            <TouchableOpacity style={{ position: 'absolute', marginLeft: wp('20%'), top: hp('27%'), backgroundColor: '#fff', padding: 10, zIndex: 2, borderRadius: 40 }} onPress={dialCall} >
                                <Feather size={25} name="phone-call" />
                            </TouchableOpacity>
                            :
                            <View style={{ position: 'absolute' }}>
                                <TouchableOpacity style={{ position: 'relative', marginLeft: wp('20%'), marginTop: hp('28%'), elevation: 5, backgroundColor: '#fff', padding: 10, borderRadius: 40 }} onPress={dialCall} >
                                    <Feather size={25} name="phone-call" />
                                </TouchableOpacity>
                            </View>
                    }
                    {
                        Platform.OS ?
                            <TouchableOpacity style={{ position: 'absolute', marginLeft: wp('42%'), top: hp('27%'), zIndex: 2, backgroundColor: '#fff', padding: 10, borderRadius: 40 }} onPress={dialmap}>
                                <FontAwesome size={25} name="map-o" />
                            </TouchableOpacity>
                            :
                            <View style={{ position: 'absolute' }}>
                                <TouchableOpacity style={{ position: 'relative', marginLeft: wp('42%'), marginTop: hp('28%'), elevation: 5, backgroundColor: '#fff', padding: 10, borderRadius: 40 }} onPress={dialmap}>
                                    <FontAwesome size={25} name="map-o" />
                                </TouchableOpacity>
                            </View>
                    }

                    <View style={{ position: 'absolute' }}>
                        <TouchableOpacity style={{ position: 'relative', marginLeft: wp('65%'), marginTop: hp('28%'), elevation: 5, backgroundColor: '#fff', padding: 10, borderRadius: 40 }} onPress={favoritecall}>
                            {!favorite ? <Icon size={25} name="heart-outline" color={'black'} /> : <Icon size={25} name="heart-sharp" color={'red'} />}
                        </TouchableOpacity>
                    </View>
                </CardItem>
            </View>
            <View style={{ height: hp('2.5%') }}>
            </View>
            <ScrollView style={{ flex: 8 }} contentInsetAdjustmentBehavior="automatic">
                <View style={{ borderBottomColor: '#b4b4b4', borderBottomWidth: 1, width: wp('100%'), height: hp('125%') }} >
                    <CardItem >
                        <View style={{ flexDirection: 'column', alignItems: 'center', width: wp('90%'), }}>
                            <View style={{ width: wp('85%') }}>
                                <Text style={{ textAlign: 'center', fontSize: 24, marginLeft: wp('0.5%'), marginBottom: hp('1%'), color: '#00CED1', fontFamily: 'Rubik-Bold', fontWeight: 'bold' }}>Economize {itemdata.deals.discount}</Text>
                                <Text style={{ textAlign: 'center', fontSize: 16, marginLeft: wp('0.5%'), marginBottom: hp('1.5%'), color: '#b4b4b4', fontFamily: 'Rubik-Regular', fontWeight: 'bold' }}>{itemdata.deals.restaurant.name}</Text>
                            </View>
                            <Text style={{ width: wp('80%'), color: '#3a4047', fontWeight: 'bold', fontFamily: "Rubik-Medium", fontSize: 18, textAlign: 'center' }}>{itemdata.deals.description}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                {/* <Text style={styles.textr}>{itemdata.deals.restaurant.rating}</Text> */}
                                <StarRating ratings={itemdata.deals.restaurant.rating} style={2} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: hp('0.5%'), marginBottom: hp('0.8%') }}>
                                <Text style={{ marginTop: hp('0.5%'), marginLeft: wp('0.5%'), color: '#b4b4b4', fontSize: 16 }}>{route.params.kilo}Km</Text>
                                <Text style={{ marginLeft: wp('0.5%'), color: '#000', fontSize: 16, marginTop: hp('-0.5%') }}>.</Text>
                                <Icon name="ios-card-outline" style={{ color: '#b4b4b4', marginLeft: wp('0.5%') }} size={25} />
                            </View>
                            <View style={{ borderBottomColor: '#b4b4b4', borderBottomWidth: 1, borderTopColor: '#b4b4b4', borderTopWidth: 1 }}>
                                <View style={{ flexDirection: 'row', marginTop: hp('1.5%') }}>
                                    <Icon name="ios-time-outline" style={{ color: '#3a4047' }} size={40} />
                                    <Text style={{ fontSize: 18, marginLeft: wp('0.5%'), marginTop: hp('1%'), color: '#3a4047' }}>{en.TODAY} {itemdata.startingdate_hours}  -  {itemdata.expirydate_hours}</Text>
                                </View>
                                <View style={{ width: wp('85%'), flexDirection: 'row', marginTop: hp('1%'), marginBottom: hp('2%') }}>
                                    <Icon name="ios-location-outline" color={'#3a4047'} size={40} />
                                    <Text style={{ width: wp('70%'), marginLeft: wp('0.5%'), marginTop: hp('1%'), fontFamily: "Rubik-Medium", fontSize: 16, textAlign: 'left', color: '#3a4047' }}>{itemdata.deals.restaurant.address}</Text>
                                </View>
                            </View>
                            <View style={{ width: wp('85%'), borderBottomColor: '#b4b4b4', borderBottomWidth: 1 }}>
                                <Text style={{ textAlign: 'left', fontSize: 20, marginLeft: wp('0.5%'), marginBottom: hp('2%'), marginTop: hp('1.5%'), color: 'black', fontFamily: 'Rubik-Bold', fontWeight: 'bold' }}>What you are going to have</Text>
                                <Text style={{ textAlign: 'justify', fontSize: 14, marginLeft: wp('0.5%'), color: '#3a4047', fontFamily: 'Rubik-Regular', marginBottom: hp('1%') }}>{itemdata.deals.deal_description}</Text>
                            </View>
                            <View style={{ width: wp('85%'), borderBottomColor: '#b4b4b4', borderBottomWidth: 1 }}>
                                <Text style={{ textAlign: 'left', fontSize: 20, marginLeft: wp('0.5%'), marginBottom: hp('2%'), marginTop: hp('1.5%'), color: 'black', fontFamily: 'Rubik-Bold', fontWeight: 'bold' }}>More information on the brand</Text>
                                <Text style={{ textAlign: 'justify', fontSize: 14, marginLeft: wp('0.5%'), color: '#3a4047', fontFamily: 'Rubik-Regular', marginBottom: hp('1%') }}>{itemdata.deals.restaurant.description}</Text>
                            </View>
                            <View style={{ width: wp('85%') }}>
                                <Text style={{ textAlign: 'left', fontSize: 20, marginLeft: wp('0.5%'), marginBottom: hp('2%'), marginTop: hp('1.5%'), color: 'black', fontFamily: 'Rubik-Bold', fontWeight: 'bold' }}>Terms of use</Text>
                                <Text style={{ textAlign: 'justify', fontSize: 14, marginLeft: wp('0.5%'), color: '#3a4047', fontFamily: 'Rubik-Regular' }}>The presentation of your code at the partner is required. {'\n'} Any reservation not confirmed by the partner after 2 times may be banned from the application. {'\n'} If you pay online, your reservation is confirmed. {'\n'} If you pay on site, first come first served depending on the quantity available.</Text>
                            </View>
                        </View>
                    </CardItem>
                </View>
            </ScrollView>
            {route.params.status == false ?
                null
                :
                <Animated.View style={{ opacity: fadeAnimalert, position: 'absolute', bottom: wp('17%'), left: 0, right: 0, backgroundColor: 'red', flexDirection: 'row', justifyContent: "center", height: hp('5%') }}>
                    <Icon name="md-timer-outline" size={20} style={{ color: 'white', marginTop: hp('1%') }} />
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'white', textAlign: 'center', marginLeft: wp('2%'), marginTop: hp('1%') }}>Offer ends in</Text>
                        <View>
                            <CountDown
                                until={totalDuration}
                                size={12}
                                style={{ marginTop: hp('0.2%') }}
                                digitStyle={{ backgroundColor: 'transparent' }}
                                digitTxtStyle={{ color: '#fff' }}
                                separatorStyle={{ color: '#fff' }}
                                showSeparator
                                timeToShow={['M', 'S']}
                                timeLabels={{ m: null, s: null }}
                            />
                        </View>
                        <Text style={{ marginTop: hp('1%'), color: 'white', textAlign: 'center', }}>minutes</Text>

                    </View>

                </Animated.View >
            }
            <Animated.View style={{ opacity: fadeAnim, position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'white', height: hp('10%'), borderTopWidth: 0.4, borderTopColor: "#b4b4b4b4" }}>
                {route.params.status == false ?
                    <Button disabled style={styles.connectbtnfalse} mode='outlined' onPress={() => { }}>
                        <Text style={styles.btntext}>Reserve</Text>
                    </Button>
                    :
                    <Button style={styles.connectbtn} mode='outlined' onPress={() => { action() }}>
                        <Text style={styles.btntext}>Reserve</Text>
                    </Button>
                }
                {renderguest()}
                {renderCoupon()}
            </Animated.View>
            <Modalize ref={modalizeRefReserveConfir} snapPoint={hp('62%')} modalHeight={hp('62%')} closeOnOverlayTap={false} disableScrollIfPossible={false} handlePosition='inside'>
                {_dialog()}
            </Modalize>
            <Modalize ref={modalizeRef} snapPoint={hp('60%')} modalHeight={hp('60%')} disableScrollIfPossible={false} handlePosition='inside' withHandle={false}>
                {renderInnerReserve()}
            </Modalize>
            <Modalize ref={modalizeRefPay} snapPoint={hp('35%')} modalHeight={hp('35%')} closeOnOverlayTap={false} disableScrollIfPossible={false} handlePosition='inside'>
                {renderpayment()}
            </Modalize>
        </View>
    );
}

export default CardItemDetails;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
    },
    economie: {
        width: wp('21%'),
        height: hp('3%'),
        backgroundColor: "#00CED1",
        // marginLeft: wp('5%'),
        position: 'absolute',
        marginTop: hp('12%'),
        marginLeft: hp('2%'),
        borderRadius: 4
    },
    teconomie: {
        textAlign: "center",
        marginTop: 6,
        color: '#ffffff',
        fontFamily: "Rubik-Medium",
        fontSize: 11,
    },
    overlay: {
        // position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        backgroundColor: 'black',
        opacity: 0.5,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        width: wp('100%'), height: hp('30%')
    },
    logo: {
        // width: 110,
        // height:30,
        // marginLeft:20,
        position: 'absolute',
        marginTop: hp('10%'),
        marginLeft: hp('42%'),
    },
    logoStyle: {
        width: wp('16%'),
        height: hp('7%'),

        margin: 5,
        borderRadius: 8, backgroundColor: 'grey'
    },
    text: {
        fontSize: 12,
        marginLeft: wp('1%'),
        color: '#444',
    },
    textr: {
        fontSize: 13,
        marginRight: 5,
        color: '#FF8C00'
    },
    connectbtnreserve: {
        height: hp('7%'), // 70% of height device screen
        width: wp('90%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#36b3c9",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 5,
        marginTop: hp('2%')
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
    connectbtn: {
        height: hp('7%'), // 70% of height device screen
        width: wp('90%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#36b3c9",
        justifyContent: "center",
        alignContent: "center",
        marginTop: hp('2%'),
        borderRadius: 30,
    },
    connectbtnfalse: {
        height: hp('6%'), // 70% of height device screen
        width: wp('90%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#BFBEBB",
        justifyContent: "center",
        alignContent: "center",
        marginTop: hp('2%'),
        borderRadius: 30,
    },
    btntext: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
        color: '#fff'
    },
    TextInputqt: {
        // width: wp('40%'),
        height: hp('6%'),
        borderRadius: 1,
        borderWidth: 0.5,
        borderColor: '#b4b4b4',
        marginTop: hp('0.1%'),
        fontSize: 13,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});