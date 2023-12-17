import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeMainPage from '../../../components/homeComponents/HomeMainPage';
import SearchedUserView from '../../../components/searchComponents/SearchedUserView';


const Stack = createNativeStackNavigator();

const HomeNavigation = () => {
    return (
        <Stack.Navigator>
          <Stack.Screen name="HomeMainPage" component={HomeMainPage} options={{headerShown:false}} />
          <Stack.Screen name="SearchedUserView" component={SearchedUserView} options={{headerShown:false}} />
        </Stack.Navigator>
    )
}

export default HomeNavigation;
