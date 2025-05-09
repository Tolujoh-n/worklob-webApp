import { createContext, useContext, useState, useEffect } from "react";
import Walletmodal from "./Walletmodal";
import { useWeb3 } from "../Web3Provider";
import { useSmartWallet } from "../SmartWallet";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletType, setWalletType] = useState(null);
  const [isWalletmodalOpen, setIsWalletmodalOpen] = useState(false);
  const web3 = useWeb3();
  const smartWallet = useSmartWallet();

  // Determine which provider to use
  const { connected } =
    (walletType === "metamask"
      ? web3
      : walletType === "smartwallet"
      ? smartWallet
      : {}) || {};

  const openWalletmodal = () => setIsWalletmodalOpen(true);
  const closeWalletmodal = () => setIsWalletmodalOpen(false);
  // store to local storage
  useEffect(() => {
    const storedWalletType = localStorage.getItem("walletType");
    if (storedWalletType) {
      setWalletType(storedWalletType);
    }
  }, []);

  useEffect(() => {
    if (walletType) {
      localStorage.setItem("walletType", walletType);
    }
  }, [walletType]);

  // Automatically close modal when wallet connects
  useEffect(() => {
    if (connected) {
      closeWalletmodal();
    }
  }, [connected]);

  return (
    <WalletContext.Provider value={{ walletType, setWalletType }}>
      {children}
      <Walletmodal isOpen={isWalletmodalOpen} onClose={closeWalletmodal} />
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
