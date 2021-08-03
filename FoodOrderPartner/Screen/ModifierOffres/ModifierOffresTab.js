import React from 'react'
import ModifierOffres from './ModifierOffres'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const tab = createMaterialTopTabNavigator()

const ModifierOffresTab = () => {

    return (
        <tab.Navigator tabBarOptions={{ indicatorStyle: { height: 2, backgroundColor: '#36b3c9' } }}>
            <tab.Screen name="Ajouter Invendu" component={ModifierOffres} />
        </tab.Navigator>
    )

}
export default ModifierOffresTab;
