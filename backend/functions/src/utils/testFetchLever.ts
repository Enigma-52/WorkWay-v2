import fetch from "node-fetch";
import pkg from '../config/firebaseConfig.js';
const {
    db,
    doc,
    setDoc,
    getDocs,
    collection
} = pkg;

//TODO : EXPIRY CHECKER

const companyNameList = [
    "Accurate"
]


// Define a Job interface for clarity
interface Job {
  id: string;
  text: string;
  updated_at: string;
  hostedUrl: string;
  categories: {
    location: string;
  };
  createdAt: number;
  additional : string,
  description : symbol,
  lists : object,
  salaryRange: object,
  workplaceType: string,
  applicants: any;

}

// Utility function to remove undefined values from an object
const removeUndefined = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
}

// Function to determine experience level based on job title
const getExperienceLevel = (title: string): string => {
  const lowercaseTitle = title.toLowerCase();
  
  if (lowercaseTitle.includes(" Founder ") || lowercaseTitle.includes(" Co-Founder ") || lowercaseTitle.includes(" Founding ")) {
    return "Founding Team";
  } else if (lowercaseTitle.includes(" Lead ") || lowercaseTitle.includes(" Architect ")) {
    return "Lead";
  } else if (lowercaseTitle.includes(" Senior ") || lowercaseTitle.includes(" Sr. ")) {
    return "Senior";
  } else if (lowercaseTitle.includes(" Manager ") || lowercaseTitle.includes(" Director ")) {
    return "Manager";
  } else if (lowercaseTitle.includes(" Staff ") || lowercaseTitle.includes(" Principal ")) {
    return "Staff";
  } else if (lowercaseTitle.includes(" Junior ") || lowercaseTitle.includes(" Jr. ") || lowercaseTitle.includes(" Associate ") || lowercaseTitle.includes(" Assisstant ")) {
    return "Junior";
  } else {
    return "Mid-level";
  }
};

const getEmploymentType = (title: string): string => {
  const lowercaseTitle = title.toLowerCase();
  
  if (lowercaseTitle.includes(" Internship ") || lowercaseTitle.includes(" Intern ") || lowercaseTitle.includes(" Trainee ")) {
    return "Intern";
  } else if (lowercaseTitle.includes(" Contract ") || lowercaseTitle.includes(" Temporary ")) {
    return "Contract";
  } else {
    return "Full-time";
  }
};

// Function to determine domain based on job title
const getDomain = (title: string): string => {
  const lowercaseTitle = title.toLowerCase();
  
  if (lowercaseTitle.includes(" Android ")) {
    return "Android";
  } else if (lowercaseTitle.includes(" Backend ") || lowercaseTitle.includes(" Back-End ") ) {
    return "Backend";
  } else if (lowercaseTitle.includes(" Frontend ") || lowercaseTitle.includes(" Front-End ") ){
    return "Frontend";
  } else if (lowercaseTitle.includes(" IOS ")) {
    return "iOS";
  } else if (lowercaseTitle.includes(" Full Stack ") || lowercaseTitle.includes(" Fullstack ") || lowercaseTitle.includes(" Full-Stack ")) {
    return "Full-stack";
  } else if (lowercaseTitle.includes(" Devops ")) {
    return "DevOps";
  } else if (lowercaseTitle.includes(" Data Scientist ") || lowercaseTitle.includes(" Data Science") || lowercaseTitle.includes(" Machine Learning ")) {
    return "Data Science";
  } else {
    return "Other";
  }
};

// Function to format job data based on the specified pattern
const formatJobData = (job: Job, company: string) => removeUndefined({
  id: job.id,
  title: job.text,
  company: company.charAt(0).toUpperCase() + company.slice(1),
  updatedAt: job.createdAt,
  isExpired: false,  
  absolute_url: job.hostedUrl,
  location: job.categories?.location,
  source: "Lever",
  experienceLevel: getExperienceLevel(job.text),
  employmentType: getEmploymentType(job.text),
  domain: getDomain(job.text),
  additional : job.additional,
  description : job.description,
  lists : job.lists,
  salaryRange: job.salaryRange,
  workplaceType: job.workplaceType,
  applicants: job.applicants || 0
});
function deduplicateJobs(jobs: any[]){
  // Create a Map using a composite key of relevant fields
  const uniqueJobsMap = new Map();
  
  jobs.forEach(job => {
      // Create a composite key using fields that should make a job unique
      const key = `${job.title}_${job.company}_${job.location}`.toLowerCase();
      
      // If this key already exists, only keep the more recently updated job
      if (uniqueJobsMap.has(key)) {
          const existingJob = uniqueJobsMap.get(key);
          // For Lever jobs, updatedAt is already a timestamp number
          if (job.updatedAt > existingJob.updatedAt) {
              uniqueJobsMap.set(key, job);
          }
      } else {
          uniqueJobsMap.set(key, job);
      }
  });
  
  return Array.from(uniqueJobsMap.values());
}


async function fetchAllJobs(): Promise<void> {
  const allJobs: Job[] = [];

  for (const companyName of companyNameList) {
    const apiUrl = `https://api.lever.co/v0/postings/${companyName.toLowerCase()}?mode=json`;

    try {
      const response = await fetch(apiUrl);
      const jobCompany = await response.json() as [];

      const jobByCompany = jobCompany.map(job => formatJobData(job, companyName));
      
      const uniqueJobs = deduplicateJobs(jobByCompany);
      console.log(`${companyName}: Reduced from ${jobByCompany.length} to ${uniqueJobs.length} jobs`);

      const docRef = doc(db, 'jobs2', companyName);
      const details = {
        data: uniqueJobs
      };

      console.log("Saving all jobs from : ", companyName );
      await setDoc(docRef, details);
    } catch (error) {
      console.error(`Error fetching jobs for ${companyName}:`, error);
    }
  }
}

const lever = async (): Promise<void> => {
  try {
    await fetchAllJobs();
    return;
  } catch (error) {
    console.error('Error:', error);
  }
}

lever();

export default lever;