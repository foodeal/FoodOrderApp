import React, { useEffect } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import MainTabScreen from './MainTabScreen'
import CardItemDetails from "./CardItemDetails";
import EditProfileScreen from "./EditProfileScreen";
import SearchBar from "./homePage/SearchBars";
import VaucherScreen from './VaucherScreen';
import Favorite from "./favorite"
import CategorieListitem from "./homePage/CategorieListitem";
import InitMap from "./InitMap";
import Support from "./Support";
import ChoosePlace from './homePage/ChoosePlace';
import WebVieww from "./Webvieww";

import AsyncStorage from '@react-native-community/async-storage';



const ContStack = createStackNavigator();

const ScreenStackScreen = ({ token,navigation,name, neww}) => {
    const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);
    let routeName;
    // console.log(screen)
    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunchedmap').then((value) => {
            console.log(value)
            if (value == null) {
                AsyncStorage.setItem('alreadyLaunchedmap', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false);
            }
        });
    }, []);

    
    if (isFirstLaunch === null) {
        return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user. But if you want to display anything then you can use a LOADER here
    } else if (isFirstLaunch == true) {
        routeName = 'InitMap';
    } else {
        routeName = 'HomeDrawer';
    }
    return (
        <ContStack.Navigator headerMode='none' initialRouteName={routeName}>
            <ContStack.Screen name="InitMap" component={InitMap} />
            <ContStack.Screen name="HomeDrawer" children={() => <MainTabScreen token={token} name={name} neww={neww} />} />
            <ContStack.Screen name="ChoosePlace" component={ChoosePlace}  />
            <ContStack.Screen name="SearchBar" component={SearchBar} />
            <ContStack.Screen name="CardItemDetails" component={CardItemDetails} />
            <ContStack.Screen name="EditProfile" component={EditProfileScreen} />
            <ContStack.Screen name="VaucherScreen" component={VaucherScreen} />
            <ContStack.Screen name="Favorite" component={Favorite} />
            <ContStack.Screen name="Support" component={Support} />
            <ContStack.Screen name="CategorieListitem" component={CategorieListitem} />
            <ContStack.Screen name="Webvieww" component={WebVieww} />
        </ContStack.Navigator>
    )
};

export default ScreenStackScreen;