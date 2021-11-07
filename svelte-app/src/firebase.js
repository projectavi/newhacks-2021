import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
var firebaseConfig = {
    apiKey: "AIzaSyA0cMxOoFH_c2LNLyJlZXHW81E4OGr3dV0",
    authDomain: "dialog-newhacks2021.firebaseapp.com",
    projectId: "dialog-newhacks2021",
    storageBucket: "dialog-newhacks2021.appspot.com",
    messagingSenderId: "639784304123",
    appId: "1:639784304123:web:94fa1aae4e68b05de91f5e",
    measurementId: "G-14XZT5RNNE"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const google_provider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();