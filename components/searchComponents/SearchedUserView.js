import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, StatusBar, SafeAreaView, Image, TouchableOpacity, Modal } from 'react-native'
import { firebase, db } from '../../Firebase'
import FollowersHeader from '../profileComponents/FollowersHeader'
import ProfiletabNavigation from '../../pages/navigation/profileNavigation/ProfiletabNavigation'
import { useRoute } from '@react-navigation/native'
const SearchedUserView = ({ navigation }) => {
    const route = useRoute()
    const [currentUsername, setCurrentUsername] = useState({})
    const [postLength, setPostLength] = useState(0)
    const [snapshotError, setSnapshotError] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const getUserName = () => {
        try {
            const user = firebase.auth().currentUser
            const unsubscribe = db.collection('users')
                .where('ownerUid', '==', route.params.currentUser.ownerUid)
                .limit(1).onSnapshot({
                    error: (e) => setSnapshotError(true),
                    next: (snapshot) => snapshot.docs.map(docs => {
                        setCurrentUsername(docs.data())
                    })
                })
            if (!snapshotError) {
                return unsubscribe
            }
        } catch { errors => Alert.alert('something went wrong') }
    }
    const getPostLength = () => {
        db.collection('users').doc(route.params.currentUser.email)
        .collection('posts').get().then(
            (snapshot)=>setPostLength(snapshot.docs.length)
        )
    }
    useEffect(() => {
        getUserName(),
        getPostLength()
    }, [])

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar />
            <View style={styles.headerContainer}>
                <TouchableOpacity>
                    <Text style={styles.userNameStyle}>{route.params.currentUser.userName}</Text>
                </TouchableOpacity>
            </View>
            <FollowersHeader currentUsername={currentUsername} postLength={postLength}/>
            <ProfiletabNavigation />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 15,
        alignItems: 'center'

    },
    userNameStyle: {
        color: 'white',
        fontSize: 22,
        fontWeight: '500',
        marginHorizontal: 10
    },
    headerThreeDot: {
        color: 'white',
        width: 20,
        borderWidth: 1,
        borderColor: 'white',
        height: 1,
        marginBottom: 5
    },
    modelContainer: {
        width: '100%',
        backgroundColor: 'black',
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 15,
        paddingVertical: 25

    },
    modelLogoutBtn: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    modelCloseIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        alignSelf: 'flex-end'
    }
})

export default SearchedUserView;
