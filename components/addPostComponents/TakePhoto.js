import React, { useEffect, useState, useRef } from 'react'
import { Alert, Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Camera, CameraType, requestCameraPermissionsAsync, requestMicrophonePermissionsAsync, getCameraPermissionsAsync, getMicrophonePermissionsAsync } from 'expo-camera';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window')
const TakePhoto = ({ selectMode, navigation }) => {
    const cameaRef = useRef()
    const [type, setType] = useState(CameraType.back);
    const [flash, setFlash] = useState('off');
    const [image, setImage] = useState('')
    const imagelink = useSelector(state=> state.addPostReducer.AddPostImage)
    const cameraPermission = async () => {
        await requestCameraPermissionsAsync()
        await requestMicrophonePermissionsAsync()
    };
    const getPermission = async () => {
        const cameraPermission = await getCameraPermissionsAsync()
        const microphonePermission = await getMicrophonePermissionsAsync()
        return cameraPermission && microphonePermission
    }
    if (!getPermission()) {
        return Alert.alert(
            "permission req*",
            "you need permission to access camere",
            [{ text: 'got it' }]
        )
    }

    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const toggleFlashMode = () => {
        setFlash(flash === 'off' ? 'on' : 'off') 
    }

    const handleBack = () => {
        navigation.goBack()
    }

    const clickPicture = async() => {
        const {uri, width, height} = await cameaRef?.current.takePictureAsync()
        navigation.navigate('SubmitPost',{imagelink:uri, handleBack: handleBack})   
    }
    useEffect(() => {
        cameraPermission()
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Camera
                style={styles.cameraContainer}
                type={type} 
                flashMode={flash}
                ratio='16:9'
                ref={cameaRef}
                flash={flash}
            >
                <TouchableOpacity onPress={()=>navigation.goBack()} >
                    <Image style={styles.closeIcon} source={require('../../assets/images/close.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleFlashMode}>
                    {
                        flash === 'on' ?
                        <Image style={styles.flashIcon} source={require('../../assets/images/flashOn.png')} />
                        :
                        <Image style={styles.flashIcon} source={require('../../assets/images/flashOff.png')} />

                    }
                </TouchableOpacity>
                <TouchableOpacity style={{width: 25,height:25}}>
                </TouchableOpacity>
            </Camera>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={()=>selectMode('gallery')}>
                    <Image style={styles.imageShow} source={{uri: imagelink}} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.captureBtnOuter} onPress={clickPicture}>
                    <View style={styles.captureBtnInner}></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCameraType}>
                    <Image style={styles.rotateStyle} source={require('../../assets/images/rotate.png')} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    iconContainer: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20, 
        height: 100
    },
    captureBtnInner: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: 'white',
    },
    captureBtnOuter: {
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageShow: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5
    },
    rotateStyle: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    cameraContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width,
        height: (width / 2) * 3
    },
    closeIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        margin: 10
    },
    flashIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        margin: 10
    }
})

export default TakePhoto
