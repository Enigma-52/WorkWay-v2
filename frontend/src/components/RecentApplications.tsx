import React, { useState, useEffect } from "react";
import { Activity } from "lucide-react";

type ActivityType = "Application" | "Signup" | "Alert";

interface ActivityItem {
  time: string;
  role: string;
  company: string;
  location: string;
  type: ActivityType;
}

const RecentApplications = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100); // Adjust this value based on when you want the sticky effect to start
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activities: ActivityItem[] = [
    {
      time: "1m",
      role: "Social Media Lead",
      company: "Fabric of Truth",
      location: "Remote",
      type: "Application",
    },
    {
      time: "3m",
      role: "Backend Developer",
      company: "Inflection.io",
      location: "SF",
      type: "Alert",
    },
    {
      time: "9m",
      role: "React Native Dev",
      company: "ThirstySprout",
      location: "NY",
      type: "Application",
    },
    {
      time: "9m",
      role: "SE Intern",
      company: "",
      location: "",
      type: "Signup",
    },
  ];

  const getTagStyle = (type: ActivityType): string => {
    const styles = {
      Application:
        "bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Signup:
        "bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-400 border-blue-500/20",
      Alert:
        "bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-400 border-amber-500/20",
    };
    return styles[type];
  };

  const formatActivity = (activity: ActivityItem): string => {
    switch (activity.type) {
      case "Application":
        return `Someone applied to ${activity.role} at ${activity.company} in ${activity.location}`;
      case "Signup":
        return "Someone signed up on Workway";
      case "Alert":
        return `Someone set alert for ${activity.role}`;
      default:
        return "";
    }
  };

  return (
    <div
      className={`bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full shadow-xl shadow-purple-500/5
        transition-all duration-300 lg:sticky ${
          isSticky ? "lg:top-4" : "lg:top-4"
        }
        max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent`}
    >
      <div className="sticky top-0 z-20 p-8 border-b border-white/10 bg-gray-900/95 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-white flex items-center bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            <Activity className="text-white mr-3" size={24} />
            Recent Activities
          </h3>
          <div className="flex items-center space-x-2 text-sm bg-white/5 px-3 py-2 rounded-full">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-emerald-400">Live</span>
          </div>
        </div>
      </div>

      <div className="text-left divide-y divide-white/[0.06] relative">
        {activities.map((item, i) => (
          <div
            key={i}
            className="p-6 hover:bg-white/[0.02] transition-all duration-300 group relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${getTagStyle(
                    item.type
                  )}`}
                >
                  {item.type}
                </span>
                <span className="text-white/40 text-sm">{item.time} ago</span>
              </div>

              <p className="mt-3 text-base text-white/70">
                {formatActivity(item)}
              </p>
            </div>
            <div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 
              group-hover:from-purple-500/[0.02] group-hover:via-purple-500/[0.02] group-hover:to-purple-500/0 
              transition-all duration-500"
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentApplications;
