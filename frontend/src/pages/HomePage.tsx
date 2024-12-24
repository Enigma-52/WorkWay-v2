import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ChevronDown, Bell, Briefcase, User, LogOut } from "lucide-react";
import JobCard from "../components/JobCard";
import RecentApplications from "../components/RecentApplications";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
  const location = useLocation();
  const params = useParams();

  // Initial state setup with URL parameters
  const getInitialFilters = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      jobTitle: searchParams.get("title") || "",
      company: searchParams.get("company") || "",
      location: searchParams.get("location") || "",
      domain: searchParams.get("domain") || null,
      experienceLevel: searchParams.get("experience") || null,
      employmentType: searchParams.get("type") || null,
    };
  };

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
  const [filters, setFilters] = useState(getInitialFilters());

  useEffect(() => {
    // Check if we're on a filtered route
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length === 2) {
      const [filterType, value] = pathSegments;
      const newFilters = { ...getInitialFilters() };

      switch (filterType.toLowerCase()) {
        case "category":
        case "domain":
          newFilters.domain = decodeURIComponent(value);
          break;
        case "company":
          newFilters.company = decodeURIComponent(value);
          break;
        case "experience":
          newFilters.experienceLevel = decodeURIComponent(value);
          break;
        case "type":
          newFilters.employmentType = decodeURIComponent(value);
          break;
      }

      setFilters(newFilters);
      updateURLParams(newFilters);
    }
  }, [location.pathname]);

  // Update the URL params function to handle both path and query parameters
  const updateURLParams = (currentFilters: typeof filters) => {
    const searchParams = new URLSearchParams();
    let newPath = "/";

    // Determine if we should use path-based routing
    if (currentFilters.domain) {
      newPath = `/domain/${encodeURIComponent(currentFilters.domain)}`;
    } else if (currentFilters.company) {
      newPath = `/company/${encodeURIComponent(currentFilters.company)}`;
    }

    // Add remaining filters as query parameters
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (
        value &&
        // Don't add domain/company as query param if it's in the path
        !(
          (key === "domain" && newPath.startsWith("/domain/")) ||
          (key === "company" && newPath.startsWith("/company/"))
        )
      ) {
        switch (key) {
          case "jobTitle":
            searchParams.set("title", value);
            break;
          case "experienceLevel":
            searchParams.set("experience", value);
            break;
          case "employmentType":
            searchParams.set("type", value);
            break;
          default:
            searchParams.set(key, value);
        }
      }
    });

    const queryString = searchParams.toString();
    const newURL = queryString ? `${newPath}?${queryString}` : newPath;
    navigate(newURL, { replace: true });
  };

  // Update handleFilterChange to better handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = {
      ...filters,
      [filterType]: value === "All" ? null : value,
    };

    setFilters(newFilters);
    updateURLParams(newFilters);

    if (["domain", "experienceLevel", "employmentType"].includes(filterType)) {
      setOpenDropdown("");
    }
  };

  const experienceLevels = ["All", "Junior", "Mid-level", "Senior", "Lead"];
  const employmentTypes = ["All", "Intern", "Full-time", "Contract"];
  const domains = [
    "All",
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
        const token = process.env.REACT_APP_API_AUTH;
        const response = await fetch(`${API_BASE_URL}/jobs/all`, {});

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

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
      const titleMatch = job.title
        .toLowerCase()
        .includes(filters.jobTitle.toLowerCase());
      const companyMatch = job.company
        .toLowerCase()
        .includes(filters.company.toLowerCase());
      const locationMatch = job.location
        .toLowerCase()
        .includes(filters.location.toLowerCase());

      // Updated dropdown filter logic with null checks and "All" option handling
      const domainMatch =
        !filters.domain || filters.domain === "All"
          ? true
          : job.domain === filters.domain;
      const experienceLevelMatch =
        !filters.experienceLevel || filters.experienceLevel === "All"
          ? true
          : job.experienceLevel === filters.experienceLevel;
      const employmentTypeMatch =
        !filters.employmentType || filters.employmentType === "All"
          ? true
          : job.employmentType === filters.employmentType;

      return (
        titleMatch &&
        companyMatch &&
        locationMatch &&
        domainMatch &&
        experienceLevelMatch &&
        employmentTypeMatch
      );
    });

    setFilteredJobs(filtered);
    setTotalJobs(filtered.length);
  }, [filters, jobs]);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? "" : dropdown);
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
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

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
                    dropdown.label}
                  <ChevronDown className="ml-2" size={16} />
                </button>
                {openDropdown === dropdown.name && (
                  <div className="absolute mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                    {dropdown.options.map((option) => (
                      <div
                        key={option}
                        className={`p-2 text-lg flex items-center cursor-pointer hover:bg-gray-700 ${
                          filters[dropdown.name as keyof typeof filters] ===
                          option
                            ? "bg-purple-600"
                            : ""
                        }`}
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
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            {/* Main content area - job listings */}
            <div className="lg:col-span-4">
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
            <div className="lg:col-span-2">
              <RecentApplications />
            </div>
          </div>
        </main>

        {/*World Map*/}

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

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
