import React, { useState, useEffect } from "react";
import "../chat.css";
import { useWeb3 } from "../../../Web3Provider";
import { useSmartWallet } from "../../../SmartWallet";
import { useWallet } from "../../WalletContext";
import { toast } from "sonner";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as MetamaskChain from "./EscrowChainIntegration";
import * as SmartWalletChain from "./SmEscrowChainIntegration";
import API_URL from "../../../config";
import { useAccount } from "wagmi";

const Escrow = ({ jobId, chatId, currentStatus, trackWalletAddress }) => {
  const { walletType, setWalletType } = useWallet();
  const { address: SmwalletAddress, isConnected } = useAccount();

  console.log(
    "Smart Wallet Address:",
    SmwalletAddress,
    "Connected:",
    isConnected
  );

  // Call both hooks unconditionally
  const web3 = useWeb3();
  const smartWallet = useSmartWallet();
  const { connectWallet, walletAddress, connected } =
    (walletType === "metamask"
      ? web3
      : walletType === "smartwallet"
      ? smartWallet
      : {}) || {};

  const [sender, setSender] = useState("");

  const [buttonStates, setButtonStates] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [chat, setChat] = useState(null); // Add this state to store chat details
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

  // Fetch chat details when the component mounts
  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/chat/chatdetails/${jobId}/chat/${chatId}`
        );
        setChat(response.data);
        console.log("Chat details fetched:", response.data);
        // Make sure chatId exists
        if (!response.data._id) {
          console.error("chatId is missing in the response");
        } else {
          console.log("Chat ID is:", response.data._id); // This should be the `chatId`
        }

        console.log("User Role:", userRole);
        console.log("User ID:", userId);
        console.log("Customer ID:", response.data.customerId);
        console.log("Talent ID:", response.data.talentId);
      } catch (error) {
        console.error("Error fetching chat details:", error);
      }
    };

    fetchChatDetails();
  }, [jobId, chatId, userRole, userId]);

  useEffect(() => {
    console.log("Job ID:", jobId);
    console.log("Current Status:", currentStatus);
    console.log("Escrow wallet address:", walletAddress);
    console.log("User Role:", userRole);
    console.log("Track Wallet Address:", trackWalletAddress);

    const statusMapping = {
      offered: [true, false, false, false, false],
      deposited: [true, true, false, false, false],
      inProgress: [true, true, true, false, false],
      completed: [true, true, true, true, false],
      confirmed: [true, true, true, true, true],
    };

    if (currentStatus in statusMapping) {
      setButtonStates(statusMapping[currentStatus]);
    }
  }, [jobId, currentStatus]);

  const handleClick = async (index, status, requiredRole) => {
    if (userRole !== requiredRole) {
      toast.error(`Switch to ${requiredRole} role for this action.`);
      return;
    }

    const updatedStates = [...buttonStates];
    if (!updatedStates[index] && (index === 0 || updatedStates[index - 1])) {
      updatedStates[index] = true;
      setButtonStates(updatedStates);

      await handleStatusUpdate(status, index);
    }
  };

  const handleStatusUpdate = async (newStatus, index) => {
    if (!connected) {
      await connectWallet();
    }

    const chainActions =
      walletType === "smartwallet" ? SmartWalletChain : MetamaskChain;

    try {
      if (index === 1) {
        await chainActions.deposit(
          jobId,
          chat.customerId,
          chat.talentId,
          walletAddress,
          chatId
        );
      } else if (index === 3) {
        await chainActions.complete(
          jobId,
          chat.customerId,
          chat.talentId,
          walletAddress,
          chatId
        );
      } else if (index === 4) {
        await chainActions.confirm(
          jobId,
          chat.customerId,
          chat.talentId,
          walletAddress,
          chatId
        );
      }

      const response = await axios.put(
        `${API_URL}/api/v1/chat/chatdetails/${jobId}/chat/${chatId}`,
        {
          walletAddress,
          status: newStatus,
          userId,
          userRole,
        }
      );
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error.message);
      toast.error("Failed to update status.");
    }
  };

  const ropeProgress = buttonStates.filter((state) => state).length;

  return (
    <div className="progress-container">
      <div
        className="progress-rope"
        style={{
          width: `calc((100% / 4) * ${ropeProgress})`,
        }}
      ></div>

      <button
        className={`progress-btn ${buttonStates[0] ? "active" : ""} ${
          !buttonStates[0] ? "highlight" : ""
        }`}
        onClick={() => handleClick(0, "offered", "Customer")}
      >
        Offer
      </button>

      <button
        className={`progress-btn ${buttonStates[1] ? "active" : ""} ${
          !buttonStates[1] && buttonStates[0] ? "highlight" : ""
        }`}
        onClick={() => handleClick(1, "deposited", "Customer")}
        disabled={!buttonStates[0]}
      >
        Deposit
      </button>

      <button
        className={`progress-btn ${buttonStates[2] ? "active" : ""} ${
          !buttonStates[2] && buttonStates[1] ? "highlight" : ""
        }`}
        onClick={() => handleClick(2, "inProgress", "Talent")}
        disabled={!buttonStates[1]}
      >
        In-Progress
      </button>

      <button
        className={`progress-btn ${buttonStates[3] ? "active" : ""} ${
          !buttonStates[3] && buttonStates[2] ? "highlight" : ""
        }`}
        onClick={() => handleClick(3, "completed", "Talent", true)}
        disabled={!buttonStates[2]}
      >
        Completed
      </button>

      <button
        style={{
          borderTopRightRadius: "100px",
          borderBottomRightRadius: "100px",
        }}
        className={`progress-btn ${buttonStates[4] ? "active" : ""} ${
          !buttonStates[4] && buttonStates[3] ? "highlight" : ""
        }`}
        onClick={() => handleClick(4, "confirmed", "Customer")}
        disabled={!buttonStates[3]}
      >
        Confirmed
      </button>
    </div>
  );
};

export default Escrow;
