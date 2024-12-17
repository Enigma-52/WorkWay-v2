import React, { useState } from "react";
import {
  Bell,
  Trash2,
  Edit2,
  Search,
  Briefcase,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

interface JobAlert {
  id: number;
  title: string;
  location: string;
  frequency: string;
  domains: string[];
  active: boolean;
}

interface NewJobAlert {
  title: string;
  location: string;
  frequency: string;
  domains: string[];
}

const JobAlertsPage = () => {
  const [alerts, setAlerts] = useState<JobAlert[]>([
    {
      id: 1,
      title: "Senior React Developer",
      location: "Remote",
      frequency: "Daily",
      domains: ["Frontend", "Full-stack"],
      active: true,
    },
    {
      id: 2,
      title: "DevOps Engineer",
      location: "New York",
      frequency: "Weekly",
      domains: ["DevOps"],
      active: true,
    },
  ]);

  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [newAlert, setNewAlert] = useState<NewJobAlert>({
    title: "",
    location: "",
    frequency: "Daily",
    domains: [],
  });

  const domains = [
    "Frontend",
    "Backend",
    "Full-stack",
    "DevOps",
    "Data Science",
    "Mobile",
  ];
  const frequencies = ["Daily", "Weekly", "Monthly"];

  const handleCreateAlert = () => {
    if (newAlert.title && newAlert.domains.length > 0) {
      setAlerts([
        ...alerts,
        { ...newAlert, id: alerts.length + 1, active: true },
      ]);
      setNewAlert({ title: "", location: "", frequency: "Daily", domains: [] });
      setShowCreateAlert(false);
    }
  };

  const toggleDomain = (domain: string) => {
    setNewAlert((prev: NewJobAlert) => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter((d) => d !== domain)
        : [...prev.domains, domain],
    }));
  };

  return (
    <div className="min-h-screen text-white">
      {/* Gradient backgrounds with animation */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800 to-purple-900" />

      <div className="max-w-6xl mx-auto p-8">
        {/* Animated Header Section */}
        <div className="relative mb-12 animate-fadeIn">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold flex items-center mb-2 hover:text-purple-300 transition-colors">
                <Bell
                  className="mr-4 text-purple-400 animate-bounce"
                  size={32}
                />
                Job Alerts
              </h1>
              <p className="text-white/80 ml-12">
                Stay updated with your dream job opportunities
              </p>
            </div>
            <button
              onClick={() => setShowCreateAlert(true)}
              className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-full font-semibold flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 active:scale-95"
            >
              <Bell size={20} className="mr-2" />
              Create New Alert
            </button>
          </div>
        </div>

        {/* Animated Stats Overview
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { icon: Bell, title: "Active Alerts", value: alerts.length },
            { icon: Briefcase, title: "Matching Jobs", value: 24 },
            { icon: AlertCircle, title: "New Today", value: 5 },
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
        </div> */}

        {/* Create Alert Modal with Animation */}
        {showCreateAlert && (
          <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-xl mb-8 shadow-xl overflow-hidden animate-slideIn">
            <div className="border-b border-white/10 p-4">
              <h2 className="text-xl font-semibold text-white">
                Create New Job Alert
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Form fields with animations */}
                {[
                  {
                    label: "Job Title",
                    type: "text",
                    value: newAlert.title,
                    key: "title",
                  },
                  {
                    label: "Location",
                    type: "text",
                    value: newAlert.location,
                    key: "location",
                  },
                ].map((field, index) => (
                  <div
                    key={index}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <label className="block text-sm font-medium mb-2 text-white/90">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      className="w-full bg-gray-900/50 rounded-lg px-4 py-2 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-white/50"
                      value={field.value}
                      onChange={(e) =>
                        setNewAlert({
                          ...newAlert,
                          [field.key]: e.target.value,
                        })
                      }
                      placeholder={`e.g. ${field.label}`}
                    />
                  </div>
                ))}

                <div
                  className="animate-fadeIn"
                  style={{ animationDelay: "200ms" }}
                >
                  <label className="block text-sm font-medium mb-2 text-white/90">
                    Alert Frequency
                  </label>
                  <select
                    className="w-full bg-gray-900/50 rounded-lg px-4 py-2 border border-white/10 focus:border-purple-500 focus:outline-none transition-all duration-300 text-white"
                    value={newAlert.frequency}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, frequency: e.target.value })
                    }
                  >
                    {frequencies.map((freq) => (
                      <option key={freq} value={freq} className="bg-gray-900">
                        {freq}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className="animate-fadeIn"
                  style={{ animationDelay: "300ms" }}
                >
                  <label className="block text-sm font-medium mb-2 text-white/90">
                    Domains
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {domains.map((domain) => (
                      <button
                        key={domain}
                        onClick={() => toggleDomain(domain)}
                        className={`px-4 py-2 rounded-full text-sm transition-all duration-300 transform hover:scale-105 ${
                          newAlert.domains.includes(domain)
                            ? "bg-purple-600 text-white shadow-lg"
                            : "bg-gray-900/50 text-white hover:bg-gray-700/50 border border-white/10"
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setShowCreateAlert(false)}
                    className="px-6 py-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-300 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAlert}
                    className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 text-white"
                  >
                    Create Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compact Alert Cards with Animations */}
        <div className="grid gap-3">
          {alerts.map((alert, index) => (
            <div
              key={alert.id}
              className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-lg hover:border-purple-500/30 transition-all duration-300 group animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {alert.title}
                      </h3>
                      <div className="flex items-center mt-1 space-x-4">
                        <p className="text-white/80 text-sm flex items-center">
                          <Search size={14} className="mr-1" />
                          {alert.location}
                        </p>
                        <p className="text-white/80 text-sm flex items-center">
                          <Bell size={14} className="mr-1" />
                          {alert.frequency}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {alert.domains.map((domain) => (
                      <span
                        key={domain}
                        className="px-2 py-1 rounded-full text-xs border border-purple-500/30 text-white bg-purple-500/10"
                      >
                        {domain}
                      </span>
                    ))}
                    <div className="flex space-x-1 ml-4">
                      <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                        <Edit2 size={16} className="text-white" />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                        <Trash2
                          size={16}
                          className="text-white hover:text-red-400"
                        />
                      </button>
                    </div>
                  </div>
                </div>
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

export default JobAlertsPage;
