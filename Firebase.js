import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDFzR0KZyhkr2AmMcCGfneZLDzFwOoVII8",
    authDomain: "selfinsta-2837.firebaseapp.com",
    projectId: "selfinsta-2837",
    storageBucket: "selfinsta-2837.appspot.com",
    messagingSenderId: "234778941498",
    appId: "1:234778941498:web:8e11d657e31161fd407d03",
    measurementId: "G-7TDP676W1P"
  };

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

const db = firebase.firestore()

export { firebase, db }