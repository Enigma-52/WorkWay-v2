import React, { useState, useEffect } from "react";
import axios from "axios";
import LoginModal from "./LoginModal";
import {
  Briefcase,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Code,
  GraduationCap,
  Building,
  Check,
  X,
} from "lucide-react";

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

interface JobCardProps {
  jobs: Job[];
  itemsPerPage?: number;
}

const JobCard: React.FC<JobCardProps> = ({ jobs, itemsPerPage = 4 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationStatus, setApplicationStatus] = useState<{
    [key: string]: "none" | "applied" | "skipped";
  }>({});
  const [applyingJobs, setApplyingJobs] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const savedStatuses = localStorage.getItem("applicationStatuses");
    if (savedStatuses) {
      setApplicationStatus(JSON.parse(savedStatuses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "applicationStatuses",
      JSON.stringify(applicationStatus)
    );
  }, [applicationStatus]);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApply = (job: Job) => {
    window.open(job.absolute_url, "_blank");
    setApplyingJobs((prev) => ({ ...prev, [job.id]: true }));
  };

  const handleApplied = (jobId: string) => {
    if (!isLoggedIn) {
      setSelectedJobId(jobId);
      setShowLoginModal(true);
    } else {
      setApplicationStatus((prev) => ({ ...prev, [jobId]: "applied" }));
      setApplyingJobs((prev) => ({ ...prev, [jobId]: false }));
      sendApplicationToServer(jobId);
      alert("Added to applications!");
    }
  };

  const handleSkip = (jobId: string) => {
    setApplicationStatus((prev) => ({ ...prev, [jobId]: "skipped" }));
    setApplyingJobs((prev) => ({ ...prev, [jobId]: false }));
  };

  const handleResetApplication = (jobId: string) => {
    setApplicationStatus((prev) => ({ ...prev, [jobId]: "none" }));
    setApplyingJobs((prev) => ({ ...prev, [jobId]: false }));
  };

  const sendApplicationToServer = async (jobId: string) => {
    try {
      await axios.post("/api/applications", { jobId });
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error("Failed to save application:", error);
      // Handle error (e.g., show an error message)
    }
  };
  const getRelativeTimeString = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - postDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }
  };

  const getExperienceLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "junior":
        return "bg-green-500";
      case "mid-level":
        return "bg-yellow-500";
      case "senior":
        return "bg-orange-500";
      case "lead":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDomainColor = (domain: string) => {
    switch (domain.toLowerCase()) {
      case "frontend":
        return "border-blue-500";
      case "backend":
        return "border-green-500";
      case "fullstack":
        return "border-purple-500";
      case "android":
        return "border-emerald-500";
      case "ios":
        return "border-gray-500";
      case "devops":
        return "border-orange-500";
      case "data science":
        return "border-yellow-500";
      default:
        return "border-gray-500";
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "full-time":
        return "border-blue-500";
      case "part-time":
        return "border-green-500";
      case "contract":
        return "border-yellow-500";
      case "internship":
        return "border-purple-500";
      default:
        return "border-gray-500";
    }
  };

  const renderTag = (
    icon: React.ReactNode,
    text: string,
    type: "experience" | "domain" | "employment" | "other"
  ) => {
    let tagClass =
      "px-3 py-1 rounded-full text-sm flex items-center mr-2 mb-2 ";
    switch (type) {
      case "experience":
        tagClass += `${getExperienceLevelColor(text)} text-white`;
        break;
      case "domain":
        tagClass += `bg-gray-700 text-gray-300 border-2 ${getDomainColor(
          text
        )}`;
        break;
      case "employment":
        tagClass += `bg-gray-700 text-gray-300 border-2 ${getEmploymentTypeColor(
          text
        )}`;
        break;
      default:
        tagClass += "bg-gray-700 text-gray-300 border border-gray-600";
    }
    return (
      <span className={tagClass}>
        {icon}
        <span className="ml-2">{text}</span>
      </span>
    );
  };

  return (
    <>
      {paginatedJobs.map((job) => (
        <div
          key={job.id}
          className="bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-gray-750 hover:border-green-500 hover:border-2 mb-6 w-full"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <img
                src={`https://logo.clearbit.com/${job.company
                  .split(" ")[0]
                  .toLowerCase()}.com`}
                alt={job.company}
                className="w-12 h-12 rounded-full object-cover mr-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/48?text=Logo";
                }}
              />
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {job.title}
                </h3>
                <p className="text-purple-400 text-lg">{job.company}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm mb-2">
                Posted {getRelativeTimeString(job.updatedAt)}
              </div>
              {applicationStatus[job.id] === "applied" ? (
                <div>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors mr-2"
                    disabled
                  >
                    <Check size={16} className="inline mr-2" />
                    Applied
                  </button>
                  <button
                    onClick={() => handleResetApplication(job.id)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  >
                    Reset
                  </button>
                </div>
              ) : applicationStatus[job.id] === "skipped" ? (
                <div>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors mr-2"
                    disabled
                  >
                    <X size={16} className="inline mr-2" />
                    Skipped
                  </button>
                  <button
                    onClick={() => handleResetApplication(job.id)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  >
                    Reset
                  </button>
                </div>
              ) : applyingJobs[job.id] ? (
                <div>
                  <button
                    onClick={() => handleApplied(job.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors mr-2"
                  >
                    Applied?
                  </button>
                  <button
                    onClick={() => handleSkip(job.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  >
                    Skipped?
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => handleApply(job)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors mr-2"
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap mt-4">
            {renderTag(<MapPin size={16} />, job.location, "other")}
            {renderTag(<Building size={16} />, job.source, "other")}
            {job.experienceLevel &&
              renderTag(
                <GraduationCap size={16} />,
                job.experienceLevel,
                "experience"
              )}
            {job.employmentType &&
              renderTag(
                <Briefcase size={16} />,
                job.employmentType,
                "employment"
              )}
            {job.domain && renderTag(<Code size={16} />, job.domain, "domain")}
          </div>
        </div>
      ))}

      {jobs.length === 0 && (
        <p className="text-center text-gray-400">No jobs match your filters.</p>
      )}

      {jobs.length > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-gray-700 rounded-full disabled:opacity-50"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-white text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-700 rounded-full disabled:opacity-50"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => console.log("User logged in successfully")}
        />
      )}
    </>
  );
};

export default JobCard;
