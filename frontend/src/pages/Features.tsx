import React, { useState, useEffect } from "react";
import { Sparkles, Send, ThumbsUp, X } from "lucide-react";

interface Feature {
  id: number;
  title: string;
  description: string;
  votes: number;
  submittedBy: string;
}

interface User {
  id: string;
  email: string;
}

const Features = () => {
  const [email, setEmail] = useState<string>("");
  const [featureTitle, setFeatureTitle] = useState<string>("");
  const [featureDescription, setFeatureDescription] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [featureRequests, setFeatureRequests] = useState<Feature[]>([]);
  const [userVotes, setUserVotes] = useState<{ [key: number]: boolean }>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedFeatureRequests = JSON.parse(
      localStorage.getItem("featureRequests") || "[]"
    ) as Feature[];
    setFeatureRequests(savedFeatureRequests);

    const savedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    ) as User | null;
    if (savedUser) {
      setCurrentUser(savedUser);
      const savedUserVotes = JSON.parse(
        localStorage.getItem(`userVotes_${savedUser.id}`) || "{}"
      ) as { [key: number]: boolean };
      setUserVotes(savedUserVotes);
    }
  }, []);

  const validateEmail = (email: string) => {
    const regex =
      /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo)\.[a-zA-Z]{2,}$/i;
    return regex.test(email);
  };

  const sendOTP = () => {
    if (validateEmail(email)) {
      const generatedOTP = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      console.log("OTP:", generatedOTP); // For demonstration purposes
      setOtpSent(true);
      alert("OTP sent to your email!");
    } else {
      alert(
        "Please enter a valid email from Gmail, Hotmail, Outlook, or Yahoo."
      );
    }
  };

  const verifyOTP = () => {
    // In a real app, verify OTP with the server
    // For this demo, we'll assume the OTP is correct
    const userId = `user_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const newUser: User = { id: userId, email: email };
    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    return true;
  };

  const submitFeatureRequest = () => {
    if (verifyOTP() && currentUser) {
      const newFeature: Feature = {
        id: Date.now(),
        title: featureTitle,
        description: featureDescription,
        votes: 0,
        submittedBy: currentUser.email,
      };
      const updatedFeatureRequests = [...featureRequests, newFeature];
      setFeatureRequests(updatedFeatureRequests);
      localStorage.setItem(
        "featureRequests",
        JSON.stringify(updatedFeatureRequests)
      );

      // Reset form
      setFeatureTitle("");
      setFeatureDescription("");
      setOtpSent(false);
      setOtp("");

      alert("Feature request submitted successfully!");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleVote = (featureId: number) => {
    if (!currentUser) {
      alert("Please log in to vote.");
      return;
    }

    if (userVotes[featureId]) {
      alert("You have already voted for this feature.");
      return;
    }

    const updatedFeatureRequests = featureRequests.map((feature) =>
      feature.id === featureId
        ? { ...feature, votes: feature.votes + 1 }
        : feature
    );
    setFeatureRequests(updatedFeatureRequests);
    localStorage.setItem(
      "featureRequests",
      JSON.stringify(updatedFeatureRequests)
    );

    const updatedUserVotes = { ...userVotes, [featureId]: true };
    setUserVotes(updatedUserVotes);
    localStorage.setItem(
      `userVotes_${currentUser.id}`,
      JSON.stringify(updatedUserVotes)
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserVotes({});
    localStorage.removeItem("currentUser");
    localStorage.removeItem(`userVotes_${currentUser?.id}`);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <Sparkles className="inline-block mr-2 text-yellow-400" />
          Shape the Future of <span className="text-purple-400">WorkWay</span>
        </h1>

        {currentUser ? (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                Submit Your Feature Idea
              </h2>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Logout
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={featureTitle}
                onChange={(e) => setFeatureTitle(e.target.value)}
                placeholder="Feature Title"
                className="w-full bg-gray-700 rounded-md py-2 px-3 text-white"
              />
              <textarea
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
                placeholder="Feature Description"
                className="w-full bg-gray-700 rounded-md py-2 px-3 text-white h-32"
              ></textarea>
              <button
                onClick={submitFeatureRequest}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
              >
                <Send className="mr-2" />
                Submit Feature Request
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Login to Submit Ideas
            </h2>
            {!otpSent ? (
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-gray-700 rounded-md py-2 px-3 text-white"
                />
                <button
                  onClick={sendOTP}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                >
                  Send OTP
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full bg-gray-700 rounded-md py-2 px-3 text-white"
                />
                <button
                  onClick={verifyOTP}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Popular Feature Requests
          </h2>
          {featureRequests
            .sort((a, b) => b.votes - a.votes)
            .map((feature) => (
              <div key={feature.id} className="bg-gray-700 rounded-lg p-4 mb-4">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleVote(feature.id)}
                    className={`flex items-center ${
                      userVotes[feature.id]
                        ? "bg-green-600"
                        : "bg-purple-600 hover:bg-purple-700"
                    } text-white font-bold py-2 px-4 rounded-md transition duration-300`}
                    disabled={userVotes[feature.id] || !currentUser}
                  >
                    <ThumbsUp className="mr-2" />
                    {feature.votes} {feature.votes === 1 ? "Vote" : "Votes"}
                  </button>
                  <span className="text-gray-400">
                    Submitted by: {feature.submittedBy}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
