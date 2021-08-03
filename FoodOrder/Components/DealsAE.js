import React, { useEffect } from 'react'
import { StatusBar, Text, View, Image } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DealTab from './DealTab';
import Dialog from "react-native-dialog";
import { AuthContext } from './context';
import en from '../model/local_en.json'


const DealAE = ({ token, navigation }) => {
    useEffect(() => {
        if (token == null) {
            const isFocused = navigation.isFocused();
            if (isFocused) {
                showDialogguest()
            }
            const navFocusListener = navigation.addListener('focus', () => {
                showDialogguest()
            });

            return navFocusListener
        }
    }, [navigation]);

    const [visibleguest, setVisibleguest] = React.useState(false);
    const { LoginToContinu } = React.useContext(AuthContext);

    const showDialogguest = () => {
        setVisibleguest(true);
    };

    const handleCancelguest = () => {
        setVisibleguest(false);
    };
    const handleoptionOK = () => {
        LoginToContinu()
    }

    const renderguest = () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Image source={require('../assets/img-denied.png')} style={{ width: wp('52%'), height: hp('25%'), marginBottom: hp('2%') }} />
                <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: hp("1%") }}>Access denied</Text>
                <Text style={{ width: wp('60%'), textAlign: 'center', color: '#686663' }}>You are logged in as a guest. Please log in to view this page</Text>
            </View>
            <Dialog.Container visible={visibleguest}>
                <Dialog.Title style={{ fontWeight: 'bold' }}>{en.BUTTON_CONNECT}</Dialog.Title>
                <Dialog.Description>
                    {en.MUST_CONNECT}
                </Dialog.Description>
                <Dialog.Button color='#36b3c9' bold={true} label="Cancel" onPress={handleCancelguest} />
                <Dialog.Button color='#36b3c9' bold={true} label="Ok" onPress={handleoptionOK} />
            </Dialog.Container>
        </View>
    )
    if (token == null) {
        return (
            renderguest()
        )
    }
    else {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={'transparent'}
                    barStyle='dark-content'
                />
                <View style={{ height:  Platform.OS === 'ios' ? hp('10%'): hp('7%'), backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ marginLeft: wp('3%'), color: 'black', top: Platform.OS === 'ios' ? hp('6%'): hp('3%'), fontSize: 22, fontWeight: 'bold' }}>
                        My Bassinet
                        </Text>
                </View>
                <DealTab />
            </View>
        )
    }
}
export default DealAE;