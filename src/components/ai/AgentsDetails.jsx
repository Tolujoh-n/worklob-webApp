import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Aidata from "./Aidata";
import eth from "../../assets/img/eth.png";
import AI_Integration from "./AI_Integration";
import { toast } from "sonner";
import MarkdownMessage from "./MarkdownMessage";
import { useWeb3 } from "../../Web3Provider";
import { useSmartWallet } from "../../SmartWallet";
import { useWallet } from "../WalletContext";

import * as MetamaskChain from "./AI_blockchain";
// import * as SmartWalletChain from "./Sm_AI_blockchain";

// import { useMetaAIActions } from "./AI_blockchain";
import { useSmAIActions } from "./Sm_AI_blockchain";

import "./ai.css";

function AgentsDetails() {
  const { id } = useParams();
  const agent = Aidata.find((a) => a.id === parseInt(id));
  const aiId = agent?.id;
  const providerAddress = agent?.provider_address;
  const singleFee = agent?.singleFee;
  const { walletType, setWalletType } = useWallet();

  const smartWalletChain = useSmAIActions();

  const chainActions =
    walletType === "smartwallet" ? smartWalletChain : MetamaskChain;

  const web3 = useWeb3();
  const smartWallet = useSmartWallet();
  const { connectWallet, walletAddress, connected } =
    (walletType === "metamask"
      ? web3
      : walletType === "smartwallet"
      ? smartWallet
      : {}) || {};

  const navigate = useNavigate();

  const [userInput, setUserInput] = useState("");
  const [step, setStep] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const aiRef = useRef();

  const [subscriptionType, setSubscriptionType] = useState("1 day");
  const [subscriptionPrice, setSubscriptionPrice] = useState(agent?.basePrice);

  // please fetch from the blockchain the start and end date of the subscription here
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [timeLeft, setTimeLeft] = useState("");
  const [fileError, setFileError] = useState("");

  const isSubscribed = endDate && new Date() < endDate;

  useEffect(() => {
    if (!connected) {
      // Redirect if not connected
      navigate("/dashboard/ai_agents");
    }
  }, [connected, navigate]);

  // To fetch subscription status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      if (!walletAddress || !aiId || !connected) return;

      try {
        const status = await chainActions.getSubscriptionStatus(
          walletAddress,
          aiId
        );
        console.log("Subscription status:", status);

        setStartDate(status.startDate);
        setEndDate(status.endDate);
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      }
    };

    fetchStatus();
  }, [walletAddress, aiId, connected]);

  useEffect(() => {
    if (startDate && endDate) {
      console.log("Fetched subscription:", {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (isSubscribed) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = endDate - now;

        if (diff < 0) {
          setTimeLeft("Expired");
          clearInterval(interval);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (days >= 30) {
          const months = Math.floor(days / 30);
          setTimeLeft(`${months} month${months > 1 ? "s" : ""} left`);
        } else if (days >= 1) {
          setTimeLeft(`${days} day${days > 1 ? "s" : ""} left`);
        } else {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [endDate, isSubscribed]);

  useEffect(() => {
    const multipliers = {
      "1 day": 1,
      "7 days": 7,
      "30 days": 30,
      "1 year": 365,
    };
    setSubscriptionPrice(
      (agent.basePrice * multipliers[subscriptionType]).toFixed(5)
    );
  }, [subscriptionType, agent.basePrice]);

  const handleSubscribe = async () => {
    const now = new Date();
    const durations = {
      "1 day": 1,
      "7 days": 7,
      "30 days": 30,
      "1 year": 365,
    };
    const days = durations[subscriptionType];
    const newEndDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const subscriptionFee = (agent.basePrice * days).toFixed(5);

    console.log("Subscribe function triggered with data:");
    console.log({
      aiId,
      providerAddress,
      now,
      newEndDate,
      subscriptionFee,
    });
    try {
      const result = await chainActions.subscribeToAI(
        agent.id,
        agent.provider_address,
        now,
        newEndDate,
        (agent.basePrice * days).toFixed(6)
      );

      if (result) {
        setStartDate(now);
        setEndDate(newEndDate);
        toast.success("Subscription successful!");
      } else {
        toast.error("Subscription failed");
      }
    } catch (error) {
      toast.error("Error processing subscription");
      console.error("Subscription error:", error);
    }
  };

  const handleProcessClick = () => setStep(2);

  const handleConfirmPayment = async () => {
    console.log("Payment triggered:", {
      aiId,
      providerAddress,
      singleFee,
    });

    try {
      toast.loading("Waiting for transaction confirmation...", { id: "txn" });

      const result = await chainActions.payForSingleUse(
        aiId,
        providerAddress,
        singleFee
      );

      toast.dismiss("txn");

      if (result) {
        toast.success("Single use payment successful");
        setStep(3);
        setLoading(true);
        if (aiRef.current) {
          aiRef.current.triggerAI();
        }
      } else {
        toast.error("Payment failed or rejected");
      }
    } catch (error) {
      toast.dismiss("txn");
      toast.error("Payment failed");
      console.error("handleConfirmPayment error:", error);
    }
  };

  const handleCancel = () => setStep(1);

  const handleStartNewRequest = () => {
    setStep(1);
    setUserInput("");
    setResult(null);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = result.data;
    link.download = "ai-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(result.data);
    toast.success("Text copied to clipboard!");
  };

  const handleSendPrompt = () => {
    setLoading(true);
    setUserInput("");
    if (aiRef.current) {
      aiRef.current.triggerAI(); // Triggers real AI request
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileError("");

    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        if (content.length > 10000) {
          setFileError("Text exceeds 10,000 character limit.");
        } else {
          setUserInput(content);
        }
      };
      reader.readAsText(file);
    } else {
      setFileError("Only .txt files are supported.");
    }
  };

  if (!agent) {
    return <div className="container">Agent not found.</div>;
  }

  return (
    <>
      <div className="pagetitle">
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard/ai_agents">AI Agents</Link>
            </li>
            <li className="breadcrumb-item active">{agent.name}</li>
          </ol>
        </nav>
        <h1>{agent.name}</h1>
        <br />
      </div>

      <div className="row">
        {/* Left Column */}
        <div className="col-md-4">
          <p>{agent.tagline}</p>
          <p>
            Author: <b>{agent.author}</b>
          </p>
          <div className="ai-instruction">
            <h5>Instructions</h5>
            <p>{agent.instructions}</p>
          </div>

          {/* Subscription Box */}
          <div className="mb-3">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label>
                <b>Subscription</b>
              </label>
              {isSubscribed ? (
                <span style={{ color: "gold", fontWeight: "bold" }}>
                  {timeLeft}
                </span>
              ) : (
                <select
                  value={subscriptionType}
                  onChange={(e) => setSubscriptionType(e.target.value)}
                  className="form-select"
                  style={{ maxWidth: "150px" }}
                >
                  <option>1 day</option>
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>1 year</option>
                </select>
              )}
            </div>

            {!isSubscribed && (
              <>
                <p style={{ marginTop: "5px" }}>
                  Process with <b>{subscriptionPrice} ETH</b>
                </p>
                <button className="ai-walletbtn" onClick={handleSubscribe}>
                  Subscribe Now
                </button>
              </>
            )}
          </div>

          {/* Step UI */}
          {isSubscribed ? (
            <div>
              <textarea
                className="form-control"
                placeholder="Enter your input here"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <input
                type="file"
                accept=".txt"
                className="form-control mt-2"
                onChange={handleFileUpload}
              />
              {fileError && <p className="text-danger mt-1">{fileError}</p>}
              <button className="ai-walletbtn mt-2" onClick={handleSendPrompt}>
                Send Prompt
              </button>
            </div>
          ) : step === 1 ? (
            <>
              <textarea
                className="form-control"
                placeholder="Enter your input here"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <input
                type="file"
                accept=".txt"
                className="form-control mt-2"
                onChange={handleFileUpload}
              />
              {fileError && <p className="text-danger mt-1">{fileError}</p>}
              <button
                className="ai-walletbtn mt-2"
                onClick={handleProcessClick}
              >
                <i className="bi bi-rocket"></i> Process with {agent.singleFee}{" "}
                ETH
              </button>
            </>
          ) : step === 2 ? (
            <div className="ai-instruction">
              <p>
                <b>Confirm Payment</b>
              </p>
              <p>
                <b>Cost</b>:{" "}
                <img src={eth} alt="eth" className="lobcoin-detailsicon" />{" "}
                {agent.singleFee} ETH
              </p>
              <p>
                <b>Your Input</b>:{" "}
                {userInput.length > 50
                  ? userInput.slice(0, 50) + "..."
                  : userInput}
              </p>
              <div>
                <button className="ai-walletbtn" onClick={handleConfirmPayment}>
                  Confirm Payment
                </button>
                <button className="ai-walletbtn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="ai-instruction">
              <p style={{ color: "goldenrod" }}>
                Request Completed Successfully
              </p>
              <p>
                Your request has been processed successfully. The result is
                displayed on the right.
              </p>
              <button className="ai-walletbtn" onClick={handleStartNewRequest}>
                Start New Request
              </button>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="col-md-8">
          <div
            className="wallet-card"
            style={{
              minHeight: "35rem",
              border: "1px solid gray",
              borderRadius: "5px",
              padding: "1rem",
              position: "relative",
            }}
          >
            {loading ? (
              <p id="ai-outpara" className="generating-text">
                Generating
                <span className="dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </p>
            ) : result ? (
              result.type === "text" ? (
                <>
                  <i
                    className="bi bi-clipboard"
                    id="aicopyicon"
                    onClick={handleCopyText}
                  ></i>
                  <p style={{ whiteSpace: "pre-wrap" }}>
                    <MarkdownMessage content={result.data} />
                  </p>
                </>
              ) : (
                <>
                  <img
                    src={result.data}
                    alt="AI Result"
                    style={{ maxWidth: "100%", borderRadius: "5px" }}
                  />
                  <button
                    className="airesponse-walletbtn mt-2"
                    onClick={handleDownload}
                  >
                    Download Image
                  </button>
                </>
              )
            ) : (
              <p id="ai-outpara">Task output will appear here.</p>
            )}
          </div>
        </div>
      </div>

      <AI_Integration
        ref={aiRef}
        userInput={userInput}
        systemPrompt={agent.system_prompt}
        type={agent.type}
        id={agent.id}
        onResponse={({ id, output, raw, prompt }) => {
          console.log("AI Response:");
          console.log("userInput:", userInput);
          console.log("systemPrompt:", agent.system_prompt);
          console.log("type:", agent.type);
          console.log("id:", id);
          console.log("output:", output);
          console.log("Prompt sent to AI:", prompt);
          console.log("AI raw response:", raw);

          setResult({ type: agent.type, data: output });
          setLoading(false);
        }}
      />
    </>
  );
}

export default AgentsDetails;
