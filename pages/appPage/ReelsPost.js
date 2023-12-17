import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import ReelsVideo from '../../components/reelsComponents/ReelsVideo';
import { Alert } from 'react-native';
import { db } from '../../Firebase';

const ReelsPost = ({ navigation }) => {

    const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
    const [isMute, setIsMute] = useState(false)
    const [videoData, setVideoData] = useState([])
    const handleIndexChange = ({ index }) => {
        setCurrentVideoIndex(index)
    }

    useEffect(() => {
        try {
            const unsubscribe = db.collectionGroup('reels').onSnapshot({
                error: (e) => Alert.alert('poor Connection!'),
                next: (snapshot) => {
                    setVideoData(snapshot.docs.map(doc => (
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
        <View style={styles.mainContainer}>
            <SwiperFlatList
                data={videoData}
                onChangeIndex={handleIndexChange}
                vertical
                renderItem={({item, index}) => (
                    <ReelsVideo
                        item={item}
                        index={index}
                        key={index}
                        currentVideoIndex={currentVideoIndex}
                        navigation={navigation} isMute={isMute}
                        setIsMute={setIsMute}
                    />
                )}
                pagingEnabled
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'black'
    }
})

export default ReelsPost;
