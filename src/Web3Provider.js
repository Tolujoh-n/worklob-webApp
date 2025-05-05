import React, { createContext, useState, useEffect, useContext } from "react";
import Web3 from "web3";
import {
  BASE_TESTNET_PARAMS,
  LOB_TOKEN_ABI,
  LOB_TOKEN_ADDRESS,
} from "./components/Constants";
import Walletmodal from "./components/Walletmodal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { smartWallet } from "./CoinbaseSmartWallet";
import { ethers } from "ethers";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [baseETHBalance, setBaseETHBalance] = useState("0");
  const [lobBalance, setLobBalance] = useState("0");
  const [web3, setWeb3] = useState(null);
  const [walletType, setWalletType] = useState(null);

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
      console.log("Restored balances from localStorage:");
      console.log("Base ETH balance:", baseETHBalance);
      console.log("LOB token balance:", lobBalance);
    }
  };

  const switchToBaseTestnet = async () => {
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
    } else if (type === "coinbase") {
      const APP_NAME = "Your App Name";
      const APP_LOGO_URL = "https://yourdomain.com/logo.png"; // Optional
      const DEFAULT_ETH_JSONRPC_URL = BASE_TESTNET_PARAMS.rpcUrls[0];
      const DEFAULT_CHAIN_ID = BASE_TESTNET_PARAMS.chainId;

      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: APP_NAME,
        appLogoUrl: APP_LOGO_URL,
        darkMode: true,
      });

      provider = coinbaseWallet.makeWeb3Provider(
        DEFAULT_ETH_JSONRPC_URL,
        DEFAULT_CHAIN_ID
      );
    }

    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const web3Instance = new Web3(provider);
      setWeb3(web3Instance);
      setWalletAddress(accounts[0]);
      setConnected(true);
      setWalletType(type);

      localStorage.setItem("walletAddress", accounts[0]);
      localStorage.setItem("walletType", type);

      console.log("Connected address:", accounts[0]);

      await switchToBaseTestnet(); // Still uses MetaMask window.ethereum under the hood
      window.location.reload();
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
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

      // Save balances to localStorage
      saveBalancesToLocalStorage(ethBalance, lobTokenBalance);

      console.log("Base ETH balance:", ethBalance);
      console.log("LOB token balance:", lobTokenBalance);
    } catch (error) {
      console.error("Failed to fetch balances", error);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress("");
    setBaseETHBalance("0");
    setLobBalance("0");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("balances");
  };

  const shortenAddress = (address) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    const savedType = localStorage.getItem("walletType");

    if (savedAddress && savedType) {
      let provider;
      if (savedType === "metamask" && window.ethereum) {
        provider = window.ethereum;
      } else if (savedType === "coinbase") {
        const coinbaseWallet = new CoinbaseWalletSDK({
          appName: "Your App Name",
          darkMode: true,
        });
        provider = coinbaseWallet.makeWeb3Provider(
          BASE_TESTNET_PARAMS.rpcUrls[0],
          BASE_TESTNET_PARAMS.chainId
        );
      }

      if (provider) {
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
        setWalletAddress(savedAddress);
        setWalletType(savedType);
        setConnected(true);
        restoreBalancesFromLocalStorage();
      }
    }
  }, []);

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
