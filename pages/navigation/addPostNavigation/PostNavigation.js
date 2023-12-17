import React from 'react';
import { Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PostReelNavigation from './PostReelNavigation';
import SubmitPost from '../../../components/addPostComponents/SubmitPost';
import SubmitReel from '../../../components/addPostComponents/SubmitReel';

const Stack = createNativeStackNavigator()

const PostNavigation = ({externalNavigation}) => {
    return (
        <Stack.Navigator>
          <Stack.Screen name="PostReelNavigation" component={PostReelNavigation} options={{headerShown:false}} />
          <Stack.Screen name="SubmitPost" component={SubmitPost} options={{headerShown:false}} />
          <Stack.Screen name="SubmitReel" component={SubmitReel} options={{headerShown:false}} />
        </Stack.Navigator>
    )
}

export default PostNavigation
