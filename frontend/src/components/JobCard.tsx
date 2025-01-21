import React, { useState, useEffect, useMemo } from "react";
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
  Building2,
  DollarSign,
  Eye,
  Flame,
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
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    interval: string;
  };
  workplaceType?: string;
  applicants?: number;
}

interface JobCardProps {
  jobs: Job[];
  itemsPerPage?: number;
}

const JobCard: React.FC<JobCardProps> = ({ jobs, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationStatus, setApplicationStatus] = useState<{
    [key: string]: "none" | "applied" | "skipped";
  }>({});
  const [applyingJobs, setApplyingJobs] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [viewedJobs, setViewedJobs] = useState<{ [key: string]: number }>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    const savedViewedJobs = localStorage.getItem("viewedJobs");
    if (savedViewedJobs) {
      setViewedJobs(JSON.parse(savedViewedJobs));
    }
  }, []);

  // Reset to first page when jobs array changes (e.g., when filters change)
  useEffect(() => {
    setCurrentPage(1);
    setApplyingJobs({}); // Reset applying state when jobs change
  }, [jobs]);

  // Calculate pagination details using useMemo
  const { totalPages, currentJobs } = useMemo(() => {
    const total = Math.max(1, Math.ceil(jobs.length / itemsPerPage));
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentItems = jobs.slice(start, end);

    return {
      totalPages: total,
      currentJobs: currentItems,
    };
  }, [jobs, currentPage, itemsPerPage]);

  // Load application statuses from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const savedStatuses = localStorage.getItem("applicationStatuses");
    if (savedStatuses) {
      setApplicationStatus(JSON.parse(savedStatuses));
    }
  }, []);

  // Save application statuses to localStorage
  useEffect(() => {
    localStorage.setItem(
      "applicationStatuses",
      JSON.stringify(applicationStatus)
    );
  }, [applicationStatus]);

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

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

  const formatSalary = (amount: number, currency: string) => {
    if (currency === "INR") {
      const lakhs = (amount / 100000).toFixed(1);
      return `₹${lakhs} L`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = (job: Job) => {
    const timestamp = Date.now();
    const updatedViewedJobs = {
      ...viewedJobs,
      [job.id]: timestamp,
    };
    setViewedJobs(updatedViewedJobs);
    localStorage.setItem("viewedJobs", JSON.stringify(updatedViewedJobs));

    const jobString = JSON.stringify(job);
    window.open(`/job-details?job=${encodeURIComponent(jobString)}`, "_blank");
  };

  const getViewedStatus = (jobId: string) => {
    if (!viewedJobs[jobId]) {
      return null;
    }

    const viewedTime = new Date(viewedJobs[jobId]);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - viewedTime.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `Viewed ${
        diffInHours === 0
          ? "recently"
          : `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`
      }`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Viewed ${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    }
  };

  const isLeverJob = (job: Job) => {
    return job.source.toLowerCase() === "lever";
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setApplyingJobs({});
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
        {currentJobs.map((job) => (
          <div
            key={job.id}
            className="p-6 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-700/50 overflow-hidden flex-shrink-0">
                  <img
                    src={`https://logo.clearbit.com/${job.company
                      .split(" ")[0]
                      .toLowerCase()}.com`}
                    alt={job.company}
                    className="w-full h-full object-contain"
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
                    {isLeverJob(job) && job.workplaceType && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-indigo-500/20 text-indigo-300">
                        <Building2 size={16} />
                        {job.workplaceType.charAt(0).toUpperCase() +
                          job.workplaceType.slice(1)}
                      </span>
                    )}
                    {isLeverJob(job) && job.salaryRange && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-green-500/20 text-green-300">
                        {formatSalary(
                          job.salaryRange.min,
                          job.salaryRange.currency
                        )}
                        {" - "}
                        {formatSalary(
                          job.salaryRange.max,
                          job.salaryRange.currency
                        )}
                        {job.salaryRange.interval === "per-year-salary"
                          ? "/year"
                          : job.salaryRange.interval === "per-month-salary"
                          ? "/month"
                          : job.salaryRange.interval === "per-week-salary"
                          ? "/week"
                          : job.salaryRange.interval === "per-day-salary"
                          ? "/day"
                          : job.salaryRange.interval === "per-hour-salary"
                          ? "/hour"
                          : ""}
                      </span>
                    )}
                    {job?.applicants !== undefined && job.applicants >= 20 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-red-500/20 text-white-300 ml-2">
                        <Flame size={20} /> Popular
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-gray-400 text-sm">
                  Posted {getRelativeTime(job.updatedAt)}
                </span>

                <button
                  onClick={() => {
                    handleViewDetails(job);
                    const jobString = JSON.stringify(job);
                    window.open(
                      `/job-details?job=${encodeURIComponent(jobString)}`,
                      "_blank"
                    );
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors whitespace-nowrap"
                >
                  <ExternalLink size={16} />
                  View Details
                </button>
                {getViewedStatus(job.id) && (
                  <div className="absolute -top-3 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-700/90 text-gray-300">
                    <Eye size={12} className="text-purple-400" />
                    {getViewedStatus(job.id)}
                  </div>
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

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, jobs.length)} of{" "}
              {jobs.length} jobs
            </span>
          </div>

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
