import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  useSignMessage,
  useAccount,
  useConnect,
  useDisconnect,
  usePublicClient,
} from "wagmi";
import { toast } from "sonner";
import { base } from "wagmi/chains";
import { createSiweMessage } from "viem/siwe";
import { formatEther, formatUnits } from "viem";
import { LOB_TOKEN_ADDRESS, LOB_TOKEN_ABI } from "./components/Constants";

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

export const SmartWalletProvider = ({ children }) => {
  const { signMessage } = useSignMessage();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, status, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const [ethBalance, setEthBalance] = useState(0n);
  const [lobTokenBalance, setLobTokenBalance] = useState(0n);

  const smartEthBalance = formatEther(ethBalance); // formatted string
  const formattedLobBalance = formatUnits(lobTokenBalance, 18); // assuming 18 decimals

  const fetchBalances = useCallback(async () => {
    if (!address || !publicClient) return;

    try {
      // ETH balance
      const eth = await publicClient.getBalance({ address });
      setEthBalance(eth ?? 0n);
    } catch (error) {
      console.error("ETH Balance fetch failed:", error);
      setEthBalance(0n);
    }

    try {
      // LOB token balance
      const lob = await publicClient.readContract({
        address: LOB_TOKEN_ADDRESS,
        abi: LOB_TOKEN_ABI,
        functionName: "balanceOf",
        args: [address],
      });
      setLobTokenBalance(lob ?? 0n);
    } catch (error) {
      console.error("LOB token fetch failed:", error);
      setLobTokenBalance(0n); // ensures fallback to 0
    }
  }, [address, publicClient]);

  useEffect(() => {
    if (isConnected) {
      fetchBalances();
    } else {
      setEthBalance(0n);
      setLobTokenBalance(0n);
    }
  }, [isConnected, fetchBalances]);

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

  const shortSmartAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <SmartWalletContext.Provider
      value={{
        disconnect,
        address,
        status,
        isConnected,
        handleConnectClick,
        shortSmartAddress,
        smartEthBalance,
        formattedLobBalance,
        ethBalance,
        lobTokenBalance,
      }}
    >
      {children}
    </SmartWalletContext.Provider>
  );
};

export const useSmartWallet = () => useContext(SmartWalletContext);
