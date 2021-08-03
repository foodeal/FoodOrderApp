import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    SafeAreaView,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
// import StarRating from '../StarRating';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { List, ListItem, Avatar } from "react-native-elements";
import StarRating from './StarRating';

const favorite = ({ route, navigation }) => {
    const [data, setData] = React.useState({
        error: null,
        data: route.params.itemData
    });
    const [newdata, setNewData] = React.useState([]);
    useEffect(() => {
        const newCentres = data.data.map((item) => ({ key: item.id, name: item.restaurant.name, address: item.restaurant.address, logo: item.restaurant.logourl, rating: item.restaurant.rating }));
        setNewData(newCentres)
    }, [])

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
            <ListItem bottomDivider style={{ backgroundColor: 'grey' }}>
                <Avatar source={{ uri: item.logo }} />
                <ListItem.Content>
                    <ListItem.Title>{item.name}</ListItem.Title>
                    <ListItem.Subtitle>{item.address}</ListItem.Subtitle>
                    <ListItem.Subtitle><StarRating ratings={item.rating} /></ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: hp('7%'), backgroundColor: 'transparent', borderBottomColor: '#b4b4b4b4', borderBottomWidth: 0.2 }}>
                <Icon name="chevron-back-outline" style={{ paddingLeft: wp('4%'), color: 'black', top: hp('2%') }} size={30} onPress={() => { navigation.goBack() }} />
            </View>
            {newdata == '' ?
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Image source={require('../assets/nofavoris.jpg')} style={{ width: wp('50%'), height: hp('20%'), marginBottom: hp('2%') }} />
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: hp("1%"),fontSize:16 }}>No favorites yet</Text>
                    <Text style={{ width: wp('60%'), textAlign: 'center', color: '#686663',fontSize:16 }}>Press the heart of an offer to add it to your favorites and it will be displayed here</Text>
                </View>
                :
                <FlatList
                    data={newdata}
                    renderItem={renderItem}
                    keyExtractor={item => item.key.toString()}
                    ItemSeparatorComponent={renderSeparator}
                />
            }
        </SafeAreaView>

    );
}

export default favorite;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});