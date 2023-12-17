import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SearchedUserView from '../../../components/searchComponents/SearchedUserView';
import SearchUser from '../../../components/searchComponents/SearchUser';


const Stack = createNativeStackNavigator();

const SearchNavigation = () => {
    return (
        <Stack.Navigator>
          <Stack.Screen name="SearchUser" component={SearchUser} options={{headerShown:false}} />
          <Stack.Screen name="SearchedUserView" component={SearchedUserView} options={{headerShown:false}} />
        </Stack.Navigator>
    )
}

export default SearchNavigation;
