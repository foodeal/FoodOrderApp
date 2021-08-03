import React from 'react'
import ScannerOffreEnd from './ScannerOffreEnd'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const tab = createMaterialTopTabNavigator()

const ScannerOffreEndTab = ({itemData,navigation}) => {

    return (
        <tab.Navigator tabBarOptions={{ indicatorStyle: { height: 2, backgroundColor: '#36b3c9' } }}>
            <tab.Screen name="Add Bassinet" children={(navigation) => <ScannerOffreEnd {...navigation} itemData={itemData}  />}/>
        </tab.Navigator>
    )

}
export default ScannerOffreEndTab;
