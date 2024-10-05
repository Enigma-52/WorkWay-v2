import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Calendar,
  Link2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  updatedAt: string;
  isExpired: boolean;
  absolute_url: string;
  location: string;
  source: string;
  company?: string;
}

interface CompanyJobs {
  company: string;
  data: Array<{ data: Job[] }>;
}

interface JobCardProps {
  jobs: CompanyJobs[];
  itemsPerPage?: number;
}

const JobCard: React.FC<JobCardProps> = ({ jobs, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [flattenedJobs, setFlattenedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const flattened = jobs.flatMap((companyJob) => {
      let jobsData: Job[] = [];

      if (
        Array.isArray(companyJob.data) &&
        companyJob.data.length > 0 &&
        Array.isArray(companyJob.data[0].data)
      ) {
        jobsData = companyJob.data[0].data;
      } else {
        console.warn(
          `Unexpected data structure for company ${companyJob.company}`
        );
        return [];
      }

      return jobsData.map((job) => ({
        ...job,
        company: companyJob.company,
      }));
    });

    setFlattenedJobs(flattened);
  }, [jobs]);

  const totalPages = Math.ceil(flattenedJobs.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedJobs = flattenedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {paginatedJobs.map((job) => (
        <div
          key={job.id}
          className="bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-gray-750 hover:border-green-500 hover:border-2 mb-6 flex justify-between items-start"
        >
          <div className="flex-grow">
            <div className="flex items-center mb-3">
              <img
                src={`https://logo.clearbit.com/${
                  job.company?.split(" ")[0]
                }.com`}
                alt={job.company}
                className="w-12 h-12 rounded-full object-cover mr-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/48?text=Logo";
                }}
              />
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {job.title}
                </h3>
                <p className="text-purple-400 text-lg">{job.company}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center">
                <MapPin size={16} className="mr-2" />
                {job.location || "Location not specified"}
              </span>
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center">
                <Briefcase size={16} className="mr-2" />
                {job.source}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm mb-3">
              Posted on {new Date(job.updatedAt).toLocaleDateString()}
            </p>
            <a
              href={job.absolute_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-base font-semibold transition-colors"
            >
              Apply Now
            </a>
          </div>
        </div>
      ))}

      {/* Pagination controls */}
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
    </>
  );
};

export default JobCard;
