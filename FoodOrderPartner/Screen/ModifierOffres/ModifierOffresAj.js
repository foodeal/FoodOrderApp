import React, { useEffect } from 'react'
import { StatusBar, Text, View, Image } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ModifierOffresTab from './ModifierOffresTab';
import Dialog from "react-native-dialog";
import Icon from 'react-native-vector-icons/Ionicons';


const ModifierOffresAj = ({ navigation }) => { 
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={'transparent'}
                    barStyle='dark-content'
                />
                <View style={{ height: hp('10%'), backgroundColor: 'white', flexDirection: 'row' }}>
                <Icon name="chevron-back-outline" style={{ paddingLeft: wp('1%'), color: 'black', top: hp('5%') }} size={30} onPress={() => { navigation.goBack() }} />
                    <Text style={{ marginLeft: wp('3%'), color: 'black', top: hp('5%'), fontSize: 22, fontWeight: 'bold' }}>
                        Modifier Couffin
                </Text>
                </View>
                <ModifierOffresTab />
            </View>
        )
}
export default ModifierOffresAj;