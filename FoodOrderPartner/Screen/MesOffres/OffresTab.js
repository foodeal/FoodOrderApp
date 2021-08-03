import React from 'react'
import OffresActifs from './OffresActifs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HistoriqueOffres from './HistoriqueOffres';


const tab = createMaterialTopTabNavigator()

const OffresTab = () => {

    return (
        <tab.Navigator tabBarOptions={{ indicatorStyle: { height: 2, backgroundColor: '#36b3c9' } }}>
            <tab.Screen name="Baskets of the day" children={(navigation) => <OffresActifs {...navigation} />} />
            <tab.Screen name="History Baskets" children={(navigation) => <HistoriqueOffres {...navigation} />} />
        </tab.Navigator>
    )

}
export default OffresTab;
