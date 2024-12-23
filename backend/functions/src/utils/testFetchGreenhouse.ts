import pkg from '../config/firebaseConfig.js';
const {
    db,
    doc,
    setDoc,
    getDocs,
    collection
} = pkg;
import fetch from 'node-fetch';
import axios from 'axios';

interface ProcessedJob {
  id: any;
  title: any;
  company: string;
  updatedAt: any;
  isExpired: boolean;
  absolute_url: any;
  location: any;
  source: string;
  experienceLevel: string;
  employmentType: string;
  domain: string;
  description: string;
  applicants: any;
}

const companies: string[] = [
    "Acumen"
]

const baseUrl = "https://boards-api.greenhouse.io/v1/boards/";

function generateJobBoardURLs(companies: string[]): string[] {
  return companies.map(company => `${baseUrl}${company.toLowerCase()}/jobs`);
}

async function fetchData(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

function decodeHTMLEntities(text) {
  return text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
}

async function getGreenhouseDescription(companyName, jobId) {
  const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  };

  try {
      const response = await axios.get(
          `https://boards-api.greenhouse.io/v1/boards/${companyName}/jobs/${jobId}`,
          { headers }
      );
      return decodeHTMLEntities(response.data.content);
  } catch (error) {
      return error;
  }
}

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

async function processJobs(company: string, jobs: any[]): Promise<ProcessedJob[]> {
  const processedJobs: ProcessedJob[] = [];
  for (const job of jobs) {
      const description = await getGreenhouseDescription(company, job.id);
      processedJobs.push({
          id: job.id,
          title: job.title,
          company: company.charAt(0).toUpperCase() + company.slice(1),
          updatedAt: job.updated_at,
          isExpired: false,
          absolute_url: job.absolute_url,
          location: job.location.name,
          source: "Greenhouse",
          experienceLevel: getExperienceLevel(job.title),
          employmentType: getEmploymentType(job.title),
          domain: getDomain(job.title),
          description: description || '',
          applicants: job?.applicants || 0
      });
  }
  return processedJobs;
}

function deduplicateJobs(jobs: ProcessedJob[]): ProcessedJob[] {
  const uniqueJobsMap = new Map();
  
  jobs.forEach(job => {
      const key = `${job.title}_${job.company}_${job.location}`.toLowerCase();
      
      if (uniqueJobsMap.has(key)) {
          const existingJob = uniqueJobsMap.get(key);
          const existingDate = new Date(existingJob.updatedAt);
          const newDate = new Date(job.updatedAt);
          
          if (newDate > existingDate) {
              uniqueJobsMap.set(key, job);
          }
      } else {
          uniqueJobsMap.set(key, job);
      }
  });
  
  return Array.from(uniqueJobsMap.values());
}

async function greenhouse(): Promise<void> {
  for (const company of companies) {
    const url = `${baseUrl}${company.toLowerCase()}/jobs`;
    
    try {
      const data = await fetchData(url);
      if (data && data.jobs) {
        const processedJobs = await processJobs(company, data.jobs);
        const uniqueJobs = deduplicateJobs(processedJobs);
        
        const docRef = doc(db, 'jobs2', company);
        const details = {
          data: uniqueJobs
        };
        
        await setDoc(docRef, details);
      }
    } catch (error) {
      console.error(`Error processing ${company}:`, error);
    }
  }
}

greenhouse();

export default greenhouse;