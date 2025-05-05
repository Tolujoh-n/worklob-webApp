import React, { createContext, useState, useEffect, useContext } from "react";
import Web3 from "web3";
import {
  BASE_TESTNET_PARAMS,
  LOB_TOKEN_ABI,
  LOB_TOKEN_ADDRESS,
} from "./components/Constants";
import Walletmodal from "./components/Walletmodal";

import { ethers } from "ethers";
import { signInWithEthereum } from "./utils/SiweAuth";
import { OnchainKitProvider, getOnchainKitConfig } from "@coinbase/onchainkit";
import { TokenRow } from "@coinbase/onchainkit/token";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import {
  Avatar,
  Identity,
  Name,
  Badge,
  Address,
} from "@coinbase/onchainkit/identity";
import { baseSepolia, base } from "viem/chains";
import { http } from "viem";

// Initialize OnchainKit config
const onchainKitConfig = getOnchainKitConfig({
  appId: "11649a68-b71c-454f-8520-1f232dbe9335", // Replace with your OnchainKit app ID
  walletConnectProjectId: "11649a68-b71c-454f-8520-1f232dbe9335", // Replace if needed
  chains: [baseSepolia], // Set to base or baseSepolia depending on environment
  defaultChain: baseSepolia,
});

const smartWallet = onchainKitConfig.smartWallet;

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [baseETHBalance, setBaseETHBalance] = useState("0");
  const [lobBalance, setLobBalance] = useState("0");
  const [web3, setWeb3] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [signer, setSigner] = useState(null);

  const [isWalletmodalOpen, setIsWalletmodalOpen] = useState(false);

  const openWalletmodal = () => setIsWalletmodalOpen(true);
  const closeWalletmodal = () => setIsWalletmodalOpen(false);

  const saveBalancesToLocalStorage = (ethBalance, lobTokenBalance) => {
    localStorage.setItem(
      "balances",
      JSON.stringify({
        baseETHBalance: ethBalance,
        lobBalance: lobTokenBalance,
      })
    );
  };

  const restoreBalancesFromLocalStorage = () => {
    const savedBalances = localStorage.getItem("balances");
    if (savedBalances) {
      const { baseETHBalance, lobBalance } = JSON.parse(savedBalances);
      setBaseETHBalance(baseETHBalance);
      setLobBalance(lobBalance);
    }
  };

  const switchToBaseTestnet = async () => {
    if (walletType === "smartwallet") {
      await smartWallet.switchChain({ chainId: BASE_TESTNET_PARAMS.chainId });
      return;
    }

    try {
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      const baseTestnetChainId = `0x${BASE_TESTNET_PARAMS.chainId.toString(
        16
      )}`;

      if (currentChainId !== baseTestnetChainId) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: baseTestnetChainId }],
        });
      }
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${BASE_TESTNET_PARAMS.chainId.toString(16)}`,
                chainName: BASE_TESTNET_PARAMS.chainName,
                nativeCurrency: BASE_TESTNET_PARAMS.nativeCurrency,
                rpcUrls: BASE_TESTNET_PARAMS.rpcUrls,
                blockExplorerUrls: BASE_TESTNET_PARAMS.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Base Testnet", addError);
        }
      } else {
        console.error("Failed to switch network", error);
      }
    }
  };

  const connectWallet = async (type = "metamask") => {
    let provider;

    if (type === "metamask") {
      if (!window.ethereum) {
        console.error("MetaMask not detected.");
        window.open("https://metamask.io/download/", "_blank");
        return;
      }

      provider = window.ethereum;

      try {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });

        const web3Instance = new Web3(provider);
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();

        setWeb3(web3Instance);
        setSigner(signer); // Set signer for MetaMask
        setWalletAddress(accounts[0]);
        setConnected(true);
        setWalletType("metamask");

        localStorage.setItem("walletAddress", accounts[0]);
        localStorage.setItem("walletType", "metamask");

        await switchToBaseTestnet();
        window.location.reload();
      } catch (error) {
        console.error("MetaMask connection failed", error);
      }

      return;
    }

    if (type === "smartwallet") {
      try {
        await smartWallet.connect();
        const provider = await smartWallet.getProvider();
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();

        // Optional: Sign-In with Ethereum (SIWE)
        await signInWithEthereum(address, signer);

        setWeb3(new Web3(provider));
        setSigner(signer);
        setWalletAddress(address);
        setConnected(true);
        setWalletType("smartwallet");

        localStorage.setItem("walletAddress", address);
        localStorage.setItem("walletType", "smartwallet");

        await smartWallet.switchChain({ chainId: BASE_TESTNET_PARAMS.chainId });

        window.location.reload();
      } catch (error) {
        console.error("Smart Wallet connection failed", error);
      }

      return;
    }

    console.error("Unsupported wallet type:", type);
  };

  const fetchBalances = async (address) => {
    if (!web3 || !address) return;

    try {
      const balance = await web3.eth.getBalance(address);
      const ethBalance = web3.utils.fromWei(balance, "ether");
      setBaseETHBalance(ethBalance);

      const lobTokenContract = new web3.eth.Contract(
        LOB_TOKEN_ABI,
        LOB_TOKEN_ADDRESS
      );
      const lobBalance = await lobTokenContract.methods
        .balanceOf(address)
        .call();
      const lobTokenBalance = web3.utils.fromWei(lobBalance, "ether");
      setLobBalance(lobTokenBalance);

      saveBalancesToLocalStorage(ethBalance, lobTokenBalance);
    } catch (error) {
      console.error("Failed to fetch balances", error);
    }
  };

  const disconnectWallet = async () => {
    if (walletType === "smartwallet") {
      await smartWallet.disconnect();
    }

    setConnected(false);
    setWalletAddress("");
    setBaseETHBalance("0");
    setLobBalance("0");
    setSigner(null); // Clear signer on disconnect
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletType");
    localStorage.removeItem("balances");
  };

  const shortenAddress = (address) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  // Restore wallet connection from localStorage
  useEffect(() => {
    const restoreWalletConnection = async () => {
      const savedAddress = localStorage.getItem("walletAddress");
      const savedType = localStorage.getItem("walletType");

      if (!savedAddress || !savedType) return;

      try {
        let provider = null;

        if (savedType === "metamask" && window.ethereum) {
          provider = window.ethereum;
        }

        if (savedType === "smartwallet") {
          const provider = await smartWallet.getProvider();
          if (provider) {
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();
            const address = await signer.getAddress();

            await signInWithEthereum(address, signer);
            setWeb3(new Web3(provider));
            setSigner(signer);
            setWalletAddress(address);
            setWalletType(savedType);
            setConnected(true);
            restoreBalancesFromLocalStorage();
          }
        }

        if (provider) {
          const web3Instance = new Web3(provider);
          setWeb3(web3Instance);
          setWalletAddress(savedAddress);
          setWalletType(savedType);
          setConnected(true);
          restoreBalancesFromLocalStorage();
        }
      } catch (err) {
        console.error("Error restoring wallet:", err);
      }
    };

    restoreWalletConnection();
  }, []);

  // Fetch balances when wallet is ready
  useEffect(() => {
    if (connected && walletAddress) {
      fetchBalances(walletAddress);
    }
  }, [connected, walletAddress, web3]);

  return (
    <Web3Context.Provider
      value={{
        connected,
        walletAddress,
        walletType,
        signer, // Expose signer
        baseETHBalance,
        lobBalance,
        connectWallet,
        disconnectWallet,
        shortenAddress,
        openWalletmodal,
        closeWalletmodal,
      }}
    >
      {children}
      <Walletmodal isOpen={isWalletmodalOpen} onClose={closeWalletmodal} />
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
