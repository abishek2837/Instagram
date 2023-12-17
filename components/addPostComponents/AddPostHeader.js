import React from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

const AddPostHeader = ({ navigation}) => {
    const imagelink = useSelector(state => state.addPostReducer.AddPostImage)
    const handleBack = () => {
        navigation.navigate('Home')
    }
    return (
        <SafeAreaView  style={styles.mainContainer}>
            <View style={styles.closeContainer}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Image style={styles.closeIcon} source={require('../../assets/images/close.png')}/>
            </TouchableOpacity>
            <Text style={styles.newPostText}>New post</Text>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('SubmitPost',{imagelink:imagelink, handleBack: handleBack})}>
                <Text style={styles.nextBtn}>Next</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10
    },
    closeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        marginHorizontal: 10,
        alignItems: 'center'
    }, 
    closeIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    newPostText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500'
    }, 
    nextBtn: {
        color: '#2196F3',
        fontSize: 15,
        marginRight: 5
    }
})

export default AddPostHeader;
