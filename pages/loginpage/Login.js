import React from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, Image } from 'react-native'
import LoginForm from '../../components/loginComponents/LoginForm'

const Login = ({navigation}) => {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar />
            <View style={styles.imageContainer}>
                <Image style={styles.logoImage} source={require('../../assets/images/instaLogo.jpg')} />
            </View>
            <View style={styles.loginFormContainer}>
                <LoginForm navigation={navigation}/>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        // backgroundColor: 'black',
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
    loginFormContainer: {
        marginTop: 50
    }
})

export default Login
