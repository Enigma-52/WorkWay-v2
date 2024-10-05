import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import JobCard from "../components/JobCard"; // Assuming you save the JobCard component in the same directory
import RecentApplications from "../components/RecentApplications";

const HomePage = () => {
  // State for tracking which dropdown is open
  const [openDropdown, setOpenDropdown] = useState("");

  // Sample job data to mock the real job data
  const mockJobs = [
    {
      id: "1",
      text: "Senior Software Engineer (Frontend)",
      createdAt: "2024-09-28T13:00:00Z",
      hostedUrl: "#",
      categories: { location: "Poland - Remote" },
    },
    {
      id: "2",
      text: "Backend Developer",
      createdAt: "2024-09-26T10:00:00Z",
      hostedUrl: "#",
      categories: { location: "Remote - USA" },
    },
    {
      id: "3",
      text: "Full-Stack Engineer",
      createdAt: "2024-09-25T14:30:00Z",
      hostedUrl: "#",
      categories: { location: "Worldwide - Remote" },
    },
  ];

  // Mock companies for each job
  const companies = ["Userlane GmbH", "TechCorp", "InnoTech"];

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

  // Function to handle dropdown toggling
  const toggleDropdown = (dropdown: string) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(""); // Close if it's already open
    } else {
      setOpenDropdown(dropdown); // Open the selected one
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
            6624 active jobs
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
            {/* Experience Dropdown */}
            <div className="relative">
              <button
                className="bg-gray-800 hover:bg-gray-700 transition-colors px-5 py-3 rounded-full flex items-center text-lg"
                onClick={() => toggleDropdown("experience")}
              >
                Experience <ChevronDown className="ml-2" size={16} />
              </button>
              {openDropdown === "experience" && (
                <div className="absolute mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                  {experienceLevels.map((level) => (
                    <div
                      key={level.label}
                      className="flex items-center p-2 text-lg"
                    >
                      <span
                        className={`w-3 h-3 rounded-full ${level.color} mr-2`}
                      ></span>
                      {level.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Employment Type Dropdown */}
            <div className="relative">
              <button
                className="bg-gray-800 hover:bg-gray-700 transition-colors px-5 py-3 rounded-full flex items-center text-lg"
                onClick={() => toggleDropdown("employment")}
              >
                Employment type <ChevronDown className="ml-2" size={16} />
              </button>
              {openDropdown === "employment" && (
                <div className="absolute mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                  {employmentTypes.map((type) => (
                    <div key={type} className="p-2 text-lg">
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Dropdown */}
            <div className="relative">
              <button
                className="bg-gray-800 hover:bg-gray-700 transition-colors px-5 py-3 rounded-full flex items-center text-lg"
                onClick={() => toggleDropdown("location")}
              >
                Location <ChevronDown className="ml-2" size={16} />
              </button>
              {openDropdown === "location" && (
                <div className="absolute mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                  {locations.map((location) => (
                    <div key={location} className="p-2 text-lg">
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Domain Dropdown */}
            <div className="relative">
              <button
                className="bg-gray-800 hover:bg-gray-700 transition-colors px-5 py-3 rounded-full flex items-center text-lg"
                onClick={() => toggleDropdown("domain")}
              >
                Domain <ChevronDown className="ml-2" size={16} />
              </button>
              {openDropdown === "domain" && (
                <div className="absolute mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                  {domains.map((domain) => (
                    <div key={domain} className="p-2 text-lg">
                      {domain}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 p-6">
              <h3 className="text-2xl font-semibold mb-4">Job Listings</h3>
              <div className="space-y-4">
                {mockJobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={{
                      ...job,
                      createdAt: new Date(job.createdAt).toISOString(),
                    }}
                    company={companies[index]}
                  />
                ))}
              </div>
            </div>
            <RecentApplications />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
