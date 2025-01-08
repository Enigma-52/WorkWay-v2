import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Code,
  GraduationCap,
  Building,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface BaseJob {
  id: string | number;
  title: string;
  company: string;
  updatedAt: string;
  isExpired: boolean;
  absolute_url: string;
  location: string;
  source: string;
  description: string;
  experienceLevel?: string;
  employmentType?: string;
  domain?: string;
}

interface GreenhouseJob extends BaseJob {
  source: "Greenhouse";
}

interface LeverJob extends BaseJob {
  source: "Lever";
  additional?: string;
  lists?: Array<{ text: string; content: string }>;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    interval: string;
  };
  workplaceType?: string;
}

type Job = GreenhouseJob | LeverJob;

const isLeverJob = (job: Job): job is LeverJob => {
  return job.source.toLowerCase() === "lever";
};

const JobDetailsPage = () => {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [applicationState, setApplicationState] = useState<
    "initial" | "pending" | "applied" | "skipped"
  >("initial");

  const navigate = useNavigate();

  const handleApplyClick = async () => {
    setApplicationState("pending");
    window.open(job?.absolute_url, "_blank");
  };

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleApplicationChoice = async (choice: "applied" | "skipped") => {
    if (choice === "applied") {
      try {
        console.log(user);
        const response = await fetch(`${API_BASE_URL}/applications/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job: job,
            user: user,
            status: "applied",
          }),
        });

        if (response.ok) {
          setApplicationState("applied");
        } else {
          throw new Error("Failed to record application");
        }
      } catch (error) {
        console.error("Error recording application:", error);
        setApplicationState("initial");
      }
    } else {
      setApplicationState("initial");
    }
  };

  const renderApplyButton = () => {
    switch (applicationState) {
      case "initial":
        return (
          <button
            onClick={handleApplyClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 active:scale-95"
          >
            <ExternalLink size={20} />
            Apply Now
          </button>
        );

      case "pending":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleApplicationChoice("applied")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-full font-semibold transition-all"
            >
              <CheckCircle size={20} />
              Applied
            </button>
            <button
              onClick={() => handleApplicationChoice("skipped")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-full font-semibold transition-all"
            >
              <XCircle size={20} />
              Skipped
            </button>
          </div>
        );

      case "applied":
        return (
          <div className="text-center">
            <button
              disabled
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 cursor-not-allowed rounded-full font-semibold opacity-75"
            >
              <CheckCircle size={20} />
              Applied
            </button>
            <p className="text-sm text-gray-400 mt-2">Application recorded</p>
          </div>
        );

      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobParam = params.get("job");
    if (jobParam) {
      try {
        let decodedString = jobParam;
        try {
          decodedString = decodeURIComponent(jobParam);
        } catch (e) {
          decodedString = jobParam.replace(/\+/g, " ");
        }
        const parsedJob = JSON.parse(decodedString);
        setJob(parsedJob);
      } catch (error) {
        console.error("Error parsing job data:", error);
        setJob(null);
      }
    }
  }, []);

  if (!job || !job.description) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Loading job details...
            </h2>
            <a
              href="/"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Return to job listings
            </a>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

        <div className="max-w-6xl mx-auto">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Jobs
          </a>

          <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:border-purple-500/30 transition-all duration-300 mb-16">
            {/* Job Header */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={`https://logo.clearbit.com/${job.company
                    .split(" ")[0]
                    .toLowerCase()}.com`}
                  alt={job.company}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/32?text=Logo";
                  }}
                />
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {job.title}
                </h1>
                <p className="text-xl text-purple-400 font-medium mb-4">
                  {job.company}
                </p>

                <div className="flex flex-wrap gap-3">
                  {/* Job Tags */}
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-gray-700/50 text-white/90">
                    <MapPin size={16} /> {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-gray-700/50 text-white/90">
                    <Building size={16} /> {job.source}
                  </span>
                  {job.experienceLevel && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-purple-500/20 text-purple-300">
                      <GraduationCap size={16} /> {job.experienceLevel}
                    </span>
                  )}
                  {isLeverJob(job) && job.workplaceType && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-indigo-500/20 text-indigo-300">
                      <Building2 size={16} />{" "}
                      {job.workplaceType.charAt(0).toUpperCase() +
                        job.workplaceType.slice(1)}
                    </span>
                  )}
                  {isLeverJob(job) && job.salaryRange && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-green-500/20 text-green-300">
                      <DollarSign size={16} />
                      {formatSalary(
                        job.salaryRange.min,
                        job.salaryRange.currency
                      )}{" "}
                      -
                      {formatSalary(
                        job.salaryRange.max,
                        job.salaryRange.currency
                      )}
                      {job.salaryRange.interval === "per-year-salary"
                        ? "/year"
                        : ""}
                    </span>
                  )}
                  {job.employmentType && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-blue-500/20 text-blue-300">
                      <Briefcase size={16} /> {job.employmentType}
                    </span>
                  )}
                  {job.domain && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-green-500/20 text-green-300">
                      <Code size={16} /> {job.domain}
                    </span>
                  )}
                </div>
              </div>

              <div>{renderApplyButton()}</div>
            </div>

            {/* Job Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-white/80">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Posted {new Date(job.updatedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {job.isExpired ? "Expired" : "Active"}
                </span>
              </div>

              <div
                className="text-lg max-w-none mt-8 text-gray-200"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />

              {isLeverJob(job) && (
                <div className="prose prose-invert max-w-none mt-10">
                  {job.lists?.map((list, index) => (
                    <div key={index} className="mt-8">
                      <h3 className="text-lg font-semibold mb-6">
                        {list.text}
                      </h3>
                      <div
                        dangerouslySetInnerHTML={{ __html: list.content }}
                        className=" text-lg list-disc pl-8"
                      />
                    </div>
                  ))}
                  {job.additional && (
                    <div className="mt-10">
                      <div
                        dangerouslySetInnerHTML={{ __html: job.additional }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default JobDetailsPage;
