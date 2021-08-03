import React, { useEffect } from 'react'
import { StatusBar, Text, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DealTab from './DealTab';

const DealAE = ({ navigation }) => { 
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={'transparent'}
                    barStyle='dark-content'
                />
                <View style={{ height:Platform.OS  === 'ios' ? hp('9%'):hp('7%'), backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ marginLeft: wp('3%'), color: 'black', top: Platform.OS  === 'ios' ? hp('6%'):hp('3%'), fontSize: 22, fontWeight: 'bold' }}>
                    My Reservations
                </Text>
                </View>
                <DealTab />
            </View>
        )
}
export default DealAE;