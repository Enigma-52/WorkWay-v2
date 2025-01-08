import React, { useState, useEffect } from "react";
import axios from "axios";

const ActivityMockPage = () => {
  const [activity, setActivity] = useState({
    type: "",
    description: "",
    timestamp: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [activities, setActivities] = useState<any[]>([]); // To store activities

  // Mock function to generate activities
  const generateActivity = () => {
    const types = ["Login", "Purchase", "Page Visit"];
    const descriptions = [
      "User logged in",
      "User made a purchase",
      "User visited a page",
    ];
    const randomIndex = Math.floor(Math.random() * types.length);

    return {
      type: types[randomIndex],
      description: descriptions[randomIndex],
      timestamp: new Date().toISOString(),
    };
  };

  // Simulate sending activity to the backend
  const sendActivity = async () => {
    const newActivity = generateActivity();
    setActivity(newActivity);

    try {
      // Sending a mock activity to the backend API (e.g., saving it to Firebase)
      const response = await axios.post(
        "http://localhost:3005/activities",
        newActivity
      ); // Replace with actual backend URL
      setResponseMessage(`Activity Saved: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setResponseMessage("Failed to save activity");
      console.error(error);
    }
  };

  // Fetch the activities from the backend every 5 seconds to simulate real-time updates
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:3005/activities");
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities(); // Initial fetch

    const intervalId = setInterval(fetchActivities, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div>
      <h1>Activity Mock Page</h1>
      <button onClick={sendActivity}>Generate and Send Activity</button>

      <div>
        <h3>Generated Activity</h3>
        <p>
          <strong>Type:</strong> {activity.type}
        </p>
        <p>
          <strong>Description:</strong> {activity.description}
        </p>
        <p>
          <strong>Timestamp:</strong> {activity.timestamp}
        </p>
      </div>

      <div>
        <h3>Response</h3>
        <p>{responseMessage}</p>
      </div>

      <div>
        <h3>Latest Activities</h3>
        {activities.length === 0 ? (
          <p>No activities yet.</p>
        ) : (
          activities.map((act, index) => (
            <div key={index}>
              <p>
                <strong>Type:</strong> {act.type}
              </p>
              <p>
                <strong>Description:</strong> {act.description}
              </p>
              <p>
                <strong>Timestamp:</strong> {act.timestamp}
              </p>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityMockPage;
