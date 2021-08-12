import React, { useEffect } from "react";
import { StyleSheet, ActivityIndicator, View, StatusBar, Alert } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from './Components/context';
import RootStackScreen from './Components/RootStackScreen'
import ScreenStackScreen from './Components/ScreenStackScreen'
import SplashScreen from 'react-native-splash-screen'
import OneSignal from 'react-native-onesignal'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

const App = () => {


  const [loading, setLoading] = React.useState(false);
//////////////////////
  //Equal to Redux. we use this function for manage our Authentification Sign in / Sign out
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    numero: null,
    name: null,
    new: null
    // screen: null
  };
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          name: action.name,
          new: action.new,
          numero: action.numero,
          // screen: action.screen,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          name: null,
          new: null,
          numero: null,
          isLoading: false,
        };
      case 'GUEST':
        return {
          ...prevState,
          name: action.name,
          isLoading: false,
        };
      case 'LOGINTOCON':
        return {
          ...prevState,
          name: null,
          // screen: action.screen,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (foundUser) => {
      const userToken = foundUser.userToken;
      const userName = foundUser.username;
      const name = foundUser.name;
      const numero = foundUser.numero;
      const neww = foundUser.new;
      // let screen;
      // screen = null;
      try {
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('userid', userName.toString());
        await AsyncStorage.setItem('username', name);
        await AsyncStorage.setItem('numero', numero.toString());
        await AsyncStorage.setItem('new', neww.toString());
        // screen = await AsyncStorage.getItem('screen');
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', screen);
      dispatch({ type: 'LOGIN', id: userName, token: userToken, name: name, new: neww, numero: numero });
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('listOflikes');
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('listofLocation');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    Asguest: async () => {
      const userToken = '';
      const userName = '';
      const name = 'guest';

      try {
        // await AsyncStorage.setItem('userToken', userToken);
        // await AsyncStorage.setItem('userid', userName.toString());
        await AsyncStorage.setItem('username', name);
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'GUEST', name: name });
    },
    LoginToContinu: async () => {
      try {
        // await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('userToken');
        // await AsyncStorage.setItem('screen', screeninterface);
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGINTOCON' });
    },
  }), []);
//////////////////////
  useEffect(() => {
    setTimeout(async () => {
      setLoading(true);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
      SplashScreen.hide();
      /* O N E S I G N A L   S E T U P */
      OneSignal.setAppId("c3372faf-22dc-4a7f-989a-fa75c7b28ef0");
      OneSignal.setLogLevel(6, 0);
      OneSignal.setRequiresUserPrivacyConsent(false);
     

      const partnerId = (await OneSignal.getDeviceState()).userId
      // await AsyncStorage.setItem('OnesignalId', partnerId);
      /* O N E S I G N A L  H A N D L E R S */
      OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
        // OSLog("OneSignal: notification will show in foreground:", notifReceivedEvent);

        let notif = notifReceivedEvent.getNotification();
        console.log(notif)
        const button1 = {
          text: "Plus tard",
          onPress: () => { notifReceivedEvent.complete(); },
          style: "cancel"
        };

        const button2 = { text: "Découvrez", onPress: () => { notifReceivedEvent.complete(notif); } };

        Alert.alert(`${notif.rawPayload.aps.alert.title}`, `${notif.rawPayload.aps.alert.body}`, [button1, button2], { cancelable: true });
      });
      OneSignal.setNotificationOpenedHandler(notification => {
        // OSLog("OneSignal: notification opened:", notification);
      });
      OneSignal.setInAppMessageClickHandler(event => {
        // OSLog("OneSignal IAM clicked:", event);
      });
      OneSignal.addEmailSubscriptionObserver((event) => {
        // OSLog("OneSignal: email subscription changed: ", event);
      });
      // OneSignal.addSubscriptionObserver(event => {
      //   OSLog("OneSignal: subscription changed:", event);
      //   this.setState({ isSubscribed: event.to.isSubscribed })
      // });
      OneSignal.addPermissionObserver(event => {
        // OSLog("OneSignal: permission changed:", event);
      });
    }, 2000);
  }, []);


  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Bubbles size={10} color="#36b3c9" />
      </View>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken !== null || loginState.name == 'guest' ?
          //if there is a token in application cache  this line forward us to Home interface and all his stack interface
          <ScreenStackScreen token={loginState.userToken} name={loginState.name} neww={loginState.new} /> 
          :
          //else we will be in Auth Stack to sign in or sign up  
          <RootStackScreen />
        }
      </NavigationContainer>
    </AuthContext.Provider >
  );

}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
