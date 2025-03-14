import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAgoh8wQT2UfotOkSqabSoVYjSS5YgA4XQ",
  authDomain: "loginreact-b5623.firebaseapp.com",
  projectId: "loginreact-b5623",
  storageBucket: "loginreact-b5623.firebasestorage.app",
  messagingSenderId: "608724246322",
  appId: "1:608724246322:web:d357eb58ef11c67a1a812b",
  registered: true,
  isNewUser: false
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account", 
});

export { app, auth, googleProvider, signInWithPopup, db };