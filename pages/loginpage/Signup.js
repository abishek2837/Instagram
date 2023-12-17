import React from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, Image, Dimensions } from 'react-native'
import SignupForm from '../../components/loginComponents/SignupForm'

const Signup = ({navigation}) => {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar/>
        <View style={styles.imageContainer}>
        <Image style={styles.logoImage} source={require('../../assets/images/instaLogo.jpg')}/>
        </View>
        <View style={styles.singnupFormContainer}>
        <SignupForm navigation={navigation}/>
        </View>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: '25%'
    },
    logoImage: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
        borderRadius: 20
    },
    singnupFormContainer: {
        marginTop: 50
    }
})

export default Signup;
