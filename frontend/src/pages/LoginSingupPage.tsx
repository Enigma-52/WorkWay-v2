import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  User,
  Briefcase,
  Building,
  Keyboard,
  Globe2,
  LucideIcon,
  ChevronRight,
  Loader2,
  ArrowLeft,
} from "lucide-react";

interface FormData {
  email: string;
  password: string;
  name: string;
}

interface FeatureDetailed {
  icon: LucideIcon;
  title: string;
  description: string;
  stat?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
  });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const features: FeatureDetailed[] = [
    {
      icon: Globe2,
      title: "Global Remote Jobs",
      description: "Access opportunities worldwide",
      stat: "20k+ remote positions",
    },
    {
      icon: Building,
      title: "Top Companies",
      description: "Work with industry leaders",
      stat: "500+ companies",
    },
    {
      icon: Briefcase,
      title: "Dream Careers",
      description: "Find your perfect role",
      stat: "25+ industries",
    },
    {
      icon: Keyboard,
      title: "Smart Applications",
      description: "Apply with one click",
      stat: "2min average apply time",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      return;
    }
    setIsLoading(true);
    try {
      if (isLogin) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to send OTP");
        }

        const data = await response.json();
        if (data) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("email", data.user.email);
          localStorage.setItem("name", data.user.name);
          localStorage.setItem("userId", data.user.uid);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          navigate("/");
        } else {
          throw new Error(data.message || "Failed to send OTP");
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to send OTP");
        }

        if (data) {
          setShowOTP(true);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp.join(""),
          name: formData.name,
          password: formData.password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify OTP");
      }

      const data = await response.json();
      if (data) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("name", data.name);
        localStorage.setItem("userId", data.uid);

        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate("/");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOTPSection = () => (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Verify your email
        </h2>
        <p className="text-gray-400">
          We've sent a verification code to
          <br />
          <span className="text-white">{formData.email}</span>
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleOTPKeyDown(index, e)}
              className="w-12 h-12 text-center bg-white/5 border border-white/10 rounded-lg text-white
                text-xl font-medium focus:outline-none focus:border-purple-500/50
                focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.some((digit) => digit === "")}
          className="relative w-full group"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg blur
            opacity-75 group-hover:opacity-100 transition-opacity duration-300"
          />
          <div
            className="relative w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500
            rounded-lg flex items-center justify-center text-white font-medium
            hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Verify Email
                <ChevronRight className="ml-2 w-5 h-5" />
              </>
            )}
          </div>
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setOTP(["", "", "", "", "", ""])}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            Didn't receive the code?
            <span className="ml-2 text-purple-400 hover:text-purple-300">
              Resend
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-950">
      {/* Left Panel - Features */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-gray-900 via-purple-950 to-violet-950">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-4 top-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        {/* Content */}
        <div className="relative w-full flex flex-col justify-center px-12">
          <div className="mb-12">
            <div className="inline-block px-4 py-2 bg-white/5 rounded-full text-purple-400 text-sm font-medium mb-4">
              Trusted by professionals
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-white">Work</span>
              <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                Way
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              Your gateway to endless career possibilities. Join thousands of
              professionals finding their dream jobs daily.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            {[
              { value: "93%", label: "Success Rate" },
              { value: "500+", label: "Active Users" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 rounded-xl border border-white/10
                  hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center mb-4">
                  <feature.icon className="w-8 h-8 text-purple-400 mr-4 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium">
                    {feature.title}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {feature.description}
                </p>
                <div className="text-purple-400 text-sm font-medium">
                  {feature.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        {showOTP ? (
          renderOTPSection()
        ) : (
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-gray-400">
                {isLogin
                  ? "Enter your details to sign in"
                  : "Start your 30-day free trial"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative group">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg blur
                    group-hover:opacity-100 transition-opacity duration-300 opacity-0"
                  />
                  <div className="relative">
                    <User
                      className="absolute left-4 top-3.5 text-gray-400 group-hover:text-purple-400
                      transition-colors duration-300"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white
                        placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50
                        focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              <div className="relative group">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg blur
                  group-hover:opacity-100 transition-opacity duration-300 opacity-0"
                />
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-3.5 text-gray-400 group-hover:text-purple-400
                    transition-colors duration-300"
                    size={20}
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white
                      placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50
                      focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="relative group">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg blur
                  group-hover:opacity-100 transition-opacity duration-300 opacity-0"
                />
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-3.5 text-gray-400 group-hover:text-purple-400
                    transition-colors duration-300"
                    size={20}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white
                      placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50
                      focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full group"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg blur
                  opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div
                  className="relative w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500
                  rounded-lg flex items-center justify-center text-white font-medium
                  hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Sign in" : "Create account"}
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </div>
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-gray-400 bg-gray-950">
                    or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10
                  rounded-lg flex items-center justify-center space-x-3 text-white transition-colors duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c2.17 0 4.1.72 5.63 1.92l4.13-4.13C19.17.24 15.7-1 12 1 7.31 1 3.23 3.53.65 7.28l4.84 3.77c1.17-3.5 4.48-6.01 8.51-6.01z"
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
                <span>Continue with Google</span>
              </button>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ email: "", password: "", name: "" });
                  }}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
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
        )}
      </div>
    </div>
  );
};

export default LoginPage;
