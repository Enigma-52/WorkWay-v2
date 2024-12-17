import React, { useState } from "react";
import {
  Briefcase,
  Search,
  Calendar,
  BarChart,
  Building,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  DollarSign,
  MapPin,
} from "lucide-react";

interface Application {
  id: number;
  company: string;
  position: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  appliedDate: string;
  location: string;
  salary: string;
  nextStep?: string;
  logo?: string;
  type: string;
  lastUpdated: string;
}

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      company: "TechCorp",
      position: "Senior Frontend Developer",
      status: "Interview",
      appliedDate: "2024-02-15",
      location: "Remote",
      salary: "$120k - $150k",
      nextStep: "Technical Interview on Mar 20",
      type: "Full-time",
      lastUpdated: "2 days ago",
    },
    {
      id: 2,
      company: "DataFlow",
      position: "Full Stack Engineer",
      status: "Applied",
      appliedDate: "2024-02-10",
      location: "New York, NY",
      salary: "$130k - $160k",
      type: "Full-time",
      lastUpdated: "5 days ago",
    },
    {
      id: 3,
      company: "CloudTech",
      position: "DevOps Engineer",
      status: "Offer",
      appliedDate: "2024-02-01",
      location: "San Francisco, CA",
      salary: "$140k - $170k",
      nextStep: "Salary Negotiation",
      type: "Full-time",
      lastUpdated: "1 day ago",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const stats = {
    total: applications.length,
    interview: applications.filter((app) => app.status === "Interview").length,
    offer: applications.filter((app) => app.status === "Offer").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
  };

  const getStatusIcon = (status: Application["status"]) => {
    switch (status) {
      case "Applied":
        return <Clock className="text-blue-400" size={18} />;
      case "Interview":
        return <AlertCircle className="text-yellow-400" size={18} />;
      case "Offer":
        return <CheckCircle className="text-green-400" size={18} />;
      case "Rejected":
        return <XCircle className="text-red-400" size={18} />;
    }
  };

  const getStatusStyle = (status: Application["status"]) => {
    switch (status) {
      case "Applied":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Interview":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "Offer":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "Rejected":
        return "bg-red-500/10 text-red-400 border-red-500/30";
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Gradient backgrounds with animation */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 opacity-90 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent animate-pulse -z-10" />

      <div className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="relative mb-12 animate-fadeIn">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold flex items-center mb-2 hover:text-purple-300 transition-colors">
                <Briefcase className="mr-4 text-purple-400" size={32} />
                Applications Tracker
              </h1>
              <p className="text-white/80 ml-12">
                Track and manage your job applications
              </p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-full font-semibold flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 active:scale-95">
              <Search size={20} className="mr-2" />
              Add Application
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Briefcase,
              title: "Total Applications",
              value: stats.total,
            },
            {
              icon: AlertCircle,
              title: "In Interview",
              value: stats.interview,
            },
            { icon: CheckCircle, title: "Offers", value: stats.offer },
            { icon: XCircle, title: "Rejected", value: stats.rejected },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
            >
              <div className="flex items-center mb-2">
                <stat.icon
                  className="text-purple-400 mr-2 group-hover:scale-110 transition-transform"
                  size={20}
                />
                <h3 className="font-semibold text-white">{stat.title}</h3>
              </div>
              <p className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                className="w-full bg-gray-800/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-white/50"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="bg-gray-800/30 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Applications List */}
        <div className="space-y-3">
          {applications.map((app, index) => (
            <div
              key={app.id}
              className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-lg hover:border-purple-500/30 transition-all duration-300 group animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                      <Building className="text-purple-400" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors flex items-center">
                        {app.position}
                        <span className="text-sm font-normal text-white/60 ml-2">
                          at {app.company}
                        </span>
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-white/80 text-sm flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {app.location}
                        </span>
                        <span className="text-white/80 text-sm flex items-center">
                          <DollarSign size={14} className="mr-1" />
                          {app.salary}
                        </span>
                        <span className="text-white/80 text-sm flex items-center">
                          <Calendar size={14} className="mr-1" />
                          Applied {app.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm border flex items-center ${getStatusStyle(
                        app.status
                      )}`}
                    >
                      {getStatusIcon(app.status)}
                      <span className="ml-1">{app.status}</span>
                    </span>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <ExternalLink size={18} className="text-white" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <ChevronDown size={18} className="text-white" />
                    </button>
                  </div>
                </div>
                {app.nextStep && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-sm text-white/80">
                      <span className="text-purple-400">Next Step:</span>{" "}
                      {app.nextStep}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default ApplicationsPage;
