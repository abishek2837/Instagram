import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av'
import { useIsFocused } from '@react-navigation/native';
import { useCallback } from 'react';
import { db, firebase } from '../../Firebase';

const ReelsVideo = ({ item, index, currentVideoIndex, setIsMute, isMute }) => {
  const videoRef = useRef(null)
  const hasFocus = useIsFocused()
  const [showMute, setShowMute] = useState(false)
  const [isLiked, setIsLiked] = useState(item.likes_by.includes(firebase.auth().currentUser.email))
  const [currentUser, setCurrentUser] = useState({})
  const getCurrentUserData = async () => {
    await db.collection('users').doc(firebase.auth().currentUser.email).get().then(
      (snapshot) => setCurrentUser({ ...snapshot.data() })
    )
  }
  const handleLike = item => {
    const currentLikeStatus = !item.likes_by.includes(
      firebase.auth().currentUser.email
    )
    setIsLiked(currentLikeStatus)
    const unsubscribe = db.collection('users').doc(item.owner_email)
      .collection('reels')
      .doc(item.id)
      .update({
        likes_by: currentLikeStatus ?
          firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.email)
          :
          firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.email)
      })
    return unsubscribe
  }

  const handleError = (e) => {
  }
  async function playVideo() {
    if (videoRef.current === null) {
      return;
    }
    await videoRef.current.replayAsync();
    await videoRef.current.playAsync();
  }
  async function pauseVideo() {
    if (videoRef.current === null) {
      return;
    }
    await videoRef.current.pauseAsync();
  }
  async function loadVideo() {
    if (videoRef.current === null) {
      return;
    }
    await videoRef.current.loadAsync();
  }
  useEffect(() => {
    getCurrentUserData()
    setIsLiked(item.likes_by.includes(firebase.auth().currentUser.email))
}, [])
  useEffect(() => {
    pauseVideo();
    if (hasFocus && currentVideoIndex == index) {
      playVideo();
    }
  }, [currentVideoIndex, hasFocus, isMute])
  useEffect(() => {
    setTimeout(() => {
      setShowMute(false);
    }, 2000);
  }, [isMute])
  return (
    <View key={index} style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height - 70 }}>
      <Video
        ref={videoRef}
        source={item.videourl}
        isLooping={true}
        shouldPlay={false}
        style={{
          flex: 1,
          borderRadius: 5,
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
        onError={handleError}
        resizeMode={ResizeMode.COVER}
        isMuted={isMute}
      />
      <TouchableOpacity style={styles.muteBtnContainer} onPress={() => { setIsMute(!isMute), setShowMute(true) }}>
        {showMute ?
          <View style={{ backgroundColor: 'lightgrey', opacity: 0.8, padding: 16, borderRadius: 50 }}>
            <Ionicons name="ios-volume-mute-sharp" size={16} color="white" />
          </View>
          : null
        }
        {useCallback(() => {

        })}
      </TouchableOpacity>
      {currentVideoIndex === 0 &&
        <View style={styles.reelsHeader}>
          <Text style={styles.reelsText}>Reels</Text>
          <TouchableOpacity>
            <Feather name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>}
      <View style={styles.reelsFooter}>

        <View style={styles.captionContainer}>
          <View style={styles.ownerProfileContainer}>
            <TouchableOpacity style={styles.reelsOwnerProfileImageOuter}>
              <Image style={styles.reelsOwnerProfileImage} source={{ uri: item.profilePicture }} />
            </TouchableOpacity>
            <Text style={{ color: "white", fontWeight: 'bold' }}>{item.userName}</Text>
            <TouchableOpacity style={styles.followbtn}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Follow</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ color: 'white', fontWeight: '500', marginTop: 10 }}>{item.caption}</Text>
          <Text style={{ color: 'lightgrey', marginTop: 5 }}>Liked by rahul_dev and 49 others</Text>
          <View style={styles.orginalAudioContainer}>
            <MaterialIcons name="multitrack-audio" size={24} color="white" />
            <Text style={{ color: 'white' }}>orginal audio</Text>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={()=>handleLike(item)}>
            <Ionicons name="heart" size={32} color={isLiked?'red':'white'} />
            <Text style={{ color: 'white', alignSelf: 'center', fontWeight: 'bold', fontSize: 12, marginTop: 4 }}>{item.likes_by.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ios-chatbubble-outline" size={32} color="white" />
            <Text style={{ color: 'white', alignSelf: 'center', fontWeight: 'bold', fontSize: 12, marginTop: 4 }}>100</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ios-paper-plane-outline" size={32} color="white" />
            <Text style={{ color: 'white', alignSelf: 'center', fontWeight: 'bold', fontSize: 12, marginTop: 4 }}>50</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 10 }}>
            <Text style={styles.footerThreedot}></Text>
            <Text style={styles.footerThreedot}></Text>
            <Text style={styles.footerThreedot}></Text>
          </TouchableOpacity>
          <Image style={styles.musicPhoto} source={{ uri: item.profilePicture }} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  reelsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginHorizontal: 15,
    alignItems: 'center'
  },
  reelsText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold'
  },
  reelsFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1
  },
  captionContainer: {
    width: '80%',
    paddingHorizontal: 10
  },
  iconContainer: {
    width: '20%',
    alignItems: 'center',
    gap: 15
  },
  musicPhoto: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'black',
    marginBottom: 10
  },
  footerThreedot: {
    borderColor: 'white',
    borderWidth: 1,
    height: 3,
    width: 3,
    margin: 1,
    borderRadius: 50,
    backgroundColor: 'white'
  },
  ownerProfileContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  reelsOwnerProfileImage: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    borderRadius: 50,
    backgroundColor: 'black'
  },
  reelsOwnerProfileImageOuter: {
    borderWidth: 2,
    borderColor: '#ff8501',
    borderRadius: 50,
    padding: 1.5
  },
  followbtn: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 2,
  },
  orginalAudioContainer: {
    flexDirection: 'row',
    gap: 5,
    marginVertical: 5
  },
  muteBtnContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ReelsVideo
