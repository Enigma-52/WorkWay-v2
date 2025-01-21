import firebaseConfig from '../config/firebaseConfig.js';
import { Timestamp, QuerySnapshot, DocumentData, query, where, limit } from 'firebase/firestore';

const {
    db,
    doc,
    setDoc,
    getDocs,
    collection,
} = firebaseConfig;

export const createApplication = async ({ job, user, status }) => {
    try {
        const applicationsRef = collection(db, 'applications');
        const userApplicationQuery = query(
            applicationsRef,
            where('userId', '==', user.id),
            limit(1)
        );

        const userApplicationSnapshot = await getDocs(userApplicationQuery);
        const applicationRef = doc(db, 'applications', user.id);

        // Check if document exists and if user has already applied
        if (!userApplicationSnapshot.empty) {
            const existingDoc = userApplicationSnapshot.docs[0].data();
            const applications = existingDoc.applications || [];
            
            if (applications.some(app => app.jobId === job.id)) {
                throw new Error('User has already applied to this job');
            }
        }

        const newApplication = {
            applicationId: crypto.randomUUID(),
            jobId: job.id,
            status,
            job,
            appliedAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            userName: user.name,
            userEmail: user.email,
        };

        // Get existing applications or initialize empty array
        const existingApplications = userApplicationSnapshot.empty ? [] : userApplicationSnapshot.docs[0].data().applications || [];

        // Create new document or merge with existing
        await setDoc(applicationRef, {
            userId: user.id,
            applications: [...existingApplications, newApplication]
        }, { merge: true });  // Add merge option to preserve existing data

        return newApplication;

    } catch (error) {
        console.error('Error in createApplication service:', error);
        throw error;
    }
};

// Get all applications for a user
export const getUserApplications = async (userId) => {
    try {
        const applicationsRef = collection(db, 'applications');
        const userApplicationQuery = query(
            applicationsRef,
            where('userId', '==', userId),
            limit(1)
        );

        const userApplicationSnapshot = await getDocs(userApplicationQuery);
        
        if (userApplicationSnapshot.empty) {
            return [];
        }

        const applications = userApplicationSnapshot.docs[0].data().applications || [];
        return applications;

    } catch (error) {
        console.error('Error in getUserApplications service:', error);
        throw error;
    }
};

// Update application status
export const updateApplicationStatus = async (userId, applicationId, newStatus) => {
    try {
        const applicationsRef = collection(db, 'applications');
        const userApplicationQuery = query(
            applicationsRef,
            where('userId', '==', userId),
            limit(1)
        );

        const userApplicationSnapshot = await getDocs(userApplicationQuery);
        
        if (userApplicationSnapshot.empty) {
            throw new Error('No applications found for this user');
        }

        const applicationData = userApplicationSnapshot.docs[0].data();
        const applications = applicationData.applications;
        const applicationIndex = applications.findIndex(app => app.applicationId === applicationId);
        
        if (applicationIndex === -1) {
            throw new Error('Application not found');
        }

        // Create updated applications array
        const updatedApplications = [...applications];
        updatedApplications[applicationIndex] = {
            ...applications[applicationIndex],
            status: newStatus,
            updatedAt: Timestamp.now()
        };

        // Update the document with the modified array using setDoc
        const applicationRef = doc(db, 'applications', userId);
        await setDoc(applicationRef, {
            applications: updatedApplications
        });

        return updatedApplications[applicationIndex];

    } catch (error) {
        console.error('Error in updateApplicationStatus service:', error);
        throw error;
    }
};