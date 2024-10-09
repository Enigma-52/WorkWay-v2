import fetch from "node-fetch";
import pkg from '../config/firebaseConfig';
const {
    db,
    doc,
    setDoc,
    getDocs,
    collection
} = pkg;

//TODO : EXPIRY CHECKER

const companyNameList = [
  "Rockset",
  "Replicant",
  "Papara",
  "Latch",
  "Dodmg",
  "Wisk",
  "Netflix",
  "Pennylane",
  "Lumosity",
  "Ritual",
  "Metabase",
  "WanDB",
  "Anybotics",
  "QBio",
  "TorchDental",
  "Cresta",
  "Whoop",
  "Weride",
  "SimplyWallst",
  "MatchGroup",
  "Replicant",
  "Alluxio",
  "OpenX",
  "Provi",
  "SandboxVR",
  "Alice-Bob",
  "EquipHealth",
  "Cohere",
  "Govini",
  "UseInsider",
  "CBTNuggets",
  "ScanlineVFX",
  "Cresta",
  "Trunkio",
  "Agtonomy",
  "Uncountable",
  "PayJoy",
  "Secureframe",
  "WorkOS",
  "Lime",
  "Monad",
  "Azul",
  "AngelList",
  "Voleon",
  "Wisk",
  "DAZN",
  "TryJeeves",
  "Kong",
  "Ontic",
  "Zeotap",
  "XAgroup",
  "Highspot",
  "Hevodata",
  "Actian",
  "Accurate",
  "Egen",
  "UEI",
  "R3.com",
  "RedaptiveINC",
  "TeikaMetrics",
  "Mashgin",
  "SigFig-2",
  "Dreamsports",
  "KokoNetworks",
  "CogitoCorp",
  "Findem",
  "TTecDigital",
  "Zededa",
  "TrustArc",
  "Mendix",
  "AlifSemi",
  "BrightEdge",
  "Brillio-2",
  "Immutable",
  "Tala",
  "Smarsh",
  "Fampay",
  "ParallelWireless",
  "Hotstar",
  "RivosINC",
  "BookeeApp",
  "Galatea-Associates",
  "Actian",
  "Plus-2",
  "Extremenetworks",
  "Mindtickle",
  "Hevodata",
  "Mactores",
  "Certik",
  "Veeva",
  "Augmedix",
  "Nominal",
  "Coupa",
  "Rocketlawyer",
  "AskFavor",
  "RackSpace",
  "Zuru",
  "Aircall",
  "GoodLeap",
  "Clari",
  "Nium",
  "Mendix",
  "Zippi",
  "Kodiak",
  "Dazn",
  "Fluence",
  "ShyftLabs",
  "Aeva",
  "PingCAP",
  "LevelAI",
  "LIFE",
  "Uniphore",
  "Quince",
  "Instructure",
  "Doola",
  "WeLocalize",
  "Attentive",
  "Hadrian",
  "GoForward",
  "Metabase",
  "Articulate",
  "Waabi",
  "Augmedix",
  "Framework",
  "Entrata",
  "AeraTechnology",
  "Balbix",
  "Upstox",
  "DNB",
  "Plum",
  "Kong",
  "Palantir",
  "Nielsen"
];

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
});

async function fetchAllJobs(): Promise<void> {
  const allJobs: Job[] = [];

  for (const companyName of companyNameList) {
    const apiUrl = `https://api.lever.co/v0/postings/${companyName.toLowerCase()}?mode=json`;

    try {
      const response = await fetch(apiUrl);
      const jobCompany = await response.json() as [];

      const jobByCompany = jobCompany.map(job => formatJobData(job, companyName));

      const docRef = doc(db, 'jobs', companyName);
      const details = {
        data: jobByCompany
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