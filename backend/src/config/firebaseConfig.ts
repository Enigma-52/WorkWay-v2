import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc , getDocs ,collection , query, orderBy, startAfter, limit} from 'firebase/firestore';
import { signOut, sendPasswordResetEmail,signInWithEmailAndPassword, createUserWithEmailAndPassword,GoogleAuthProvider, signInWithPopup,getAuth } from 'firebase/auth';

import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export default { signOut,sendPasswordResetEmail,signInWithEmailAndPassword, createUserWithEmailAndPassword, firebaseConfig,firebaseApp, db, doc , setDoc ,getFirestore, getDocs, collection,auth, GoogleAuthProvider, signInWithPopup, query, orderBy, startAfter, limit};