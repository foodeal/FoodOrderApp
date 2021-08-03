import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    SafeAreaView,
    Alert,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Deal from './DealHomeCard'
import en from '../../model/local_en.json'


const CategorieListitem = ({ route, navigation }) => {
    const [data, setData] = React.useState({
        error: null,
        data: route.params.itemData,
        dataa: null
    });

    const [newdata, setNewData] = React.useState([]);
    useEffect(() => {
        searchFilterFunction(route.params.name)
    }, [])

    const searchFilterFunction = (text) => {
        const newData = data.data.filter((item) => {
            const itemData = `${item.deals.restaurant.type.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setData({
            ...data,
            dataa: newData
        })
    };

    const renderItemdeal = ({ item }) => {
        return (
            <Deal itemData={item} favorite={route.params.favorite} token={route.params.token} totalDuration={route.params.totalDuration} navigation={navigation} />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: hp('7%'), backgroundColor: 'transparent', borderBottomColor: '#b4b4b4b4', borderBottomWidth: 0.2, flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Icon name="chevron-back-outline" style={{ paddingLeft: wp('1%'), color: 'black', top: hp('2%') }} size={30} onPress={() => { navigation.goBack() }} />
                <Text style={{ paddingLeft: wp('5%'), color: 'black', top: hp('2.3%'), fontSize: 18, fontWeight: 'bold' }}>{route.params.name}</Text>
            </View>
            {data.dataa == '' ?
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Text>{en.NO_OFFER}</Text>
                </View>
                :
                <FlatList
                    data={data.dataa}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItemdeal}
                />
            }
        </SafeAreaView>

    );
}

export default CategorieListitem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});