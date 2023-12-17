import React, { useState } from 'react'
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {firebase} from '../../Firebase'

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email*')
        .required('email required*'),
    password: Yup.string()
        .min(8, 'min 8 char req*')
        .required('password required*')
})


const LoginForm = ({navigation}) => {
    const [eye, setEye] = useState(true)
    const submitData = async(values) => {
        try{
            await firebase.auth().signInWithEmailAndPassword(values.email.toLowerCase(), values.password)
        }catch(errors){
            Alert.alert('email/password not matched*')
        }
    }
    return (
        <Formik
            initialValues={{
                email: '',
                password: ''
            }}
            validationSchema={loginSchema}
            validateOnMount={true}
            onSubmit={values => submitData(values)}
        >
            {({ values, errors, isValid, touched, handleChange, handleSubmit, setFieldTouched }) => (
                <View style={styles.loginContainer}>
                    <View>
                        <TextInput
                            placeholder='email'
                            style={styles.textboxContainer}
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={() => setFieldTouched('email')}
                        />
                        {touched.email && errors.email && (
                            <Text style={{ color: 'red' }}>{errors.email}</Text>
                        )}
                    </View>
                    <View>
                        <TextInput
                            secureTextEntry={eye}
                            placeholder='password'
                            style={styles.textboxContainer}
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={() => setFieldTouched('password')}
                        />
                        {touched.password && errors.password && (
                            <Text style={{ color: 'red' }}>{errors.password}</Text>
                        )}
                        <TouchableOpacity style={styles.eyeIconStyle} onPress={() => setEye(!eye)}>
                            <Image
                                style={styles.eyeIcon}
                                source={eye ? require('../../assets/images/eyeCloseIcon.png') : require('../../assets/images/eyeIcon.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.forgetPasswordStyle}>
                            <Text style={{ color: '#2196F3' }}>Forget password?</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.loginBtn(isValid)} disabled={!isValid} onPress={handleSubmit}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Log in</Text>
                    </TouchableOpacity>

                    <View style={styles.singnupContainer}>
                        <Text>create account?</Text>
                        <TouchableOpacity>
                            <Text style={styles.singupBtn} onPress={()=>navigation.navigate('Signup')}>sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Formik>
    )
}

const styles = StyleSheet.create({
    loginContainer: {
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
        backgroundColor: '#FAFAFA'
    },
    loginBtn: (isValid)=>({
        width: '100%',
        height: 40,
        backgroundColor: '#2196F3',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        opacity: isValid ? 1 : 0.7
    }),
    forgetPasswordStyle: {
        position: 'absolute',
        right: 0,
        top: 45,
    },
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
    singnupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50
    },
    singupBtn: {
        color: '#2196F3',
        marginLeft: 5,
        fontWeight: 'bold'
    }

})

export default LoginForm;
