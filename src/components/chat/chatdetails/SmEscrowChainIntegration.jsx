import {
  readContract,
  writeContract,
  waitForTransaction,
  getWalletClient,
} from "@wagmi/core";
import axios from "axios";
import { JOB_CONTRACT_ADDRESS, JOB_ABI } from "../../Constants";
import API_URL from "../../../config";
import { parseEther } from "viem";

/**
 * Fetches the estimated job budget in USD.
 */
async function getAmount(jobId) {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/jobs/jobdetails/${jobId}`
    );
    if (response.data.budget) return response.data.budget;

    const allJobs = await axios.get(`${API_URL}/api/v1/jobs/getAlljobs`);
    const job = allJobs.data.find((job) => job._id === jobId);

    if (job?.rangeCompensation)
      return (job.rangeCompensation.min + job.rangeCompensation.max) / 2;
    if (job?.fixedCompensation) return job.fixedCompensation;
    if (job?.budget) return job.budget;

    return null;
  } catch (err) {
    console.error("Error fetching job amount:", err);
    return null;
  }
}

/**
 * Fetches the current ETH price in USD.
 */
async function getEthPriceUSD() {
  try {
    const response = await axios.get(`${API_URL}/api/v1/price/eth`);
    return response.data.usd;
  } catch (error) {
    console.error("Failed to get ETH price from backend:", error);
    return null;
  }
}

/**
 * Handles the deposit action on the smart contract.
 */
export async function deposit(
  jobId,
  customerId,
  talentId,
  customerWallet,
  chatId
) {
  console.log("Deposit parameters:", {
    jobId,
    customerId,
    talentId,
    customerWallet,
    chatId,
  });

  const usdAmount = await getAmount(jobId);
  const ethPrice = await getEthPriceUSD();
  if (!usdAmount || !ethPrice) {
    console.error("Missing USD amount or ETH price");
    return;
  }

  const ethAmount = (usdAmount / ethPrice).toFixed(6);
  const parsedValue = parseEther(ethAmount);

  try {
    const walletClient = await getWalletClient();
    if (!walletClient) {
      console.error("Wallet client not found. Ensure wallet is connected.");
      return;
    }

    const { hash } = await writeContract({
      address: JOB_CONTRACT_ADDRESS,
      abi: JOB_ABI,
      functionName: "deposit",
      args: [
        jobId,
        customerId._id,
        talentId._id,
        customerWallet,
        parsedValue,
        chatId,
      ],
      value: parsedValue,
      walletClient, // ensure correct signer is used (for smart wallet too)
    });

    await waitForTransaction({ hash });
    console.log("Deposit successful! Tx:", hash);
  } catch (error) {
    console.error("Smart Wallet Deposit Error:", error);
  }
}

/**
 * Handles the complete action on the smart contract.
 */
export async function complete(
  jobId,
  customerId,
  talentId,
  talentWallet,
  chatId
) {
  try {
    const walletClient = await getWalletClient();
    if (!walletClient) {
      console.error("Wallet client not found. Ensure wallet is connected.");
      return;
    }

    const { hash } = await writeContract({
      address: JOB_CONTRACT_ADDRESS,
      abi: JOB_ABI,
      functionName: "complete",
      args: [jobId, customerId._id, talentId._id, talentWallet, chatId],
      walletClient,
    });

    await waitForTransaction({ hash });
    console.log("Job completion successful! Tx:", hash);
  } catch (error) {
    console.error("Smart Wallet Complete Error:", error);
  }
}

/**
 * Handles the confirm action on the smart contract.
 */
export async function confirm(
  jobId,
  customerId,
  talentId,
  customerWallet,
  chatId
) {
  try {
    const walletClient = await getWalletClient();
    if (!walletClient) {
      console.error("Wallet client not found. Ensure wallet is connected.");
      return;
    }

    const { hash } = await writeContract({
      address: JOB_CONTRACT_ADDRESS,
      abi: JOB_ABI,
      functionName: "confirm",
      args: [jobId, customerId._id, talentId._id, customerWallet, chatId],
      walletClient,
    });

    await waitForTransaction({ hash });
    console.log("Job confirmation successful! Tx:", hash);
  } catch (error) {
    console.error("Smart Wallet Confirm Error:", error);
  }
}
