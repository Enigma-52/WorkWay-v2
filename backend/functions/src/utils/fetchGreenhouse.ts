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

//TODO : EXPIRY CHECKER

const companies: string[] = [
"Affirm", "Airtable", "Calm", "Faire", "Forward","Mercury", "Notion", "Retool","Robinhood", "Waymo", 
   "Anthropic","Betterment", "Blend", "Branch", "Carbon", "Clever", 
   "Collibra", "Descript", "Discord", "DriveWealth",
    "Everlane", "Faire", "Forethought", "Galileo", "Glossier",
     "Grammarly", "Guideline", 
      "Axon", "BetterCloud", "Braze", "Checkr", "CoreWeave", "Doma", "Formlabs", 
       "Fourkites", "Glean", "GoCardless",
    "Apptronik",
    "GoMotive",
    "ExnessInternship",
    "NoahMedical",
    "HarbingerMotors",
    "Niantic",
    "RecordedFuture",
    "Verkada",
    "Sertis",
    "Udemybedi",
    "Minitab",
    "Verily",
    "Radiant",
    "CapellaSpace",
    "DoubleVerify",
    "Gusto",
    "Astranis",
    "JaneStreet",
    "Make",
    "RocketLab",
    "ZipRecruiter",
    "ToyotaConnected",
    "Dataiku",
    "WeHRTYou",
    "Censys",
    "OwnBackup",
    "RTI",
    "Gardacp",
    "Mill",
    "Skyryse",
    "OneDegree",
    "FlyZipline",
    "GeckoRobotics",
    "Duolingo",
    "GiveDirectly",
    "CleoIndia",
    "Remotasks",
    "AptosLabs",
    "HighMetric",
    "Thoughtspot",
    "WorldCoinOrg",
    "Catchpoint",
    "Airbase",
    "GoDaddy",
    "Acumen",
    "FreshPrints",
    "RockstarGames",
    "PorchIndia",
    "ChargePoint",
    "EasyShip",
    "Datadog",
    "JFrog",
    "ArkoseLabsIndia",
    "WizeHiveIndia",
    "MHI",
    "Ivalua",
    "Dimagi",
    "SnowflakeComputing",
    "Qualtrics",
    "Gleanwork",
    "Highmetric",
    "Toast",
    "Aspireio",
    "Databook",
    "Canonical",
    "StorableIndia",
    "Legion",
    "Alphasense",
    "Degreed",
    "Fortra",
    "Addepar1",
    "BlinkHealth",
    "Upkeep",
    "DiligentCorporation",
    "Acquia",
    "Mixpanel",
    "BrightInsight",
    "Startree",
    "Ivalua",
    "Vimeo",
    "Syndigo",
    "PorchIndia",
    "Opendoor",
    "Moveworks",
    "ArcadiaCareers",
    "CleoIndia",
    "Phonepe",
    "FiveTran",
    "Stripe",
    "Disco",
    "Instawork",
    "BerkadiaIndia",
    "Oportun",
    "ApolloIO",
    "SingleStore",
    "Decisions",
    "EpisodeSIX",
    "CourseHero",
    "EnvoyGlobalINC",
    "Bloomreach",
    "BusinessolverGhost",
    "Verifone",
    "Lacework",
    "NoahMedical",
    "TraceLinkInc",
    "Poshmark",
    "Rubrik",
    "Addepar1",
    "Encora10",
    "Agoda",
    "Ivalua",
    "GroundTruth",
    "Moveworks",
    "AbnormalSecurity",
    "GravitonResearchCapital",
    "Enterpret",
    "OwnBackup",
    "IBKR",
    "SingleStore",
    "Fivetran",
    "Crunchyroll",
    "Devrev",
    "Benchling",
    "Mixpanel",
    "Digicert",
    "Mindbody",
    "Brex",
    "Lacework",
    "Samsara",
    "Enfusion",
    "Seekout",
    "Make",
    "Sumologic",
    "Circle",
    "Verifone",
    "ClarifAI",
    "FuboTV",
    "Litmus46",
    "Databento",
    "CoinBase",
    "Moloco",
    "IMC",
    "Neuralink",
    "Relativity",
    "Affinitiv",
    "Enova",
    "SigmaComputing",
    "Docugami",
    "Tesseract",
    "Intradiem",
    "Verkada",
    "AptosLabs",
    "Reltio",
    "Applovin",
    "Skydio",
    "Schonfeld",
    "Loop",
    "Chime",
    "Gardacp",
    "Futronics",
    "Inbank",
    "Metron",
    "Alarmcom",
    "Dropbox",
    "Twilio", 
    "Brevium","OpenSesame","AscendAnalytics" ,"MongoDB", "PagerDuty", "Elastic", "Anaplan", "Databricks", "GitLab", "HashiCorp", "Okta", "Zscaler", "Datadog", "Dropbox", "Tanium", "Zuora", "ZoomInfo", "NICE", "SolarWinds", "InterSystems", "Appian", "SolarWinds", "Appian", "SolarWinds", "SolarWinds", "SolarWinds", "Appian", "SolarWinds", "SolarWinds", "SolarWinds", "SolarWinds", "Dropbox", "Tanium", "Zuora", "ZoomInfo", "NICE", "SolarWinds", "InterSystems", "Udemy", "Pinterest", "Twitch", "Squarespace", "Asana", "Stripe", "Dropbox", "Instacart", "Okta", "Thumbtack", "HashiCorp", "PagerDuty", "Gusto", "Twilio", "SurveyMonkey", "Glassdoor", "Flexport", "Figma", "Gusto", "Guru", "Handshake", "HackerRank", "HashiCorp", "Hootsuite", "HubSpot", "Indeed", "Instacart", "Integrate", "Jampp", "Jumia", "Justworks", "Lattice", "Life360", "LinkedIn", "Lyft", "Marqeta", "Mindbody", "Mixpanel", "MongoDB", "Mozilla", "MyHeritage", "N26", "Narvar", "Netskope", "Netlify", "Nextdoor", "Oath", "Okta", "OpenTable", "Opendoor", "OpenTable", "PagerDuty", "PathAI", "PebblePost", "Peloton", "Pendo", "Pinterest", "Qualtrics", "Quip", "Reddit", "Reddit", "Relativity", "Rev", "Roblox", "Roku", "Rubrik", "Samsara", "SeatGeek", "Sisense", "Skydio", "SkyScanner", "Smartsheet", "SoFi", "Solera", "SpaceX", "Squarespace", "Squarespace", "Strava", "Stripe", "SurveyMonkey", "Symphony", "Synack", "Tanium", "Thumbtack", "Toast", "TripAdvisor", "Twitch", "Twilio", "Udacity", "Udemy", "Upstart", "Upwork", "Vimeo", "Wayfair", "Weave", "Webflow", "Wework", "WillowTree", "Wizeline", "Yext", "ZoomInfo", "Zscaler", "Zuora", "Zynga"
];

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
    console.error(`Error fetching data from ${url}:`, error);
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

      // Decode the HTML content
      const decodedContent = decodeHTMLEntities(response.data.content);

      return decodedContent;
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

