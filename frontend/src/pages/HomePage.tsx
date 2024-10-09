import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
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

        console.log("Processed jobs:", allJobs); // Log the processed jobs

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

  return (
    <div className="bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen text-white text-lg">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-4xl font-bold">
            <span className="text-white">Work</span>
            <span className="text-purple-400">Way</span>
          </h1>
          <button className="bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-2 rounded-full text-sm font-semibold">
            Log in
          </button>
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
                <p>Loading jobs...</p>
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
        </main>
      </div>
    </div>
  );
};

export default HomePage;
