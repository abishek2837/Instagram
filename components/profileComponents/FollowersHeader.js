import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, Text, View, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Dimensions } from 'react-native';
import { db, firebase } from '../../Firebase';
import * as ImagePicker from 'expo-image-picker';

const FollowersHeader = ({ currentUsername, postLength }) => {
    const [editValue, setEditValue] = useState({
        name: currentUsername?.name,
        userName: currentUsername?.userName,
        bio: currentUsername?.bio,
        profilePicture: currentUsername?.profilePicture
    })
    const [showModal, setShowModal] = useState(false)
    const editProfile = () => {
        const unsubscribe = db.collection('users').doc(firebase.auth().currentUser.email).set({
            ...currentUsername,
            name: editValue.name,
            userName: editValue.userName,
            bio: editValue.bio,
            profilePicture: editValue.profilePicture
        })
        setShowModal(false)
    }
    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setEditValue({ ...editValue, profilePicture: result.assets[0].uri });
            }
        } catch { (e) => Alert.alert('something went wrong!') }
    };
    const handleFollowCheck = () => {
        const currentFollowStatus = !currentUsername?.followed_by.includes(
            firebase.auth().currentUser.email
        )
        const unsubscribe = db.collection('users').doc(currentUsername?.email)
            .update({
                followed_by: currentFollowStatus ?
                    firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.email)
                    :
                    firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.email)
            }).then(
                db.collection('users').doc(firebase.auth().currentUser.email)
                    .update({
                        following: currentFollowStatus ?
                            firebase.firestore.FieldValue.arrayUnion(currentUsername.email)
                            :
                            firebase.firestore.FieldValue.arrayRemove(currentUsername.email)
                    })
            )
            return unsubscribe
    }
    useEffect(() => {
        setEditValue({
            name: currentUsername?.name,
            userName: currentUsername?.userName,
            bio: currentUsername?.bio,
            profilePicture: currentUsername?.profilePicture
        })
        
    }, [currentUsername])
    return (
        <SafeAreaView>
            <View style={styles.followContainer}>
                <View>
                    <Image style={styles.profileImage} source={{ uri: currentUsername?.profilePicture }} />
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                        {postLength}
                    </Text>
                    <Text style={{ color: 'white' }}>
                        Posts
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                        {currentUsername?.followed_by?.length}
                    </Text>
                    <Text style={{ color: 'white' }}>
                        Followers
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                        {currentUsername?.following?.length}
                    </Text>
                    <Text style={{ color: 'white' }}>
                        Following
                    </Text>
                </View>
            </View>

            <View style={{ marginHorizontal: 20 }}>
                <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>
                    {currentUsername?.name}
                </Text>
                <Text style={{ color: 'white', fontSize: 16 }}>
                    {currentUsername?.bio}
                </Text>
            </View>
            {currentUsername.email === firebase.auth().currentUser.email ?
                <View style={styles.profileBtnContainer}>
                    <TouchableOpacity style={styles.profileBtn} onPress={() => setShowModal(true)}>
                        <Text style={styles.profileBtnText}>Edit profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profileBtn} onPress={() => setShowModal(false)}>
                        <Text style={styles.profileBtnText}>Share profile</Text>
                    </TouchableOpacity>
                </View>
                :
                <FollowBox handleFollowCheck={handleFollowCheck} currentUsername={currentUsername} />
            }
            <Modal
                visible={showModal}
                animationType='slide'
            >
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <EditProfileHeader setShowModal={setShowModal} editProfile={editProfile} />
                    <EditProfilePicture profilePicture={editValue.profilePicture} pickImage={pickImage} />
                    <View style={styles.inputFieldContainer}>
                        <View>
                            <Text style={{ color: 'grey' }}>Name</Text>
                            <TextInput
                                placeholder='Name...'
                                style={styles.inputFieldStyle}
                                value={editValue.name}
                                onChangeText={text => setEditValue({ ...editValue, name: text })}
                            />
                        </View>
                        <View>
                            <Text style={{ color: 'grey' }}>UserName</Text>
                            <TextInput
                                placeholder='UserName...'
                                style={styles.inputFieldStyle}
                                value={editValue.userName}
                                onChangeText={text => setEditValue({ ...editValue, userName: text })}
                            />
                        </View>
                        <View>
                            <Text style={{ color: 'grey' }}>Bio</Text>
                            <TextInput
                                placeholder='Bio...'
                                style={styles.inputFieldStyle}
                                value={editValue.bio}
                                onChangeText={text => setEditValue({ ...editValue, bio: text })}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const EditProfileHeader = ({ setShowModal, editProfile }) => {
    return (
        <View style={styles.editHeaderContainer}>
            <View style={styles.editHeaderSubContainer}>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Image style={styles.editCloseIcon} source={require('../../assets/images/close.png')} />
                </TouchableOpacity>
                <Text style={styles.editProfileText}>Edit Profile</Text>
            </View>
            <TouchableOpacity onPress={() => editProfile()}>
                <Image style={styles.editCloseIcon} source={require('../../assets/images/check.png')} />
            </TouchableOpacity>
        </View>
    )
}

const FollowBox = ({ handleFollowCheck, currentUsername }) => {
    return (
        <TouchableOpacity style={styles.followBoxContainer} onPress={() => handleFollowCheck()}>
            <Text style={{ color: 'white' }}>
                {currentUsername?.followed_by?.includes(firebase.auth().currentUser.email)
                    ?
                    'unfollow'
                    :
                    'follow'
                }
            </Text>
        </TouchableOpacity>
    )
}

const EditProfilePicture = ({ profilePicture, pickImage }) => {
    return (
        <View style={styles.profilePictureContainer}>
            <Image source={{ uri: profilePicture }} style={styles.profilePictureImage} />
            <TouchableOpacity onPress={() => pickImage()}>
                <Text style={{ color: '#2196F3', fontWeight: '400' }}>
                    Edit picture
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    followContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 10
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    profileBtnContainer: {
        flexDirection: 'row',
        margin: 20
    },
    profileBtn: {
        backgroundColor: 'rgba(40,40,40,255)',
        width: '50%',
        height: 32,
        borderRadius: 10,
        marginRight: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileBtnText: {
        color: 'white',
        fontWeight: 'bold'
    },
    editHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        alignItems: 'center',
        backgroundColor: 'black'
    },
    editHeaderSubContainer: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center'
    },
    editCloseIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    editOkIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    editProfileText: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white'
    },
    profilePictureContainer: {
        alignItems: 'center',
        gap: 20,
        margin: 20
    },
    profilePictureImage: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 50
    },
    inputFieldStyle: {
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginTop: 5,
        color: 'black',
        fontSize: 15
    },
    inputFieldContainer: {
        margin: 15,
        gap: 20
    },
    followBoxContainer: {
        width: Dimensions.get('window').width - 40,
        height: 35,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        marginTop: 20
    }
})

export default FollowersHeader;
