import pkg from '../config/firebaseConfig';
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
} = pkg;

const JOBS_PER_PAGE = 5;
async function fetchJobs() {
    try {
        const startTime = Date.now();
        const jobsRef = collection(db, 'jobs');
        
        // Fetch jobs from Firestore
        const snapshot = await getDocs(jobsRef);
        
        const jobs = [] as any;
        snapshot.forEach(doc => {
            jobs.push({ company: doc.id, ...doc.data() });
        });

        // Calculate the time it took to fetch the jobs
        const endTime = Date.now();
        const durationInSeconds = (endTime - startTime) / 1000;
        
        console.log(jobs);

        console.log(`Fetched ${jobs.length} jobs in ${durationInSeconds} seconds`);

    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
}

fetchJobs();


// async function fetchJobs(lastVisible = null) {
//   try {
//     let jobsQuery;

//     if (lastVisible) {
//       jobsQuery = query(
//         collection(db, 'jobs'),
//         startAfter(lastVisible),
//         limit(JOBS_PER_PAGE)
//       );
//     } else {
//       jobsQuery = query(
//         collection(db, 'jobs'),
//         limit(JOBS_PER_PAGE)
//       );
//     }

//     const querySnapshot = await getDocs(jobsQuery);
//     const jobs = [] as any;

//     querySnapshot.forEach((doc) => {
//       jobs.push({ id: doc.id, ...doc.data() });
//     });

//     const lastVisibleJob = querySnapshot.docs[querySnapshot.docs.length - 1];

//     return { jobs, lastVisibleJob };
//   } catch (error) {
//     console.error("Error fetching jobs: ", error);
//     return { jobs: [], lastVisibleJob: null };
//   }
// }

// // Usage example
// let lastVisibleJob = null as any;

// async function loadMoreJobs() {
//   const { jobs, lastVisibleJob: newLastVisible } = await fetchJobs(lastVisibleJob);
//   lastVisibleJob = newLastVisible;

//   jobs.forEach((job: { id: string; title: string }) => {
//     console.log(`Job ID: ${job.id}, Title: ${job.title}`);
//     // Add job to your UI
//   });

//   console.log(jobs);
//   if (jobs.length < JOBS_PER_PAGE) {
//     console.log("No more jobs to load");
//   }
// }

// // Initial load
// loadMoreJobs();

// // Load more jobs again after a delay of 2 seconds (2000 milliseconds)
// setTimeout(() => {
//     loadMoreJobs();
// }, 5000);
