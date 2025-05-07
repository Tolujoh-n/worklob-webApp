import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ai.css";

import eth from "../../assets/img/eth.png";
import Aidata from "./Aidata";
import { useWeb3 } from "../../Web3Provider";
import { useSmartWallet } from "../../SmartWallet";
import { useWallet } from "../WalletContext";

const AgentsList = () => {
  const navigate = useNavigate();
  const { walletType, setWalletType } = useWallet();

  // Call both hooks unconditionally
  const web3 = useWeb3();
  const smartWallet = useSmartWallet();

  const { connectWallet, walletAddress, connected } =
    (walletType === "metamask"
      ? web3
      : walletType === "smartwallet"
      ? smartWallet
      : {}) || {};

  const handleRedirect = (id) => {
    navigate(`/dashboard/${id}/ai_agents_details`);
  };

  return (
    <div className="aiagent container py-4">
      <div className="row">
        {Aidata.map((agent, index) => (
          <div className="col-md-6 col-lg-4 mb-4" key={index}>
            <div className="card h-100">
              <img
                src={agent.image}
                alt={agent.title}
                className="card-image card-img-top"
              />
              <div className="">
                <h2 className="card-title h5">{agent.name}</h2>
                <p className="card-description">{agent.description}</p>
              </div>
              <div className="card-checkk d-flex justify-content-between align-items-center">
                <span className="card-price">
                  <img src={eth} alt="Lobcoin" className="lobcoin-icon" />{" "}
                  {agent.singleFee} ETH
                </span>
                <span className="card-author">Author: {agent.author}</span>
              </div>

              {connected ? (
                <button
                  className="aibut"
                  onClick={() => handleRedirect(agent.id)}
                >
                  View Details
                </button>
              ) : (
                <button className="aibut" onClick={connectWallet}>
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <p id="moreagenttext">More AI Agents Coming Soon...</p>
    </div>
  );
};

export default AgentsList;
