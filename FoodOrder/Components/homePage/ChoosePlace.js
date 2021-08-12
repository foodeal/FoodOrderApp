import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
// import StarRating from '../StarRating';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { List, ListItem, Avatar } from "react-native-elements";
import AsyncStorage from '@react-native-community/async-storage';
import Button from 'react-native-paper/lib/commonjs/components/Button';
import en from '../../model/local_en.json'


const ChoosePlace = ({ route, navigation }) => {
    const [data, setData] = React.useState({
        error: null,
        data: route.params.itemData,
        favorite: []
    });
    const [newdata, setNewData] = React.useState([]);
    useEffect(() => {
        setNewData(route.params.itemData)
    }, [])

    const ChoisirEmplacement = async (item) => {
        const loc = {
            latitude: item.latitude,
            longitude: item.longitude,
            nameLocation: item.name
        }
        data.favorite = []
        data.favorite.push(loc)
        try {
            await AsyncStorage.setItem('location', JSON.stringify(data.favorite));
        } catch (e) {
            console.log(e);
        }
        navigation.navigate('HomeDrawer', { itemData: JSON.stringify(data.favorite) });
    }
    const renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CED0CE",
                }}
            />
        );
    };

    const renderItem = ({ item }) => {
        return (
            <ListItem bottomDivider style={{ backgroundColor: 'grey' }} button onPress={() => { ChoisirEmplacement(item) }}>
                <Avatar source={require('../../assets/logolocation.png')} />
                <ListItem.Content>
                    <ListItem.Title>{item.name}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ justifyContent: 'center', height: hp('10%'), backgroundColor: 'transparent', borderBottomColor: '#b4b4b4b4', borderBottomWidth: 1, flexDirection: 'row' }}>
                <View style={{}}>
                    <Text style={{ paddingLeft: wp('1%'), color: 'black', fontWeight: 'bold', fontSize: 15, marginLeft: wp('10%'), textAlign: 'center', marginTop: hp('2%'), width: wp('70%') }}>{en.INITMAP_TITLE}</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Icon name="close" style={{ paddingLeft: wp('1%'), color: '#b4b4b4', top: hp('3%'), marginLeft: wp('4%') }} size={30}  />
                </TouchableOpacity>
            </View>
            {/* {newdata == '' ?
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Image source={require('../assets/nofavoris.jpg')} style={{ width: wp('50%'), height: hp('20%'), marginBottom: hp('2%') }} />
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: hp("1%") }}>Pas encore de favoris</Text>
                    <Text style={{ width: wp('60%'), textAlign: 'center', color: '#686663' }}>Appuyer sur le coeur d'un offre pour l'ajouter à vos favoris et il s'affichera ici</Text>
                </View>
                : */}
            <View style={{ height: hp('70%'), marginBottom: hp('1%') }}>
                <FlatList
                    data={newdata}
                    renderItem={renderItem}
                    keyExtractor={item => item.key.toString()}
                    ItemSeparatorComponent={renderSeparator}
                />
            </View>
            <Button style={styles.connectbtn} mode='outlined' onPress={() => { navigation.navigate('InitMap') }}>
                <Text style={styles.btntext}>{en.BUTTON_CHOOSELOCATION}</Text>
            </Button>
            {/* } */}
        </SafeAreaView>

    );
}

export default ChoosePlace;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    connectbtn: {
        // position: 'absolute',
        marginTop: Platform.OS === 'ios' ? hp('2%') : hp('2%'),
        padding: 5,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 1,
        height: hp('7%'), // 70% of height device screen
        width: wp('85%'),
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        backgroundColor: "#36b3c9",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 30,
    },
    btntext: {
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 22,
        color: '#fff'
    },
});