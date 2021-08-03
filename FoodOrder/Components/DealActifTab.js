import React from 'react'
import DealActifs from './DealsActifs'
import DealExpired from './DealsExpired'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DealsUtilises from './DealsUtilises';


const tab = createMaterialTopTabNavigator()

const DealActifTab = () => {

    return (
        <tab.Navigator tabBarOptions={{ indicatorStyle: { height: 2, backgroundColor: '#36b3c9' } }}>
            <tab.Screen name="UnPaid" component={DealActifs} />
            <tab.Screen name="Paid" component={DealsUtilises} />
        </tab.Navigator>
    )

}
export default DealActifTab;
