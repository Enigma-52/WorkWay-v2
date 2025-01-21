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
  ChevronDown,
  MapPin,
  Plus,
  AlertCircle as AlertIcon,
} from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Application {
  id: string;
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

interface User {
  id: string;
  name: string;
  email: string;
}

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
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

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const initializeUser = () => {
      const id = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      const name = localStorage.getItem("name");
      const email = localStorage.getItem("email");

      if (id && name && email && token) {
        const userData = { id, name, email };
        setIsLoggedIn(true);
        setUser(userData);
        fetchApplications(id);
      }
    };

    initializeUser();
  }, []);

  const fetchApplications = async (userId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_BASE_URL}/applications/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data.data);

      if (response.data) {
        const transformedApplications = response.data.data.map((app: any) => ({
          id: app.applicationId || app.jobId,
          company: app.job?.company || "",
          position: app.job?.title || "",
          status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
          appliedDate: new Date(
            app.appliedAt.seconds * 1000
          ).toLocaleDateString(),
          location: app.job?.location || "Remote",
          type: app.job?.employmentType || "Full-time",
          domain: app.job?.domain || "Other",
          description: app.job?.description || "",
          lastUpdated: new Date(
            app.updatedAt.seconds * 1000
          ).toLocaleDateString(),
        }));
        setApplications(transformedApplications);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleAddApplication = async () => {
    if (!user || !newApplication.company || !newApplication.position) return;

    try {
      const token = localStorage.getItem("token");
      const applicationData = {
        job: {
          id: crypto.randomUUID(),
          company: newApplication.company,
          position: newApplication.position,
          location: newApplication.location,
          type: newApplication.type,
          domain: newApplication.domain,
          description: newApplication.description,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        status: "Applied",
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/jobs/apply`,
        applicationData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        await fetchApplications(user.id);
        setShowAddModal(false);
        setNewApplication({
          company: "",
          position: "",
          location: "",
          type: "Full-time",
          domain: "Frontend Development",
          description: "",
        });
      }
    } catch (err) {
      console.error("Error adding application:", err);
      setError("Failed to add application");
    }
  };

  const handleStatusChange = async (
    appId: string,
    newStatus: Application["status"]
  ) => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/applications/user/${user.id}/application/${appId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        await fetchApplications(user.id);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update application status");
    }
    setEditingStatus(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUser(null);
    setApplications([]);
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

  const getFilteredApplications = () => {
    return applications.filter((app) => {
      if (!app) return false;

      const searchTermLower = searchTerm.toLowerCase();
      const company = app.company?.toLowerCase() || "";
      const position = app.position?.toLowerCase() || "";
      const location = app.location?.toLowerCase() || "";
      const status = app.status?.toLowerCase() || "";

      const matchesSearch =
        searchTerm === "" ||
        company.includes(searchTermLower) ||
        position.includes(searchTermLower) ||
        location.includes(searchTermLower);

      const matchesFilter = filter === "all" || status === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  };

  const stats = {
    total: applications.length,
    interview: applications.filter((app) => app.status === "Interview").length,
    offer: applications.filter((app) => app.status === "Offer").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="text-gray-100 min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl relative">
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="relative mb-12 animate-fadeIn">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold flex items-center mb-2 text-purple-100">
                <Briefcase className="mr-4 text-purple-400" size={32} />
                Applications Tracker
              </h1>
              <p className="text-gray-400 ml-12">
                Track and manage your job applications
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-full font-semibold flex items-center transition-all duration-300 transform hover:scale-105"
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
          ].map((stat) => (
            <div
              key={stat.title}
              className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-purple-500/20"
            >
              <div className="flex items-center mb-2">
                <stat.icon className={stat.color} size={20} />
                <h3 className="font-semibold text-gray-300 ml-2">
                  {stat.title}
                </h3>
              </div>
              <p className="text-3xl font-bold text-purple-100">{stat.value}</p>
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
                className="w-full bg-gray-900/40 border border-purple-500/20 rounded-lg pl-10 pr-4 py-3"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="bg-gray-900/40 border border-purple-500/20 rounded-lg px-4 py-3"
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
        <div className="space-y-4 mb-16">
          {getFilteredApplications().map((app) => (
            <div
              key={app.id}
              className="bg-gray-900/40 backdrop-blur-sm border border-purple-500/20 rounded-lg"
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                      <Building className="text-purple-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-100">
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
                      {editingStatus === app.id && (
                        <div className="absolute bottom-full mb-2 right-0 bg-gray-900 border border-purple-500/20 rounded-lg shadow-xl">
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
                                className="w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors"
                              >
                                {status}
                              </button>
                            )
                          )}
                        </div>
                      )}
                      <button
                        onClick={() =>
                          setEditingStatus(
                            editingStatus === app.id ? null : app.id
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-sm border flex items-center ${getStatusStyle(
                          app.status
                        )}`}
                      >
                        {getStatusIcon(app.status)}
                        <span className="ml-1.5">{app.status}</span>
                        <ChevronDown size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Application Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gray-900 border border-purple-500/20 rounded-xl w-full max-w-2xl animate-slideIn">
              <div
                className="border-b border-purple-500/20 p-4 animate-slideIn"
                style={{ animationDelay: "0.1s" }}
              >
                <h2 className="text-xl font-semibold text-purple-100 flex items-center">
                  <AlertIcon className="mr-2 text-purple-400" size={20} />
                  Add New Application
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Basic Info Fields */}
                  {[
                    { label: "Company Name", key: "company", delay: 0.2 },
                    { label: "Position", key: "position", delay: 0.3 },
                    { label: "Location", key: "location", delay: 0.4 },
                  ].map((field) => (
                    <div
                      key={field.key}
                      className="animate-slideIn"
                      style={{ animationDelay: `${field.delay}s` }}
                    >
                      <label className="block text-sm font-medium mb-2 text-purple-100">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-purple-500/20 focus:border-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-500"
                        value={
                          newApplication[field.key as keyof NewApplication]
                        }
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
                    className="animate-slideIn"
                    style={{ animationDelay: "0.5s" }}
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
                    className="animate-slideIn"
                    style={{ animationDelay: "0.6s" }}
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
                    className="animate-slideIn"
                    style={{ animationDelay: "0.7s" }}
                  >
                    <label className="block text-sm font-medium mb-2 text-purple-100">
                      Description
                    </label>
                    <textarea
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-purple-500/20 focus:border-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-500 min-h-[100px]"
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
                  <div
                    className="flex justify-end space-x-4 pt-4 border-t border-purple-500/20 animate-slideIn"
                    style={{ animationDelay: "0.8s" }}
                  >
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
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
