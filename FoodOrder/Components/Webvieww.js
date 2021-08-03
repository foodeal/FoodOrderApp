import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import * as Progress from 'react-native-progress';
import {
  View,
  Text,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import config from '../config.js'
import OneSignal from 'react-native-onesignal'
import en from '../model/local_en.json'

const WebVieww = ({ navigation, route }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setLoaded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('')
  const [canGoBack, setCanGoBack] = useState(false)
  const webviewRef = React.useRef(null)

  const onMessage = (data) => {
    //Prints out data that was passed.
    // window.ReactNativeWebView.postMessage(event.data);
    console.log("hello");
  }
  let earnedmoney = route.params.itemData.deals.PriceBeforeDiscount - route.params.itemData.deals.PriceAfterDiscount
  let nbreincrement = route.params.itemData.nbre_redeemed_deal + parseInt(route.params.list.nbre)

  const updatenbre = (status) => {
    axios
      .put(`${config.url}/dealsscheduled/${route.params.itemData.id}`, {
        nbre_redeemed_deal: nbreincrement
      })
      .then(res => { if (res.data == "deal updated!") { navigation.navigate('VaucherScreen', { status: status, itemData: route.params.list, payement: route.params.payement, code: route.params.code }) } })
      .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
  }
  const reserved = (status) => {
    axios
      .post(`${config.url}/coupon`, {
        PriceAfterDiscount: route.params.list.prix,
        status_user: 'confirmed',
        status_restaurant: '',
        commission_rate: route.params.list.commission_rate,
        noter: false,
        earned_money: earnedmoney.toFixed(2),
        user_id: route.params.list.user_id,
        restaurant_id: route.params.itemData.deals.restaurant.restaurant_id,
        dealScheduled_id: route.params.itemData.id,
        nbre_coupons: route.params.list.nbre,
        payement: 'online',
        reduce: route.params.list.reduce,
        username: route.params.list.username,
        numero: route.params.list.numero,
        nomPartner: route.params.list.nomPartner,
        typee: "Payé",
        description: route.params.itemData.deals.description,
        detail: route.params.itemData.deals.deal_description,
        foodQR: route.params.code
      })
      .then(res => {
        if (res.data == "Coupon added Succefuly") {
          updatenbre(status)
          const notificationObj = {
            app_id: 'f750576c-4163-4a7c-8fe4-3b501b921ad0',
            contents: { en: "Vous avez une nouvelle réservation payée" },
            headings: { en : "Nouvelle Réservation payée" },
            include_player_ids: route.params.itemData.deals.restaurant.OnesignalId.split(",")
          };
          console.log(`${route.params.itemData.deals.restaurant.OnesignalId}`)
          const jsonString = JSON.stringify(notificationObj);

          OneSignal.postNotification(jsonString, (success) => {
            console.log("Success:", success);
          }, (error) => {
            console.log("Error:", error);
          });
        }
      })
      .catch(err => Toast.show(en.TOAST_CHECK_ERROR));
  }
  const backButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.goBack()
  }

  const checkpayment = () => {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token 5a1097feecd252a40732220910c88dd2c1242465'
      }
    };
    axios.get(`https://app.paymee.tn/api/v1/payments/${route.params.token}/check`, axiosConfig)
      .then((res) => {
        // console.log(res.data.data)
        // navigation.goBack()
        if (res.data.data.payment_status) {
          Toast.show('Accepted payment')
          reserved(res.data.data.payment_status)
        } else {
          Toast.show('Failed payment')
          navigation.navigate('CardItemDetails', { status: res.data.data.payment_status, itemData: route.params.itemData, status: route.params.status })
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      })
  }
  const javascript = `
  document.body.style.backgroundColor = 'orange';
  window.alert('This is javascript');
    `;

  return <>
    {
      !isLoaded ?
        <Progress.Bar
          progress={progress}
          width={null}
          borderWidth={0}
          borderRadius={0}
          color='#36b3c9'
        /> : null
    }
    <View style={{ flexDirection: 'row' }}>
      <View style={{ height: hp('8%'), backgroundColor: 'transparent', borderBottomColor: '#b4b4b4b4', borderBottomWidth: 0.2 }}>
        <Icon name="chevron-back-outline" style={{ paddingLeft: wp('1%'), color: 'black', top: hp('4%') }} size={30} onPress={() => { navigation.goBack() }} />
      </View>
      <Text style={{ paddingLeft: wp('1%'), color: 'black', top: hp('4.5%'), fontSize: 18 }}>Go Back</Text>
    </View>
    <WebView
      ref={webviewRef}
      source={{
        uri: `https://app.paymee.tn/gateway/${route.params.token}`
      }}
      javaScriptEnabled={true}
      originWhitelist={['*']}
      cacheEnabled={false}
      // source={{ html: '<h1>This is a statsampleic HTML source!</h1>' }}
      // source={source}
      onError={(event) =>
        alert(`Webview error: ${event.nativeEvent.description}`)
      }
      // injectedJavaScript={javascript}
      // onMessage={(event)=> console.log(event.nativeEvent.data)}
      onMessage={onMessage}

      onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
      onLoadEnd={() => { webviewRef.current.postMessage("RN message") }}
      onNavigationStateChange={navState => {
        if (navState.url == "https://app.paymee.tn/gateway/loader" && currentUrl == '') {
          checkpayment()
          setCurrentUrl(navState.url)
        }
      }}

    />
  </>
}

export default WebVieww;
