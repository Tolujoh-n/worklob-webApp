import React, { useState } from "react";
import { useWeb3 } from "../../Web3Provider";
import { Toaster, toast } from "sonner";
import Web3 from "web3";
import { LOB_TOKEN_ADDRESS, LOB_TOKEN_ABI } from "../Constants";
import ETHLogo from "../../assets/img/eth.png";
import LOBLogo from "../../assets/img/worklob-coin.png";

const Swapmodal = ({ isOpen, onClose }) => {
  const { connectWallet, walletAddress, connected } = useWeb3();
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("LOB");
  const [amount, setAmount] = useState("");

  const handleFromTokenChange = (e) => setFromToken(e.target.value);
  const handleToTokenChange = (e) => setToToken(e.target.value);
  const handleAmountChange = (e) => setAmount(e.target.value);

  const handleSwap = async () => {
    if (!amount) {
      toast.error("Please enter the amount to swap.");
      return;
    }

    const web3 = new Web3(Web3.givenProvider);
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];

    try {
      if (fromToken === "ETH" && toToken === "LOB") {
        const contract = new web3.eth.Contract(
          LOB_TOKEN_ABI,
          LOB_TOKEN_ADDRESS
        );
        await web3.eth.sendTransaction({
          from: sender,
          to: LOB_TOKEN_ADDRESS,
          value: web3.utils.toWei(amount, "ether"),
        });
        await contract.methods
          .transfer(sender, web3.utils.toWei(amount, "ether"))
          .send({ from: sender });
      } else if (fromToken === "LOB" && toToken === "ETH") {
        const contract = new web3.eth.Contract(
          LOB_TOKEN_ABI,
          LOB_TOKEN_ADDRESS
        );
        await contract.methods
          .transfer(LOB_TOKEN_ADDRESS, web3.utils.toWei(amount, "ether"))
          .send({ from: sender });
        await web3.eth.sendTransaction({
          from: sender,
          to: sender,
          value: web3.utils.toWei(amount, "ether"),
        });
      } else {
        toast.error("Swap between the same tokens is not allowed.");
        return;
      }

      toast.success("Swap successful!");
    } catch (error) {
      toast.error(`Swap failed: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content" style={modalContentStyle}>
        {connected ? (
          <>
            <h3 style={{ textAlign: "center" }}>Swap Tokens</h3>
            <div className="form-group" style={formGroupStyle}>
              <label style={labelStyle}>From</label>
              <div style={tokenSelectStyle}>
                <select
                  value={fromToken}
                  onChange={handleFromTokenChange}
                  style={formControlStyle}
                >
                  <option value="ETH">ETH (Base)</option>
                  <option value="LOB">LOB</option>
                </select>
                <img
                  src={fromToken === "ETH" ? ETHLogo : LOBLogo}
                  alt={fromToken}
                  style={tokenLogoStyle}
                />
              </div>
            </div>
            <div className="form-group" style={formGroupStyle}>
              <label style={labelStyle}>To</label>
              <div style={tokenSelectStyle}>
                <select
                  value={toToken}
                  onChange={handleToTokenChange}
                  style={formControlStyle}
                >
                  <option value="LOB">LOB</option>
                  <option value="ETH">ETH (Base)</option>
                </select>
                <img
                  src={toToken === "ETH" ? ETHLogo : LOBLogo}
                  alt={toToken}
                  style={tokenLogoStyle}
                />
              </div>
            </div>
            <div className="form-group" style={formGroupStyle}>
              <label style={labelStyle}>Amount</label>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={handleAmountChange}
                style={formControlStyle}
              />
            </div>

            <div className="wallet-buttons">
              <button className="closemodall-button" onClick={onClose}>
                Close
              </button>
              <button className="modall-button" onClick={handleSwap}>
                Swap Tokens
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 style={{ textAlign: "center" }}>Connect wallet to swap</h3>
            <div style={{ textAlign: "center" }}>
              <button onClick={connectWallet} className="modall-button">
                Connect Wallet
              </button>
            </div>
            <br></br>
            <button className="closemodall-button" onClick={onClose}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Swapmodal;

const modalStyle = {
  display: "block",
  position: "fixed",
  zIndex: "9999",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
};

const modalContentStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "80%",
  width: "auto",
  minWidth: "300px",
  background: "#1a2c38",
  border: "1px solid white",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

const formGroupStyle = {
  marginBottom: "15px",
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#d5dceb",
};

const formControlStyle = {
  width: "calc(100% - 40px)",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  background: "#fff",
  color: "#5c5a5a",
  display: "inline-block",
  verticalAlign: "middle",
};

const tokenSelectStyle = {
  display: "flex",
  alignItems: "center",
};

const tokenLogoStyle = {
  width: "30px",
  height: "30px",
  marginLeft: "10px",
};

const swapButtonStyle = {
  padding: "10px 15px",
  marginTop: "15px",
  background: "#1a73e8",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const connectButtonStyle = {
  padding: "10px 15px",
  marginTop: "15px",
  background: "#1a73e8",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const closeButtonStyle = {
  padding: "10px 15px",
  marginTop: "15px",
  background: "#1a73e8",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
