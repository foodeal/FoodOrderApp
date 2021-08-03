import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Onboarding from 'react-native-onboarding-swiper';
import en from '../model/local_en.json'

const Dots = ({ selected }) => {
    let backgroundColor;

    backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';

    return (
        <View
            style={{
                width: 6,
                height: 6,
                marginHorizontal: 3,
                backgroundColor
            }}
        />
    );
}

const Skip = ({ ...props }) => (
    <TouchableOpacity
        style={{ marginHorizontal: 10 }}
        {...props}
    >
        <Text style={{ fontSize: 16 }}>Skip</Text>
    </TouchableOpacity>
);

const Next = ({ ...props }) => (
    <TouchableOpacity
        style={{ marginHorizontal: 10 }}
        {...props}
    >
        <Text style={{ fontSize: 16 }}>Next</Text>
    </TouchableOpacity>
);

const Done = ({ ...props }) => (
    <TouchableOpacity
        style={{ marginHorizontal: 10 }}
        {...props}
    >
        <Text style={{ fontSize: 16 }}>Done</Text>
    </TouchableOpacity>
);

const OnboardingScreen = ({ navigation }) => {
    return (
        <Onboarding
            SkipButtonComponent={Skip}
            NextButtonComponent={Next}
            DoneButtonComponent={Done}
            DotComponent={Dots}
            onSkip={() => navigation.replace("Init")}
            onDone={() => navigation.navigate("Init")}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <Image source={require('../assets/onboarding-img2.png')} style={{ width:wp('100%'),height:hp('62%'), marginTop:hp('-10%')}}/>,
                    title: en.ONBORDING_TITLE_1,
                    subtitle: en.ONBORDING_TITLE_1_1,
                },
                {
                    backgroundColor: '#fff',
                    image: <Image source={require('../assets/onboarding-img1.png')} style={{ width:wp('100%'),height:hp('60%'),marginLeft:wp('-1%'),marginTop:hp('-8%')}} />,
                    title: en.ONBORDING_TITLE_2,
                    subtitle: en.ONBORDING_TITLE_2_1,
                },
                {
                    backgroundColor: '#fff',
                    image: <Image source={require('../assets/onboarding-img4.png')} style={{ width:wp('100%'),height:hp('62%'), marginTop:hp('-11%')}}/>,
                    title: en.ONBORDING_TITLE_3,
                    subtitle: en.ONBORDING_TITLE_3_1,
                },
            ]}
        />
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
