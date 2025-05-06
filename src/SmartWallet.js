import React, { createContext, useContext, useState, useEffect } from "react";
import { useCallback } from "react";
import { useSignMessage, useAccount, useConnect, useDisconnect } from "wagmi";
import { toast } from "sonner";
import { base } from "wagmi/chains";
import { createSiweMessage } from "viem/siwe";
// import {
//   Address,
//   Avatar,
//   Name,
//   Identity,
//   Badge,
//   EthBalance,
// } from "@coinbase/onchainkit/identity";

const message = createSiweMessage({
  address: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
  chainId: base.id,
  domain: "example.com",
  nonce: "foobarbaz",
  uri: "https://example.com/path",
  version: "1",
});

// Create the context
const SmartWalletContext = createContext();

// Hook to access the context
export const useSmartWallet = () => useContext(SmartWalletContext);

// Provider Component
export const SmartWalletProvider = ({ children }) => {
  const { signMessage } = useSignMessage();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, status, isConnected } = useAccount();

  const handleConnectClick = useCallback(async () => {
    const connector = connectors[0];
    if (!connector) {
      toast.error("No wallet connector found!");
      return;
    }

    connect(
      { connector },
      {
        onSuccess: () => {
          signMessage({ message });
          toast.success("Wallet connected!");
        },
        onError: (error) => {
          toast.error("Failed to connect wallet: " + error.message);
        },
      }
    );
  }, [connect, connectors, signMessage]);
  return (
    <SmartWalletContext.Provider
      value={{
        disconnect,
        address,
        status,
        isConnected,
        handleConnectClick,
      }}
    >
      {children}
    </SmartWalletContext.Provider>
  );
};
