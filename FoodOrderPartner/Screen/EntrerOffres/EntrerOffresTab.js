import React from 'react'
import EntrerOffres from './Etape1'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AjouterPanier from './Etape2';


const tab = createMaterialTopTabNavigator()

const EntrerOffresTab = () => {

    return (
        <tab.Navigator tabBarOptions={{ indicatorStyle: { height: 2, backgroundColor: '#36b3c9' } }}>
            <tab.Screen name="Ajouter Invendu" component={EntrerOffres} />
            <tab.Screen name="Ajouter Panier" component={AjouterPanier} />
        </tab.Navigator>
    )

}
export default EntrerOffresTab;
