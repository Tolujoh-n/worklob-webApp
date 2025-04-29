import { ethers } from "ethers";
import { WorkLob_ai_address, WorkLob_ai_abi } from "../Constants";

let contract = null;

const getContract = async () => {
  if (!contract) {
    if (!window.ethereum) throw new Error("MetaMask is not installed");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    contract = new ethers.Contract(WorkLob_ai_address, WorkLob_ai_abi, signer);
  }
  return contract;
};

export const payForSingleUse = async (aiId, providerAddress, singleFee) => {
  try {
    const contract = await getContract();
    const feeInWei = ethers.utils.parseEther(singleFee.toString());

    const tx = await contract.payForSingleUse(aiId, providerAddress, feeInWei, {
      value: feeInWei,
    });
    await tx.wait();
    return true;
  } catch (error) {
    console.error("payForSingleUse error:", error);
    return false;
  }
};

export const subscribeToAI = async (
  aiId,
  providerAddress,
  startDate,
  endDate,
  subscriptionFee
) => {
  try {
    const contract = await getContract();
    const feeInWei = ethers.utils.parseEther(subscriptionFee.toString());

    const tx = await contract.subscribeToAI(
      aiId,
      providerAddress,
      Math.floor(startDate.getTime() / 1000),
      Math.floor(endDate.getTime() / 1000),
      feeInWei, // pass fee here if your contract requires it
      {
        value: feeInWei, // this makes MetaMask prompt to pay
      }
    );
    await tx.wait();
    return true;
  } catch (error) {
    console.error("subscribeToAI error:", error);
    return false;
  }
};

export const getSubscriptionStatus = async (user, aiId) => {
  try {
    const contract = await getContract();
    const [isActive, start, end] = await contract.getSubscriptionStatus(
      user,
      aiId
    );

    return {
      isActive,
      startDate: new Date(start.toNumber() * 1000), // Convert UNIX to JS date
      endDate: new Date(end.toNumber() * 1000),
    };
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return {
      isActive: false,
      startDate: null,
      endDate: null,
    };
  }
};

export const isSubscriptionActive = async (userAddress, aiId) => {
  try {
    const contract = await getContract();
    return await contract.isSubscriptionActive(userAddress, aiId);
  } catch (error) {
    console.error("Error checking subscription active:", error);
    return false;
  }
};
