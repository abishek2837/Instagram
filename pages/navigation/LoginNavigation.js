import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../loginpage/Login';
import Signup from '../loginpage/Signup';

const Stack = createNativeStackNavigator();

const LoginNavigation = () => {
    return (
        <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
          <Stack.Screen name="Signup" component={Signup} options={{headerShown:false}} />
        </Stack.Navigator>
      </NavigationContainer>
    )
}

export default LoginNavigation;
