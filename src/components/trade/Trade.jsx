import React, { useState, useEffect } from "react";
import TradeAIchatbot from "./TradeAIchatbot";
import TradeChart from "./TradeChart";
import Tradeform from "./Tradeform";
import Tradetables from "./Tradetables";
import Orderbook from "./Orderbook";
import btcimg from "../../assets/img/btc.png";
import { useWeb3 } from "../../Web3Provider";
import { useSmartWallet } from "../../SmartWallet";
import { useWallet } from "../WalletContext";
import { Toaster, toast } from "sonner";
import useCryptoPrices from "./UseCryptoPrices"; // import the hook
import "./trade.css";

const Trade = () => {
  const { walletType, setWalletType } = useWallet();

  // Call both hooks unconditionally
  const web3 = useWeb3();
  const smartWallet = useSmartWallet();
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const { connectWallet, connected } =
    (walletType === "metamask"
      ? web3
      : walletType === "smartwallet"
      ? smartWallet
      : {}) || {};

  const [sender, setSender] = useState("");

  const pairDetails = useCryptoPrices();

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

  const defaultDetail = {
    price: "Loading...",
    change: "--",
    high: "--",
    low: "--",
    image: btcimg,
  };

  const currentDetails = {
    ...defaultDetail,
    ...pairDetails[selectedPair],
    image: btcimg, // You can improve by assigning different images later
  };

  return (
    <div className="worklobtrading container-fluid trade-container">
      {/* Coin Pair Selection */}
      <div className="row">
        <div className="col-md-12 pairs">
          <div className="pairs-select">
            <select
              className="form-select"
              onChange={(e) => setSelectedPair(e.target.value)}
              value={selectedPair}
            >
              <option value="BTC/USDT">BTC/USDT</option>
              <option value="ETH/USDT">ETH/USDT</option>
              <option value="BNB/USDT">BNB/USDT</option>
            </select>
          </div>

          <div className="pair-details">
            <div className="pair-info">
              <img
                src={currentDetails.image}
                alt={selectedPair}
                className="token-image"
              />
              <span>{selectedPair}</span>
            </div>
            <div className="price-info">
              <p>Price: {currentDetails.price}</p>
              <p className="price-change">{currentDetails.change}</p>
            </div>
            <div className="price-info">
              <p>24H High: </p>
              <p className="price-change">{currentDetails.high}</p>
            </div>
            <div className="price-info">
              <p>24H Low:</p>
              <p className="price-change">{currentDetails.low}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart and Chatbot */}
      <div className="row">
        <div className="col-md-6 tradechart">
          <TradeChart />
        </div>
        <div className="col-md-6 tradebot">
          <TradeAIchatbot />
        </div>
      </div>

      {/* Order Book & Trade Inputs */}
      <div className="row">
        <div className="col-md-6 order-book">
          <Orderbook />
        </div>
        <div className="col-md-6 tradentry-ui">
          <Tradeform />
        </div>
      </div>

      {/* Trading Tables */}
      <div className="row">
        <div className="col-md-12 trade-history">
          <Tradetables />
        </div>
      </div>
    </div>
  );
};

export default Trade;
