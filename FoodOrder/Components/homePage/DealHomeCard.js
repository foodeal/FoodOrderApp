import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image, TouchableOpacity
} from "react-native";
import { Card, Thumbnail } from 'native-base'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableRipple } from "react-native-paper";
import haversine from 'haversine';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import config from '../../config.js'
import Toast from 'react-native-simple-toast';
import Dialog from "react-native-dialog";
import { AuthContext } from '../context';
import en from '../../model/local_en.json'

const Deal = ({ itemData, favorite, navigation, token }) => {
    const deals = itemData.deals
    const restaurant = itemData.deals.restaurant
    const [kiloo, setKilo] = React.useState(null)
    const [dealrestant, setDealrestant] = React.useState(null);
    const [commencer, setCommencer] = React.useState(false);
    const [visibleguest, setVisibleguest] = React.useState(false);
    const [favoritee, setfavoritee] = React.useState(false);
    const { LoginToContinu } = React.useContext(AuthContext);
    const [favorites, setfavorites] = React.useState([]);

    //Calculate distance
    const calcDistance = () => {
        const start = {
            latitude: favorite[0].latitude,
            longitude: favorite[0].longitude
        }
        const end = {
            latitude: restaurant.latitude,
            longitude: restaurant.longitude
        }
        return haversine(start, end).toFixed(1);
    };
    const showDialogguest = () => {
        setVisibleguest(true);
    };
    const handleCancelguest = () => {
        setVisibleguest(false);
    };
    const handleoptionOK = () => {
        LoginToContinu()
    }
    // console.log(calcDistance())

    const distance = () => {
        setKilo(calcDistance())
    }
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

    const quantity = () => {
        const quantity = itemData.quantity - itemData.nbre_redeemed_deal
        if (quantity >= 0) {
            setDealrestant(quantity)
        } else {
            setDealrestant(0)
        }
        if (token !== null) {
            searchFilterFunction()
        }
    }
    const favoritecall = async () => {
        if (token === null) {
            showDialogguest()
        } else {
            let user_id;
            user_id = null;
            try {
                user_id = await AsyncStorage.getItem('userid');
            } catch (e) {
                console.log(e);
            }
            if (favoritee) {
                axios
                    .delete(`${config.url}/deleteFavorite`, {
                        data: {
                            user_id: parseInt(user_id),
                            restaurant_id: parseInt(itemData.deals.restaurant.restaurant_id)
                        }
                    })
                    .then(res => { if (res.data == "favorite Deleted!") { removeFavorit(itemData.deals.restaurant.restaurant_id); Toast.show(en.TOAST_FAVORITE); setfavoritee(false) } })
                    .catch(err => alert(err));
            } else {
                axios
                    .post(`${config.url}/users/favorite`, {
                        user_id: parseInt(user_id),
                        restaurant_id: parseInt(itemData.deals.restaurant.restaurant_id)
                    })
                    .then(res => { if (res.data == "favorite added Succefuly created") { _updatefavorite(); Toast.show(en.TOAST_FAVORITE_1); setfavoritee(true); } else if (res.data == "favorite already exists") { Toast.show(en.TOAST_FAVORITE_2) } })
                    .catch(err => alert(err));
            }
        }
    }
    const _updatefavorite = async () => {
        let response = await AsyncStorage.getItem('listOflikes');
        var listOfLikes = await JSON.parse(response) || [];
        listOfLikes.push({ "restaurant_id": itemData.deals.restaurant.restaurant_id })
        await AsyncStorage.removeItem('listOflikes');
        await AsyncStorage.setItem('listOflikes', JSON.stringify(listOfLikes));
        setfavorites(
            listOfLikes
        );
        // console.log(favorites);
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
    const searchFilterFunction = async () => {
        var response = await AsyncStorage.getItem('listOflikes');
        var listOfLikes = await JSON.parse(response);
        setfavorites(
            listOfLikes
        );
        if (listOfLikes) {
            const newData = listOfLikes.filter((item) => {
                const itemDataa = `${item.restaurant_id}`;
                const textData = parseInt(itemData.deals.restaurant.restaurant_id);
                return itemDataa.indexOf(textData) > -1;
            });
            if (newData == '') {
                setfavoritee(false)
            } else {
                setfavoritee(true)
            }
        }
    };
    useEffect(() => {
        Promise.all([
            quantity(),
            distance()
        ])
    }, [calcDistance])

    return (
        <TouchableRipple onPress={() => { navigation.navigate('CardItemDetails', { itemData: itemData, favorite: favorite, kilo: kiloo, active: commencer, status: true, token: token }) }} >
            <Card style={{ height: null, marginTop: hp('3%'), marginLeft: wp('3%'), marginRight: wp('3%'), borderRadius: 8, marginBottom: hp('1%') }} >
                <Image source={{ uri: deals.imageurl }}
                    style={{ flex: 1, width: null, height: hp('20%'), resizeMode: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8, bottom: hp('1%') }}
                />
                <View style={styles.Uniteactive}>
                    <Text style={{ textAlign: 'center', color: '#ffffff', marginTop: hp('0.7%'), fontSize: 12 }}> {dealrestant} {en.TO_SAVE}</Text>
                </View>
                <Thumbnail source={{ uri: restaurant.logourl }} style={styles.logo} />

                <View style={{ width: wp('80%'), left: wp('2%'), marginBottom: hp('1%'), flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: wp('70%') }}>
                        <Text style={{ color: '#3a4047', textAlign: 'left', marginLeft: wp('1%'), fontSize: 18, fontFamily: "Rubik-Regular", fontWeight: 'bold', backgroundColor: 'transparent', marginTop: hp('0%') }}>{deals.description}</Text>
                        {/* <StarRating ratings={restaurant.rating} style={{ top: hp('1%') }} /> */}
                        {/* <Text style={styles.cardTime}>Aujourd'hui de {itemData.startingdate_hours} à {itemData.expirydate_hours} </Text> */}
                        <View style={{ flexDirection: 'row', opacity: 0.7, top: hp('0.4%'), bottom: hp('3%') }}>
                            <Text style={styles.cardTime}>{en.TODAY}  {itemData.startingdate_hours}  -  {itemData.expirydate_hours} </Text>
                            <Text style={{ marginLeft: wp('1%'), color: '#000', fontSize: 14, marginTop: hp('-0.5%') }}>.</Text>
                            <Text style={{ marginLeft: wp('1%'), color: '#686663', fontSize: 14 }}>{kiloo} km</Text>
                        </View>
                    </View>
                    <View style={{ left: wp('-2%'), alignSelf: 'center' }}>
                        <Text style={{ color: '#b4b4b4b4', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{deals.PriceBeforeDiscount} $</Text>
                        <Text style={{ color: '#36b3c9', fontSize: 20 }}>{deals.PriceAfterDiscount} $</Text>
                    </View>
                </View>
                <View style={{ position: 'absolute' }}>
                    <TouchableOpacity style={{ position: 'relative', marginLeft: wp('78%'), marginTop: hp('0.4%'), elevation: 5, backgroundColor: '#fff', padding: 10, borderRadius: 40 }} onPress={favoritecall}>
                        {!favoritee ? <Icon size={25} name="heart-outline" color={'black'} /> : <Icon size={25} name="heart-sharp" color={'red'} />}
                    </TouchableOpacity>
                </View>
                {renderguest()}
            </Card>
        </TouchableRipple>
    );
}

export default Deal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    Uniteactive: {
        width: wp('20%'),
        height: hp('3%'),
        backgroundColor: "#00CED1",
        // marginLeft: 20,
        position: 'absolute',
        marginTop: hp('0.%'),
        marginLeft: wp('4%'),
        borderRadius: 5,
        // opacity: 0.8

    },
    uniteExpirer: {
        width: wp('17%'),
        height: hp('4%'),
        backgroundColor: "#696969",
        // marginLeft: 20,
        position: 'absolute',
        marginTop: hp('1%'),
        marginLeft: wp('4%'),
        borderRadius: 20,
        opacity: 0.8
    },
    teconomie: {
        textAlign: "center",
        marginTop: hp('0.8%'),
        color: '#ffffff',
        fontFamily: "Rubik-Medium",
        fontSize: 13,
    },
    logo: {
        // width: 110,
        // height:30,
        // marginLeft:20,
        position: 'absolute',
        top: hp('10%'),
        left: wp('5%'),
        borderColor: '#b4b4b4b4',
        borderWidth: 0.6

    },
    cardTime: {
        left: wp('1%'),
        color: '#686663',
        fontFamily: "Rubik-Regular"
    },
    countdown: {
        backgroundColor: '#00CED1',
        position: 'absolute',
        width: wp('40%'),
        top: hp('7%'),
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 40,
        flexDirection: 'row', opacity: 0.9

        // left: wp('65%')
    },
    countdownexp: {
        backgroundColor: '#fff',
        position: 'absolute',
        width: wp('18%'),
        top: hp('1%'),
        justifyContent: 'center',
        left: wp('70%'),
        borderRadius: 40,
        flexDirection: 'row', opacity: 0.9

        // left: wp('65%')
    }
});