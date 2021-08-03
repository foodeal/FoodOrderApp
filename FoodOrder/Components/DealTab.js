import React from 'react'
import DealActifs from './DealsActifs'
import DealExpired from './DealsExpired'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import DealsUtilises from './DealsUtilises';
import DealActifTab from './DealActifTab';
import DealsUtilisesConfirmer from './DealsUtilisesConfirmer';


const tab = createMaterialTopTabNavigator()

const DealTab = () => {

    return (
        <tab.Navigator tabBarOptions={{ indicatorStyle: { height: 2, backgroundColor: '#36b3c9' } }}>
            <tab.Screen name="Active" component={DealActifTab} />
            <tab.Screen name="Used" component={DealsUtilisesConfirmer} />
            <tab.Screen name="Expired" component={DealExpired} />
        </tab.Navigator>
    )

}
export default DealTab;
