import { createContext, useContext, useState, useEffect } from "react";
import { useWeb3 } from "../Web3Provider";
import { useSmartWallet } from "../SmartWallet";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletType, setWalletType] = useState(null);
  const web3 = useWeb3();
  const smartWallet = useSmartWallet();

  // Determine which provider to use
  const { connected } =
    (walletType === "metamask"
      ? web3
      : walletType === "smartwallet"
      ? smartWallet
      : {}) || {};

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

  return (
    <WalletContext.Provider value={{ walletType, setWalletType }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
