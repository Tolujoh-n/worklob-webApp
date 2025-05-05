import React from "react";
import { useWeb3 } from "../Web3Provider";
import { Toaster, toast } from "sonner";
import metamask from "../assets/img/metamask.png";
import smartwallet from "../assets/img/smart-wallet.png";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { base } from "wagmi/chains";
import { createSiweMessage } from "viem/siwe";
import { useSignMessage } from "wagmi";

const message = createSiweMessage({
  address: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
  chainId: base.id,
  domain: "example.com",
  nonce: "foobarbaz",
  uri: "https://example.com/path",
  version: "1",
});

const Walletmodal = ({ isOpen, onClose }) => {
  const { walletAddress, connected } = useWeb3();
  const { signMessage } = useSignMessage();

  const getSmartWalletAddress = async () => {
    try {
      await ConnectWallet(); // this is from @coinbase/onchainkit
      toast.success("Smart Wallet connected!");
    } catch (error) {
      toast.error("Failed to connect Smart Wallet.");
    }
  };

  const handleSmartwallet = async () => {
    try {
      await getSmartWalletAddress();
    } catch (error) {
      toast.error("Failed to connect Smart Wallet.");
    }
  };

  const getWalletAddress = async () => {
    // if (!walletAddress) {
    //   await connectWallet();
    // }

    toast.success("Wallet connected successfully!");
  };

  const handleWalletConnect = async () => {
    try {
      await getWalletAddress();
    } catch (error) {
      toast.error("Failed to connect wallet.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <i className="bi bi-x-lg" style={closeIconStyle} onClick={onClose}></i>
        <>
          <ConnectWallet
            onConnect={() => {
              signMessage({ message });
            }}
          />
          
          <button
            id="connbtn"
            type="button"
            style={{ marginBottom: "10px" }}
            onClick={handleSmartwallet}
          >
            <img src={smartwallet} alt="Smart Wallet" style={walletIconStyle} />
            Smart Wallet
          </button>
          <button
            id="connbtn"
            type="button"
            style={{ marginBottom: "20px" }}
            onClick={handleWalletConnect}
          >
            <img src={metamask} alt="Wallet" style={walletIconStyle} />
            Metamask
          </button>
        </>
      </div>
    </div>
  );
};

export default Walletmodal;

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

const closeButtonStyle = {
  padding: "8px 12px",
  backgroundColor: "rgb(129, 128, 125)",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "10px",
  marginRight: "8px",
};

const walletAddressStyle = {
  textAlign: "center",
  margin: "20px 0",
  fontSize: "18px",
  fontWeight: "bold",
  background: "#fff",
  color: "#5c5a5a",
  padding: "20px",
  borderRadius: "20px",
};

const copyIconStyle = {
  display: "block",
  textAlign: "center",
  cursor: "pointer",
  fontSize: "24px",
  color: "#fff",
};

const connectButtonStyle = {
  padding: "8px 12px",
  backgroundColor: "white",
  color: "black",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "20px",
};

const closeIconStyle = {
  marginRight: "10px",
  marginBottom: "10px",
  fontWeight: "bold",
  textAlign: "right",
  cursor: "pointer",
};

const walletIconStyle = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  marginRight: "8px",
};
