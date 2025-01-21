import firebaseConfig from '../config/firebaseConfig.js';
import { Timestamp, QuerySnapshot, DocumentData, query, where, limit } from 'firebase/firestore';

const {
    db,
    doc,
    setDoc,
    getDocs,
    collection,
} = firebaseConfig;