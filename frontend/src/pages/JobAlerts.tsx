import React, { useState, useEffect } from "react";
import { Bell, Trash2, Edit2, Search, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [newAlert, setNewAlert] = useState<NewJobAlert>({
    title: "",
    location: "",
    frequency: "Daily",
    domains: [],
  });

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

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
    setNewAlert((prev) => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter((d) => d !== domain)
        : [...prev.domains, domain],
    }));
  };

  return (
    <div className="text-gray-100 min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl relative">
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="relative mb-12 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold flex items-center mb-2 text-purple-100 hover:text-purple-200 transition-colors">
                  <Bell
                    className="mr-4 text-purple-400 animate-pulse"
                    size={32}
                  />
                  Job Alerts
                </h1>
                <p className="text-gray-400 ml-12">
                  Stay updated with your dream job opportunities
                </p>
              </div>
              <button
                onClick={() => setShowCreateAlert(true)}
                className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-full font-semibold flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-600/20 active:scale-95"
              >
                <Bell size={20} className="mr-2" />
                Create New Alert
              </button>
            </div>
          </div>

          {/* Create Alert Modal */}
          {showCreateAlert && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray-900 border border-purple-500/20 rounded-xl w-full max-w-2xl shadow-xl overflow-hidden animate-slideIn">
                <div className="border-b border-purple-500/20 p-4 bg-gray-900/50">
                  <h2 className="text-xl font-semibold text-purple-100 flex items-center">
                    <AlertCircle className="mr-2 text-purple-400" size={20} />
                    Create New Job Alert
                  </h2>
                </div>
                <div className="p-6 bg-gray-900/30">
                  <div className="space-y-4">
                    {/* Form Fields */}
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
                        <label className="block text-sm font-medium mb-2 text-purple-100">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-purple-500/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-500"
                          value={field.value}
                          onChange={(e) =>
                            setNewAlert({
                              ...newAlert,
                              [field.key]: e.target.value,
                            })
                          }
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      </div>
                    ))}

                    {/* Frequency Select */}
                    <div
                      className="animate-fadeIn"
                      style={{ animationDelay: "200ms" }}
                    >
                      <label className="block text-sm font-medium mb-2 text-purple-100">
                        Alert Frequency
                      </label>
                      <select
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-purple-500/20 focus:border-purple-500 focus:outline-none transition-all duration-300 text-white"
                        value={newAlert.frequency}
                        onChange={(e) =>
                          setNewAlert({
                            ...newAlert,
                            frequency: e.target.value,
                          })
                        }
                      >
                        {frequencies.map((freq) => (
                          <option
                            key={freq}
                            value={freq}
                            className="bg-gray-900"
                          >
                            {freq}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Domains */}
                    <div
                      className="animate-fadeIn"
                      style={{ animationDelay: "300ms" }}
                    >
                      <label className="block text-sm font-medium mb-2 text-purple-100">
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
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-purple-500/20"
                            }`}
                          >
                            {domain}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-4 border-t border-purple-500/20">
                      <button
                        onClick={() => setShowCreateAlert(false)}
                        className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 text-gray-300"
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
            </div>
          )}

          {/* Alerts List */}
          <div className="grid gap-4 mb-16">
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className="bg-gray-900/40 backdrop-blur-sm border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all duration-300 group animate-fadeIn hover:bg-gray-900/60"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-100 group-hover:text-purple-300 transition-colors">
                          {alert.title}
                        </h3>
                        <div className="flex items-center mt-2 space-x-4">
                          <p className="text-gray-400 text-sm flex items-center">
                            <Search size={14} className="mr-1" />
                            {alert.location}
                          </p>
                          <p className="text-gray-400 text-sm flex items-center">
                            <Bell size={14} className="mr-1" />
                            {alert.frequency}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {alert.domains.map((domain) => (
                        <span
                          key={domain}
                          className="px-3 py-1 rounded-full text-xs border border-purple-500/30 text-purple-200 bg-purple-500/10"
                        >
                          {domain}
                        </span>
                      ))}
                      <div className="flex space-x-2 ml-4">
                        <button className="p-2 hover:bg-purple-500/10 rounded-full transition-colors">
                          <Edit2 size={16} className="text-purple-300" />
                        </button>
                        <button className="p-2 hover:bg-red-500/10 rounded-full transition-colors">
                          <Trash2
                            size={16}
                            className="text-gray-400 hover:text-red-400"
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

        <Footer />
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
};

export default JobAlertsPage;
