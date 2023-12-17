import React, { useState } from 'react'
import { Image, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import AddImageView from './AddImageView';

const width = Dimensions.get('window').width

const AddPostImageViewer = ({image, selectMode}) => {
    const [selectedAlbum, setSelectedAlbum] = useState('Recent');
    const handleAlbumChange= (data) => {
        setSelectedAlbum(data)
    }
    const imageurl = useSelector(state => state.addPostReducer.AddPostImage)
    return (
        <View>
            <Image style={styles.selectedImage} source={{ uri: imageurl }} />
            <CameraHeader image={image} selectedAlbum={selectedAlbum} handleAlbumChange={handleAlbumChange} selectMode={selectMode}/>
            <AddImageView allImage={image} selectedAlbum={selectedAlbum} />
        </View>
    )
}

const CameraHeader = ({image, selectedAlbum, handleAlbumChange, selectMode}) => {
    return (
        <View style={styles.CameraHeaderMainContainer}>
            <View style={styles.albumCollector}>
                <Text style={styles.albumName}>{selectedAlbum}</Text>
                <Picker
                    selectedValue={selectedAlbum}
                    onValueChange={(itemValue, itemIndex) =>
                        handleAlbumChange(itemValue)
                    }
                    style={{ color: 'white', width: 30}}
                    dropdownIconColor='white'
                >
                    <Picker.Item label="Recent" value="Recent" />
                    {
                    image ?
                    image.map((val,index)=>{
                        return <Picker.Item label={val.album} value={val.album} key={index}/>
                    })
                    : null
                    }
                    
                    
                </Picker>
            </View>
            <TouchableOpacity style={styles.camerIconContainer} onPress={()=>selectMode('camera')}>
                <Image style={{ width: 25, height: 25 }} source={require('../../assets/images/camera.png')} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    selectedImage: {
        width: width,
        height: 350,
        resizeMode: 'cover',
        marginTop: 5
    },
    CameraHeaderMainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // margin: 10,
        marginHorizontal: 15,
        alignItems: 'center'
    },
    albumCollector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    albumName: {
        color: 'white',
        fontSize: 16,
        marginRight: 10,
    },
    camerIconContainer: {
        backgroundColor: 'rgba(40,40,40,255)',
        borderRadius: 50,
        height: 32,
        width: 32,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default AddPostImageViewer