async function processJobs(company: string, jobs: any[]): Promise<any[]> {
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
          applicants: job.applicants || 0
      });
  }
  return processedJobs;
}

function deduplicateJobs(jobs: any[]){
  // Create a Map using a composite key of relevant fields
  const uniqueJobsMap = new Map();
  
  jobs.forEach(job => {
      // Create a composite key using fields that should make a job unique
      const key = `${job.title}_${job.company}_${job.location}`.toLowerCase();
      
      // If this key already exists, only keep the more recently updated job
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
  
  // Convert Map back to array
  return Array.from(uniqueJobsMap.values());
}

async function fetchAllData(urls: string[]): Promise<void> {
  let totalJobsSaved = 0;
  let totalJobsAttempted = 0;

  for (const url of urls) {
      const company = url.split('/')[5]; // Extract company name from URL
      console.log(`Processing jobs for ${company}...`);
      
      try {
          const data = await fetchData(url);
          if (data && data.jobs) {
              const processedJobs = await processJobs(company, data.jobs);
              const uniqueJobs = deduplicateJobs(processedJobs);
              
              console.log(`Found ${uniqueJobs.length} unique jobs for ${company}`);
              
              // Save jobs individually
              for (const job of uniqueJobs) {
                  totalJobsAttempted++;
                  try {
                      await saveJobToFirebase(job);
                      totalJobsSaved++;
                      
                      // Optional: Add a small delay between saves to prevent rate limiting
                      await new Promise(resolve => setTimeout(resolve, 100));
                  } catch (error) {
                      console.error(`Failed to save job ${job.id} for ${company}:`, error);
                  }
              }
          }
      } catch (error) {
          console.error(`Error processing ${company}:`, error);
      }
  }
  
  console.log(`Job processing completed. Successfully saved ${totalJobsSaved} out of ${totalJobsAttempted} jobs.`);
}

async function saveJobToFirebase(job: ProcessedJob): Promise<void> {
  try {
      const companyDocRef = doc(db, 'jobs', job.company.toLowerCase());
      const jobDocRef = doc(companyDocRef, 'positions', job.id.toString());
      
      await setDoc(jobDocRef, job, { merge: true });
      //console.log(`Successfully saved job ${job.id} for ${job.company}`);
  } catch (error) {
      console.error(`Error saving job ${job.id} for ${job.company}:`, error);
      // Optional: Add retry logic here if needed
  }
}

const greenhouse = async (): Promise<void> => {
  const urls = generateJobBoardURLs(companies);
  await fetchAllData(urls);
  return;
};

greenhouse();

export default greenhouse;