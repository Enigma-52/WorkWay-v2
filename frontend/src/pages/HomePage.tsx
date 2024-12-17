import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Bell,
  Briefcase,
  User,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Filter,
  Github,
  Linkedin,
  Twitter,
  Mail,
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const navigate = useNavigate();
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
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/all`);
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
            <button
              onClick={() => navigate("/alerts")}
              className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center"
            >
              <Bell size={16} className="mr-2" />
              Job Alerts
            </button>
            <button
              onClick={() => navigate("/applications")}
              className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center"
            >
              <Briefcase size={16} className="mr-2" />
              Applications
            </button>
            {isLoggedIn ? (
              <>
                <span className="text-white">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center"
              >
                <User size={16} className="mr-2" />
                Log in
              </button>
            )}
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

          {/* Update this grid section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main content area - job listings */}
            <div className="lg:col-span-3">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-2xl font-semibold mb-6 text-white">
                  Job Listings
                </h3>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, index) => (
                      <SkeletonLoader key={index} />
                    ))}
                  </div>
                ) : error ? (
                  <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20">
                    {error}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <JobCard jobs={filteredJobs} />
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar - recent applications */}
            <div className="lg:col-span-1">
              <RecentApplications />
            </div>
          </div>
        </main>

        {/* FAQ Section */}
        <section aria-labelledby="faq-heading" className="mt-16">
          <h2 id="faq-heading" className="text-2xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <article key={index} className="bg-gray-800 rounded-lg">
                <h3 className="w-full">
                  <button
                    className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-750 transition-colors duration-200"
                    onClick={() => toggleFaqItem(index)}
                    aria-expanded={openFaqItem === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="font-medium">{item.question}</span>
                    <ChevronDown
                      size={20}
                      className={`transform transition-transform duration-200 ${
                        openFaqItem === index ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-answer-${index}`}
                  className={`transition-all duration-200 ${
                    openFaqItem === index ? "block" : "hidden"
                  }`}
                >
                  <div className="p-4 bg-gray-700 rounded-b-lg prose prose-invert max-w-none">
                    {item.answer}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          className="mt-16 border-t border-gray-700 pt-8"
          role="contentinfo"
        >
          <nav
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            aria-label="Footer Navigation"
          >
            <div>
              <h2 className="text-xl font-semibold mb-4">About WorkWay</h2>
              <p className="text-gray-400">
                WorkWay is your gateway to exciting career opportunities. We
                connect talented professionals with leading companies worldwide.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Go to homepage"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Go to login page"
                  >
                    Login
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <address className="text-gray-400 not-italic">
                <a
                  href="mailto:workway.team@gmail.com"
                  className="hover:text-white transition-colors duration-200"
                >
                  workway.team@gmail.com
                </a>
              </address>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">
                Connect with the Maker
              </h2>
              <ul className="flex space-x-4" aria-label="Social Media Links">
                <li>
                  <a
                    href="https://x.com/enigmaticity"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Follow on Twitter"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/rohitsingh52/"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Connect on LinkedIn"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Enigma-52"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="View GitHub Profile"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              <small>
                &copy; {new Date().getFullYear()} WorkWay. All rights reserved.
              </small>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
