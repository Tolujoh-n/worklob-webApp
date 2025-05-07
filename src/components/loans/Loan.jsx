import React, { useState, useEffect } from "react";
import Borrow from "./Borrow";
import Lend from "./Lend";
import "./loanasset/loanstyle.css";
import { useWeb3 } from "../../Web3Provider";
import { useSmartWallet } from "../../SmartWallet";
import { useWallet } from "../WalletContext";
import { Toaster, toast } from "sonner";

const Loan = () => {
  const { walletType, setWalletType } = useWallet();

  // Call both hooks unconditionally
  const web3 = useWeb3();
  const smartWallet = useSmartWallet();

  const [activeTab, setActiveTab] = useState("overview");
  const { connectWallet, connected } =
    (walletType === "metamask"
      ? web3
      : walletType === "smartwallet"
      ? smartWallet
      : {}) || {};

  const [sender, setSender] = useState("");

  const handleClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="pagetitle">
        <h1>Lending and Borrowing</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard">Dashboard</a>
            </li>
            <li className="breadcrumb-item active">loans</li>
          </ol>
        </nav>
      </div>

      <div className="text-right">
        <a href="/dashboard/loan_portfolio">
          <button className="btn btn-primary mystake-button">
            <i className="bi bi-bar-chart-line"></i> Portfolio
          </button>
        </a>

        <a href="/dashboard/loan_list">
          <button className="btn btn-primary mystake-button">
            <i className="bi bi-cash"></i> my Loans
          </button>
        </a>
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
            Borrow
          </button>
          <button
            className={`stakes-button ${
              activeTab === "staking" ? "active" : ""
            }`}
            onClick={() => handleClick("staking")}
          >
            Lend
          </button>
        </div>
      </div>

      {activeTab === "overview" && <Borrow />}
      {activeTab === "staking" && <Lend />}
    </>
  );
};

export default Loan;
