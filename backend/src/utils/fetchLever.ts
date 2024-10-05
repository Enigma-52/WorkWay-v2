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