import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Bell,
  Briefcase,
  User,
  ChevronRight,
} from "lucide-react";
import JobCard from "../components/JobCard";
import RecentApplications from "../components/RecentApplications";

interface Job {
  id: string;
  title: string;
  company: string;
  updatedAt: string;
  isExpired: boolean;
  absolute_url: string;
  location: string;
  source: string;
  experienceLevel?: string;
  employmentType?: string;
  domain?: string;
}

interface CompanyJobs {
  company: string;
  data: { data: Job[] }[];
}

const HomePage: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [companyJobs, setCompanyJobs] = useState<CompanyJobs[]>([]);
  const [filters, setFilters] = useState({
    jobTitle: "",
    company: "",
    location: "",
    domain: "",
    experienceLevel: "",
    employmentType: "",
  });

  const experienceLevels = ["Junior", "Mid-level", "Senior", "Lead"];
  const employmentTypes = ["Intern", "Full-time", "Contract"];
  const domains = [
    "Android",
    "Backend",
    "Frontend",
    "iOS",
    "Full-stack",
    "DevOps",
    "Data Science",
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/api/jobs/all");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Log the entire response

        let allJobs: Job[] = [];

        if (Array.isArray(data.jobs)) {
          allJobs = data.jobs.flatMap((job: any) => {
            if (job && job.data && Array.isArray(job.data)) {
              return job.data;
            }
            console.warn("Unexpected job structure:", job);
            return [];
          });
        } else if (typeof data.jobs === "object" && data.jobs !== null) {
          // If data.jobs is an object, assume it's a single job
          allJobs = [data.jobs];
        } else {
          console.error("Unexpected data structure:", data);
          throw new Error("Invalid data structure received from API");
        }

        // Sort jobs by updatedAt in descending order (most recent first)
        allJobs.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        console.log("Processed and sorted jobs:", allJobs); // Log the processed and sorted jobs

        setJobs(allJobs);
        setFilteredJobs(allJobs);
        setTotalJobs(allJobs.length);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(
          "An error occurred while fetching jobs. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(filters.jobTitle.toLowerCase()) &&
        job.company.toLowerCase().includes(filters.company.toLowerCase()) &&
        job.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        (filters.domain === "" || job.domain === filters.domain) &&
        (filters.experienceLevel === "" ||
          job.experienceLevel === filters.experienceLevel) &&
        (filters.employmentType === "" ||
          job.employmentType === filters.employmentType)
      );
    });
    setFilteredJobs(filtered);
    setTotalJobs(filtered.length);
  }, [filters, jobs]);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? "" : dropdown);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
    if (["domain", "experienceLevel", "employmentType"].includes(filterType)) {
      setOpenDropdown("");
    }
  };

  const [openFaqItem, setOpenFaqItem] = useState<number | null>(null);

  const faqItems = [
    {
      question: "How can I search for jobs on WorkWay?",
      answer:
        "You can search for jobs using the search bars at the top of the homepage. Enter a job title, company name, or location to start your search. You can further refine your results using the dropdown filters for domain, experience level, and employment type.",
    },
    {
      question: "What types of filters are available for job searches?",
      answer:
        "WorkWay offers several filters to refine your job search. You can filter by job title, company, and location using the text inputs. Additionally, you can use dropdown menus to filter by domain (e.g., Android, Backend, Frontend), experience level (e.g., Junior, Mid-level, Senior), and employment type (e.g., Intern, Full-time, Contract).",
    },
    {
      question: "How do I apply for a job on WorkWay?",
      answer:
        "Once you've found a job you're interested in, click on the 'Apply Now' button on the job card. This will typically take you to the company's application page or provide instructions on how to apply. Make sure you're logged in to keep track of your applications.",
    },
    {
      question: "Can I save jobs to apply later?",
      answer:
        "Currently, WorkWay doesn't have a built-in job saving feature. However, you can use the search and filter options to easily find jobs you're interested in when you're ready to apply.",
    },
    {
      question: "How often is the job list updated?",
      answer:
        "WorkWay fetches job listings regularly to ensure you have access to the most current opportunities. The exact frequency may vary, but you can always use the search and filter options to find the latest job postings.",
    },
  ];

  const toggleFaqItem = (index: number) => {
    setOpenFaqItem(openFaqItem === index ? null : index);
  };

  const SkeletonLoader = () => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6 w-full animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
          <div className="text-left">
            <div className="h-8 bg-gray-700 rounded w-64 mb-2"></div>
            <div className="h-6 bg-gray-700 rounded w-48"></div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-10 bg-gray-700 rounded-full w-24"></div>
        </div>
      </div>
      <div className="flex flex-wrap mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-8 bg-gray-700 rounded-full w-24 mr-2 mb-2"
          ></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen text-white text-lg">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-4xl font-bold">
            <span className="text-white">Work</span>
            <span className="text-purple-400">Way</span>
          </h1>
          <div className="flex items-center space-x-4">
            <button className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center">
              <Bell size={16} className="mr-2" />
              Job Alerts
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center">
              <Briefcase size={16} className="mr-2" />
              Applications
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center">
              <User size={16} className="mr-2" />
              Log in
            </button>
          </div>
        </header>

        <main className="text-center mb-16">
          <p className="text-green-400 mb-4 animate-pulse text-xl">
            30,000+ active jobs
          </p>
          <h2 className="text-6xl font-bold mb-6 leading-tight">
            Find your Dream Job
          </h2>
          <p className="text-gray-300 mb-12 max-w-2xl mx-auto text-xl">
            Discover top remote and in-office opportunities with leading
            companies from all over the world.
          </p>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Job Title"
              className="bg-gray-800 px-5 py-3 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={filters.jobTitle}
              onChange={(e) => handleFilterChange("jobTitle", e.target.value)}
            />
            <input
              type="text"
              placeholder="Company"
              className="bg-gray-800 px-5 py-3 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={filters.company}
              onChange={(e) => handleFilterChange("company", e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              className="bg-gray-800 px-5 py-3 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {/* Dropdowns */}
            {[
              { name: "domain", options: domains, label: "Domain" },
              {
                name: "experienceLevel",
                options: experienceLevels,
                label: "Experience Level",
              },
              {
                name: "employmentType",
                options: employmentTypes,
                label: "Employment Type",
              },
            ].map((dropdown) => (
              <div key={dropdown.name} className="relative">
                <button
                  className="bg-gray-800 hover:bg-gray-700 transition-colors px-5 py-3 rounded-full flex items-center text-lg"
                  onClick={() => toggleDropdown(dropdown.name)}
                >
                  {filters[dropdown.name as keyof typeof filters] ||
                    dropdown.label}{" "}
                  <ChevronDown className="ml-2" size={16} />
                </button>
                {openDropdown === dropdown.name && (
                  <div className="absolute mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                    {dropdown.options.map((option) => (
                      <div
                        key={option}
                        className="p-2 text-lg flex items-center cursor-pointer hover:bg-gray-700"
                        onClick={() =>
                          handleFilterChange(dropdown.name, option)
                        }
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 p-6">
              <h3 className="text-2xl font-semibold mb-4">Job Listings</h3>
              {isLoading ? (
                <>
                  {[...Array(4)].map((_, index) => (
                    <SkeletonLoader key={index} />
                  ))}
                </>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="space-y-4">
                  <JobCard jobs={filteredJobs} />
                </div>
              )}
            </div>
            <RecentApplications />
          </div>
          <div className="mt-16">
            <h3 className="text-2xl font-semibold mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full text-left p-4 flex justify-between items-center"
                    onClick={() => toggleFaqItem(index)}
                  >
                    <span>{item.question}</span>
                    <ChevronRight
                      size={20}
                      className={`transform transition-transform ${
                        openFaqItem === index ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {openFaqItem === index && (
                    <div className="text-left p-4 bg-gray-700">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">About WorkWay</h4>
              <p className="text-gray-400">
                WorkWay is your gateway to exciting career opportunities. We
                connect talented professionals with leading companies worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Job Listings
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Company Profiles
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Career Resources
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-400">Email: support@workway.com</p>
              <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 WorkWay. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
