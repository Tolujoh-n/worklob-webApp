import {
  writeContract,
  waitForTransaction,
  getWalletClient,
} from "@wagmi/core";
import axios from "axios";
import { parseEther } from "viem";
import { JOB_CONTRACT_ADDRESS, JOB_ABI } from "../../Constants";
import API_URL from "../../../config";
import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";
import { connect, getAccount } from "@wagmi/core";

export const cbWalletConnector = coinbaseWallet({
  appName: "Wagmi Smart Wallet",
  preference: "smartWalletOnly",
});

export const config = createConfig({
  chains: [baseSepolia],
  multiInjectedProviderDiscovery: false,
  connectors: [cbWalletConnector],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

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
  chatId,
  account
) {
  const usdAmount = await getAmount(jobId);
  const ethPrice = await getEthPriceUSD();
  if (!usdAmount || !ethPrice) return;

  const ethAmount = (usdAmount / ethPrice).toFixed(6);
  const parsedValue = parseEther(ethAmount.toString());

  try {
    const accountData = getAccount();

    if (!accountData?.address) {
      await connect({ connector: cbWalletConnector });
    }

    const walletClient = await getWalletClient(config, {
      account,
      chainId: baseSepolia.id,
    });

    if (!walletClient) {
      throw new Error("No wallet client found.");
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
      walletClient,
    });

    await waitForTransaction({ hash });
    console.log("Deposit successful! Tx:", hash);
  } catch (error) {
    console.error("Smart Wallet Deposit Error:", error);
  }
}

// Same change for complete()
export async function complete(
  jobId,
  customerId,
  talentId,
  talentWallet,
  chatId,
  account
) {
  try {
    const walletClient = await getWalletClient(config, {
      account,
      chainId: baseSepolia.id,
    });

    if (!walletClient) throw new Error("No wallet client");

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

// Same change for confirm()
export async function confirm(
  jobId,
  customerId,
  talentId,
  customerWallet,
  chatId,
  account
) {
  try {
    const walletClient = await getWalletClient(config, {
      account,
      chainId: baseSepolia.id,
    });

    if (!walletClient) throw new Error("No wallet client");

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
