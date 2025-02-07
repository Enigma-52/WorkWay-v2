import React, { useState, useEffect } from "react";
import { Bell, Trash2, Edit2, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobAlertModal from "../components/JobAlertModal";

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
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newAlert, setNewAlert] = useState<NewJobAlert>({
    title: "",
    location: "",
    frequency: "Daily",
    domains: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);

  const domains = [
    "Frontend",
    "Backend",
    "Full-stack",
    "DevOps",
    "Data Science",
    "Mobile",
  ];
  const frequencies = ["Daily", "Weekly", "Monthly"];

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    const userData = {
      id: userId as string,
      name: name as string,
      email: email as string,
    };

    console.log(token, userData);
    if (token) {
      setIsLoggedIn(true);
      if (userData) {
        setUser(userData);
      }
    }
  }, []);

  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && user?.id) {
      fetchUserAlerts(token);
    }
  }, [user?.id]);

  const fetchUserAlerts = async (token: string) => {
    try {
      setIsLoading(true);
      const userId = user?.id;

      console.log(userId);
      const response = await fetch(`${API_BASE_URL}/jobAlerts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAlert = async (alertData: NewJobAlert) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/jobAlerts/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(alertData),
      });

      if (response.ok) {
        const createdAlert = await response.json();
        setAlerts([...alerts, createdAlert]);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  };

  const handleDeleteAlert = async (alertId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/jobAlerts/delete/${alertId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setAlerts(alerts.filter((alert) => alert.id !== alertId));
      }
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  const handleEditClick = (alert: JobAlert) => {
    setEditingAlert(alert);
    setShowModal(true);
  };

  const handleUpdateAlert = async (alertData: Partial<JobAlert>) => {
    if (!editingAlert) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/jobAlerts/update/${editingAlert.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(alertData),
        }
      );

      if (response.ok) {
        const updatedAlert = await response.json();
        setAlerts(
          alerts.map((alert) =>
            alert.id === editingAlert.id ? updatedAlert : alert
          )
        );
        setShowModal(false);
        setEditingAlert(null);
      }
    } catch (error) {
      console.error("Error updating alert:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setAlerts([]);
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
    <div className="text-gray-100 min-h-screen bg-gradient-to-br from-black via-purple-950/90 to-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl relative">
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

        <div className="max-w-6xl mx-auto">
          <div className="relative mb-12 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold flex items-center mb-2 text-purple-100 hover:text-purple-200 transition-colors">
                  <Bell className="mr-4 text-purple-400" size={32} />
                  Job Alerts
                </h1>
                <p className="text-gray-400 ml-12">
                  Stay updated with your dream job opportunities
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingAlert(null);
                  setShowModal(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full font-semibold flex items-center transition-all duration-300"
              >
                <Bell size={20} className="mr-2" />
                Create New Alert
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-purple-200">Loading your alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-20 bg-gray-900/40 rounded-lg border border-purple-500/20">
              <Bell
                size={40}
                className="mx-auto mb-4 text-purple-400 opacity-50"
              />
              <h3 className="text-xl font-semibold text-purple-200 mb-2">
                No Job Alerts Yet
              </h3>
              <p className="text-gray-400">
                Create your first alert to start receiving job notifications
              </p>
            </div>
          ) : (
            <div className="grid gap-4 mb-16">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-gray-900/40 backdrop-blur-sm border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all duration-300 group animate-fadeIn"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
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
                          <button
                            onClick={() => handleEditClick(alert)}
                            className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
                          >
                            <Edit2 size={16} className="text-purple-300" />
                          </button>
                          <button
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                          >
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
          )}
        </div>

        <Footer />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
      <JobAlertModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAlert(null);
        }}
        onSubmit={(data) => {
          if (editingAlert) {
            handleUpdateAlert(data);
          } else {
            handleCreateAlert(data);
          }
          setShowModal(false);
          const token = localStorage.getItem("authToken");
          if (token && user?.id) {
            fetchUserAlerts(token);
          }
        }}
        editAlert={editingAlert}
        domains={domains}
        frequencies={frequencies}
      />
    </div>
  );
};

export default JobAlertsPage;
