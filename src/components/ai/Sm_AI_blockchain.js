import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useWriteContracts } from "wagmi/experimental";
import { parseEther } from "viem";
import { createPublicClient, custom } from "viem";
import { WorkLob_ai_address, WorkLob_ai_abi } from "../Constants";

export function useSmAIActions() {
  const account = useAccount();
  const { writeContracts } = useWriteContracts();

  const getPublicClient = () =>
    createPublicClient({
      chain: account.chain,
      transport: custom(window.ethereum),
    });

  async function waitForConfirmation(txHash) {
    const publicClient = getPublicClient();
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
    return receipt.status === "success";
  }

  async function payForSingleUse(aiId, providerAddress, singleFee) {
    try {
      if (!account?.address) throw new Error("Wallet not connected.");

      const feeInWei = parseEther(singleFee.toString());

      const result = await writeContracts({
        contracts: [
          {
            address: WorkLob_ai_address,
            abi: WorkLob_ai_abi,
            functionName: "payForSingleUse",
            args: [aiId, providerAddress, feeInWei],
            value: feeInWei,
          },
        ],
      });

      if (!result || !result[0]) {
        console.error(
          "Transaction was not submitted. writeContracts result:",
          result
        );
        throw new Error(
          "Transaction not submitted. Possibly rejected or failed to prepare."
        );
      }

      const txHash = result[0].hash;
      console.log("Transaction hash:", txHash);

      const confirmed = await waitForConfirmation(txHash);
      return confirmed;
    } catch (error) {
      console.error("payForSingleUse error:", error);
      return false;
    }
  }

  async function subscribeToAI(
    aiId,
    providerAddress,
    startDate,
    endDate,
    subscriptionFee
  ) {
    try {
      if (!account?.address) throw new Error("Wallet not connected.");

      const feeInWei = parseEther(subscriptionFee.toString());

      const result = await writeContracts({
        contracts: [
          {
            address: WorkLob_ai_address,
            abi: WorkLob_ai_abi,
            functionName: "subscribeToAI",
            args: [
              aiId,
              providerAddress,
              Math.floor(startDate.getTime() / 1000),
              Math.floor(endDate.getTime() / 1000),
              feeInWei,
            ],
            value: feeInWei,
          },
        ],
      });

      if (!result || !result[0]?.hash) {
        throw new Error("Transaction hash not returned or failed to submit.");
      }

      const txHash = result[0].hash;
      const confirmed = await waitForConfirmation(txHash);
      return confirmed;
    } catch (error) {
      console.error("subscribeToAI error:", error);
      return false;
    }
  }

  async function getSubscriptionStatus(_, aiId) {
    try {
      if (!account.chain) {
        console.warn("Chain not ready");
        return { isActive: false, startDate: null, endDate: null };
      }

      const provider = getPublicClient();

      const [isActive, start, end] = await provider.readContract({
        address: WorkLob_ai_address,
        abi: WorkLob_ai_abi,
        functionName: "getSubscriptionStatus",
        args: [account.address, aiId],
      });

      return {
        isActive,
        startDate: new Date(Number(start) * 1000),
        endDate: new Date(Number(end) * 1000),
      };
    } catch (error) {
      console.error("getSubscriptionStatus error:", error);
      return {
        isActive: false,
        startDate: null,
        endDate: null,
      };
    }
  }

  return {
    payForSingleUse,
    subscribeToAI,
    getSubscriptionStatus,
  };
}
