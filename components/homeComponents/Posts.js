import React, { useMemo, useEffect, useState } from 'react'
import { Image, Text, View, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, Modal, ScrollView, TextInput, Alert } from 'react-native'
import { Divider } from 'react-native-elements'
import { firebase, db } from '../../Firebase'
import { TapGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated'

const AnimatedImage = Animated.createAnimatedComponent(Image)

const RemoteImage = ({ uri, desiredWidth, post, handleLikeOnDoubleClick }) => {
    const scale = useSharedValue(0)
    const [desiredHeight, setDesiredHeight] = React.useState(0)
    const rStyle = useAnimatedStyle(() => ({
        transform: [{ scale: Math.max(scale.value, 0) }]
    }))
    const onDoubleTab = () => {
        scale.value = withSpring(1, undefined, (isFinished) => {
            if (isFinished) {
                scale.value = withDelay(500, withSpring(0))
            }
        })
        handleLikeOnDoubleClick(post)
    }
    Image.getSize(uri, (width, height) => {
        setDesiredHeight(desiredWidth / width * height > 500 ? 500 : desiredWidth / width * height)
    })

    return (
        <GestureHandlerRootView>
            <TapGestureHandler
                maxDelayMs={250}
                numberOfTaps={2}
                onActivated={onDoubleTab}
            >
                <Animated.View>
                    <ImageBackground
                        source={{ uri }}
                        style={{
                            width: desiredWidth,
                            height: desiredHeight,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <AnimatedImage style={[styles.likeAnimaton, rStyle]} source={require('../../assets/images/likeEffectIcon.png')} />
                    </ImageBackground>
                </Animated.View>
            </TapGestureHandler>
        </GestureHandlerRootView>
    )
}

const Posts = ({ post, navigation }) => {
    const [isLiked, setIsLiked] = useState(post.likes_by.includes(firebase.auth().currentUser.email))
    const [currentUser, setCurrentUser] = useState({})
    const getCurrentUserData = async () => {
        await db.collection('users').doc(firebase.auth().currentUser.email).get().then(
            (snapshot) => setCurrentUser({ ...snapshot.data() })
        )
    }
    const handleLike = post => {
        const currentLikeStatus = !post.likes_by.includes(
            firebase.auth().currentUser.email
        )
        setIsLiked(currentLikeStatus)
        const unsubscribe = db.collection('users').doc(post.owner_email)
            .collection('posts')
            .doc(post.id)
            .update({
                likes_by: currentLikeStatus ?
                    firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.email)
                    :
                    firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.email)
            })
        return unsubscribe
    }
    const handleLikeOnDoubleClick = post => {
        const currentLikeStatus = !post.likes_by.includes(
            firebase.auth().currentUser.email
        )
        setIsLiked(true)
        const unsubscribe = db.collection('users').doc(post.owner_email)
            .collection('posts')
            .doc(post.id)
            .update({
                likes_by: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.email)
            })
        if (currentLikeStatus) {
            return unsubscribe
        }
    }
    const memoUnchangeHeader = useMemo(() =>
        <>
            <PostHeader post={post} navigation={navigation} />
            <PostImage post={post} handleLikeOnDoubleClick={handleLikeOnDoubleClick} />
        </>
        , [post.imageurl]);
    useEffect(() => {
        getCurrentUserData()
        setIsLiked(post.likes_by.includes(firebase.auth().currentUser.email))
    }, [])
    return (
        <>
            <View style={styles.postMainContainer}>
                {memoUnchangeHeader}
                <PostIconFooter post={post} handleLike={handleLike} currentUser={currentUser} isLiked={isLiked} />
                <PostCaptionFooter post={post} />
            </View>
            <Divider width={0.1} orientation='vertical' />
        </>
    )
}

const PostHeader = ({ post, navigation }) => {
    const handleUserView = async (post) => {
        await db.collection('users').doc(post.owner_email).get().then(
            (snapshot) => {
                navigation.navigate('SearchedUserView', { currentUser: { ...snapshot.data() } })
            }
        )
    }
    return (
        <View style={styles.postHeaderContainer}>
            <View style={styles.postHeaderSubContainer}>
                <TouchableOpacity onPress={() => handleUserView(post)}>
                    <Image style={styles.PostHeaderImage} source={{ uri: post.profilePicture }} />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontWeight: 700 }}>{post.userName}</Text>
            </View>
            <TouchableOpacity>
                <Text style={{ color: 'white', fontWeight: '900', marginRight: 10 }}>...</Text>
            </TouchableOpacity>
        </View>
    )
}

const PostImage = ({ post, handleLikeOnDoubleClick }) => {
    return (
        <View>
            <TouchableOpacity activeOpacity={1} >
                <RemoteImage
                    uri={post.imageurl}
                    desiredWidth={Dimensions.get('window').width}
                    post={post}
                    handleLikeOnDoubleClick={handleLikeOnDoubleClick}
                />
            </TouchableOpacity>
        </View>
    )
}

