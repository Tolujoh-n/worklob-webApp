import React, { useState } from "react";
import useImage from "../assets/address.jpg";
import { Link } from "react-router-dom";
import Modal from "./Modal"; // Assuming Modal is still required
import Notification from "./Notification";
import { useWeb3 } from "../Web3Provider";
import { useSmartWallet } from "../SmartWallet";
import { useWallet } from "./WalletContext";
import { Toaster, toast } from "sonner";
import Walletmodal from "./Walletmodal";

const truncateText = (text, wordLimit) => {
  if (!text || text.trim() === "") return "No description available";
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
};

const Dash = () => {
  const { walletType, setWalletType } = useWallet();
  const [isWalletmodalOpen, setIsWalletmodalOpen] = useState(false);
  const openWalletmodal = () => setIsWalletmodalOpen(true);
  const closeWalletmodal = () => setIsWalletmodalOpen(false);
  // Call both hooks unconditionally
  const web3 = useWeb3();
  const smartWallet = useSmartWallet();
  const [selectedTab, setSelectedTab] = useState("active");
  const { connectWallet, connected, baseETHBalance, walletAddress } =
    (walletType === "metamask"
      ? web3
      : walletType === "smartwallet"
      ? smartWallet
      : {}) || {};

  const tabContent = {
    active: {
      heading: "Explore Job Mining Opportunities",
      paragraph:
        "Stake our platform token and start mining jobs. Experience the benefits of decentralized job mining today.",
      button: "Start Mining",
      link: "/dashboard/staking",
    },
    draft: {
      heading: "Trade Tokens Seamlessly",
      paragraph:
        "Trade tokens seamlessly on our platform. Enjoy competitive rates and a secure trading environment.",
      button: "Start Trading",
      link: "/dashboard/trade",
    },
    archive: {
      heading: "Get Involved in Governance",
      paragraph:
        "Participate in the governance of our platform. Vote on proposals and be a part of important decisions.",
      button: "Participate",
      link: "/dashboard/governance",
    },
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Wallet address copied to clipboard!");
  };

  return (
    <>
      <Notification />
      <div className="job-list">
        <div className="nav-toggle">
          <button
            className={selectedTab === "active" ? "active" : ""}
            onClick={() => setSelectedTab("active")}
          >
            Job Mining
          </button>
          <button
            className={selectedTab === "draft" ? "active" : ""}
            onClick={() => setSelectedTab("draft")}
          >
            Trade
          </button>
          <button
            className={selectedTab === "archive" ? "active" : ""}
            onClick={() => setSelectedTab("archive")}
          >
            Governance
          </button>
        </div>

        <div className="tabb-content">
          <h2 className="tabb-heading">{tabContent[selectedTab].heading}</h2>
          <p className="tabb-paragraph">{tabContent[selectedTab].paragraph}</p>
          <div className="text-center">
            <Link to={tabContent[selectedTab].link} className="modall-button">
              {tabContent[selectedTab].button}
            </Link>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="walletinfo-box card">
          <div className="d-flex justify-content-between align-items-center">
            {/* Wallet information section */}
            <div className="wallet-info" style={{ marginRight: "10px" }}>
              <h3 className="wallet-title">Wallet</h3>
              <h5 className="balance-label">Estimated Balance</h5>
              <h5 className="balance-label">Escrow Balance</h5>
            </div>

            {/* Wallet management section */}
            <div className="wallet-manage">
              <Link to="/dashboard/wallet">
                <p className="manage-wallet">
                  <i className="bi-wallet"></i> Manage Wallet
                </p>
              </Link>
              {connected ? (
                <>
                  <h5 className="balance-amount">
                    {parseFloat(baseETHBalance).toFixed(2)} ETH
                  </h5>
                  <h5 className="balance-amount">$00.00</h5>
                </>
              ) : (
                <>
                  <h5 className="balance-amount">$00.0</h5>
                  <h5 className="balance-amount">$00.0</h5>
                </>
              )}
            </div>
          </div>
          {connected && (
            <p className="walllet-address">
              {walletAddress}{" "}
              <span onClick={handleCopyAddress}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  class="bi bi-copy"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                  />
                </svg>
              </span>
            </p>
          )}

          <br />

          {connected ? null : (
            <button
              className="walletbtn"
              onClick={() => {
                if (connected) {
                  closeWalletmodal();
                } else {
                  openWalletmodal();
                }
              }}
            >
              <i className="bi bi-wallet"></i> Connect Wallet
            </button>
          )}
        </div>
        <Walletmodal isOpen={isWalletmodalOpen} onClose={closeWalletmodal} />
      </div>
    </>
  );
};

export default Dash;
