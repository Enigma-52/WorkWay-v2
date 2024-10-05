import pkg from '../config/firebaseConfig';
const {
    db,
    doc,
    setDoc,
    getDocs,
    collection
} = pkg;

interface Job {
  id: string;
  title: string;
  company: string;
  updatedAt: string | number;
  isExpired: boolean;
  absolute_url: string;
  location: string;
  source: string;
}

function parseDate(dateString: string | number): Date {
  if (typeof dateString === 'number') {
    return new Date(dateString);
  }
  return new Date(dateString);
}

async function getTop5LatestJobs(): Promise<Job[]> {
  const jobsCollection = collection(db, 'jobs');
  const querySnapshot = await getDocs(jobsCollection);
  
  let allJobs: Job[] = [];

  querySnapshot.forEach((doc) => {
    const companyData = doc.data();
    if (companyData.data && Array.isArray(companyData.data)) {
      allJobs = allJobs.concat(companyData.data);
    }
  });

  // Sort jobs by updatedAt in descending order
  allJobs.sort((a, b) => {
    const dateA = parseDate(a.updatedAt);
    const dateB = parseDate(b.updatedAt);
    return dateB.getTime() - dateA.getTime();
  });

  // Return the top 5 jobs
  return allJobs.slice(0, 5);
}

getTop5LatestJobs()
  .then(async (top5Jobs) => {
    console.log("Top 5 latest jobs:", top5Jobs);
    const docRef = doc(db, 'LatestJobs', 'LatestJobs');
    const jobDetails = { top5Jobs };

    await setDoc(docRef, jobDetails);
    return;
  })
  .catch((error) => {
    console.error("Error fetching top 5 jobs:", error);
  });

export default getTop5LatestJobs;