import React, { useState } from "react";
import AgentsList from "./AgentsList";
import Chatbot from "./Chatbot";
import "./ai.css";
import API_URL from "../../config";

import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

function Agents() {
  const [activeTab, setActiveTab] = useState("aiagents");
  const token = localStorage.getItem("token");

  let userId;

  const user = JSON.parse(localStorage.getItem("user"));
  let userRole = user?.role;
  console.log("User Role:", userRole);
  console.log("User ID:", user);

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
  }

  // Add a fallback for user
  const username = user ? user.username : "Guest";

  const handleClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="pagetitle">
        <h1>AI Agents</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard/">Dashboard</a>
            </li>
            <li className="breadcrumb-item active">ai</li>
          </ol>
        </nav>
      </div>

      <div className="stakebuttonn">
        <div
          style={{
            background: "#213743",
            padding: "10px",
            borderRadius: "20px",
          }}
          className="checkstake"
        >
          <button
            className={`stakes-button ${
              activeTab === "aiagents" ? "active" : ""
            }`}
            onClick={() => handleClick("aiagents")}
          >
            AI Agents
          </button>
          <button
            className={`stakes-button ${
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => handleClick("overview")}
          >
            ChatBot
          </button>
        </div>
      </div>

      {activeTab === "aiagents" && <AgentsList />}
      {activeTab === "overview" && <Chatbot />}
    </>
  );
}

export default Agents;
