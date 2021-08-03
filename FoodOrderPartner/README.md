# FoodOrder Partner
> A beautiful food deal partner app for use to confirm booking or publich offers

## Features

- Auth
- Push Notifications
- Qr code Scanner

## :arrow_up: How to Setup

**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Install the Application with `npm i` for android and run `react-native link --all`

**Step 4:** Install the Application with `cd ios & pod install` for IOS

**Step 5:** Change Onesignal ID with yours in App.js for notification : 
  UseEffect(()=> 
    //
    //
      OneSignal.setAppId("Your OneSignal ID");
    //
    //
  )

**Step 6:** Change the URL of REST Api with yours in config.js file

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
    
    /Screen                             - React native specific code
        /EntrerOffres                   - Add Offers components
        /MesOffres                      - Offers Partner components
        /MesReservations                - Bookings components
        /ModifierOffres                 - Update Offers components
        EditProfileScreen.js            - Update Profil component
        Profile.js                      - Account component
        MainTabScreen.js                - Bottom tab Menu component
        Register.js                     - Sign up component
        Signup.js                       - Sign in component
        QrcodeScanner.js                - QR code Scanner component
        ScanScreen.js                   - Home components
    /assets                             - contains image and fonts
    /Images                             - contains image

    /ios                                - React native ios source code
    App.js                              - App Root component
    config.js                           - config File that contain URL of REST Api, (webClientId and iosClientId of Google account), logo for all the screen of our application             
```



## Languages

- **Node.js & Express** => _For backend and API design_
- **React Native** => _iOS and Android App_
