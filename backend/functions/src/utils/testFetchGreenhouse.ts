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
  const lowercaseTitle = ' ' + title.toLowerCase() + ' ';
  
  if (lowercaseTitle.includes(" intern ") || lowercaseTitle.includes(" internship ")) {
    return "Intern";
  } else if (lowercaseTitle.includes(" founder ") || lowercaseTitle.includes(" co-founder ") || lowercaseTitle.includes(" founding ")) {
    return "Founding Team";
  } else if (lowercaseTitle.includes(" lead ") || lowercaseTitle.includes(" architect ")) {
    return "Lead";
  } else if (lowercaseTitle.includes(" senior ") || lowercaseTitle.includes(" sr. ")) {
    return "Senior";
  } else if (lowercaseTitle.includes(" manager ") || lowercaseTitle.includes(" director ")) {
    return "Manager";
  } else if (lowercaseTitle.includes(" staff ") || lowercaseTitle.includes(" principal ")) {
    return "Staff";
  } else if (lowercaseTitle.includes(" junior ") || lowercaseTitle.includes(" jr. ") || lowercaseTitle.includes(" associate ") || lowercaseTitle.includes(" assistant ")) {
    return "Junior";
  } else {
    return "Mid-level";
  }
};

const getEmploymentType = (title: string): string => {
  const lowercaseTitle = ' ' + title.toLowerCase() + ' ';
  
  if (lowercaseTitle.includes(" internship ") || lowercaseTitle.includes(" intern ") || lowercaseTitle.includes(" trainee ")) {
    return "Part-Time";
  } else if (lowercaseTitle.includes(" contract ") || lowercaseTitle.includes(" temporary ")) {
    return "Contract";
  } else {
    return "Full-Time";
  }
};

// Function to determine domain based on job title
const getDomain = (title: string): string => {
  const lowercaseTitle = ' ' + title.toLowerCase() + ' ';
  
  if (lowercaseTitle.includes(" android ")) {
    return "Android";
  } else if (lowercaseTitle.includes(" backend ") || lowercaseTitle.includes(" back-end ") ) {
    return "Backend";
  } else if (lowercaseTitle.includes(" frontend ") || lowercaseTitle.includes(" front-end ") ){
    return "Frontend";
  } else if (lowercaseTitle.includes(" ios ")) {
    return "iOS";
  } else if (lowercaseTitle.includes(" full stack ") || lowercaseTitle.includes(" fullstack ") || lowercaseTitle.includes(" full-stack ")) {
    return "Full-stack";
  } else if (lowercaseTitle.includes(" devops ")) {
    return "DevOps";
  } else if (lowercaseTitle.includes(" data scientist ") || lowercaseTitle.includes(" data science") || lowercaseTitle.includes(" machine learning ")) {
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