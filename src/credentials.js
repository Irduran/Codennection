
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAgoh8wQT2UfotOkSqabSoVYjSS5YgA4XQ",
  authDomain: "loginreact-b5623.firebaseapp.com",
  projectId: "loginreact-b5623",
  storageBucket: "loginreact-b5623.firebasestorage.app",
  messagingSenderId: "608724246322",
  appId: "1:608724246322:web:d357eb58ef11c67a1a812b"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase)
const provider = new GoogleAuthProvider()
export {auth, appFirebase, provider}