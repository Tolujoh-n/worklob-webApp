// SmEscrowChainIntegration.jsx
import { useAccount } from "wagmi";
import { useWriteContracts, useCapabilities } from "wagmi/experimental";
import { useMemo } from "react";
import { parseEther } from "viem";
import axios from "axios";
import { JOB_ABI, JOB_CONTRACT_ADDRESS } from "../../Constants";
import API_URL from "../../../config";

export function useSmEscrowActions() {
  const account = useAccount();
  const { writeContracts } = useWriteContracts();
  const { data: availableCapabilities } = useCapabilities({
    account: account.address,
  });

  const capabilities = useMemo(() => {
    if (!availableCapabilities || !account.chainId) return {};
    const caps = availableCapabilities[account.chainId];
    if (caps?.PaymasterService?.supported) {
      return {
        PaymasterService: {
          url: process.env.NEXT_PUBLIC_PAYMASTER_PROXY_SERVER_URL,
        },
      };
    }
    return {};
  }, [availableCapabilities, account.chainId]);

  async function getAmount(jobId) {
    try {
      const res = await axios.get(`${API_URL}/api/v1/jobs/jobdetails/${jobId}`);
      if (res.data?.budget) return res.data.budget;

      const allJobs = await axios.get(`${API_URL}/api/v1/jobs/getAlljobs`);
      const job = allJobs.data.find((job) => job._id === jobId);
      if (job?.rangeCompensation)
        return (job.rangeCompensation.min + job.rangeCompensation.max) / 2;
      if (job?.fixedCompensation) return job.fixedCompensation;
      if (job?.budget) return job.budget;
      return null;
    } catch (e) {
      console.error("getAmount error:", e);
      return null;
    }
  }

  async function getEthPriceUSD() {
    try {
      const res = await axios.get(`${API_URL}/api/v1/price/eth`);
      return res.data.usd;
    } catch (e) {
      console.error("getEthPriceUSD error:", e);
      return null;
    }
  }

  async function deposit(jobId, customerId, talentId, customerWallet, chatId) {
    const usdAmount = await getAmount(jobId);
    const ethPrice = await getEthPriceUSD();
    if (!usdAmount || !ethPrice) {
      console.error("Missing amount or ETH price");
      return;
    }

    const ethAmount = (usdAmount / ethPrice).toFixed(6);
    const parsedValue = parseEther(ethAmount);

    return writeContracts({
      contracts: [
        {
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
        },
      ],
      capabilities,
    });
  }

  async function complete(jobId, customerId, talentId, talentWallet, chatId) {
    return writeContracts({
      contracts: [
        {
          address: JOB_CONTRACT_ADDRESS,
          abi: JOB_ABI,
          functionName: "complete",
          args: [jobId, customerId._id, talentId._id, talentWallet, chatId],
        },
      ],
      capabilities,
    });
  }

  async function confirm(jobId, customerId, talentId, customerWallet, chatId) {
    return writeContracts({
      contracts: [
        {
          address: JOB_CONTRACT_ADDRESS,
          abi: JOB_ABI,
          functionName: "confirm",
          args: [jobId, customerId._id, talentId._id, customerWallet, chatId],
        },
      ],
      capabilities,
    });
  }

  return {
    deposit,
    complete,
    confirm,
  };
}
