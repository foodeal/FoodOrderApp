import React, { useEffect, useRef } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SearchBar } from "react-native-elements";
import Iconn from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { List, ListItem, Avatar } from "react-native-elements";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Modalize } from 'react-native-modalize';
import Deal from './DealHomeCard'
import AsyncStorage from '@react-native-community/async-storage';
import haversine from 'haversine';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DatePicker from 'react-native-date-picker'
import moment, { now } from 'moment';
import en from '../../model/local_en.json'

const SearchBars = ({ navigation, route }) => {

  const [data, setData] = React.useState({
    loading: false,
    data: route.params.itemData,
    temp: route.params.itemData,
    origin: route.params.favorite,
    error: null,
    search: null,
    toggleC: false,
    toggleE: false,
    distance: null,
    temps: null
  });
  const [dateDe, setDateDe] = React.useState(new Date(Date.now()))
  const [dateA, setDateA] = React.useState(new Date())
  const [Pickupfrom, setPickFrom] = React.useState('')
  const [Pickupto, setPickto] = React.useState('')
  const modalizeRef = useRef(null);
  const modalizeRefplageHoraire = useRef(null);
  const [Horaire, sethoraire] = React.useState('All day')
  const calcDistance = (item) => {
    const start = {
      latitude: data.origin[0].latitude,
      longitude: data.origin[0].longitude
    }
    const end = {
      latitude: item.latitude,
      longitude: item.longitude
    }
    return haversine(start, end).toFixed(1);
  };

  const horaireFunction = () => {
    //  console.log(Pickupfrom + ' - ' + Pickupto)
    sethoraire(Pickupfrom + ' - ' + Pickupto)
    modalizeRefplageHoraire.current?.close();

  }

  const horairedelete = () => {
    sethoraire('All day')
    setDateDe(new Date())
    setDateA(new Date())
    modalizeRefplageHoraire.current?.close();

  }

  const handleConfirmDe = (date) => {
    // const tt = moment(date).add(1, 'hours')
    const houre = moment(date).format('HH:mm')
    // console.log(houre.toString())
    setPickFrom(houre)
    setDateDe(date)
  };

  const handleConfirmA = (date) => {
    const houre = moment(date).format('HH:mm')
    setPickto(houre)
    setDateA(date)
  };

  const onOpenHoraireplage = () => {
    modalizeRefplageHoraire.current?.open();
  };
  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const onClose = () => {
    modalizeRef.current?.close()
  };
  const changedistance = (val) => {
    setData({
      ...data,
      distance: val
    });
  }

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{ flexDirection: 'row', marginBottom: hp('2%'), marginTop: hp('2%') }}>
        <TouchableOpacity onPress={() => { reinitiliser(), onClose() }}>
          <Text style={{ textAlign: 'left', fontSize: 15, marginTop: hp('0.2%'), color: '#686663', fontWeight: 'bold' }}>{en.SEARCH_DELETEALL}</Text>
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', marginLeft: wp('30%'), fontWeight: 'bold', fontSize: 20, color: 'black' }}>{en.SEARCH_FILTER}</Text>

        {/* <Text style={styles.panelTitle}>Filtrer</Text> */}
      </View>
      <View style={{}}>
        <Text style={styles.panelSousTitle}>Distance</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'black', fontSize: 13, marginLeft: 5 }}>0km</Text>
          <Text style={{ color: 'black', fontSize: 13, marginLeft: 5 }}>{data.distance}km</Text>
        </View>
        <Slider
          style={styles.slider}
          value={data.distance}
          minimumValue={0}
          maximumValue={30}
          step={1}
          onValueChange={(val) => changedistance(val)} />
      </View>
      <View style={{ borderBottomWidth: 1, marginTop: hp('4%'), borderBottomColor: '#b4b4b4' }} />
      <View style={{}}>
        <Text style={styles.panelSousTitle}>{en.SEARCH_TIME_COLLECT}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'black', fontSize: 15, marginLeft: wp('3%') }}>{Horaire}</Text>
        </View>
        <TouchableOpacity onPress={() => { onOpenHoraireplage() }}>
          <ListItem bottomDivider topDivider style={{ backgroundColor: 'white', marginTop: hp('2%') }}>
            <ListItem.Content>
              <ListItem.Title style={{ color: '#36b3c9', fontWeight: 'bold' }}>{en.SEARCH_TIME_SLOT}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="black" />
          </ListItem>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.panelButton} onPress={() => { filterfunction(), onClose() }} >
        <Text style={styles.panelButtonTitle}>{en.SEARCH_FILTER}</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.panelButtonr}
        onPress={() => { reinitiliser(), onClose() }}>
        <Text style={styles.panelButtonTitler}>Réinitialiser</Text>
      </TouchableOpacity> */}
    </View>
  );

  const renderInnerPlageHoraire = () => (
    <View style={styles.panel}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('2%'), marginTop: hp('2%'), borderBottomWidth: 1, height: hp('5%'), borderBottomColor: '#b4b4b4' }}>
        <TouchableOpacity onPress={() => { horairedelete() }}>
          <Text style={{ textAlign: 'left', fontSize: 16, color: '#686663', fontWeight: 'bold' }}>{en.SEARCH_DELETEALL}</Text>
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: 'black' }}>{en.SEARCH_TIME_COLLECT}</Text>
        <TouchableOpacity onPress={() => { horaireFunction() }}>
          <Text style={{ textAlign: 'left', fontSize: 16, marginTop: hp('0.2%'), color: '#36b3c9', fontWeight: 'bold' }}>{en.SEARCH_VALIDE}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp('60%'), alignSelf: 'center', marginTop: hp('2%') }}>
        <View>
          <Text style={{ marginLeft: wp('3%') }}>{en.SEARCH_OF}</Text>
        </View>
        <View >
          <Text style={{ marginLeft: wp('-5%') }}>{en.SEARCH_AT}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp('85%'), alignSelf: 'center', marginTop: hp('2%') }}>
        <View>
          <DatePicker
            date={dateDe}
            onDateChange={(date) => { handleConfirmDe(date) }}
            mode="time"
            is24hourSource={'locale'}
            androidVariant={'iosClone'}
            style={{ width: wp('35%') }}
            minuteInterval={30}
            locale='fr'
          />

        </View>
        <View >
          <DatePicker
            date={dateA}
            onDateChange={(date) => { handleConfirmA(date) }}
            mode="time"
            is24hourSource={'locale'}
            androidVariant={'iosClone'}
            style={{ width: wp('35%') }}
            minuteInterval={30}
            locale='fr'

          />
        </View>
      </View>
    </View>
  );

  const reinitiliser = () => {
    setData({
      ...data,
      data: data.temp,
      distance: 0,
      temps: 0,
      toggleC: false,
      toggleE: false,
    })
    sethoraire('All day')
    setDateDe(new Date())
    setDateA(new Date())
  }


  const renderHeader = () => {
    return <View style={{ flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 0.5, borderBottomColor: '#b4b4b4b4b4', marginTop: hp('4%') }} >
      <Iconn name="chevron-back-outline" style={{ paddingLeft: wp('2%'), color: 'black', marginTop: Platform.OS === 'ios' ? hp('2.5%') : hp('1%') }} size={30} onPress={() => { navigation.goBack() }} />
      <SearchBar placeholder="A partner or a product"
        lightTheme
        containerStyle={{ backgroundColor: 'white', width: wp('80%'), height: hp('9%'), borderBottomColor: 'white', borderTopColor: 'white', marginTop: Platform.OS === 'ios' ? hp('0.7%') : hp('-1%') }}
        clearIcon round editable={true}
        value={data.search}
        onChangeText={(text) => searchFilterFunction(text)}
      />
      <TouchableOpacity onPress={onOpen}>
        <Iconn
          name="options-outline"
          size={30}
          style={{ color: 'black', marginTop: Platform.OS === 'ios' ? hp('2.5%') : hp('1%') }}
        />
      </TouchableOpacity>


    </View>

  };

  //Functions allow user to search in the list of offers 
  ////////////////////////////////////
  const searchFilterFunction = (text) => {
    const newData = data.temp.filter((item) => {
      const itemData = `${item.deals.restaurant.name.toUpperCase()}   
          ${item.deals.description.toUpperCase()} ${item.deals.deal_description.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setData({
      ...data,
      data: newData
    })
  };

  const filterfunction = () => {
    var Data = []

    if (Data.length == 0) {
      if (parseInt(data.distance) != 0) {
        var newData = data.temp.filter((item) => {
          const distance = calcDistance(item.deals.restaurant)
          if (parseInt(distance) > 0 && parseInt(distance) < parseInt(data.distance)) {
            const itemData = `${item.deals.deal_id}`
            const text = `${item.deals.deal_id}`
            return itemData.indexOf(text) > -1;
          }
        })
        Data = newData
      }
    } else {
      if (parseInt(data.distance) != 0) {
        var newData = Data.filter((item) => {
          const distance = calcDistance(item.deals.restaurant)
          if (parseInt(distance) > 0 && parseInt(distance) < parseInt(data.distance)) {
            const itemData = `${item.deals.deal_id}`
            const text = `${item.deals.deal_id}`
            return itemData.indexOf(text) > -1;
          }
        })
        Data = newData
      }
    }

    // if (Data.length != 0) {
    //   if (data.toggleE && !data.toggleC) {
    //     var newData = Data.filter((item) => {
    //       const itemData = `${item.deals.restaurant.typePayment}`
    //       const text = 'Espèces'
    //       return itemData.indexOf(text) > -1;
    //     })
    //   } else if (!data.toggleE && data.toggleC) {
    //     var newData = Data.filter((item) => {
    //       const itemData = `${item.deals.restaurant.typePayment}`
    //       const text = 'Carte Bancaire'
    //       return itemData.indexOf(text) > -1;
    //     })
    //   }
    //   Data = newData
    // } else {
    //   if (!data.toggleE && !data.toggleC) {
    //     var newData = data.temp
    //     return newData;
    //   } else if (data.toggleE && !data.toggleC) {
    //     var newData = data.temp.filter((item) => {
    //       console.log(item.deals.restaurant.typePayment)
    //       const itemData = `${item.deals.restaurant.typePayment}`
    //       const text = 'Espèces'
    //       return itemData.indexOf(text) > -1;
    //     })
    //   } else if (!data.toggleE && data.toggleC) {
    //     var newData = data.temp.filter((item) => {
    //       const itemData = `${item.deals.restaurant.typePayment}`
    //       const text = 'Carte Bancaire'
    //       return itemData.indexOf(text) > -1;
    //     })
    //   }
    //   Data = newData
    // }

    if (Data.length === 0) {
      if (Horaire != 'All day') {
        var newData = data.temp.filter((item) => {
          const De = dateDe
          const A = dateA
          // const compare1 = moment(De).isSameOrAfter(item.startingdate)
          const compare = moment(item.expirydate).isBetween(De, A)
          // console.log(compare)
          if (compare) {
            const itemData = `${item.deals.deal_id}`
            const text = `${item.deals.deal_id}`
            return itemData.indexOf(text) > -1;
          }
        })
        Data = newData
      }
    } else {
      if (Horaire != 'All day') {
        var newData = Data.filter((item) => {
          const De = dateDe
          const A = dateA
          const compare = moment(item.expirydate).isBetween(De, A)
          // console.log(compare)
          if (compare) {
            const itemData = `${item.deals.deal_id}`
            const text = `${item.deals.deal_id}`
            return itemData.indexOf(text) > -1;
          }
        })
        Data = newData
      }
    }

    setData({
      ...data,
      data: Data
    })
  };
  ////////////////////////////////////
  const renderItemdeal = ({ item }) => {
    return (
      <Deal itemData={item} favorite={route.params.favorite} token={route.params.token} totalDuration={route.params.totalDuration} navigation={navigation} />
    );
  };

  return (
    <View style={styles.Container}>
      {renderHeader()}
      <Modalize ref={modalizeRef} snapPoint={hp('60%')} modalHeight={hp('60%')} withHandle={false} >
        {renderInner()}
      </Modalize>
      <Modalize ref={modalizeRefplageHoraire} snapPoint={hp('50%')} modalHeight={hp('50%')} withHandle={false} >
        {renderInnerPlageHoraire()}
      </Modalize>
      <FlatList
        data={data.data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItemdeal}
      />
    </View>
  );
}

export default SearchBars;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff"
  },
  dropShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    zIndex: 100,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  contentContainer: {
    flexGrow: 1
  },
  Navbar: {
    flexDirection: "row",
    width: wp('100%'),
    height: hp('10%'),
    justifyContent: "space-around",
    alignItems: 'center',
    backgroundColor: "#fff",
    marginTop: 20


  },
  Nav: {
    flexDirection: "row",
    width: wp('65%'),
  },
  bluetext: {
    color: "#36b3c9"
  },

  Categorie: {
    backgroundColor: "transparent",
    flexDirection: "row",
    width: wp('95%'),
    height: hp('15%'),
    justifyContent: "space-between",
    alignSelf: 'center',
    marginTop: hp('2%'),
  },
  textCategorie: {
    textAlign: "center",
    fontFamily: "Rubik-Regular",
    fontSize: 12,
    lineHeight: 24,
    color: "#3a4047",
  },
  logoStyle: {
    height: hp('8%'), // 70% of height device screen
    width: wp('16%'),
  },
  logoS: {
    height: hp('5%'), // 70% of height device screen
    width: wp('7%'),
  },
  Searchbar: {
    borderColor: '#e8e8e8',
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf:"center",
    borderWidth: 0.5,
    marginLeft: 21,
    height: hp('6.5%'),
    borderRadius: 8,
    marginTop: 10

  },
  textDealp: {
    textAlign: "left",
    fontFamily: "Rubik-Regular",
    fontSize: 18,
    lineHeight: 22,
    color: "#3a4047",
    marginLeft: 15,
    fontWeight: 'bold',
  },
  textDealc: {
    textAlign: "left",
    fontFamily: "Rubik-Regular",
    fontSize: 18,
    lineHeight: 22,
    color: "#3a4047",
    marginLeft: 15,
    marginTop: 20,
    fontWeight: 'bold',
  },
  textDealr: {
    textAlign: "right",
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    color: "#808080",
    marginLeft: 15,
    marginRight: 15,
    marginTop: -20,
    fontWeight: 'normal',
  },
  textDealall: {
    textAlign: "right",
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    lineHeight: 22,
    color: "#808080",
    marginLeft: 15,
    marginRight: 15,
    marginTop: -20,
    fontWeight: 'normal',
  },
  economie: {
    width: 110,
    height: 30,
    backgroundColor: "#00CED1",
    marginLeft: 20,
    position: 'absolute',
    top: 30,
    left: 5
  },
  teconomie: {
    textAlign: "center",
    marginTop: 6,
    color: '#ffffff',
    fontFamily: "Rubik-Medium",
    fontSize: 13,
  },
  logo: {
    width: 110,
    height: 30,
    marginLeft: 20,
    position: 'absolute',
    top: 20,
    left: 50
  },
  bluetext: {
    color: "#36b3c9",
    marginLeft: 35,
    marginTop: -47
  },
  placetext: {
    marginLeft: 39,
    marginTop: 3
  },
  header: {
    backgroundColor: '#F4F3F2',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: hp('1%'),
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  panelTitle: {
    fontSize: 27,
    height: hp('7%'),
    marginLeft: wp('4%'),
    fontWeight: 'bold',
    textAlign: 'left'
  },
  panelSousTitle: {
    fontSize: 20,
    height: hp('5%'),
    marginLeft: wp('2%'),
    fontWeight: 'bold',
    textAlign: 'left',
    opacity: 0.7,
    marginTop: hp('2%')
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 28,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    elevation: 6,
    marginTop: hp('4%'),
    backgroundColor: '#36b3c9',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  panelButtonTitleP: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  panelButtonr: {
    padding: 13,
    borderRadius: 28,
    backgroundColor: '#b4b4b4b4',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitler: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#3a4047',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },


});