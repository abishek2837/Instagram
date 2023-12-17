import React, { useEffect, useState } from 'react'
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, ImageBackground, TextInput, Alert, Dimensions } from 'react-native';
import { db, firebase } from '../../Firebase';
import * as ImagePicker from 'expo-image-picker';

const Stories = () => {
    const [currentUser, setCurrentUser] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [showCaptionModal, setShowCaptionModal] = useState(false)
    const [showStoryViewModal, setShowStoryViewModal] = useState(false)
    const [storyViewIndex, setStoryViewIndex] = useState(0)
    const [storyViewIndexInner, setStoryViewIndexInner] = useState(0)
    const [storyViewIndexOwner, setStoryViewIndexOwner] = useState(0)
    const [storyImage, setStoryImage] = useState('')
    const [storyCaption, setStoryCaption] = useState('')
    const [allStories, setAllStories] = useState([])
    const [ownerStory, setOwnerStory] = useState([])
    const [showOwnerStoryViewModal, setShowOwnerStoryViewModal] = useState(false)
    const [ownerLikesbyModel, setOwnerLikesbyModel] = useState(false)
    const getCurrentUserData = async () => {
        await db.collection('users').doc(firebase.auth().currentUser.email).get().then(
            (snapshot) => setCurrentUser({ ...snapshot.data() })
        )
    }
    const getStories = async () => {
        const unsubscribe = db.collection('users')
            .where('followed_by', 'array-contains', firebase.auth().currentUser.email)
            .get()
            .then((querySnapshot) => {
                let story = []
                let userIndex = 0
                querySnapshot.forEach(async (doc) =>
                    await db.collectionGroup('stories').orderBy('owner_email').startAt(doc.data().email).endAt(doc.data().email + "\uf8ff")
                        .get().then(
                            docs => {
                                const userStory = []
                                userIndex = userIndex + 1
                                if (!docs.empty) {
                                    let userStory = []
                                    docs.forEach(doc => {
                                        userStory.push({ id: doc.id, ...doc.data() })
                                    })
                                    story.push(userStory)
                                }
                                if (querySnapshot.docs.length == userIndex) {
                                    setAllStories(story)
                                }
                            }
                        ).catch((e) => Alert.alert('poor connection!'))
                )
            })
            .catch((err) => {
                console.error("Failed to execute query", err.message);
            })
        return unsubscribe
    }
    const getOwnerStories = async () => {
        await db.collection('users').doc(firebase.auth().currentUser.email)
            .collection('stories').get().then(
                (snapshot) => {
                    const ownerStoriesData = []
                    snapshot.docs.map((doc, index) =>
                        ownerStoriesData.push(doc.data()),
                    )
                    setOwnerStory(ownerStoriesData)
                }
            )
        if (ownerStory.length > 0) {
            setShowOwnerStoryViewModal(true)
        }
    }
    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                console.log(result)
                setStoryImage(result.assets[0].uri);
                setShowModal(true)
            }
        } catch { (e) => Alert.alert('something went wrong!') }
    };
    const handlePostStory = async () => {
        const unsubscribe = await db.collection('users')
            .doc(firebase.auth().currentUser.email)
            .collection('stories').add({
                userName: currentUser.userName,
                profilePicture: currentUser.profilePicture,
                imageUrl: storyImage,
                caption: storyCaption,
                owner_email: firebase.auth().currentUser.email,
                likes_by: [],
                ownerUid: firebase.auth().currentUser.uid,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
            }).then(() => {
                setShowModal(false)
                setStoryCaption('')
            }
            ).catch(errors => Alert.alert('somethig went wrong'))
    }
    const handleShowStories = (index) => {
        setShowStoryViewModal(true)
        setStoryViewIndex(index)
    }
    const handleStoryRightSwap = (data) => {
        if (data === 'ownerStory') {
            if (ownerStory.length - 1 > storyViewIndexOwner) {
                setStoryViewIndexOwner(storyViewIndexOwner + 1)
            } else {
                setShowOwnerStoryViewModal(false)
                setStoryViewIndexOwner(0)
            }
        } else {
            if (allStories[storyViewIndex].length - 1 > (storyViewIndexInner)) {
                setStoryViewIndexInner(storyViewIndexInner + 1)
            }
            if (allStories[storyViewIndex].length - 1 == (storyViewIndexInner)) {
                if (storyViewIndex < allStories.length - 1) {
                    setStoryViewIndex(storyViewIndex + 1)
                    setStoryViewIndexInner(0)
                } else {
                    setShowStoryViewModal(false)
                    setStoryViewIndex(0)
                    setStoryViewIndexInner(0)
                }
            }
        }
    }
    const handleStoryLeftSwap = (data) => {
        if (data === 'ownerStory') {
            if (storyViewIndexOwner > 0) {
                setStoryViewIndexOwner(storyViewIndexOwner - 1)
            } else {
                setShowOwnerStoryViewModal(false)
                setStoryViewIndexOwner(0)
            }
        } else {
            if (storyViewIndexInner > 0) {
                setStoryViewIndexInner(storyViewIndexInner - 1)
            }
            if (storyViewIndexInner == 0) {
                if (storyViewIndex > 0) {
                    setStoryViewIndex(storyViewIndex - 1)
                    setStoryViewIndexInner(0)
                } else {
                    setShowStoryViewModal(false)
                    setStoryViewIndex(0)
                    setStoryViewIndexInner(0)
                }
            }
        }
    }
    const handleLike = (data) => {
        const currentLikeStatus = !data.likes_by.some((data) => data.userName === currentUser.userName)
        const unsubscribe = db.collection('users').doc(data.owner_email).collection('stories')
            .doc(data.id)
            .update({
                likes_by: currentLikeStatus ?
                    firebase.firestore.FieldValue.arrayUnion({ userName: currentUser.userName, profilePicture: currentUser.profilePicture })
                    :
                    firebase.firestore.FieldValue.arrayRemove({ userName: currentUser.userName, profilePicture: currentUser.profilePicture })
            }).then(
                getStories()
            )
        return unsubscribe
    }
    useEffect(() => {
        getCurrentUserData()
        getStories()
    }, [])
    return (
        <View style={{ marginTop: 13, marginBottom: 30 }}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}

            >
                <View style={styles.storyContainer}>
                    <TouchableOpacity onPress={() => getOwnerStories()}>
                        <View style={styles.ownerStoryMainBorder}>
                            <Image style={styles.storyImage} source={{ uri: currentUser?.profilePicture }} />
                        </View>
                        <TouchableOpacity onPress={() => pickImage()}>
                            <Image style={styles.storyImageAddBtn} source={require('../../assets/images/storyAddIcon.png')} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <Text style={{ color: 'white' }}>
                        your story
                    </Text>
                </View>
                {allStories?.map((data, index) => (
                    <View key={index} style={styles.storyContainer}>
                        <TouchableOpacity key={index} onPress={() => handleShowStories(index)}>
                            <View style={styles.storyMainBorder}>
                                <Image style={styles.storyImage} source={{ uri: data[0].profilePicture }} />
                            </View>
                        </TouchableOpacity>
                        <Text style={{ color: 'white' }}>
                            {data[0].userName.length > 10 ? data[0].userName.slice(0, 8) + "..." : data[0].userName}
                        </Text>
                    </View>
                ))}

                <Modal
                    visible={showModal}
                >
                    <View style={{ flex: 1, backgroundColor: 'black' }}>
                        <View>
                            <Image style={styles.imageContainer} source={{ uri: storyImage }} />
                            {!showCaptionModal ?
                                <>
                                    <TouchableOpacity style={styles.backBtnContainer} onPress={() => { setShowModal(false) }}>
                                        <Image style={styles.backBtn} source={require('../../assets/images/backArrowIcon.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.addTextBtnContainer} onPress={() => setShowCaptionModal(true)}>
                                        <Text style={styles.addTextBtn}>Aa</Text>
                                    </TouchableOpacity>
                                </>
                                : null
                            }
                        </View>
                        <TouchableOpacity style={styles.postIconContainer} onPress={() => handlePostStory()}>
                            <Image style={styles.postIcon} source={require('../../assets/images/sendArrowIconBlack.png')} />
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    visible={showCaptionModal}
                    transparent={true}
                >
                    <TouchableOpacity style={styles.captionDoneBtn} onPress={() => setShowCaptionModal(false)}>
                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 18 }}>Done</Text>
                    </TouchableOpacity>
                    <View style={styles.addCaptionContainer}>
                        <TextInput
                            style={styles.addCaptionBox(storyCaption)}
                            multiline={true}
                            autoFocus={true}
                            value={storyCaption}
                            onChangeText={(text) => setStoryCaption(text)}
                        />
                    </View>
                </Modal>
                <Modal
                    visible={showStoryViewModal}
                >
                    {allStories.length > 0 ?
                        <View style={{ flex: 1, backgroundColor: 'black' }}>
                            <View style={{ height: '90%' }}>
                                <Image
                                    style={styles.storyView}
                                    source={{ uri: allStories[storyViewIndex][storyViewIndexInner].imageUrl }}
                                />
                                <View style={styles.gestureContainer}>
                                    <TouchableOpacity style={styles.gestureContainerLeft} onPress={() => handleStoryLeftSwap()} />
                                    <TouchableOpacity style={styles.gestureContainerRight} onPress={() => handleStoryRightSwap()} />
                                </View>
                                <View style={styles.storyProfileView}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <Image
                                            style={styles.storyProfileImageView}
                                            source={{ uri: allStories[storyViewIndex][0].profilePicture }}
                                        />
                                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>{allStories[storyViewIndex][0].userName}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => { setShowStoryViewModal(false), setStoryViewIndex(0), setStoryViewIndexInner(0) }}>
                                        <Image
                                            style={{ width: 25, height: 25, resizeMode: 'contain' }}
                                            source={require('../../assets/images/close.png')} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Text style={styles.storyViewCaption(allStories[storyViewIndex][storyViewIndexInner].caption.length)}>
                                        {allStories[storyViewIndex][storyViewIndexInner].caption}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => handleLike(allStories[storyViewIndex][storyViewIndexInner])}>
                                {allStories[storyViewIndex][storyViewIndexInner].likes_by.some((data) => data.userName === currentUser.userName) ?

                                    <Image style={styles.storyProfileLikeBtn} source={require('../../assets/images/likeIconActive.png')} />
                                    :
                                    <Image style={styles.storyProfileLikeBtn} source={require('../../assets/images/likeIcon.png')} />
                                }
                            </TouchableOpacity>
                        </View>
                        : null}
                </Modal>
                <Modal
                    visible={showOwnerStoryViewModal}
                >
                    {ownerStory.length > 0 ?
                        <View style={{ flex: 1, backgroundColor: 'black' }}>
                            <View style={{ height: '90%' }}>
                                <Image
                                    style={styles.storyView}
                                    source={{ uri: ownerStory[storyViewIndexOwner].imageUrl }}
                                />
                                {/* {console.log('index outer',ownerStory.length-1,storyViewIndex,ownerStory[storyViewIndex])} */}
                                <View style={styles.gestureContainer}>
                                    <TouchableOpacity style={styles.gestureContainerLeft} onPress={() => handleStoryLeftSwap('ownerStory')} />
                                    <TouchableOpacity style={styles.gestureContainerRight} onPress={() => handleStoryRightSwap('ownerStory')} />
                                </View>
                                <View style={styles.storyProfileView}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <Image
                                            style={styles.storyProfileImageView}
                                            source={{ uri: ownerStory[0].profilePicture }}
                                        />
                                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>{ownerStory[0].userName}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => { setShowOwnerStoryViewModal(false), setStoryViewIndex(0), setStoryViewIndexInner(0) }}>
                                        <Image
                                            style={{ width: 25, height: 25, resizeMode: 'contain' }}
                                            source={require('../../assets/images/close.png')} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Text style={styles.storyViewCaption(ownerStory[storyViewIndexOwner].caption.length)}>
                                        {ownerStory[storyViewIndexOwner].caption}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => setOwnerLikesbyModel(true)}>
                                <Image style={{ width: 35, height: 35, resizeMode: 'contain', left: 20 }} source={require('../../assets/images/user.png')} />
                            </TouchableOpacity>
                        </View>
                        : null}
                </Modal>
                <Modal
                    transparent={true}
                    visible={ownerLikesbyModel}
                >
                    {ownerStory.length > 0 ?
                        <ScrollView>
                            <View
                                style={{ height: Dimensions.get('window').height, width: '100%' }}
                            >
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => setOwnerLikesbyModel(false)}></TouchableOpacity>
                                <View style={styles.ownerStoryLikeby}>
                                    <Text style={styles.likesbyCount}>{ownerStory[storyViewIndexOwner].likes_by.length} likes</Text>
                                    {ownerStory[storyViewIndexOwner].likes_by.map((data, index) => {
                                        return (
                                            <View key={index} style={styles.ownerStoryLikedUsers}>
                                                <Image style={{ width: 40, height: 40, borderRadius: 50, resizeMode: 'contain' }} source={{ uri: data.profilePicture }} />
                                                <Text style={{ color: 'white' }}>{data.userName}</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        </ScrollView>
                        : null
                    }
                </Modal>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    storyImage: {
        width: 70,
        height: 70,
        borderColor: 'white',
        borderWidth: 0.2,
        borderRadius: 50,
    },
    storyImageAddBtn: {
        width: 30,
        height: 30,
        borderRadius: 50,
        resizeMode: 'contain',
        position: 'absolute',
        bottom: 0,
        left: 60,
        backgroundColor: 'black'
    },
    storyContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    storyMainBorder: {
        borderColor: '#ff8501',
        borderWidth: 3,
        marginLeft: 10,
        padding: 5,
        borderRadius: 50,
    },
    ownerStoryMainBorder: {
        borderColor: '#ff8501',
        borderWidth: 3,
        marginLeft: 10,
        padding: 5,
        borderRadius: 50,
    },
    backBtnContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 12,
        position: 'absolute',
        top: 0,
        borderRadius: 50,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backBtn: {
        width: 22,
        height: 22,
        resizeMode: 'contain'
    },
    addTextBtnContainer: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
        position: 'absolute',
        right: 0,
        borderRadius: 50,
        margin: 10
    },
    addTextBtn: {
        color: 'white',
        fontWeight: '500',
        fontSize: 20
    },
    imageContainer: {
        width: '100%',
        height: '92%',
        borderRadius: 20,
        borderWidth: 2,

    },
    postIcon: {
        width: 13,
        height: 13,
        resizeMode: 'contain'
    },
    postIconContainer: {
        backgroundColor: 'white',
        padding: 17,
        position: 'absolute',
        bottom: '8%',
        right: 15,
        borderRadius: 50,
    },
    addCaptionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '92%',
    },
    addCaptionBox: (storyCaption) => ({
        backgroundColor: storyCaption.length > 0 ? 'black' : null,
        color: 'white',
        fontSize: 25,
        fontWeight: '400',
        textAlign: 'center',
        padding: 10
    }),
    captionDoneBtn: {
        alignItems: 'flex-end',
        margin: 10,
        marginHorizontal: 20
    },
    storyView: {
        resizeMode: 'contain',
        flex: 1,
    },
    storyProfileView: {
        position: 'absolute',
        top: 20,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10
    },
    storyProfileImageView: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        borderRadius: 50
    },
    gestureContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        flexDirection: 'row'
    },
    gestureContainerLeft: {
        width: '50%',
        height: '100%',
    },
    gestureContainerRight: {
        width: '50%',
        height: '100%',
    },
    storyProfileLikeBtn: {
        alignSelf: 'flex-end',
        marginHorizontal: 20,
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },
    storyViewCaption: (length) => ({
        color: 'white',
        backgroundColor: length > 0 ? 'black' : null,
        bottom: 50,
        fontSize: 22,
        fontWeight: '500',
        alignSelf: 'center',
        padding: 8,
        borderRadius: 5
    }),
    ownerStoryLikeby: {
        height: '60%',
        backgroundColor: 'black',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        gap: 10
    },
    ownerStoryLikedUsers: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginHorizontal: 10
    },
    likesbyCount: {
        backgroundColor: 'grey',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        height: 40,
        fontSize: 22,
        color: 'white',
        fontWeight: '500',
        padding: 5,
        paddingHorizontal: 15
    }
})

export default Stories
