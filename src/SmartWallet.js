import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Wallet,
  ConnectWallet,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { LOB_TOKEN_ABI, LOB_TOKEN_ADDRESS } from "./components/Constants";
import { formatEther, parseAbiItem } from "viem/utils";
import {
  Address,
  Avatar,
  Name,
  Identity,
  Badge,
  EthBalance,
} from "@coinbase/onchainkit/identity";

// Create the context
const SmartWalletContext = createContext();

// Hook to access the context
export const useSmartWallet = () => useContext(SmartWalletContext);

// Provider Component
export const SmartWalletProvider = ({ children }) => {
  const wallet = Wallet();
  const connect = ConnectWallet();
  const disconnect = WalletDropdownDisconnect();

  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [baseETHBalance, setBaseETHBalance] = useState(null);
  const [lobBalance, setLobBalance] = useState(null); // assuming you’ll add logic later
  const [signer, setSigner] = useState(null);

  const client = createPublicClient({
    chain: base,
    transport: http(),
  });

  const fetchETHBalance = async (address) => {
    try {
      const balance = await client.EthBalance({ address });
      setBaseETHBalance(balance);
    } catch (err) {
      console.error("Error fetching ETH balance", err);
    }
  };

  const fetchLobBalance = async (address) => {
    try {
      const balance = await client.readContract({
        address: LOB_TOKEN_ADDRESS,
        abi: LOB_TOKEN_ABI,
        functionName: "balanceOf",
        args: [address],
      });
      setLobBalance(formatEther(balance));
    } catch (err) {
      console.error("Error fetching LOB balance", err);
    }
  };

  const connectWallet = async () => {
    try {
      const { address, signer } = await connect();
      setConnected(true);
      setWalletAddress(address);
      setSigner(signer);
      fetchETHBalance(address);
      fetchLobBalance(address); // <-- NEW
    } catch (err) {
      console.error("Wallet connect error", err);
    }
  };

  useEffect(() => {
    if (wallet?.address) {
      setConnected(true);
      setWalletAddress(wallet.address);
      setSigner(wallet.signer);
      fetchETHBalance(wallet.address);
      fetchLobBalance(wallet.address); // <-- NEW
    }
  }, [wallet]);

  const disconnectWallet = async () => {
    await disconnect();
    setConnected(false);
    setWalletAddress(null);
    setBaseETHBalance(null);
    setSigner(null);
  };

  useEffect(() => {
    if (wallet?.address) {
      setConnected(true);
      setWalletAddress(wallet.address);
      setSigner(wallet.signer);
      fetchETHBalance(wallet.address);
    }
  }, [wallet]);

  return (
    <SmartWalletContext.Provider
      value={{
        connected,
        walletAddress,
        baseETHBalance,
        lobBalance,
        connectWallet,
        disconnectWallet,
        signer,
      }}
    >
      {children}
    </SmartWalletContext.Provider>
  );
};
