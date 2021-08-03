import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    FlatList,
    Image
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import Etape3Card from "./Etape3Card";
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import config from '../../config.js'


const Etape3 = ({ itemData, navigation }) => {
    const [data, setData] = React.useState({
        nbre: 1,
        date: null,
        data: [],
        payment: '',
        color: '#b4b4b4',
        colorplus: '#36b3c9',
        birthday: '',
        sexe: ''
    });
    const [userid, setUserid] = React.useState(0);

    const getData = async () => {
        let response = await AsyncStorage.getItem('checkin');
        var listofvalidation = await JSON.parse(response) || [];
        setData({
            ...data,
            data: listofvalidation,
        })

    };
    useEffect(() => {
        setTimeout(async () => {
            const isFocused = navigation.isFocused();
            if (isFocused) {
                let user_id;
                user_id = null;
                try {
                    user_id = await AsyncStorage.getItem('userid');
                } catch (e) {
                    console.log(e);
                }
                setUserid(parseInt(user_id))
                getData()
                console.log('focused section');
            }
            let navFocusListener = navigation.addListener('focus', () => {
                getData()
                console.log('listener section');
            });
            return navFocusListener

        }, 500);


    }, [navigation])


    const renderItem = ({ item }) => {
        return (
            <Etape3Card itemData={item} navigation={navigation} />
        )
    };
    const renderHeader = () => (
        <View>
            <StatusBar
                backgroundColor={'transparent'}
                barStyle='dark-content'
            />
            <View style={{ marginTop: hp('5%'), marginBottom: hp('1%'), justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ justifyContent: 'center', color: '#36b3c9', fontWeight: 'bold', fontSize: 20 }}>Step3: Validation of the basket(s)</Text>
            </View>
        </View>

    )

    const renderFooter = () => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('2%') }}>
            <View style={{ height: hp('6%'), backgroundColor: 'white', flexDirection: 'row', marginLeft: wp('3%'), marginTop: hp('1%') }}>
                <AntDesign name="leftcircle" style={{ paddingLeft: wp('1%'), color: 'black', }} size={30} onPress={() => { navigation.goBack() }} />
                <Text style={{ marginLeft: wp('1%'), color: 'black', fontSize: 17, marginTop: hp('0.5%') }}>
                    Back
              </Text>
            </View>
            <View style={{ height: hp('6%'), backgroundColor: 'white', flexDirection: 'row', marginRight: wp('3%'), marginTop: hp('1%') }}>
                <Text style={{ marginRight: wp('1%'), color: 'black', fontSize: 17, marginTop: hp('0.5%') }}>
                Confirm
              </Text>
                <AntDesign name="checkcircle" style={{ paddingLeft: wp('1%'), color: 'black' }} size={30} onPress={() => { PublierCouffin() }} />
            </View>
        </View>

    )


    const PublierCouffin = () => {
        if (data.data.length == 0 ) {
            Toast.show("Please choose an unsold to be able to publish it")
        } else {
            axios.post(`${config.url}/multiPanier`, data.data).then(async (res) => {
                if (res.data == "done") {
                    await AsyncStorage.setItem('checkin', JSON.stringify([]));
                    setData({
                        ...data,
                        ListCouffins: []
                    })
                    Toast.show("Basket (s) added successfully!")
                    navigation.navigate('HomeDrawer')
                }
            })
                .catch(err => Toast.show("Please check your addition!"));
        }
    }
    return (

        <View style={styles.container}>
            {renderHeader()}
            <View style={{ height: hp('78%') }}>
                {
                    data.data.length == 0 ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Image source={require('../../assets/noitemfound.png')} style={{ width: wp('50%'), height: hp('20%'), marginBottom: hp('2%') }} />
                            <Text style = {{fontWeight: 'bold', textAlign: 'center', marginBottom: hp("1%")}}> No Unsold to validate </Text>
                            <Text style = {{width: wp('60%'), textAlign:'center', color:'#686663'}}> The unsold items to be validated can be found here </Text>
                        </View>
                        :
                        <FlatList
                            data={data.data}
                            renderItem={renderItem}
                            keyExtractor={item => item.name}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={false}
                        />
                }
            </View>
            {renderFooter()}


        </View>

    );
};

export default Etape3;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
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
        borderColor: '#b4b4b4',
        marginTop: hp('1%'),
        fontSize: 13,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});