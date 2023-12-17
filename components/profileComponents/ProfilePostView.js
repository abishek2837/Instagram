import React, { useEffect, useState } from 'react';
import { SafeAreaView, Image, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { db, firebase } from '../../Firebase';
import { useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';

const ProfilePostView = () => {
    const route = useRoute()
    const user = firebase.auth().currentUser;
    const [posts, setPosts] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        try {
            const unsubscribe = db.collection('users')
                .doc(route.params?.currentUser ? route.params?.currentUser?.email : user.email)
                .collection('posts').onSnapshot({
                    error: (e) => Alert.alert('something went wrong'),
                    next: (snapshot) => {
                        setPosts(snapshot.docs.map(doc => (
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
                {posts.map((data, index) => (
                    <Image style={styles.postsImage} source={{ uri: data.imageurl }} key={index} />
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
    postsImage: {
        width: Dimensions.get('window').width / 3.1,
        height: 120,
        resizeMode: 'cover',
        margin: 1
    }
})

export default ProfilePostView
