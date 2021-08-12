/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect } from 'react';
 import AsyncStorage from '@react-native-community/async-storage';
 import Signup from './Screen/Signup';
 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator } from '@react-navigation/stack';
 import MainTabScreen from './Screen/MainTabScreen';
 import QrcodeScanner from './Screen/QrcodeScanner';
 import SplashScreen from 'react-native-splash-screen';
 import { View, ActivityIndicator,Alert} from 'react-native';
 import { AuthContext } from './components/context';
 import EditProfileScreen from './Screen/EditProfileScreen';
 import Etape2 from './Screen/EntrerOffres/Etape2';
 import Etape3 from './Screen/EntrerOffres/Etape3';
 import Etape1 from './Screen/EntrerOffres/Etape1';
 import OneSignal from 'react-native-onesignal'
 
 const RootStack = createStackNavigator();
 const AuthStack = createStackNavigator();
 
 
 const App = () => {
 
   const initialLoginState = {
     isLoading: true,
     mail: null,
     userToken: null,
     image: null
   };
    const [route, setRoute]= React.useState('HomeDrawer')
    const [page, setPage]= React.useState('Scan')
 
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
           mail: action.id,
           userToken: action.token,
           image: action.image,
           isLoading: false,
         };
       case 'LOGOUT':
         return {
           ...prevState,
           mail: null,
           userToken: null,
           image: null,
           isLoading: false,
         };
       case 'REGISTER':
         return {
           ...prevState,
           mail: action.id,
           userToken: action.token,
           image: action.image,
           isLoading: false,
         };
     }
   };
 
   const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
 
   const authContext = React.useMemo(() => ({
     signIn: async (User) => {
       console.log(User)
       const id = User.id
       const userToken = User.userToken
       const image = User.image
 
         try {
           await AsyncStorage.setItem('userToken', userToken)
           await AsyncStorage.setItem('userid', id.toString())
           await AsyncStorage.setItem('image', image)
 
         } catch (e) {
           console.log(e);
         }
       // console.log('user token', userToken); 
       dispatch({ type: 'LOGIN', id: id, token: userToken, image: image });
     },
 
     signOut: async () => {
       // setUserToken(null);
       // setIsLoading(false);
       try {
         await AsyncStorage.removeItem('userToken');
         await AsyncStorage.removeItem('image')
         await AsyncStorage.removeItem('userid')
       } catch (e) {
         console.log(e);
       }
       dispatch({ type: 'LOGOUT' });
     },
 
     signUp: () => {
       // setUserToken('fgkj');
       // setIsLoading(false);
 
     },
   }));
 
   useEffect(() => {
     setTimeout(async () => {
       // setIsLoading(false);
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
       OneSignal.setAppId("643687b9-61ec-48ba-916b-7d1b22e2875a");
       OneSignal.setLogLevel(6, 0);
       OneSignal.setRequiresUserPrivacyConsent(false);
        /* O N E S I G N A L  H A N D L E R S */
       OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
         // OSLog("OneSignal: notification will show in foreground:", notifReceivedEvent);
 
         let notif = notifReceivedEvent.getNotification();
         const button1 = {
           text: "Plus tard",
           onPress: () => { notifReceivedEvent.complete(); },
           style: "cancel"
         };
 
         const button2 = { text: "Découvrez", onPress: () => { notifReceivedEvent.complete(notif); } };
 
         Alert.alert(`${notif.title}`, `${notif.body}`, [button1, button2], { cancelable: true });
       });
       OneSignal.setNotificationOpenedHandler(openedEvent => {
         console.log("OneSignal: notification opened:", openedEvent);
       const { action, notification } = openedEvent;
       console.log(action);
       // setRoute('HomeDrawer')
       setPage('Reservation')
 
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
         <ActivityIndicator size='large' />
       </View>
     );
   }
 
   return (
     <AuthContext.Provider value={authContext} >
       <NavigationContainer>
         {loginState.userToken != null ? (
           <RootStack.Navigator headerMode='none' initialRouteName={route}>
             <RootStack.Screen name="HomeDrawer" component={MainTabScreen} initialParams={{name : page }}/>
             <RootStack.Screen name="QRcodeScanner" component={QrcodeScanner} />
             <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
             <RootStack.Screen name="Etape1" component={Etape1} />
             <RootStack.Screen name="Etape2" component={Etape2} />
             <RootStack.Screen name="Etape3" component={Etape3} />
 
           </RootStack.Navigator>
         )
           :
           (
             <AuthStack.Navigator headerMode='none'>
               <AuthStack.Screen name="Signup" component={Signup} />
             </AuthStack.Navigator>
           )
         }
       </NavigationContainer>
     </AuthContext.Provider>
   );
 };
 
 export default App;
 