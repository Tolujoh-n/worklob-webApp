import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import eth from "../assets/img/eth.png";
import worklob from "../assets/img/worklob-coin.png";
import useimage from "../assets/address.jpg";
import Modal from "./Modal";
import { useWeb3 } from "../Web3Provider";
import { useSmartWallet } from "../SmartWallet";
import { useWallet } from "./WalletContext";
import Followhr from "./Followhr";

const Sidebar = () => {
  const { walletType, setWalletType } = useWallet();

  // Call both hooks unconditionally
  const web3 = useWeb3();
  const smartWallet = useSmartWallet();

  const [isGamemodalOpen, setIsGamemodalOpen] = useState(false);
  const { baseETHBalance, lobBalance } =
    (walletType === "metamask"
      ? web3
      : walletType === "smartwallet"
      ? smartWallet
      : {}) || {};

  const handleGamemodalClick = () => {
    setIsGamemodalOpen(true);
  };

  const handleCloseGamemodal = () => {
    setIsGamemodalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // claim
    handleCloseGamemodal();
  };

  return (
    <>
      <div className="col-lg-4">
        {/* Recent Activity */}
        <div className="card info-card revenue-card">
          <div className="card-body">
            <h5 className="card-title">Balance:</h5>
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                <img id="balance" src={eth} alt="" />
              </div>
              <div className="ps-3">
                <h6>{parseFloat(baseETHBalance).toFixed(4)} ETH</h6>
              </div>
            </div>
            <hr />
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                <img id="balance" src={worklob} alt="" />
              </div>
              <div className="ps-3">
                <h6>{parseFloat(lobBalance).toFixed(2)} LOB</h6>
              </div>
            </div>
          </div>
        </div>
        {/* End Recent Activity */}

        {/* News & Updates Traffic */}
        <div className="card">
          <Followhr />
        </div>
        {/* End News & Updates */}
      </div>
      <>
        {/* Render the Gamemodal if isGamemodalOpen is true */}
        {isGamemodalOpen && (
          <Modal onClose={handleCloseGamemodal} onSubmit={handleSubmit} />
        )}
      </>
    </>
  );
};

export default Sidebar;
