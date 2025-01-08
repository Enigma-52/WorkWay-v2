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
        // Check if user has already applied to this job
        const applicationsRef = collection(db, 'applications');
        const existingApplicationQuery = query(
            applicationsRef,
            where('userId', '==', user.id),
            where('jobId', '==', job.id),
            limit(1)
        );

        const existingApplications = await getDocs(existingApplicationQuery);

        if (!existingApplications.empty) {
            throw new Error('User has already applied to this job');
        }

        // Create new application document
        const applicationId = `${user.id}-${job.id}`;
        const applicationRef = doc(db, 'applications', applicationId);

        const applicationData = {
            userId: user.id,
            jobId: job.id,
            status,
            job,
            appliedAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            userName: user.name,
            userEmail: user.email,
        };

        // Save to Firestore
        await setDoc(applicationRef, applicationData);

        return {
            id: applicationId,
            ...applicationData
        };

    } catch (error) {
        console.error('Error in createApplication service:', error);
        throw error; // Re-throw to be handled by controller
    }
};