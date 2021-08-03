import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import Dialog from "react-native-dialog";
import StarRating from 'react-native-star-rating';
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import config from '../config.js'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import en from '../model/local_en.json'

const DealsUtilisesCard = ({ itemData, navigation }) => {

    const [isvisible, setIsVisible] = React.useState(false);
    const [rating, setRating] = React.useState(0);
    const [voter, setVoter] = React.useState(itemData.voter)
    const showdialog = () => {
        setIsVisible(true);
    };
    const hidedialog = () => {
        setIsVisible(false);
        if (parseInt(itemData.rating) == 0) {
            axios
                .put(`${config.url}/rating`, {
                    restaurantId: itemData.restaurant_id,
                    rating: rating,
                    noter: true,
                    coupon_id: itemData.key
                })
                .then(res => { if (res.data == "rating updated!") { Toast.show('Thank you for your evaluation'); setVoter(true); setRating(0) } })
                .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
        } else if (rating == 0) {
            setRating(0)
        } else {
            let rate = (parseInt(itemData.rating) + rating) / 2
            axios
                .put(`${config.url}/rating`, {
                    restaurantId: itemData.restaurant_id,
                    rating: Math.round(rate),
                    noter: true,
                    coupon_id: itemData.key
                })
                .then(res => { if (res.data == "rating updated!") { Toast.show('Thank you for your evaluation'); setVoter(true); setRating(0) } })
                .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
        }
    };

    const handleRating = (rating) => {
        setRating(rating);
    }
    const dialog = () => (
        <View style={{ width: wp('80%') }}>
            <View style={{ width: wp('80%'), marginBottom: hp('1%') }}>
                <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 18, lineHeight: 24 }}>Evaluation de la qualité et du service du notre partenaire</Text>
            </View>
            <StarRating
                disabled={false}
                maxStars={5}
                rating={rating}
                emptyStarColor={'#0095ff'}
                selectedStar={(rating) => handleRating(rating)}
                fullStarColor={'#0095ff'}
                starSize={30}
                containerStyle={{ marginLeft: wp('-1%'), alignContent: 'center', justifyContent: 'center', marginTop: hp('3%') }}
                starStyle={{ marginLeft: wp('5%'), marginRight: wp('4%') }}
            />
            <View>
                <Button style={styles.connectbtnn} mode='outlined' onPress={() => { hidedialog() }}>
                    <Text style={styles.btntextt}>Envoyer</Text>
                </Button>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ height: hp('12%'), width: wp('68%'), marginLeft: wp('0%'), marginTop: hp('0.5%'), borderRadius: 15 }}>
            <View style={{ height: null, marginTop: hp('2%'), marginLeft: wp('1%'), marginRight: wp('3%'), borderRadius: 8, marginBottom: hp('1%'), flexDirection: 'row' }} >
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate("VaucherScreen", { itemData: itemData, code: itemData.code })}>
                    <View style={styles.overlay}>
                        <Image source={{ uri: itemData.image }}
                            style={{ width: wp('27%'), height: hp('10%'), resizeMode: 'cover', borderRadius: 8 }}
                        />
                    </View>
                    <View style={{ height: null, width: wp('38%'), marginTop: hp('2%'), marginLeft: wp('1%') }}>
                        <Text numberOfLines={1} style={{ fontSize: 14, marginLeft: wp('0%'), marginBottom: hp('1%'), color: '#000', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-1%') }}>{itemData.description}</Text>
                        <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('1%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>{itemData.name}</Text>
                        <Text style={{ textAlign: 'left', fontSize: 12, marginLeft: wp('1%'), marginBottom: hp('1%'), color: '#b4b4b4', fontFamily: 'Rubik-Bold', fontWeight: 'bold', marginTop: hp('-0.5%') }}>Quantity: {itemData.nbre}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default DealsUtilisesCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    economie: {
        width: wp('10%'),
        height: hp('10%'),
        backgroundColor: "#00CED1",
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
        height: hp('8%'), // 70% of height device screen
        width: null,
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#36b3c9",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 5,
        marginLeft: wp('2%')
    },
    connectbtnd: {
        height: hp('8%'), // 70% of height device screen
        width: null,
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#36b3c9",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 5,
        marginLeft: wp('2%')
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
    // overlay: {
    //     // position: 'absolute',
    //     top: 0,
    //     right: 0,
    //     left: 0,
    //     marginBottom: hp('1%'),
    //     backgroundColor: 'black',
    //     opacity: 0.3,
    //     borderRadius: 8,
    //     // bottom:hp('1%'),
    //     width: wp('27%'), height: hp('10%')
    // },
});