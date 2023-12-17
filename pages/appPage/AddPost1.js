import React, { useEffect, useState } from 'react'
import { Text, View, StatusBar, SafeAreaView, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import FooterTab from '../../components/footerTab/FooterTab'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {firebase, db } from '../../Firebase'

const postSchema = Yup.object().shape({
    caption: Yup.string()
        .required('caption is required')
        .min(5, 'min 8 char req*'),
    imageurl: Yup.string()
        .required('image is required')
})

const AddPost = ({ navigation }) => {
    const [currentUsername, setCurrentUsername] = useState('')
    const submitData = async(values) => {
        const unsubscribe = db.collection('users')
        .doc(firebase.auth().currentUser.email)
        .collection('posts').add({
            userName: currentUsername.userName,
            profilePicture: currentUsername.profilePicture,
            caption: values.caption,
            imageurl: values.imageurl,
            owner_email: firebase.auth().currentUser.email,
            likes_by: [],
            comments: [],
            ownerUid: firebase.auth().currentUser.uid,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        }).then(()=>navigation.goBack()).catch(errors => Alert.alert('something went wrong'))
        return unsubscribe
    }  
    const getUserName = () => {
        try{
        const user = firebase.auth().currentUser
        const unsubscribe = db.collection('users')
        .where('ownerUid','==',user.uid)
        .limit(1).onSnapshot(
            snapshot => snapshot.docs.map(docs => {setCurrentUsername({
                    userName: docs.data().userName,
                    profilePicture: docs.data().profilePicture
                })
            }
            )
        )
        if(user.email) {
            return unsubscribe
        }
        }catch{errors => Alert.alert('something went wrong')}
    }
    useEffect(()=>{
        getUserName()
    },[])
    return (
        <Formik
            initialValues={{
                caption: "",
                imageurl: ''
            }}
            validationSchema={postSchema}
            validateOnMount={true}
            onSubmit={values=>submitData(values)}
        >
            {({ values, errors, touched, isValid, setFieldTouched, handleChange, handleSubmit }) => (
                <SafeAreaView style={styles.mainContainer}>
                    <StatusBar />
                    <View style={styles.imageCaptioncontainer}>
                        <Image style={{width: 100,height: 100}}/>
                        <TextInput
                            placeholder='write caption....'
                            value={values.caption}
                            onChangeText={handleChange('caption')}
                            onBlur={()=>setFieldTouched('caption')}
                            multiline={true}
                            style={styles.captionContainer}
                        />
                    </View>
                    <TextInput
                        placeholder='image link..'
                        value={values.imageurl}
                        onChangeText={handleChange('imageurl')}
                        onBlur={()=>setFieldTouched('imageurl')}
                        style={styles.imgurlContainer}
                    />
                    <TouchableOpacity style={styles.submitBtn} disabled={!isValid} onPress={handleSubmit}>
                        <Text style={{ color: 'white' }}>submit</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            )}
        </Formik>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    imageCaptioncontainer: {
        flexDirection: 'row',
        marginTop: 20
    },
    captionContainer: {
        borderWidth: 1,
        // borderColor: 'white',
        width: '100%',
        backgroundColor: '#FAFAFA',
        padding: 8
    },
    imgurlContainer: {
        backgroundColor: '#FAFAFA',
        margin: 20,
        padding: 8
    },
    submitBtn: {
        backgroundColor: '#2196F3',
        width: 140,
        height: 40,
        alignSelf: 'center',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default AddPost;
