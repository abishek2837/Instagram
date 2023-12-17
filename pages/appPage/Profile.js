import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, StatusBar, SafeAreaView, Image, TouchableOpacity, Modal } from 'react-native'
import { firebase, db } from '../../Firebase'
import FollowersHeader from '../../components/profileComponents/FollowersHeader'
import ProfiletabNavigation from '../navigation/profileNavigation/ProfiletabNavigation'
const Profile = ({ navigation }) => {
    const handleLogout = () => {
        firebase.auth().signOut()
    }

    const [currentUsername, setCurrentUsername] = useState({})
    const [snapshotError, setSnapshotError] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [postLength, setPostLength] = useState(0)
    const getPostLength = () => {
        db.collection('users').doc(firebase.auth().currentUser.email)
        .collection('posts').get().then(
            (snapshot)=>setPostLength(snapshot.docs.length)
        )
    }
    const getUserName = () => {
        try {
            const user = firebase.auth().currentUser
            const unsubscribe = db.collection('users')
                .where('ownerUid', '==', user.uid)
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

    useEffect(() => {
        getUserName(),
        getPostLength()
    }, [])

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar />
            <View style={styles.headerContainer}>
                <TouchableOpacity>
                    <Text style={styles.userNameStyle}>{currentUsername.userName}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowModal(true)}>
                    <Text style={styles.headerThreeDot}></Text>
                    <Text style={styles.headerThreeDot}></Text>
                    <Text style={styles.headerThreeDot}></Text>
                </TouchableOpacity>
            </View>
            <FollowersHeader currentUsername={currentUsername} postLength={postLength}/>
            <ProfiletabNavigation />
            <Modal
                transparent={true}
                visible={showModal}
            >
                <View style={styles.modelContainer}>
                    <TouchableOpacity onPress={() => setShowModal(false)}>
                        <Image style={styles.modelCloseIcon} source={require('../../assets/images/close.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modelLogoutBtn} onPress={()=>handleLogout()}>
                        <Image style={{ width: 22, height: 22 }} source={require('../../assets/images/tagIcon.png')} />
                        <Text style={{ fontWeight: '500', color: 'white' }}>LogOut</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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

export default Profile;
