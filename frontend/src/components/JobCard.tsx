import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Briefcase,
  MapPin,
  Code,
  GraduationCap,
  Building,
  Check,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoginModal from "./LoginModal";

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
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
    } catch (error) {
      console.error("Failed to save application:", error);
    }
  };

  function getRelativeTime(date: string) {
    const updatedTime = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - updatedTime.getTime()) / 1000
    );

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (days < 30) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    }
  }

  return (
    <>
      <div className="space-y-4">
        {paginatedJobs.map((job) => (
          <div
            key={job.id}
            className="p-6 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg hover:border-purple-500/50 transition-all duration-300"
          >
            {/* Job Card Content */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
              {/* Left side - Job info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-700/50 overflow-hidden flex-shrink-0">
                  <img
                    src={`https://logo.clearbit.com/${job.company
                      .split(" ")[0]
                      .toLowerCase()}.com`}
                    alt={job.company}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/48?text=Logo";
                    }}
                  />
                </div>

                <div>
                  <h3 className="text-left text-xl font-semibold text-white mb-1 hover:text-purple-400 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-left text-purple-400 font-medium">
                    {job.company}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-gray-700 text-gray-200">
                      <MapPin size={14} />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-gray-700 text-gray-200">
                      <Building size={14} />
                      {job.source}
                    </span>
                    {job.experienceLevel && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-purple-500/20 text-purple-300">
                        <GraduationCap size={14} />
                        {job.experienceLevel}
                      </span>
                    )}
                    {job.employmentType && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-blue-500/20 text-blue-300">
                        <Briefcase size={14} />
                        {job.employmentType}
                      </span>
                    )}
                    {job.domain && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-green-500/20 text-green-300">
                        <Code size={14} />
                        {job.domain}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex flex-col items-end gap-2">
                <span className="text-gray-400 text-sm">
                  Posted {getRelativeTime(job.updatedAt)}
                </span>

                {applicationStatus[job.id] === "applied" ? (
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-md cursor-not-allowed">
                      <Check size={16} />
                      Applied
                    </button>
                    <button
                      onClick={() => handleResetApplication(job.id)}
                      className="p-2 text-gray-400 hover:text-white bg-gray-700/50 rounded-md transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : applicationStatus[job.id] === "skipped" ? (
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-md cursor-not-allowed">
                      <X size={16} />
                      Skipped
                    </button>
                    <button
                      onClick={() => handleResetApplication(job.id)}
                      className="p-2 text-gray-400 hover:text-white bg-gray-700/50 rounded-md transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : applyingJobs[job.id] ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApplied(job.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                    >
                      <Check size={16} />
                      Applied?
                    </button>
                    <button
                      onClick={() => handleSkip(job.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                      <X size={16} />
                      Skip
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(job)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors whitespace-nowrap"
                  >
                    <ExternalLink size={16} />
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No jobs match your filters.</p>
        </div>
      )}

      {jobs.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700/50 rounded-md transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700/50 rounded-md transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => {
            setShowLoginModal(false);
            setSelectedJobId(null);
          }}
          onLogin={() => {
            setIsLoggedIn(true);
            setShowLoginModal(false);
            if (selectedJobId) {
              handleApplied(selectedJobId);
              setSelectedJobId(null);
            }
          }}
        />
      )}
    </>
  );
};

export default JobCard;
