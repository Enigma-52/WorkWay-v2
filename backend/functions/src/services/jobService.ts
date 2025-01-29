import pkg from '../config/firebaseConfig.js';
const {
    db,
    doc,
    setDoc,
    getDocs,
    collection,
    query,
    orderBy,
    startAfter, 
    limit
} = pkg; // Adjust this import based on your Firebase setup

export const fetchAllJobs = async () => {
    const jobsRef = collection(db, 'jobs');

    const snapshot = await getDocs(jobsRef);

    const jobs = snapshot.docs.map(doc => ({ company: doc.id, ...doc.data() }));

    return {
        jobs,
        meta: {
            count: jobs.length,
        }
    };
};

export const fetchAllTestJobs = async () => {
    const jobsRef = collection(db, 'jobs2');

    const snapshot = await getDocs(jobsRef);

    const jobs = [] as any;
    snapshot.forEach(doc => {
        jobs.push({ company: doc.id, ...doc.data() });
    });

    return {
        jobs,
        meta: {
            count: jobs.length,
        }
    };
};