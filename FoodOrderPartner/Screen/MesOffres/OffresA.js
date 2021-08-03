import React, { useEffect } from 'react'
import { StatusBar, Text, View, Image } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OffresTab from './OffresTab';
import Dialog from "react-native-dialog";


const OffresA = ({ navigation }) => { 
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={'transparent'}
                    barStyle='dark-content'
                />
                <View style={{ height: Platform.OS  === 'ios' ? hp('9%'): hp('7%'), backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ marginLeft: wp('3%'), color: 'black', top: Platform.OS  === 'ios' ? hp('6%'):hp('3%'), fontSize: 22, fontWeight: 'bold' }}>
                    My Baskets
                </Text>
                </View>
                <OffresTab />
            </View>
        )
}
export default OffresA;
