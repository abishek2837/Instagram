import React, {useState, useEffect} from 'react'
import AppNavigation from './AppNavigation';
import LoginNavigation from './LoginNavigation';
import {firebase} from '../../Firebase'

const Navigation = ({navigation}) => {
    const [isloggedin, setIsLoggedIn] = useState(false)
    useEffect(()=>{
        firebase.auth().onAuthStateChanged((user)=>{
            user !== null ? setIsLoggedIn(true) : setIsLoggedIn(false)
        })
    },[])
    return (
        <>
            {isloggedin ? <AppNavigation navigation={navigation}/> : <LoginNavigation />}
        </>
    )
}

export default Navigation;
