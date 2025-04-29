// Constants.js
import WorklobJOB from "./abi/WorklobJOB.json";
import LOBToken from "./abi/LOBToken.json"; // Add the ABI file for LOB token
import WorkLobStaking from "./abi/WorkLobStaking.json"; // Add the ABI file for LOB token
import WorklobAIMarketplace from "./abi/WorklobAIMarketplace.json";

export const JOB_ABI = WorklobJOB.abi;
export const JOB_CONTRACT_ADDRESS =
  "0x0c73edDb6326228B6E8F4Ffa3a95d3306DE95964"; // Replace with your quiz platform contract address

// LOB Token contract details
export const LOB_TOKEN_ABI = LOBToken.abi;
export const LOB_TOKEN_ADDRESS = "0x8264029aC2f6eB8c3f67F6b872Ab649875B10cF4"; // Replace with your LOB token contract address

// Worklob Staking contract
export const WorkLobStaking_abi = WorkLobStaking.abi;
export const WorkLobStaking_address =
  "0x4da51ebebBE767C4a1C370ed108E220086D6c5de";

// Worklob AI Market contract
export const WorkLob_ai_abi = WorklobAIMarketplace.abi;
export const WorkLob_ai_address = "0x05A5B5f278d8Df7297b128D2C395A372DF7cDAeA";

// Base Sepolia Testnet configuration
export const BASE_TESTNET_PARAMS = {
  chainId: 84532,
  chainName: "Base Sepolia Testnet",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://sepolia.base.org"], // Base Sepolia RPC URL
  blockExplorerUrls: ["https://sepolia-explorer.base.org"], // Block Explorer URL for Base Sepolia Testnet
};
