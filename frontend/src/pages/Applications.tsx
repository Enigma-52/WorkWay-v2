import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  Plus,
  AlertCircle as AlertIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Application {
  id: number;
  company: string;
  position: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  appliedDate: string;
  location: string;
  type: string;
  domain: string;
  description?: string;
  lastUpdated: string;
}

interface NewApplication {
  company: string;
  position: string;
  location: string;
  type: string;
  domain: string;
  description: string;
}

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      company: "TechCorp",
      position: "Senior Frontend Developer",
      status: "Interview",
      appliedDate: "2024-01-01",
      location: "Remote",
      type: "Full-time",
      domain: "Frontend Development",
      description:
        "Leading the frontend development team and architecting scalable solutions.",
      lastUpdated: "2 days ago",
    },
    {
      id: 2,
      company: "StartupX",
      position: "Full Stack Engineer",
      status: "Applied",
      appliedDate: "2024-01-03",
      location: "New York, NY",
      type: "Contract",
      domain: "Full Stack Development",
      description:
        "Building and maintaining full-stack applications using React and Node.js.",
      lastUpdated: "1 day ago",
    },
  ]);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newApplication, setNewApplication] = useState<NewApplication>({
    company: "",
    position: "",
    location: "",
    type: "Full-time",
    domain: "Frontend Development",
    description: "",
  });

  const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const domains = [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "DevOps",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "UI/UX Design",
  ];

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

  const stats = {
    total: applications.length,
    interview: applications.filter((app) => app.status === "Interview").length,
    offer: applications.filter((app) => app.status === "Offer").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
  };

  const handleAddApplication = () => {
    if (newApplication.company && newApplication.position) {
      const today = new Date().toISOString().split("T")[0];
      setApplications([
        ...applications,
        {
          ...newApplication,
          id: applications.length + 1,
          status: "Applied",
          appliedDate: today,
          lastUpdated: "Just now",
        },
      ]);
      setNewApplication({
        company: "",
        position: "",
        location: "",
        type: "Full-time",
        domain: "Frontend Development",
        description: "",
      });
      setShowAddModal(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const [editingStatus, setEditingStatus] = useState<number | null>(null);

  const handleStatusChange = (
    appId: number,
    newStatus: Application["status"]
  ) => {
    setApplications((apps) =>
      apps.map((app) =>
        app.id === appId
          ? { ...app, status: newStatus, lastUpdated: "Just now" }
          : app
      )
    );
    setEditingStatus(null);
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

  // Close status dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editingStatus !== null &&
        !(event.target as Element).closest(".status-dropdown")
      ) {
        setEditingStatus(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingStatus]);

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
                  <Briefcase className="mr-4 text-purple-400" size={32} />
                  Applications Tracker
                </h1>
                <p className="text-gray-400 ml-12">
                  Track and manage your job applications
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-full font-semibold flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-600/20 active:scale-95"
              >
                <Plus size={20} className="mr-2" />
                Add Application
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: Briefcase,
                title: "Total Applications",
                value: stats.total,
                color: "text-purple-400",
              },
              {
                icon: AlertCircle,
                title: "In Interview",
                value: stats.interview,
                color: "text-yellow-400",
              },
              {
                icon: CheckCircle,
                title: "Offers",
                value: stats.offer,
                color: "text-green-400",
              },
              {
                icon: XCircle,
                title: "Rejected",
                value: stats.rejected,
                color: "text-red-400",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
              >
                <div className="flex items-center mb-2">
                  <stat.icon
                    className={`${stat.color} mr-2 group-hover:scale-110 transition-transform`}
                    size={20}
                  />
                  <h3 className="font-semibold text-gray-300">{stat.title}</h3>
                </div>
                <p className="text-3xl font-bold text-purple-100 group-hover:text-purple-300 transition-colors">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  className="w-full bg-gray-900/40 border border-purple-500/20 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-100 placeholder-gray-500"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="bg-gray-900/40 border border-purple-500/20 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-100"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all" className="bg-gray-900">
                All Status
              </option>
              <option value="applied" className="bg-gray-900">
                Applied
              </option>
              <option value="interview" className="bg-gray-900">
                Interview
              </option>
              <option value="offer" className="bg-gray-900">
                Offer
              </option>
              <option value="rejected" className="bg-gray-900">
                Rejected
              </option>
            </select>
          </div>

          {/* Applications List */}
          <div className="space-y-4 mb-16">
            {applications.map((app, index) => (
              <div
                key={app.id}
                className="bg-gray-900/40 backdrop-blur-sm border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all duration-300 group animate-fadeIn hover:bg-gray-900/60"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                        <Building className="text-purple-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-100 group-hover:text-purple-300 transition-colors flex items-center">
                          {app.position}
                          <span className="text-sm font-normal text-gray-400 ml-2">
                            at {app.company}
                          </span>
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <span className="text-gray-400 text-sm flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {app.location}
                          </span>
                          <span className="text-gray-400 text-sm flex items-center">
                            <Calendar size={14} className="mr-1" />
                            Applied {app.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {editingStatus === app.id ? (
                          <div className="absolute bottom-full mb-2 right-0 bg-gray-900 border border-purple-500/20 rounded-lg shadow-xl z-10">
                            {["Applied", "Interview", "Offer", "Rejected"].map(
                              (status) => (
                                <button
                                  key={status}
                                  onClick={() =>
                                    handleStatusChange(
                                      app.id,
                                      status as Application["status"]
                                    )
                                  }
                                  className={`w-full px-4 py-2 flex items-center hover:bg-gray-800 first:rounded-t-lg last:rounded-b-lg ${
                                    app.status === status ? "bg-gray-800" : ""
                                  }`}
                                >
                                  {getStatusIcon(
                                    status as Application["status"]
                                  )}
                                  <span className="ml-2">{status}</span>
                                </button>
                              )
                            )}
                          </div>
                        ) : null}
                        <button
                          onClick={() =>
                            setEditingStatus(
                              editingStatus === app.id ? null : app.id
                            )
                          }
                          className={`px-3 py-1.5 rounded-full text-sm border flex items-center ${getStatusStyle(
                            app.status
                          )} hover:bg-opacity-20 transition-colors`}
                        >
                          {getStatusIcon(app.status)}
                          <span className="ml-1.5">{app.status}</span>
                          <ChevronDown size={14} className="ml-1 opacity-60" />
                        </button>
                      </div>
                      <button className="p-2 hover:bg-purple-500/10 rounded-full transition-colors">
                        <ExternalLink size={18} className="text-purple-300" />
                      </button>
                      <button
                        onClick={() => toggleExpand(app.id)}
                        className="p-2 hover:bg-purple-500/10 rounded-full transition-colors"
                      >
                        {expandedId === app.id ? (
                          <ChevronUp size={18} className="text-purple-300" />
                        ) : (
                          <ChevronDown size={18} className="text-purple-300" />
                        )}
                      </button>
                    </div>
                  </div>
                  {expandedId === app.id && (
                    <div className="mt-4 pt-4 border-t border-purple-500/20">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">
                            <span className="text-purple-400 font-medium">
                              Domain:
                            </span>{" "}
                            {app.domain}
                          </p>
                          <p className="text-gray-400 mt-2">
                            <span className="text-purple-400 font-medium">
                              Employment Type:
                            </span>{" "}
                            {app.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">
                            <span className="text-purple-400 font-medium">
                              Date Applied:
                            </span>{" "}
                            {app.appliedDate}
                          </p>
                          {app.description && (
                            <p className="text-gray-400 mt-2">
                              <span className="text-purple-400 font-medium">
                                Description:
                              </span>{" "}
                              {app.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Application Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-purple-500/20 rounded-xl w-full max-w-2xl shadow-xl overflow-hidden animate-slideIn">
              <div className="border-b border-purple-500/20 p-4 bg-gray-900/50">
                <h2 className="text-xl font-semibold text-purple-100 flex items-center">
                  <AlertIcon className="mr-2 text-purple-400" size={20} />
                  Add New Application
                </h2>
              </div>
              <div className="p-6 bg-gray-900/30">
                <div className="space-y-4">
                  {/* Form Fields */}
                  {[
                    {
                      label: "Company Name",
                      type: "text",
                      value: newApplication.company,
                      key: "company",
                    },
                    {
                      label: "Position",
                      type: "text",
                      value: newApplication.position,
                      key: "position",
                    },
                    {
                      label: "Location",
                      type: "text",
                      value: newApplication.location,
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
                          setNewApplication({
                            ...newApplication,
                            [field.key]: e.target.value,
                          })
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}

                  {/* Employment Type Select */}
                  <div
                    className="animate-fadeIn"
                    style={{ animationDelay: "300ms" }}
                  >
                    <label className="block text-sm font-medium mb-2 text-purple-100">
                      Employment Type
                    </label>
                    <select
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-purple-500/20 focus:border-purple-500 focus:outline-none transition-all duration-300 text-white"
                      value={newApplication.type}
                      onChange={(e) =>
                        setNewApplication({
                          ...newApplication,
                          type: e.target.value,
                        })
                      }
                    >
                      {employmentTypes.map((type) => (
                        <option key={type} value={type} className="bg-gray-900">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Domain Select */}
                  <div
                    className="animate-fadeIn"
                    style={{ animationDelay: "400ms" }}
                  >
                    <label className="block text-sm font-medium mb-2 text-purple-100">
                      Domain
                    </label>
                    <select
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-purple-500/20 focus:border-purple-500 focus:outline-none transition-all duration-300 text-white"
                      value={newApplication.domain}
                      onChange={(e) =>
                        setNewApplication({
                          ...newApplication,
                          domain: e.target.value,
                        })
                      }
                    >
                      {domains.map((domain) => (
                        <option
                          key={domain}
                          value={domain}
                          className="bg-gray-900"
                        >
                          {domain}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div
                    className="animate-fadeIn"
                    style={{ animationDelay: "500ms" }}
                  >
                    <label className="block text-sm font-medium mb-2 text-purple-100">
                      Description
                    </label>
                    <textarea
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-purple-500/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-500 min-h-[100px]"
                      value={newApplication.description}
                      onChange={(e) =>
                        setNewApplication({
                          ...newApplication,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter job description or notes"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-4 border-t border-purple-500/20">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddApplication}
                      className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 text-white disabled:opacity-50 disabled:hover:bg-purple-600 disabled:hover:scale-100"
                      disabled={
                        !newApplication.company || !newApplication.position
                      }
                    >
                      Add Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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

export default ApplicationsPage;
