import React, { useEffect, useState } from "react";
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
} from "lucide-react";

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

// Type guard to check if job is from Lever
const isLeverJob = (job: Job): job is LeverJob => {
  return job.source.toLowerCase() === "lever";
};

const JobDetailsPage = () => {
  const [job, setJob] = useState<Job | null>(null);

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
    const params = new URLSearchParams(window.location.search);
    const jobParam = params.get("job");
    if (jobParam) {
      try {
        // First try to decode the entire string
        let decodedString = jobParam;
        try {
          decodedString = decodeURIComponent(jobParam);
        } catch (e) {
          // If decoding fails, try to decode individual components
          decodedString = jobParam.replace(/\+/g, " ");
        }

        // Now parse the JSON
        const parsedJob = JSON.parse(decodedString);
        setJob(parsedJob);
      } catch (error) {
        console.error("Error parsing job data:", error);
        setJob(null);
      }
    }
  }, []);

  // Show loading or error state if no job data
  if (!job || !job.description) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading job details...</h2>
          <a
            href="/"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Return to job listings
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 opacity-90 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent animate-pulse -z-10" />

      <div className="max-w-6xl mx-auto p-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Jobs
        </a>

        <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:border-purple-500/30 transition-all duration-300 animate-fadeIn">
          {/* Header Section */}
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
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-gray-700/50 text-white/90">
                  <MapPin size={16} />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-gray-700/50 text-white/90">
                  <Building size={16} />
                  {job.source}
                </span>
                {job.experienceLevel && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-purple-500/20 text-purple-300">
                    <GraduationCap size={16} />
                    {job.experienceLevel}
                  </span>
                )}
                {isLeverJob(job) && job.workplaceType && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-indigo-500/20 text-indigo-300">
                    <Building2 size={16} />
                    {job.workplaceType}
                  </span>
                )}
                {isLeverJob(job) && job.salaryRange && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-green-500/20 text-green-300">
                    <DollarSign size={16} />
                    {formatSalary(
                      job.salaryRange.min,
                      job.salaryRange.currency
                    )}{" "}
                    -{" "}
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
                    <Briefcase size={16} />
                    {job.employmentType}
                  </span>
                )}
                {job.domain && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-green-500/20 text-green-300">
                    <Code size={16} />
                    {job.domain}
                  </span>
                )}
              </div>
            </div>

            <div>
              <a
                href={job.absolute_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 active:scale-95"
              >
                <ExternalLink size={20} />
                Apply Now
              </a>
            </div>
          </div>

          {/* Job Details */}
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

            {/* Common description section */}
            <div className="prose prose-invert max-w-none mt-8">
              <div
                dangerouslySetInnerHTML={{ __html: job.description }}
                className={`
                  prose-headings:text-white 
                  prose-headings:font-semibold 
                  prose-h3:text-xl 
                  prose-h3:mt-8 
                  prose-h3:mb-4
                  prose-p:text-gray-200 
                  prose-p:leading-relaxed 
                  prose-p:my-4
                  prose-p:first-of-type:mt-0
                  prose-ul:list-disc 
                  prose-ul:pl-6 
                  prose-ul:my-4
                  prose-li:text-gray-200 
                  prose-li:my-2
                  prose-strong:text-white
                  prose-a:text-purple-400 
                  prose-a:no-underline 
                  hover:prose-a:text-purple-300
                  [&_.content-intro]:mb-6
                  [&_.content-conclusion]:mt-8
                  [&_p:empty]:hidden
                  [&_h3:empty]:hidden
                  [&_p:has(br:only-child)]:hidden
                  [&_p:has(span:empty)]:hidden
                  [&_p:has(strong:only-child):not(:has(strong:not(:empty)))]:hidden
                  [&_.content-conclusion_ul]:mt-4
                  [&_.content-conclusion_li]:my-2
                  [&_li>span]:text-gray-200
                `}
              />
            </div>

            {/* Lever-specific additional content */}
            {isLeverJob(job) && (
              <div className="prose prose-invert max-w-none mt-8">
                {job.lists?.map((list, index) => (
                  <div key={index} className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">{list.text}</h3>
                    <div
                      dangerouslySetInnerHTML={{ __html: list.content }}
                      className="list-disc pl-6"
                    />
                  </div>
                ))}
                {job.additional && (
                  <div className="mt-8">
                    <div dangerouslySetInnerHTML={{ __html: job.additional }} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default JobDetailsPage;
