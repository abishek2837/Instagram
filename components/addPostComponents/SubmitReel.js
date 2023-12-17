import { useRoute } from '@react-navigation/native'
import { Video } from 'expo-av';
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native';
import { TextInput } from 'react-native';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native'
import { db, firebase } from '../../Firebase';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { Alert } from 'react-native';

const SubmitReel = ({ navigation }) => {
  const route = useRoute();
  const [caption, setCaption] = useState('')
  const [currentUsername, setCurrentUsername] = useState('')

  const submitData = async () => {
    const unsubscribe = await db.collection('users')
      .doc(firebase.auth().currentUser.email)
      .collection('reels').add({
        userName: currentUsername.userName,
        profilePicture: currentUsername.profilePicture,
        caption: caption,
        videourl: route.params.videourl,
        owner_email: firebase.auth().currentUser.email,
        likes_by: [],
        comments: [],
        ownerUid: firebase.auth().currentUser.uid,
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        navigation.goBack()
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
      <Image source={require('../../assets/images/close.png')} style={styles.closebtn} />
      <View style={styles.bodycontainer}>
        <Video
          shouldPlay={true}
          source={route.params.videourl}
          style={styles.videoStyle}
        />
        <TextInput
          placeholder='write caption....'
          value={caption}
          onChangeText={text => setCaption(text)}
          multiline={true}
          style={styles.captionContainer}
        />
      </View>
      <TouchableOpacity style={styles.submitBtn} onPress={submitData}>
        <Text style={{ fontSize: 18, color: 'white' }}>submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  submitMainContainer: {
    flex: 1,
  },
  videoStyle: {
    height: 300,
    width: 200,
    backgroundColor: 'black',
    alignSelf: 'center',
    marginTop: 50,
    borderRadius: 20
  },
  captionContainer: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    padding: 10,
  },
  submitBtn: {
    width: '90%',
    height: 50,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 20,
    borderRadius: 20
  },
  closebtn: {
    width: 30,
    height: 30,
    backgroundColor: 'grey',
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    margin: 10
  }
})

export default SubmitReel
