import React, { useState, useEffect } from "react";
import Staking from "./Staking";
import Mystake from "./Mystake";
import API_URL from "../../config";
import { useWeb3 } from "../../Web3Provider";

import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

function Stake() {
  const [activeTab, setActiveTab] = useState("overview");
  const token = localStorage.getItem("token");
  const { connectWallet, connected } = useWeb3();
  const [sender, setSender] = useState("");

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

  useEffect(() => {
    const getAccount = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setSender(accounts[0]);
        } catch (error) {
          console.error("Error fetching account:", error);
          toast.error("Failed to fetch wallet address");
        }
      }
    };

    if (connected) {
      getAccount();
    }
  }, [connected]);

  return (
    <>
      <div className="pagetitle">
        <h1>Stacking</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/wallet">Stacking</a>
            </li>
            <li className="breadcrumb-item active">coin</li>
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
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => handleClick("overview")}
          >
            Overview
          </button>
          <button
            className={`stakes-button ${
              activeTab === "staking" ? "active" : ""
            }`}
            onClick={() => handleClick("staking")}
          >
            Staking
          </button>
        </div>
      </div>

      {activeTab === "overview" && <Staking />}
      {activeTab === "staking" && <Mystake />}
    </>
  );
}

export default Stake;
