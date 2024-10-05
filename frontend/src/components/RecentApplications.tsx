import React from "react";

const RecentApplications = () => {
  const recentActivities = [
    {
      timeAgo: "1 MINUTE AGO",
      jobTitle: "Social Media Lead, Crypto, Blockchain (freelancer)",
      company: "Fabric of Truth, Inc",
    },
    {
      timeAgo: "3 MINUTES AGO",
      jobTitle: "Backend Software Developer / Software Engineer",
      company: "Inflection.io",
    },
    {
      timeAgo: "9 MINUTES AGO",
      jobTitle: "React Native Front-end Developer",
      company: "ThirstySprout",
    },
    {
      timeAgo: "9 MINUTES AGO",
      jobTitle: "Software Engineer Intern",
      company: "Google",
    },
  ];

  return (
    <div className="bg-black bg-opacity-50 p-6 rounded-xl shadow-lg transition-transform duration-300 transform hover:scale-105">
      <h3 className="text-2xl font-semibold text-white mb-6">
        Recent Activity
      </h3>
      <div className="space-y-6">
        {recentActivities.map((activity, index) => (
          <div key={index} className="text-left">
            <p className="text-purple-500 text-sm font-semibold">
              {activity.timeAgo}
            </p>
            <p className="text-gray-400">
              Someone applied for{" "}
              <span className="font-semibold text-white">
                {activity.jobTitle}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-white">
                {activity.company}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentApplications;
