import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../Web3Provider";
import { useSmartWallet } from "../../SmartWallet";
import Walletmodal from "../Walletmodal";
import { useMemo } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { useWriteContracts, useCapabilities } from "wagmi/experimental";
import { parseEther } from "viem";
import { createPublicClient, custom } from "viem";

import { useWallet } from "../WalletContext";
import { Toaster, toast } from "sonner";
import Web3 from "web3";
import { LOB_TOKEN_ADDRESS, LOB_TOKEN_ABI } from "../Constants";

const Transfermodal = ({ isOpen, onClose }) => {
  const { walletType, setWalletType } = useWallet();
  const [isWalletmodalOpen, setIsWalletmodalOpen] = useState(false);
  const openWalletmodal = () => setIsWalletmodalOpen(true);
  const closeWalletmodal = () => setIsWalletmodalOpen(false);

  // Call both hooks unconditionally
  const web3 = useWeb3();
  const smartWallet = useSmartWallet();
  const { connectWallet, connected } =
    (walletType === "metamask"
      ? web3
      : walletType === "smartwallet"
      ? smartWallet
      : {}) || {};

  const [token, setToken] = useState("ETH");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sender, setSender] = useState("");
  const account = useAccount();
  const { sendTransactionAsync, data } = useSendTransaction();
  const { writeContracts } = useWriteContracts();
  const { data: availableCapabilities } = useCapabilities({
    account: account.address,
  });

  const capabilities = useMemo(() => {
    if (!availableCapabilities || !account.chainId) return {};
    const caps = availableCapabilities[account.chainId];
    if (caps?.PaymasterService?.supported) {
      return {
        PaymasterService: {
          url: process.env.REACT_PUBLIC_PAYMASTER_PROXY_SERVER_URL,
        },
      };
    }
    return {};
  }, [availableCapabilities, account.chainId]);

  const handleSmTransfer = async () => {
    if (!recipient || !amount) {
      toast.error("Please enter recipient address and amount.");
      return;
    }

    if (!account.address) {
      toast.error("Smart Wallet not connected.");
      return;
    }

    try {
      const parsedAmount = parseEther(amount.toString());

      if (token === "ETH") {
        // ✅ Use sendTransactionAsync for native ETH
        await sendTransactionAsync({
          to: recipient,
          value: parsedAmount,
        });
      } else {
        await writeContracts({
          contracts: [
            {
              address: LOB_TOKEN_ADDRESS,
              abi: LOB_TOKEN_ABI,
              functionName: "transfer",
              args: [recipient, parsedAmount],
            },
          ],
          capabilities,
        });
      }

      toast.success("Transfer successful!");
      onClose();
    } catch (error) {
      console.error("Smart wallet transfer failed:", error);
      toast.error(`Transfer failed: ${error.message}`);
    }
  };

  const handleMetaTransfer = async () => {
    if (!recipient || !amount) {
      toast.error("Please enter recipient address and amount.");
      return;
    }

    if (!sender) {
      toast.error("Wallet not connected. Please connect your wallet.");
      return;
    }

    const web3 = new Web3(window.ethereum);
    let contractAddress =
      token === "ETH"
        ? "0x0000000000000000000000000000000000000000"
        : LOB_TOKEN_ADDRESS;

    console.log("LOB contract address:", LOB_TOKEN_ADDRESS);
    console.log("Sender address:", sender);

    try {
      if (token === "ETH") {
        await web3.eth.sendTransaction({
          from: sender,
          to: recipient,
          value: web3.utils.toWei(amount, "ether"),
        });
      } else {
        const contract = new web3.eth.Contract(LOB_TOKEN_ABI, contractAddress);
        await contract.methods
          .transfer(recipient, web3.utils.toWei(amount, "ether"))
          .send({ from: sender });
      }

      toast.success("Transfer successful!");
      onClose();
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error(`Transfer failed: ${error.message}`);
    }
  };

  useEffect(() => {
    if (walletType === "metamask" && web3?.getAddress) {
      web3.getAddress().then((address) => setSender(address));
    } else if (walletType === "smartwallet" && smartWallet?.getAddress) {
      smartWallet.getAddress().then((address) => setSender(address));
    }
  }, [walletType, web3, smartWallet]);

  if (!isOpen) return null;

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <Toaster position="top-right" />
        {connected ? (
          <>
            <h3 style={{ textAlign: "center" }}>Transfer Token</h3>
            <div className="form-group" style={formGroupStyle}>
              <label style={labelStyle}>Token</label>
              <select
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={formControlStyle}
              >
                <option value="ETH">ETH (Base)</option>
                <option value="LOB">LOB</option>
              </select>
            </div>
            <div className="form-group" style={formGroupStyle}>
              <label style={labelStyle}>Recipient Address</label>
              <input
                type="text"
                placeholder="0xb9b4....83a"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                style={formControlStyle}
              />
            </div>
            <div className="form-group" style={formGroupStyle}>
              <label style={labelStyle}>Amount to Send</label>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={formControlStyle}
              />
            </div>

            <div className="wallet-buttons">
              <button className="closemodall-button" onClick={onClose}>
                Close
              </button>
              <button
                className="modall-button"
                onClick={
                  walletType === "smartwallet"
                    ? handleSmTransfer
                    : handleMetaTransfer
                }
              >
                Transfer Token
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 style={{ textAlign: "center" }}>Connect wallet to transfer</h3>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => {
                  if (connected) {
                    closeWalletmodal();
                  } else {
                    openWalletmodal();
                  }
                }}
                className="modall-button"
              >
                Connect Wallet
              </button>
            </div>
            <br />
            <button className="closemodall-button" onClick={onClose}>
              Close
            </button>
          </>
        )}
      </div>
      <Walletmodal isOpen={isWalletmodalOpen} onClose={closeWalletmodal} />
    </div>
  );
};

export default Transfermodal;

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
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  background: "#fff",
  color: "#5c5a5a",
};

const transferButtonStyle = {
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
