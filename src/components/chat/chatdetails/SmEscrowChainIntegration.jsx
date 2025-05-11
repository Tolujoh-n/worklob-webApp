import { readContract, writeContract, waitForTransaction } from "@wagmi/core";
import { ethers } from "ethers";
import axios from "axios";
import { JOB_CONTRACT_ADDRESS, JOB_ABI } from "../../Constants";
import API_URL from "../../../config";

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

async function getEthPriceUSD() {
  try {
    const response = await axios.get(`${API_URL}/api/v1/price/eth`);
    return response.data.usd;
  } catch (error) {
    console.error("Failed to get ETH price from backend:", error);
    return null;
  }
}

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

  try {
    const { hash } = await writeContract({
      account, // ✅ explicitly set the account
      address: JOB_CONTRACT_ADDRESS,
      abi: JOB_ABI,
      functionName: "deposit",
      args: [
        jobId,
        customerId._id,
        talentId._id,
        customerWallet,
        ethers.utils.parseEther(ethAmount.toString()),
        chatId,
      ],
      value: ethers.utils.parseEther(ethAmount.toString()),
    });

    await waitForTransaction({ hash });
    console.log("Deposit successful!");
  } catch (error) {
    console.error("Smart Wallet Deposit Error:", error);
  }
}

export async function complete(
  jobId,
  customerId,
  talentId,
  talentWallet,
  chatId
) {
  try {
    const { hash } = await writeContract({
      address: JOB_CONTRACT_ADDRESS,
      abi: JOB_ABI,
      functionName: "complete",
      args: [jobId, customerId._id, talentId._id, talentWallet, chatId],
    });

    await waitForTransaction({ hash });
    console.log("Job completion successful!");
  } catch (error) {
    console.error("Smart Wallet Complete Error:", error);
  }
}

export async function confirm(
  jobId,
  customerId,
  talentId,
  customerWallet,
  chatId
) {
  try {
    const { hash } = await writeContract({
      address: JOB_CONTRACT_ADDRESS,
      abi: JOB_ABI,
      functionName: "confirm",
      args: [jobId, customerId._id, talentId._id, customerWallet, chatId],
    });

    await waitForTransaction({ hash });
    console.log("Job confirmation successful!");
  } catch (error) {
    console.error("Smart Wallet Confirm Error:", error);
  }
}
