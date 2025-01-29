import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Briefcase, User, LogOut, MessageSquare } from "lucide-react";

interface NavbarProps {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center mb-16">
      <h1
        onClick={() => navigate("/")}
        className="text-4xl font-bold cursor-pointer"
      >
        <span className="text-white">Work</span>
        <span className="text-purple-400">Way</span>
      </h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/alerts")}
          className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center"
        >
          <Bell size={16} className="mr-2" />
          Job Alerts
        </button>
        <button
          onClick={() => navigate("/discussions")}
          className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center"
        >
          <MessageSquare size={16} className="mr-2" />
          Discussions
        </button>
        <button
          onClick={() => navigate("/applications")}
          className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center"
        >
          <Briefcase size={16} className="mr-2" />
          Applications
        </button>
        {/* {isLoggedIn ? (
          <>
            <span className="text-white">{user?.name}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center"
          >
            <User size={16} className="mr-2" />
            Log in
          </button>
        )} */}
      </div>
    </header>
  );
};

export default Navbar;
