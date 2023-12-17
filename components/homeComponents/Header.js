import React from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native'

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <Image style={styles.instaLogo} source={require('../../assets/images/headerIconMain.png')} />
            <View style={styles.headerIconContainer}>
                <TouchableOpacity>
                    <Image style={styles.headerLogo} source={require('../../assets/images/likeIcon.png')} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.messageBadge}>
                    <Text style={{color: 'white'}}>11</Text>
                    </View>
                    <Image style={styles.headerLogo} source={require('../../assets/images/messageIcon.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    instaLogo: {
        width: 110,
        height: 50,
        resizeMode: 'contain'
    },
    headerIconContainer: {
        flexDirection: 'row'
    },
    headerLogo: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginLeft: 20
    },
    messageBadge: {
        backgroundColor: 'red',
        position: 'absolute',
        left: 30,
        bottom: 18,
        width: 25,
        height: 18,
        borderRadius: 25,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default Header;
