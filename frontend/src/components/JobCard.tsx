import React from "react";

// A utility function to format job data as per the requirement
const formatJobData = (
  job: {
    id: string;
    text: string;
    createdAt: string;
    hostedUrl: string;
    categories?: { location: string };
  },
  company: string
) => ({
  id: job.id,
  title: job.text,
  company: company.charAt(0).toUpperCase() + company.slice(1),
  updatedAt: job.createdAt,
  isExpired: false,
  absolute_url: job.hostedUrl,
  location: job.categories?.location,
  source: "Lever", // Static source, you can update this dynamically if needed
});

const JobCard = ({
  job,
  company,
}: {
  job: {
    id: string;
    text: string;
    createdAt: string;
    hostedUrl: string;
    categories?: { location: string };
  };
  company: string;
}) => {
  const formattedJob = formatJobData(job, company);

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg transition-transform duration-300 transform hover:scale-105 max-w-3xl">
      <div className="flex">
        {/* Company Logo */}
        <img
          src={`https://logo.clearbit.com/${
            formattedJob.company.split(" ")[0]
          }.com`}
          alt={formattedJob.company}
          className="w-12 h-12 rounded-full mr-6"
        />

        <div className="flex-grow">
          {/* Job Title and Company Name */}
          <div className="text-left">
            {/* Job Title */}
            <h3 className="text-2xl font-semibold text-white mb-1">
              {formattedJob.title}
            </h3>

            {/* Company Name */}
            <p className="text-gray-400 text-sm mb-4">{formattedJob.company}</p>
          </div>

          {/* Tags: Location and Source */}
          <div className="flex flex-wrap gap-3 mb-6">
            {formattedJob.location && (
              <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                {formattedJob.location}
              </span>
            )}
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
              Source: {formattedJob.source}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
