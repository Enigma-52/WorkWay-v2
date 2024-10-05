import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
  displayName: string;
  email: string;
  getIdToken: () => Promise<string>;
  // other properties...
}

function Home({ user }: { user: User }) {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out", error);
      });
  };

  const fetchProtectedData = async () => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get("http://localhost:3000/api/user", {
        headers: {
          Authorization: token,
        },
      });
      console.log("Protected data:", response.data);
    } catch (error) {
      console.error("Error fetching protected data", error);
    }
  };

  return (
    <div>
      <h1>Welcome, {user.displayName}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={fetchProtectedData}>Fetch Protected Data</button>
    </div>
  );
}

export default Home;
