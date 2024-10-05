import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc , getDocs ,collection} from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup,getAuth , signOut} from 'firebase/auth';

import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export default { firebaseConfig,firebaseApp, db, doc , setDoc ,getFirestore, getDocs, collection,auth, GoogleAuthProvider, signInWithPopup,};