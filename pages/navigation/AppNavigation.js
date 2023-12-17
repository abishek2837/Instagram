import React from 'react'
import { Image, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../appPage/Home';
import Profile from '../appPage/Profile';
import Search from '../appPage/Search';
import AddPost from '../appPage/AddPost';
import ReelsPost from '../appPage/ReelsPost';
import SubmitPost from '../../components/addPostComponents/SubmitPost';


const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const Create = ()=> <View style={{flex: 1}}/>

const TabNavigation = () => {
  return (
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? require(`../../assets/images/myhomeIconActive.png`)
                : require(`../../assets/images/myhomeIcon.png`);
            } else if (route.name === 'Search') {
              iconName = focused
                ? require(`../../assets/images/searchIconActive.png`)
                : require(`../../assets/images/searchIcon.png`);
            } else if (route.name === 'Create') {
              iconName = require(`../../assets/images/addIcon.png`)
            } else if (route.name === 'ReelsPost') {
              iconName = focused
                ? require(`../../assets/images/reelIconActive.png`)
                : require(`../../assets/images/reelIcon.png`);
            } else if (route.name === 'Profile') {
              iconName = 'profile'
            }

            // You can return any component that you like here!
            return <Image
              style={[styles.iconStyle(iconName,focused), iconName == 'profile' ? styles.profileStyle : null]}
              source={iconName === 'profile' ? { uri: 'https://randomuser.me/api/portraits/men/12.jpg' } : iconName}
            />;
          },
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 70,
            // paddingHorizontal: 3,
            // paddingTop: 10,
            backgroundColor: '#000000',
            paddingBottom: 25,
            // padding: 10
            // position: 'absolute',
            borderTopWidth: 0,
          }
        })}
      >
        <Tabs.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Tabs.Screen name="Search" component={Search} options={{ headerShown: false }} />
        <Tabs.Screen
          name="Create"
          component={Create}
          options={{ headerShown: false }}
          listeners={({navigation, route}) => ({
            tabPress: e => {
              e.preventDefault()
              navigation.navigate('AddPost')
            }
          })}
        />
        <Tabs.Screen name="ReelsPost" component={ReelsPost} options={{ headerShown: false }} />
        <Tabs.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      </Tabs.Navigator>
  )
}

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='TabNavigation' component={TabNavigation} />
        <Stack.Screen name='AddPost' component={AddPost} />
        <Stack.Screen name='SubmitPost' component={SubmitPost} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
const styles = StyleSheet.create({
  iconStyle: (iconName,focused)=>({
    width: 27,
    height: 27,
    resizeMode: 'cover',
    borderColor: 'white',
    borderWidth: iconName === 'profile' && focused ? 2 : null
  }),
  profileStyle: {
    borderRadius: 50,
  }
})

export default AppNavigation;
