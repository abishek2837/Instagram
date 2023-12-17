import React, { useEffect, useState } from 'react'
import { View, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux';
import * as MediaLibrary from 'expo-media-library';
import { getAddPostImage } from '../../redux/actions/mainAction';

const AddImageView = ({allImage, selectedAlbum}) => {
    const dispatch = useDispatch()
    const [recentImage, setRecentImage] = useState(null);

    const handleShowImage = (img) => {
        dispatch(getAddPostImage(img))
    }

    const getRecentImage = async () => {
        const getAllPhoto = await MediaLibrary.getAssetsAsync({
            first: 200,
            mediaType: ['photo'],
            sortBy: 'creationTime'
        })
        dispatch(getAddPostImage(getAllPhoto.assets[0].uri))
        setRecentImage([{album: 'Recent', image: getAllPhoto.assets}])
    }

    const albumImage = allImage ? selectedAlbum === 'Recent' ?
        recentImage
        :
        allImage.filter(img=>img.album === selectedAlbum) : null


    useEffect(() => {
        getRecentImage()
    }, [])
    return (
        <ScrollView>
            <View style={styles.allPhotoContainer}>
                {albumImage ? albumImage[0].image.map((img, index) => {
                    return (
                        <TouchableOpacity key={index} onPress={()=>handleShowImage(img.uri)}>
                            <Image style={styles.imageViewContainer} source={{ uri: img.uri }} />
                        </TouchableOpacity>
                    )
                }) : null}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    imageViewContainer: {
        width: Dimensions.get('window').width/4.1,
        height: 120,
        resizeMode: 'cover',
        margin: 1
    },
    allPhotoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom:40
    }
})

export default AddImageView
