import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { db, firebase } from '../../Firebase';
import { useRoute } from '@react-navigation/native';
import { Video } from 'expo-av';

const ProfileReelView = () => {
  const route = useRoute()
  const user = firebase.auth().currentUser;
  const [reels, setReels] = useState([]);
  useEffect(() => {
    try {
      const unsubscribe = db.collection('users')
        .doc(route.params?.currentUser ? route.params?.currentUser?.email : user.email)
        .collection('reels').onSnapshot({
          error: (e) => Alert.alert('something went wrong'),
          next: (snapshot) => {
            setReels(snapshot.docs.map(doc => (
              { id: doc.id, ...doc.data() }
            )))
          }
        })

      return unsubscribe
    } catch {
      errors =>
        Alert.alert('something went wrong')
    }
  }, [])
  return (
    <ScrollView>
      <SafeAreaView style={styles.postsImageContainer}>
        {reels.map((data, index) => (
          <Video
            style={styles.reelsImage}
            source={data.videourl}
            key={index}
            shouldPlay={false}
          />
        ))}
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  postsImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  reelsImage: {
    width: Dimensions.get('window').width / 3.1,
    height: 120,
    resizeMode: 'cover',
    margin: 1
  }
})

export default ProfileReelView;
