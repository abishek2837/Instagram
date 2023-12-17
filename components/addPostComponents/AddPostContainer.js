import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AddPostHeader from './AddPostHeader';
import AddPostImageViewer from './AddPostImageViewer';
import * as MediaLibrary from 'expo-media-library';
import { useDispatch } from 'react-redux';
import TakePhoto from './TakePhoto';


const AddPostContainer = ({ navigation, selectMode, mode }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState();

  const getImage = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    let albumGroup = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    })
    const imageAlbum = await Promise.all(
      albumGroup.map(async (album) => {
        const getAllPhoto = await MediaLibrary.getAssetsAsync({
          first: 100,
          album: album,
          mediaType: ['photo'],
          sortBy: 'creationTime'
        })
        if (getAllPhoto.totalCount > 0) {
          return { album: album.title, image: getAllPhoto.assets };
        }
        return null
      })
    );
    const filteredImageAlbums = imageAlbum.filter((album) => album !== null)
    setImage(filteredImageAlbums)
  }

  useEffect(() => {
    getImage()
  }, [])
  return (
    <View style={{backgroundColor: 'black', flex: 1}}>
      {
        mode === 'gallery' ?
          <View>
            <AddPostHeader navigation={navigation}/>
            <AddPostImageViewer image={image} selectMode={selectMode} />
          </View>
          :
          <TakePhoto selectMode={selectMode} navigation={navigation}/>
      }
    </View>
  )
}

export default AddPostContainer;
