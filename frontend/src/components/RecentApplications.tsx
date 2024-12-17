import React from "react";
import { Activity, Users, Clock } from "lucide-react";

const RecentApplications = () => {
  const recentActivities = [
    {
      timeAgo: "1 minute ago",
      jobTitle: "Social Media Lead",
      company: "Fabric of Truth",
      location: "Remote",
      type: "Freelance",
      userAvatar: "M", // First letter of random name for avatar
      action: "applied",
    },
    {
      timeAgo: "3 minutes ago",
      jobTitle: "Backend Developer",
      company: "Inflection.io",
      location: "San Francisco",
      type: "Full-time",
      userAvatar: "R",
      action: "saved",
    },
    {
      timeAgo: "9 minutes ago",
      jobTitle: "React Native Developer",
      company: "ThirstySprout",
      location: "New York",
      type: "Contract",
      userAvatar: "J",
      action: "applied",
    },
    {
      timeAgo: "9 minutes ago",
      jobTitle: "Software Engineer Intern",
      company: "Google",
      location: "Mountain View",
      type: "Internship",
      userAvatar: "A",
      action: "applied",
    },
  ];

  const getActionStyle = (action: string) => {
    switch (action) {
      case "applied":
        return "bg-green-500/10 text-green-400";
      case "saved":
        return "bg-blue-500/10 text-blue-400";
      default:
        return "bg-purple-500/10 text-purple-400";
    }
  };

  const getRandomColor = (letter: string) => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[letter.charCodeAt(0) % colors.length];
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Activity className="text-purple-400 mr-2" size={20} />
            Live Feed
          </h3>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-green-400 text-sm">Live</span>
          </div>
        </div>
        <p className="text-white/60 text-sm ml-7">See what others are doing</p>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-white/10">
        {recentActivities.map((activity, index) => (
          <div
            key={index}
            className="p-4 hover:bg-white/5 transition-colors duration-300 group"
          >
            <div className="flex items-start space-x-3">
              {/* User Avatar */}
              <div
                className={`w-8 h-8 rounded-full ${getRandomColor(
                  activity.userAvatar
                )} flex items-center justify-center text-white font-medium flex-shrink-0`}
              >
                {activity.userAvatar}
              </div>

              <div className="flex-1 min-w-0">
                {/* Action and Time */}
                <div className="flex items-center text-sm space-x-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${getActionStyle(
                      activity.action
                    )}`}
                  >
                    {activity.action}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/40 text-xs">
                    {activity.timeAgo}
                  </span>
                </div>

                {/* Job Details */}
                <p className="text-white/90 text-base font-medium truncate group-hover:text-purple-400 transition-colors">
                  {activity.jobTitle}
                </p>
                <p className="text-white/60 text-sm mt-0.5">
                  {activity.company} • {activity.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-center text-sm text-white/60">
          <Users size={16} className="mr-2" />
          <span>428 users active today</span>
        </div>
      </div>
    </div>
  );
};

export default RecentApplications;