const PostIconFooter = ({ post, handleLike, currentUser, isLiked }) => {
    const [addCommentModel, setAddCommentModel] = useState(false)
    const [comment, setComment] = useState('')
    const handleComment = () => {
        const unsubscribe = db.collection('users').doc(post.owner_email)
            .collection('posts')
            .doc(post.id).update({
                comments: firebase.firestore.FieldValue.arrayUnion({
                    profilePicture: currentUser.profilePicture,
                    userName: currentUser.userName,
                    comment: comment,
                    email: currentUser.email
                })
            }).then(() => setComment(''))
            .catch((e) => Alert.alert('somethig went wrong!'))
    }
    return (
        <View style={styles.postIconFooterContainer}>
            <View style={styles.postIconFooterSubContainer}>
                <TouchableOpacity onPress={() => { handleLike(post) }}>
                    <Image
                        style={styles.likesIconCommon}
                        source={isLiked ?
                            require('../../assets/images/likeIconActive.png')
                            :
                            require('../../assets/images/likeIcon.png')
                        }
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAddCommentModel(true)}>
                    <Image style={styles.likesIconCommon} source={require('../../assets/images/commentIcon.png')} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image style={styles.likesIconCommon} source={require('../../assets/images/sendIcon.png')} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity>
                <Image style={styles.likesIconCommon} source={require('../../assets/images/saveIcon.png')} />
            </TouchableOpacity>
            <Modal
                visible={addCommentModel}
                transparent={true}
            >
                <ScrollView >
                    <View style={{ height: Dimensions.get('window').height }}>
                        <TouchableOpacity style={{ height: '30%' }} onPress={() => setAddCommentModel(false)} />
                        <View style={{ height: '70%', backgroundColor: 'black' }}>
                            <Text style={styles.commentLength}>Comments</Text>
                            <Divider />
                            {post.comments.length > 0 ?
                                post.comments.map((data, index) => {
                                    return (
                                        <View style={styles.commentViewContainer} key={index}>
                                            <Image style={styles.commentedUserImage} source={{ uri: data.profilePicture }} />
                                            <View>
                                                <Text style={{ color: 'white', fontWeight: '700' }}>{data.userName}</Text>
                                                <Text style={{ color: 'white', flexWrap: 'wrap' }}>{data.comment}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                                :
                                <Text style={styles.noCommentsText}>No comments!</Text>
                            }
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.writeCommentContainer}>
                    <Image style={styles.writeCommentOwnerImage} source={{ uri: currentUser?.profilePicture }} />
                    <TextInput
                        style={styles.writeCommentTextbox}
                        placeholder='write comments...'
                        value={comment}
                        onChangeText={(text) => setComment(text)}
                    />
                    <TouchableOpacity onPress={() => handleComment()}>
                        <Image style={styles.writeCommentSendBtn} source={require('../../assets/images/sendIconBlue.png')} />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

const PostCaptionFooter = ({ post }) => {
    return (
        <View style={{ marginHorizontal: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.likeText}>{post.likes_by.length}</Text>
                <Text style={{ color: 'white' }}>likes</Text>
            </View>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {post.userName}
                <Text style={{ fontWeight: '300' }}> {post.caption}</Text>
            </Text>
            <TouchableOpacity>
                {!!post.comments?.length &&
                    <Text style={{ color: 'grey', marginTop: 5 }}>
                        view {post.comments?.length < 2 ? '1 comment' : `all ${post.comments?.length} comments`}
                    </Text>
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    postMainContainer: {
        marginBottom: 30
    },
    PostHeaderImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        borderColor: '#ff8501',
        borderWidth: 1.6,
        marginRight: 5
    },
    postHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 7,
        alignItems: 'center'
    },
    postHeaderSubContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    likesIconCommon: {
        width: 30,
        height: 30,
        resizeMode: 'cover',
        marginRight: 15,
        marginTop: 5
    },
    postIconFooterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5
    },
    postIconFooterSubContainer: {
        flexDirection: 'row',
        marginHorizontal: 10
    },
    likeText: {
        color: 'white',
        fontWeight: '900',
        marginRight: 5
    },
    likeAnimaton: {
        width: 90,
        height: 90,
        resizeMode: 'contain'
    },
    commentLength: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        margin: 10,
        marginTop: 25
    },
    commentViewContainer: {
        flexDirection: 'row',
        gap: 15,
        marginHorizontal: 15,
        marginTop: 25
    },
    commentedUserImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        borderRadius: 50,
        backgroundColor: 'red'
    },
    writeCommentContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        bottom: 0,
        height: 80,
        padding: 10,
        gap: 5
    },
    writeCommentOwnerImage: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
        borderRadius: 50,
        borderColor: 'black',
        borderWidth: 0.2
    },
    writeCommentTextbox: {
        paddingHorizontal: 10,
        width: '75%',
        height: '60%'
    },
    writeCommentSendBtn: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    noCommentsText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingVertical: '50%'
    }

})

export default Posts;
