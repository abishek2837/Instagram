import React, { useState } from 'react'
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {firebase, db} from '../../Firebase'

const signupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email*')
    .required('email required*'),
  userName: Yup.string()
    .min(4, 'min 4 char req*')
    .required('username required'),
  password: Yup.string()
    .min(8, 'min 8 char req*')
    .required('password required*')
})

const getRandomProfilePicture = async() => {
  const response = await fetch('https://randomuser.me/api')
  const data = await response.json()
  return data.results[0].picture.large
}

const SignupForm = ({navigation}) => {
  const [eye, setEye] = useState(true)
  const submitData = async(values) => {
    try{
      const authUser = await firebase.auth().createUserWithEmailAndPassword(values.email.toLowerCase(), values.password)
      await db.collection('users').doc(values.email.toLowerCase()).set({
        ownerUid: authUser.user.uid,
        userName: values.userName,
        email: (values.email.toLowerCase()),
        profilePicture: await getRandomProfilePicture(),
        followed_by: [],
        following: [],
        name: values.userName,
        bio: ''
      })
    }catch(errors){
      Alert.alert(errors.message)
    }
  }
  return (
    <Formik
      initialValues={{
        email: '',
        userName: '',
        password: ''
      }}
      validationSchema={signupSchema}
      validateOnMount={true}
      onSubmit={values => submitData(values)}
    >
      {({ values, errors, touched, handleChange, isValid, handleSubmit, setFieldTouched }) => (
        <View style={styles.signupContainer}>
          <TextInput
            placeholder='email'
            style={styles.textboxContainer}
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={()=>setFieldTouched('email')}
          />
          <TextInput
            placeholder='username'
            style={styles.textboxContainer}
            value={values.userName}
            onChangeText={handleChange('userName')}
            onBlur={()=>setFieldTouched('userName')}
          />
          <View>
            <TextInput
              secureTextEntry={eye}
              placeholder='password'
              style={styles.textboxContainer}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={()=>setFieldTouched('password')}
            />
            <TouchableOpacity style={styles.eyeIconStyle} onPress={() => setEye(!eye)}>
              <Image
                style={styles.eyeIcon}
                source={eye ? require('../../assets/images/eyeCloseIcon.png') : require('../../assets/images/eyeIcon.png')}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.signupBtn(isValid)} onPress={handleSubmit} disabled={!isValid}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign up</Text>
          </TouchableOpacity>
          <View style={styles.siginBtnContainer}>
            <Text>Already have account?</Text>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Text style={styles.siginBtn}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  signupContainer: {
    rowGap: 10,
    margin: 20
  },
  textboxContainer: {
    borderWidth: 0.3,
    borderColor: 'grey',
    width: '100%',
    height: 40,
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  signupBtn: (isValid)=>({
    width: '100%',
    height: 40,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    opacity: isValid ? 1 : 0.7
  }),
  eyeIconStyle: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  eyeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  siginBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50
  },
  siginBtn: {
    color: '#2196F3',
    marginLeft: 5,
    fontWeight: 'bold'
  }

})

export default SignupForm;
