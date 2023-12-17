import React, { useEffect, useState } from 'react'
import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db, firebase } from '../../Firebase';

const SubmitPost = ({ navigation }) => {
    const route = useRoute();
    const [caption, setCaption] = useState('')
    const [currentUsername, setCurrentUsername] = useState('')

    const submitData = async () => {
        const unsubscribe = await db.collection('users')
            .doc(firebase.auth().currentUser.email)
            .collection('posts').add({
                userName: currentUsername.userName,
                profilePicture: currentUsername.profilePicture,
                caption: caption,
                imageurl: route.params.imagelink,
                owner_email: firebase.auth().currentUser.email,
                likes_by: [],
                comments: [],
                ownerUid: firebase.auth().currentUser.uid,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                navigation.goBack()
                route.params.handleBack()
            }
            ).catch(errors => Alert.alert('somethig went wrong'))
        return unsubscribe
    }

    const getUserName = () => {
        const user = firebase.auth().currentUser
        const unsubscribe = db.collection('users')
            .where('ownerUid', '==', user.uid)
            .limit(1).onSnapshot({
                error: (e) => console.log('error'),
                next: (snapshot) => snapshot.docs.map(docs => {
                    setCurrentUsername({
                        userName: docs.data().userName,
                        profilePicture: docs.data().profilePicture
                    })
                }
                )
            })
        return unsubscribe
    }

    useEffect(() => {
        getUserName()
    }, [])

    return (
        <SafeAreaView style={styles.submitMainContainer}>
            <SubmitHeader submitData={submitData} navigation={navigation} />
            <View style={styles.bodycontainer}>
                <TextInput
                    placeholder='write caption....'
                    value={caption}
                    onChangeText={text => setCaption(text)}
                    multiline={true}
                    style={styles.captionContainer}
                />
                <Image style={styles.image} source={{ uri: route.params.imagelink }} />
            </View>
        </SafeAreaView>
    )
}

const SubmitHeader = ({ submitData, navigation }) => {

    return (
        <SafeAreaView style={styles.headerContainer}>
            <View style={styles.backContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.backIcon} source={require('../../assets/images/back.png')} />
                </TouchableOpacity>
                <Text style={styles.newPostText}>New post</Text>
            </View>
            <TouchableOpacity onPress={submitData}>
                <Text style={styles.shareBtn}>Share</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    submitMainContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10
    },
    backContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        marginHorizontal: 10,
        alignItems: 'center'
    },
    backIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    newPostText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500'
    },
    shareBtn: {
        color: '#2196F3',
        fontSize: 15,
        marginRight: 5
    },
    captionContainer: {
        width: '70%',
        height: 100,
        backgroundColor: '#FAFAFA',
        padding: 12
    },
    image: {
        width: '30%',
        height: 100,
        resizeMode: 'cover'
    },
    bodycontainer: {
        margin: 5,
        marginVertical: 30,
        flexDirection: 'row',
        gap: 3
    }
})

export default SubmitPost
