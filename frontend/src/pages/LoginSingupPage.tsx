import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LoginSignupPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        });
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setSuccess("Login successful!");
          navigate("/");
        } else {
          setShowOtpInput(true);
          setSuccess("OTP sent to your email. Please check and enter below.");
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
          name,
          email,
          password,
        });
        setSuccess("Account created successfully! Please login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        email,
        otp,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setSuccess("Login successful!");
        navigate("/");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to verify OTP. Please try again."
      );
    }
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      let response;
      if (provider === "Google") {
        response = await axios.post(`${API_BASE_URL}/auth/google-signin`);
      } else if (provider === "GitHub") {
        response = await axios.post(`${API_BASE_URL}/auth/github-signin`);
      }

      if (response?.data.token) {
        localStorage.setItem("token", response.data.token);
        setSuccess(`Login with ${provider} successful!`);
        navigate("/");
      }
    } catch (err) {
      setError(`Failed to login with ${provider}. Please try again.`);
    }
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #1a202c, #4a1d96)",
        color: "white",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(31, 41, 55, 0.8)",
          p: 6,
          borderRadius: 4,
          width: "100%",
          maxWidth: 450,
          boxShadow:
            "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          <span style={{ color: "white" }}>Work</span>
          <span style={{ color: "#a78bfa" }}>Way</span>
        </Typography>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          fontWeight="medium"
          sx={{ mb: 4 }}
        >
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </Typography>

        <form onSubmit={showOtpInput ? handleOtpSubmit : handleSubmit}>
          {!isLogin && (
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={20} color="#a78bfa" />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyle}
            />
          )}
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={20} color="#a78bfa" />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyle}
          />
          {!showOtpInput && (
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} color="#a78bfa" />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyle}
            />
          )}
          {showOtpInput && (
            <TextField
              fullWidth
              label="Enter OTP"
              variant="outlined"
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              sx={textFieldStyle}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#7c3aed",

              color: "white",
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(124, 58, 237, 0.5)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                bgcolor: "#6d28d9",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 8px rgba(124, 58, 237, 0.6)",
              },
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                {showOtpInput ? "Verify OTP" : isLogin ? "Login" : "Sign Up"}
                <ArrowRight size={20} style={{ marginLeft: "8px" }} />
              </>
            )}
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 3, mb: 3, color: "#9ca3af" }}>
          Or continue with
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
          <IconButton
            onClick={() => handleSocialLogin("Google")}
            sx={socialButtonStyle}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="24px"
              height="24px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
          </IconButton>
          <IconButton
            onClick={() => handleSocialLogin("GitHub")}
            sx={socialButtonStyle}
            disabled={isLoading}
          >
            <Github size={24} />
          </IconButton>
        </Box>

        <Typography align="center" sx={{ mt: 4, color: "#9ca3af" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Button
            sx={{
              ml: 1,
              color: "#a78bfa",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
            }}
            onClick={() => {
              setIsLogin(!isLogin);
              setShowOtpInput(false);
              setError("");
              setSuccess("");
            }}
            disabled={isLoading}
          >
            {isLogin ? "Sign Up" : "Login"}
          </Button>
        </Typography>
      </Box>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={() => {
          setError("");
          setSuccess("");
        }}
        message={error || success}
        sx={{
          "& .MuiSnackbarContent-root": {
            bgcolor: error ? "#ef4444" : "#10b981",
            color: "white",
            fontWeight: "bold",
          },
        }}
      />
    </Box>
  );
};

const textFieldStyle = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": { borderColor: "#4b5563" },
    "&:hover fieldset": { borderColor: "#9ca3af" },
    "&.Mui-focused fieldset": { borderColor: "#a78bfa" },
  },
  "& .MuiInputLabel-root": { color: "#9ca3af" },
  "& .MuiInputAdornment-root": { mr: 1.5 },
};

const socialButtonStyle = {
  color: "white",
  bgcolor: "rgba(75, 85, 99, 0.8)",
  "&:hover": {
    bgcolor: "rgba(75, 85, 99, 1)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  transition: "all 0.3s ease-in-out",
  width: 48,
  height: 48,
};

export default LoginSignupPage;
