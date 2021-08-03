import React,{useEffect} from 'react';

import { createStackNavigator } from '@react-navigation/stack';

// import SplashScreen from './SplashScreen';
import Init from './Init';
import SignInScreen from './Signup';
import SignUpScreen from './Register';
import Verif from "./Verif";
import Forget from './Forget'
import Reset from './Reset';
import Socialinfo from './Socialinfo';
import OnboardingScreen from './OnboardingScreen'
import AsyncStorage from '@react-native-community/async-storage';



const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => {
    const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);
    let routeName;
    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then((value) => {
            if (value == null) {
                AsyncStorage.setItem('alreadyLaunched', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false);
            }
        }); // Add some error handling, also you can simply do setIsFirstLaunch(null)
    }, []);

    if (isFirstLaunch === null) {
        return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user. But if you want to display anything then you can use a LOADER here
    } else if (isFirstLaunch == true) {
        routeName = 'OnboardingScreen';
    } else {
        routeName = 'Init';
    }
    return (
        <RootStack.Navigator headerMode='none' initialRouteName={routeName}>
            <RootStack.Screen name="OnboardingScreen" component={OnboardingScreen} />
            <RootStack.Screen name="Init" component={Init} />
            <RootStack.Screen name="SignInScreen" component={SignInScreen} />
            <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
            <RootStack.Screen name="Verif" component={Verif} />
            <RootStack.Screen name="Forget" component={Forget} />
            <RootStack.Screen name="Reset" component={Reset} />
            <RootStack.Screen name="Socialinfo" component={Socialinfo} />

        </RootStack.Navigator>
    )
};

export default RootStackScreen;