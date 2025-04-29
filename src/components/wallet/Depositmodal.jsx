import React from "react";
import { useWeb3 } from "../../Web3Provider";
import { Toaster, toast } from "sonner";

const Depositmodal = ({ isOpen, onClose }) => {
  const { connectWallet, walletAddress, connected } = useWeb3();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Wallet address copied to clipboard!");
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content" style={modalContentStyle}>
        {/* <Toaster position="top-right" /> */}
        {connected ? (
          <>
            <h3 style={{ textAlign: "center" }}>
              Send token to your address below
            </h3>
            <p className="walllet-address">{walletAddress}</p>
            <span style={copyIconStyle} onClick={handleCopyAddress}>
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
          </>
        ) : (
          <>
            <h3 style={{ textAlign: "center" }}>
              Connect wallet to make a deposit
            </h3>
            <br />
            <div style={{ textAlign: "center" }}>
              <button onClick={connectWallet} className="modall-button">
                Connect Wallet
              </button>
            </div>
          </>
        )}
        <br />
        <button onClick={onClose} className="closemodall-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default Depositmodal;

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
