import React, { createContext, useState, useEffect, useContext } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { TokenRow } from "@coinbase/onchainkit/token";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import {
  Avatar,
  Identity,
  Name,
  Badge,
  Address,
} from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
import Walletmodal from "./components/Walletmodal";

export const SmartWallet = ({ children }) => {
  const [isWalletmodalOpen, setIsWalletmodalOpen] = useState(false);

  const openWalletmodal = () => setIsWalletmodalOpen(true);
  const closeWalletmodal = () => setIsWalletmodalOpen(false);

  const shortenAddress = (address) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <OnchainKitProvider
      value={{
        connected,
        walletAddress,
        baseETHBalance,
        lobBalance,
        ConnectWallet,
        disconnectWallet,
        shortenAddress,
        openWalletmodal,
        closeWalletmodal,
      }}
    >
      {children}
      <Walletmodal isOpen={isWalletmodalOpen} onClose={closeWalletmodal} />
    </OnchainKitProvider>
  );
};
