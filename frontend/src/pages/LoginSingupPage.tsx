import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Github,
  Loader2,
  Briefcase,
  Star,
  Users,
  Code,
  Building2,
  Globe,
  Cpu,
} from "lucide-react";

const LoginSignupPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const features = [
    {
      icon: <Globe className="w-6 h-6 text-purple-400" />,
      title: "30,000+ Active Jobs",
      description: "Access to global opportunities",
    },
    {
      icon: <Building2 className="w-6 h-6 text-purple-400" />,
      title: "Top Companies",
      description: "Work with industry leaders",
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: "Team Collaboration",
      description: "Real-time collaboration tools",
    },
    {
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      title: "AI-Powered Matching",
      description: "Smart job recommendations",
    },
  ];

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: "success", text: "Successfully logged in!" });
      navigate("/");
    }, 1500);
  };

  const handleSocialLogin = (provider: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: "success", text: `Logged in with ${provider}!` });
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 p-4 md:p-0">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center p-8">
        {/* Features Section */}
        <div className="hidden md:block space-y-8 transform animate-fade-in">
          <div className="text-white space-y-4">
            <h1 className="text-5xl font-bold mb-6">
              <span className="text-white">Work</span>
              <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                Way
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-12">
              Your gateway to endless career possibilities. Join thousands of
              professionals finding their dream jobs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm
                transform transition-all duration-300 hover:scale-105 hover:bg-white/10
                animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Login/Signup Form */}
        <div className="w-full max-w-md mx-auto">
          <div
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10
            transform transition-all duration-500 hover:shadow-purple-500/20 animate-fade-up"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4 text-white">
                {isLogin ? "Welcome back!" : "Create account"}
              </h2>
              <p className="text-white/60">
                {isLogin
                  ? "Let's get you back to your workspace"
                  : "Start your journey with WorkWay"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div
                  className="relative group animate-fade-up"
                  style={{ animationDelay: "100ms" }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg blur 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-lg pl-12 text-white
                      placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50
                      transition-all duration-300"
                  />
                  <User
                    className="absolute left-4 top-4 text-white/40 group-hover:text-purple-400 transition-colors duration-300"
                    size={20}
                  />
                </div>
              )}

              <div
                className="relative group animate-fade-up"
                style={{ animationDelay: "200ms" }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg blur 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-lg pl-12 text-white
                    placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50
                    transition-all duration-300"
                />
                <Mail
                  className="absolute left-4 top-4 text-white/40 group-hover:text-purple-400 transition-colors duration-300"
                  size={20}
                />
              </div>

              <div
                className="relative group animate-fade-up"
                style={{ animationDelay: "300ms" }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg blur 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-lg pl-12 text-white
                    placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50
                    transition-all duration-300"
                />
                <Lock
                  className="absolute left-4 top-4 text-white/40 group-hover:text-purple-400 transition-colors duration-300"
                  size={20}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg px-5 py-4 font-medium
                  transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25
                  disabled:opacity-50 disabled:hover:scale-100 group relative animate-fade-up"
                style={{ animationDelay: "400ms" }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-violet-500/50 rounded-lg blur opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <span className="relative flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight className="ml-2" size={20} />
                    </>
                  )}
                </span>
              </button>

              <div
                className="relative my-8 animate-fade-up"
                style={{ animationDelay: "500ms" }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/60">
                    or continue with
                  </span>
                </div>
              </div>

              <div
                className="flex gap-4 justify-center animate-fade-up"
                style={{ animationDelay: "600ms" }}
              >
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 transition-all duration-300
                    hover:bg-white/10 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c2.17 0 4.1.72 5.63 1.92l4.13-4.13C19.17 .24 15.7-1 12 1 7.31 1 3.23 3.53.65 7.28l4.84 3.77c1.17-3.5 4.48-6.01 8.51-6.01z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96l-3.98 3.09C3.74 20.85 7.49 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("GitHub")}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 transition-all duration-300
                    hover:bg-white/10 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <Github className="w-6 h-6 text-white" />
                </button>
              </div>

              <div
                className="mt-8 text-center animate-fade-up"
                style={{ animationDelay: "700ms" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage({ type: "", text: "" });
                  }}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <span className="ml-2 text-purple-400 hover:text-purple-300">
                    {isLogin ? "Sign up" : "Sign in"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white ${
            message.type === "error" ? "bg-red-500" : "bg-emerald-500"
          } transform transition-all duration-500 animate-slide-up`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default LoginSignupPage;
