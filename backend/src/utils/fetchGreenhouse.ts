import pkg from '../config/firebaseConfig';
const {
    db,
    doc,
    setDoc,
    getDocs,
    collection
} = pkg;
import fetch from 'node-fetch';

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

const getExperienceLevel = (title: string): string => {
  const lowercaseTitle = title.toLowerCase();
  
  if (lowercaseTitle.includes("founder") || lowercaseTitle.includes("co-founder") || lowercaseTitle.includes("founding")) {
    return "Founding Team";
  } else if (lowercaseTitle.includes("lead") || lowercaseTitle.includes("architect")) {
    return "Lead";
  } else if (lowercaseTitle.includes("senior") || lowercaseTitle.includes("sr.")) {
    return "Senior";
  } else if (lowercaseTitle.includes("manager") || lowercaseTitle.includes("director")) {
    return "Manager";
  } else if (lowercaseTitle.includes("staff") || lowercaseTitle.includes("principal")) {
    return "Staff";
  } else if (lowercaseTitle.includes("junior") || lowercaseTitle.includes("jr.") || lowercaseTitle.includes("associate") || lowercaseTitle.includes("assisstant")) {
    return "Junior";
  } else if (lowercaseTitle.includes("intern") || lowercaseTitle.includes("trainee")) {
    return "Intern";
  } else {
    return "Mid-level";
  }
};

const getEmploymentType = (title: string): string => {
  const lowercaseTitle = title.toLowerCase();
  
  if (lowercaseTitle.includes("intern") || lowercaseTitle.includes("trainee")) {
    return "Intern";
  } else if (lowercaseTitle.includes("contract") || lowercaseTitle.includes("temporary")) {
    return "Contract";
  } else {
    return "Full-time";
  }
};

// Function to determine domain based on job title
const getDomain = (title: string): string => {
  const lowercaseTitle = title.toLowerCase();
  
  if (lowercaseTitle.includes("android")) {
    return "Android";
  } else if (lowercaseTitle.includes("backend") || lowercaseTitle.includes("back-end") || lowercaseTitle.includes("back end")) {
    return "Backend";
  } else if (lowercaseTitle.includes("frontend") || lowercaseTitle.includes("front-end") || lowercaseTitle.includes("front end")) {
    return "Frontend";
  } else if (lowercaseTitle.includes("ios")) {
    return "iOS";
  } else if (lowercaseTitle.includes("full stack") || lowercaseTitle.includes("fullstack") || lowercaseTitle.includes("full-stack")) {
    return "Full-stack";
  } else if (lowercaseTitle.includes("devops")) {
    return "DevOps";
  } else if (lowercaseTitle.includes("data scientist") || lowercaseTitle.includes("data science") || lowercaseTitle.includes("machine learning")) {
    return "Data Science";
  } else {
    return "Other";
  }
};

function processJobs(company: string, jobs: any[]): any[] {
  const currentDate = new Date();
  return jobs.map(job => ({
    id: job.id,
    title: job.title,
    company: company.charAt(0).toUpperCase() + company.slice(1),
    updatedAt: job.updated_at,
    isExpired: false,
    absolute_url: job.absolute_url,
    location: job.location.name,
    source: "Greenhouse",
    experienceLevel: getExperienceLevel(job.title) ,
    employmentType: getEmploymentType(job.title),
  domain: getDomain(job.title),
  }));
}

async function fetchAllData(urls: string[]): Promise<any[]> {
  const allJobs: any[] = [];
  for (const url of urls) {
    const company = url.split('/')[5]; // Extract company name from URL
    const data = await fetchData(url);
    if (data && data.jobs) {
      const processedJobs = processJobs(company, data.jobs);
      console.log(`Fetched ${processedJobs.length} jobs for ${company}`);
      allJobs.push(...processedJobs);
    }
  }
  return allJobs;
}

const greenhouse = async (): Promise<void> => {
  const urls = generateJobBoardURLs(companies);
  const allJobs = await fetchAllData(urls);

  const groupedJobs = companies.reduce((acc, company) => {
    acc[company] = allJobs.filter(job => job.company.toLowerCase() === company.toLowerCase());
    return acc;
  }, {} as Record<string, any[]>);

  // Store all the fetched data in Firestore for each company
  for (const company of companies) {
    const data = groupedJobs[company];

    if (data && data.length > 0) {
      const docRef = doc(db, 'jobs', company);
      const jobDetails = { data };

      await setDoc(docRef, jobDetails);
    }
  }

  console.log("Job processing completed.");
  console.log(`Total jobs fetched: ${allJobs.length}`);
  return;
};

greenhouse();

export default greenhouse;