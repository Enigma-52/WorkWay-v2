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
    <div className="text-gray-100 min-h-screen bg-gradient-to-br from-black via-purple-950/90 to-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl relative">
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

        <div className="max-w-6xl mx-auto">
          {/* Beta Banner */}
          <div className="py-3 px-6 text-center">
            <div className="flex items-center justify-center gap-x-4 text-white/90 font-medium">
              <div className="flex items-center gap-2 bg-purple-500/10 rounded-full px-4 py-1.5 border border-purple-400/20">
                <span className="animate-pulse text-lg">✨</span>
                <span className="text-sm font-semibold">Coming Soon</span>
              </div>

              <span className="text-sm">
                Job Alerts feature is in development
              </span>

              <div className="flex items-center gap-2 bg-purple-500/10 rounded-full px-4 py-1.5 border border-purple-400/20">
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
                <span className="text-sm font-light text-purple-200">
                  Beta Phase
                </span>
              </div>
            </div>
          </div>

          <style>{`
 @keyframes gradient {
   0% { background-position: 0% 50%; }
   50% { background-position: 100% 50%; }
   100% { background-position: 0% 50%; }
 }
 .animate-gradient {
   background-size: 200% 200%;
   animation: gradient 15s ease infinite;
 }
`}</style>
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
                disabled
                className="bg-purple-700/50 px-6 py-3 rounded-full font-semibold flex items-center transition-all duration-300 cursor-not-allowed blur-[0.5px] relative group"
              >
                <Bell size={20} className="mr-2" />
                Create New Alert
                <span className="absolute -top-3 -right-3 bg-purple-500 text-xs px-2 py-1 rounded-full animate-pulse">
                  Coming Soon
                </span>
              </button>
            </div>
          </div>

          {/* Alerts List */}
          {alerts.length === 0 ? (
            <div className="text-center py-20 bg-gray-900/40 rounded-lg border border-purple-500/20">
              <Bell
                size={40}
                className="mx-auto mb-4 text-purple-400 opacity-50"
              />
              <h3 className="text-xl font-semibold text-purple-200 mb-2">
                Job Alerts Coming Soon
              </h3>
              <p className="text-gray-400">
                We're working hard to bring you personalized job alerts
              </p>
            </div>
          ) : (
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
                        <div className="flex space-x-2 ml-4 blur-[0.5px]">
                          <button
                            disabled
                            className="p-2 opacity-50 cursor-not-allowed rounded-full transition-colors"
                          >
                            <Edit2 size={16} className="text-purple-300" />
                          </button>
                          <button
                            disabled
                            className="p-2 opacity-50 cursor-not-allowed rounded-full transition-colors"
                          >
                            <Trash2 size={16} className="text-gray-400" />
                          </button>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300">
                          Beta
                        </span>
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
            @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
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
