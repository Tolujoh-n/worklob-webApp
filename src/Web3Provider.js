import React, { createContext, useState, useEffect, useContext } from "react";
import Web3 from "web3";
import {
  BASE_TESTNET_PARAMS,
  LOB_TOKEN_ABI,
  LOB_TOKEN_ADDRESS,
} from "./components/Constants";
import Walletmodal from "./components/Walletmodal";
import { smartWallet } from "./CoinbaseSmartWallet";
import { ethers } from "ethers";
import { signInWithEthereum } from "./utils/SiweAuth";

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
      console.log("Restored balances from localStorage:");
      console.log("Base ETH balance:", baseETHBalance);
      console.log("LOB token balance:", lobBalance);
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
        setWeb3(web3Instance);
        setWalletAddress(accounts[0]);
        setConnected(true);
        setWalletType("metamask");

        localStorage.setItem("walletAddress", accounts[0]);
        localStorage.setItem("walletType", "metamask");

        console.log("MetaMask connected:", accounts[0]);

        await switchToBaseTestnet(); // Switch to Base testnet if not already
        window.location.reload();
      } catch (error) {
        console.error("MetaMask connection failed", error);
      }

      return;
    }

    if (type === "smartwallet") {
      try {
        const accounts = await smartWallet.connect();

        const ethersProvider = new ethers.providers.Web3Provider(
          smartWallet.ethereum
        );
        const signer = ethersProvider.getSigner();

        const address = await signer.getAddress();

        // Ensure we're on Base testnet
        await smartWallet.switchChain({ chainId: BASE_TESTNET_PARAMS.chainId });

        // 🔐 Sign-In With Ethereum (SIWE)
        await signInWithEthereum(address, signer);

        setWeb3(new Web3(smartWallet.ethereum)); // For compatibility with existing code
        setWalletAddress(address);
        setConnected(true);
        setWalletType("smartwallet");

        localStorage.setItem("walletAddress", address);
        localStorage.setItem("walletType", "smartwallet");

        console.log("Smart Wallet connected:", address);
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

      // Save balances to localStorage
      saveBalancesToLocalStorage(ethBalance, lobTokenBalance);

      console.log("Base ETH balance:", ethBalance);
      console.log("LOB token balance:", lobTokenBalance);
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
          const providerFromSmartWallet = await smartWallet.getProvider();
          if (providerFromSmartWallet) {
            provider = providerFromSmartWallet;

            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();

            // Re-authenticate with backend
            await signInWithEthereum(savedAddress, signer);
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
        signer,
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
