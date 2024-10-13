import firebaseConfig from '../config/firebaseConfig';
import { Timestamp, QuerySnapshot, DocumentData, query, where, limit } from 'firebase/firestore';

const {
    db,
    doc,
    setDoc,
    getDocs,
    collection,
} = firebaseConfig;

interface User {
    uid: string;
    email: string;
    name: string;
}

export const signUpWithEmailAndPassword = async (email: string, password: string, name: string): Promise<User> => {
    try {
        const userRef = doc(collection(db, 'users'));
        const user: User = {
            uid: userRef.id,
            email,
            name
        };
        await setDoc(userRef, {
            ...user,
            password, // Note: Storing passwords in Firestore is not secure. Use proper hashing in production.
        });
        return user;
    } catch (error) {
        throw new Error('Error creating user: ' + (error as Error).message);
    }
};

export const signinWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error('User not found');
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        if (userData.password !== password) { // Note: Use proper password comparison in production
            throw new Error('Invalid password');
        }

        return {
            uid: userDoc.id,
            email: userData.email,
            name: userData.name
        };
    } catch (error) {
        throw new Error('Invalid email or password');
    }
};

export const signOutUser = async (): Promise<void> => {
    // No action needed for sign out when not using Firebase Auth
    console.log('User signed out');
};

export const getCurrentUser = (): User | null => {
    // This function can't work without maintaining a session. 
    // You'll need to implement session management separately.
    return null;
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
    // Implement your own password reset logic here
    console.log(`Password reset requested for ${email}`);
};

const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtp = async (email: string): Promise<void> => {
    try {
        const otp = generateOTP();
        const otpRef = doc(collection(db, 'otps'));
        await setDoc(otpRef, {
            email,
            otp,
            createdAt: Timestamp.now(),
            attempts: 0
        });

        console.log(`OTP for ${email}: ${otp}`);
        // In a real application, send this OTP via email
    } catch (error) {
        throw new Error('Failed to send OTP: ' + (error as Error).message);
    }
};

export const verifyOtp = async (email: string, providedOtp: string): Promise<User> => {
    try {
        const otpRef = collection(db, 'otps');
        const q = query(otpRef, where('email', '==', email), limit(1));
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error('OTP not found. Please request a new one.');
        }

        const otpDoc = querySnapshot.docs[0];
        const { otp, createdAt, attempts } = otpDoc.data();

        if (attempts >= 3) {
            throw new Error('Too many attempts. Please request a new OTP.');
        }

        if (Date.now() - createdAt.toDate().getTime() > 5 * 60 * 1000) {
            throw new Error('OTP has expired. Please request a new one.');
        }

        if (otp !== providedOtp) {
            await setDoc(otpDoc.ref, { attempts: attempts + 1 }, { merge: true });
            throw new Error('Invalid OTP.');
        }

        // OTP is valid, delete it
        await setDoc(otpDoc.ref, {}, { merge: true });
        
        // Check if the user already exists
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef, where('email', '==', email), limit(1));
        const userQuerySnapshot = await getDocs(userQuery);

        if (userQuerySnapshot.empty) {
            // If the user doesn't exist, create a new account
            const newUserRef = doc(collection(db, 'users'));
            const newUser: User = {
                uid: newUserRef.id,
                email,
                name: '' // You might want to collect the name separately
            };
            await setDoc(newUserRef, newUser);
            return newUser;
        } else {
            // User exists, return user data
            const userDoc = userQuerySnapshot.docs[0];
            return {
                uid: userDoc.id,
                email: userDoc.data().email,
                name: userDoc.data().name
            };
        }
    } catch (error) {
        throw new Error('OTP verification failed: ' + (error as Error).message);
    }
};