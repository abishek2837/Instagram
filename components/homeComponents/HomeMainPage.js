import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert, View } from 'react-native'
import Header from './Header';
import Stories from './Stories';
import Posts from './Posts';
import { db } from '../../Firebase';

const HomeMainPage = ({navigation}) => {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        try {
            const unsubscribe = db.collectionGroup('posts').onSnapshot({
                error: (e) => Alert.alert('poor Connection!'),
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
    const memoUnchangeHomeHeader = useMemo(() =>
        <Header />
        , []);
    const memoUnchangeHomeStories = useMemo(() =>
        <Stories />
        , []);
    const memoUnchangePost = useMemo(() =>
        <View>
            {posts.map((data, index) => (
                <Posts post={data} key={index} navigation={navigation}/>
            ))}
        </View>
        , [posts]);
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar />
            {memoUnchangeHomeHeader}
            <ScrollView>
                {memoUnchangeHomeStories}
                {memoUnchangePost}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'black',
        flex: 1,
    }
})

export default HomeMainPage;