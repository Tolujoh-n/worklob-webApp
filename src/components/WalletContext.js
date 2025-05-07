import { createContext, useContext, useState, useEffect } from "react";
import Walletmodal from "./Walletmodal";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletType, setWalletType] = useState(null);
  const [isWalletmodalOpen, setIsWalletmodalOpen] = useState(false);

  const openWalletmodal = () => setIsWalletmodalOpen(true);
  const closeWalletmodal = () => setIsWalletmodalOpen(false);

  // Automatically open modal if walletType is null
  useEffect(() => {
    if (!walletType) {
      openWalletmodal();
    } else {
      closeWalletmodal();
    }
  }, [walletType]);

  return (
    <WalletContext.Provider value={{ walletType, setWalletType }}>
      {children}
      <Walletmodal isOpen={isWalletmodalOpen} onClose={closeWalletmodal} />
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
