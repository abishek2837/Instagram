import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Dimensions, PixelRatio, Text, Modal } from 'react-native';
import { Camera, CameraType, requestCameraPermissionsAsync, requestMicrophonePermissionsAsync, getCameraPermissionsAsync, getMicrophonePermissionsAsync } from 'expo-camera';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');


const AddReelView = ({ navigation }) => {
  const cameraRef = useRef()
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState('off');
  const [video, setVideo] = useState({})
  const [isRecording, setIsRecording] = useState(false)
  const [isRecorded, setIsRecorded] = useState(false)

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

  const recordVideo = async () => {
    setIsRecording(true)
    let options = {
      maxDuration: 30,
      quality: '1080p',
      mute: false
    }
    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo)
    })
  }
  const stopRecording = async () => {
    setIsRecording(false)
    cameraRef.current.stopRecording();
    setIsRecorded(true)
  }
  const handleSubmit = async () => {
    navigation.navigate('SubmitReel', { videourl: video })
  }

  const pickVideo = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setVideo({ uri: result.assets[0].uri });
      setIsRecorded(true)
    }
  };
  useEffect(() => {
    cameraPermission()
  }, [])
  return (
    <View style={{ backgroundColor: 'black', flex: 1 }}>
      <Camera
        style={styles.cameraContainer}
        type={type}
        flashMode={flash}
        ratio='16:9'
        ref={cameraRef}
        flash={flash}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
        <TouchableOpacity style={{ width: 25, height: 25 }}>
        </TouchableOpacity>
      </Camera>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => pickVideo()}>
          <Image style={styles.imageShow} />
        </TouchableOpacity>
        <View>
          <TouchableOpacity style={styles.captureBtnOuter(isRecording)} onPress={isRecording ? stopRecording : recordVideo}>
            <View style={styles.captureBtnInner(isRecording)}></View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleCameraType}>
          <Image style={styles.rotateStyle} source={require('../../assets/images/rotate.png')} />
        </TouchableOpacity>
      </View>
      <Modal visible={isRecorded}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: 'black' }}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Image style={styles.closebtn} source={require('../../assets/images/close.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.nextbtn}>Next</Text>
          </TouchableOpacity>
        </View>
        <Video
          shouldPlay={true}
          source={video}
          style={{ flex: 1, backgroundColor: 'black' }}
        />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
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
  },
  iconContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    height: 100
  },
  captureBtnInner: (isRecording) => ({
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: isRecording ? 'red' : 'white',
  }),
  captureBtnOuter: (isRecording) => ({
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: isRecording ? 'red' : 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }),
  imageShow: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5
  },
  closebtn: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  nextbtn: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2196F3'
  }
})

export default AddReelView;