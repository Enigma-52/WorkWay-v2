import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import JobCard from "../components/JobCard";
import RecentApplications from "../components/RecentApplications";

interface Job {
  id: string;
  title: string;
  updatedAt: string;
  isExpired: boolean;
  absolute_url: string;
  location: string;
  source: string;
}

interface CompanyJobs {
  company: string;
  data: { data: Job[] }[];
}

const HomePage: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [companyJobs, setCompanyJobs] = useState<CompanyJobs[]>([]);

  const experienceLevels = [
    { label: "Junior", color: "bg-green-500" },
    { label: "Mid-level", color: "bg-yellow-500" },
    { label: "Senior", color: "bg-orange-500" },
    { label: "Lead", color: "bg-red-500" },
  ];

  const employmentTypes = ["Intern", "Full-time"];
  const locations = ["All countries"];
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

        const allJobs = data.jobs;

        const companyJobs = data.jobs.map((job: any) => ({
          company: job.company, // assuming job has a company property
          data: [job],
        }));

        setJobs(allJobs);
        setTotalJobs(allJobs.length);
        setCompanyJobs(companyJobs);
      } catch (err) {
        setError(
          "An error occurred while fetching jobs. Please try again later."
        );
        console.error("Error fetching jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? "" : dropdown);
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

          <div className="mb-8">
            <input
              type="text"
              placeholder="Search job titles..."
              className="w-full max-w-xl bg-gray-800 px-5 py-3 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {/* Dropdowns */}
            {[
              {
                name: "experience",
                options: experienceLevels,
                label: "Experience",
              },
              {
                name: "employment",
                options: employmentTypes,
                label: "Employment type",
              },
              { name: "location", options: locations, label: "Location" },
              { name: "domain", options: domains, label: "Domain" },
            ].map((dropdown) => (
              <div key={dropdown.name} className="relative">
                <button
                  className="bg-gray-800 hover:bg-gray-700 transition-colors px-5 py-3 rounded-full flex items-center text-lg"
                  onClick={() => toggleDropdown(dropdown.name)}
                >
                  {dropdown.label} <ChevronDown className="ml-2" size={16} />
                </button>
                {openDropdown === dropdown.name && (
                  <div className="absolute mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                    {dropdown.options.map((option) => (
                      <div
                        key={typeof option === "object" ? option.label : option}
                        className="p-2 text-lg flex items-center"
                      >
                        {typeof option === "object" && option.color && (
                          <span
                            className={`w-3 h-3 rounded-full ${option.color} mr-2`}
                          ></span>
                        )}
                        {typeof option === "object" ? option.label : option}
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
                  <JobCard jobs={companyJobs} />
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
