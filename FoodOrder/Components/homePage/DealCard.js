import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, CardItem, Thumbnail} from 'native-base'
const { height, width } = Dimensions.get('window')
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableRipple } from "react-native-paper";
import haversine from 'haversine';

import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import config from '../../config.js'
import Toast from 'react-native-simple-toast';
import Dialog from "react-native-dialog";
import { AuthContext } from '../context';
import en from '../../model/local_en.json'

const DealCard = ({ itemData, navigation, favorite, token }) => {
    const deals = itemData.deals
    const restaurant = itemData.deals.restaurant
    const kilo = Math.floor(Math.random() * 10) + 1
    const [kiloo, setKilo] = React.useState(null)
    const [dealrestant, setDealrestant] = React.useState(null);
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
        distance()
        quantity()
    }, [])

    
        return (
            <TouchableRipple onPress={() => { navigation.navigate('CardItemDetails', { itemData: itemData, favorite: favorite, kilo: kiloo,status: true, token: token }) }} style={{  height: hp('24.5%'), width: wp('86.4%'), marginLeft: wp('3%'), marginTop: hp('2%'), borderRadius: 15 }} >
                <Card style={{ height: hp('23.5%'), width: null, borderRadius: 15 }}>
                    <CardItem cardBody style={{ borderRadius: 20, flexDirection: 'row' }}>
                        <Image source={{ uri: deals.imageurl }}
                            style={{ flex: 1, width: null, height: hp('15%'), resizeMode: 'cover', borderTopLeftRadius:15,borderTopRightRadius:15 }}
                        />
                        <View style={styles.economie}>

                            <Text style={{ textAlign: 'center', color: '#ffffff', marginTop: hp('0.7%'), fontSize: 12 }}> {dealrestant} {en.TO_SAVE}</Text>
                        </View>
                        <Thumbnail scaleX={0.8} scaleY={0.8} source={{ uri: restaurant.logourl }} style={styles.logo}/>
                        

                    </CardItem>
                    <CardItem cardBody style={{ borderRadius: 20, flexDirection: 'row' }}>
                        <View style={styles.text}>
                            <View style={{ width: wp('50%'), marginLeft: wp('2%') }}>
                                <Text numberOfLines={1} style={styles.textt}>{deals.description}</Text>
                            </View>

                        </View>
                        <View style={styles.foot}>
                        <View style={{ flexDirection: 'row', opacity: 0.7, top: hp('0.4%'), bottom: hp('3%') }}>
                                <Text style={styles.cardTime}>{en.TODAY} {itemData.startingdate_hours}  -  {itemData.expirydate_hours} </Text>
                                <Text style={{ marginLeft: wp('2.5%'), color: '#000', fontSize: 13, marginTop: hp('-0.5%') }}>.</Text>
                                <Text style={{ marginLeft: wp('0.5%'), color: '#686663', fontSize: 13 }}>{kiloo} km</Text>
                            </View>
                            <View style={{ left: wp('3%'), marginTop:hp('-3%') }}>
                                <Text style={{ color: '#b4b4b4b4', fontSize: 13, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{deals.PriceBeforeDiscount} $</Text>
                                <Text style={{ color: '#36b3c9', fontSize: 17 }}>{deals.PriceAfterDiscount} $</Text>
                            </View>
                        </View>
                    </CardItem>
                    <View style={{ position: 'absolute' }}>
                    <TouchableOpacity style={{ position: 'relative', marginLeft: wp('70%'), marginTop: hp('0.7%'), elevation: 5, backgroundColor: '#fff', padding: 10, borderRadius: 40 }} onPress={favoritecall}>
                        {!favoritee ? <Icon size={25} name="heart-outline" color={'black'} /> : <Icon size={25} name="heart-sharp" color={'red'} />}
                    </TouchableOpacity>
                </View>
                {renderguest()}
                </Card>
            </TouchableRipple>
        );
}

export default DealCard;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    economie: {
        width: wp('20%'),
        height: hp('4%'),
        backgroundColor: "#00CED1",
        marginLeft: wp('4%'),
        position: 'absolute',
        top: hp('2S%'),
        borderRadius: 4
    },
    cardTime: {
        left: wp('0.5%'),
        color: '#686663',
        fontFamily: "Rubik-Regular"
    },
    teconomie: {
        textAlign: "center",
        marginTop: hp('0.7%'),
        color: '#ffffff',
        fontFamily: "Rubik-Medium",
        fontSize: 13,
    },
     Peconomie: {
        width: wp('15%'),
        height: hp('6%'),
        backgroundColor: "#36b3c9",
        marginLeft: wp('62%'),
        position: 'absolute',
        top: hp('8%'),
        borderRadius: 4,
        flexDirection:"column"

    },
    text: {
        width: wp('79%'),
        height: hp('2%'),
        // marginLeft:20,
        // position: 'absolute',
        lineHeight: 24,
        top: hp('2%'),
        // backgroundColor: '#b4b4b4b4'

        // left: wp('4%'),
        // borderRadius:10,
        // backgroundColor:'#b4b4b4b4',
        // borderBottomRightRadius:15,
        // borderBottomLeftRadius:15,
    },
    textt: {
        // marginTop: 6,
        color: '#000',
        fontFamily: "Rubik-Medium",
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: "left",
        // lineHeight: 24,
        // left: wp('3%'),
        // right: wp('4%')
    },
    foot: {
        flexDirection: 'row',
        width: wp(('50%')),
        height: hp('4%'),
        position: 'absolute',
        top: hp('4%'),
        left: wp('2%'),
        // justifyContent: 'center',
        alignItems: 'center',
        // opacity: 0.8,
    },
    footer: {
        // marginTop: hp('2%'),
        color: '#000',
        fontFamily: "Rubik-Regular",
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'justify',
        lineHeight: 24
    },
    logo: {
        // width: 110,
        // height:30,
        // marginLeft:20,
        position: 'absolute',
        top: hp('7.5%'),
        left: wp('2%'),
        borderColor: '#b4b4b4b4',
        borderWidth: 0.6

    },
});