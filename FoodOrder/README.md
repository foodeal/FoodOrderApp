# FoodOrder Client
> A beautiful food deal app for use in online food commerce just for single objective of fighting food waste.

## Features

- Food Listing depending on category selected
- Auth
- Routing & Directions
- Payment Gateways intergration
- Push Notifications
- SplashScreen
- SSO Authentification
- QR code
## :arrow_up: How to Setup

**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Install the Application with `npm i` for android and run `react-native link --all`

**Step 4:** Install the Application with `cd ios & pod install` for IOS

**Step 5:** Add your Facebook ID and Google ID in this two path: 
    - ~\FoodOrder\android\app\src\main\res\values\strings.xml for Android
    - ~\FoodOrder\ios\FoodOrder\Info.plist for IOS

**Step 6:** Change Onesignal ID with yours in App.js for notification : 
  UseEffect(()=> 
    //
    //
      OneSignal.setAppId("Your OneSignal ID");
    //
    //
  )

**Step 7:** Change the URL of REST Api with yours in config.js file

## :arrow_forward: How to Run App

1. cd to the repo
2. Run Build for either OS
  * for iOS
    * run `react-native run-ios` or `npm run ios`
  * for Android
    * run `react-native run-android` or `npm run android`

#### Project Structure

```
    /android                            - React native android source code
    
    /Components                         - React native specific code
        /homePage                       - Home components
        CardItemDetails.js              - Item detail component
        DealActifTab.js                 - Booking tab component for active Booking
        DealsActifs.js                  - Not Paid Active Booking component
        DealsActifsCard.js              - Not Paid Active Booking Card component
        DealsExpired.js                 - Expired Booking component
        DealsExpiredCard.js             - Expired Booking Card component
        DealsUtilises.js                - Paid Active Booking component
        DealsUtilisesCard.js            - Paid Active Booking component
        DealsUtilisesConfirmer.js       - Used Booking component
        DealsUtilisesCardConfirmer.js   - Used Booking Card component
        EditProfileScreen.js            - Update Profil component
        Profile.js                      - Account component
        favorite.js                     - Favorite component
        Forget.js                       - Forget password component
        Init.js                         - Initial component
        InitMap.js                      - Initial map component where we can choose a location to see the offers to save
        MainTabScreen.js                - Bottom tab Menu component
        Map.js                          - Map component
        OnboardingScreen.js             - OnBording component
        Register.js                     - Sign up component
        RootStackScreen.js              - Auth component for routing components of authentification
        ScreenStackScreen.js            - Screen component for navigate between all interface when token isValid
        Signup.js                       - Sign in component
        VaucherScreen.js                - QR code component
        Webvieww.js                     - Payment Gateways component

    /assets                             - contains image and fonts
    /Images                             - contains image

    /ios                                - React native ios source code
    App.js                              - App Root component
    config.js                           - config File that contain URL of REST Api, (webClientId and iosClientId of Google account), logo for all the screen of our application             
```



## Languages

- **Node.js & Express** => _For backend and API design_
- **React Native** => _iOS and Android App_
