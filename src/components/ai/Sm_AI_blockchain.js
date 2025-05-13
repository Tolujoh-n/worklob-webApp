import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useWriteContracts, useCapabilities } from "wagmi/experimental";
import { parseEther } from "viem";
import { createPublicClient, custom } from "viem";
import { WorkLob_ai_address, WorkLob_ai_abi } from "../Constants";

export function useSmAIActions() {
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

  // Pay for single AI use
  async function payForSingleUse(aiId, providerAddress, singleFee) {
    try {
      const feeInWei = parseEther(singleFee.toString());

      await writeContracts({
        contracts: [
          {
            address: WorkLob_ai_address,
            abi: WorkLob_ai_abi,
            functionName: "payForSingleUse",
            args: [aiId, providerAddress, feeInWei],
            value: feeInWei,
          },
        ],
        capabilities,
      });

      return true;
    } catch (error) {
      console.error("payForSingleUse error:", error);
      return false;
    }
  }

  // Subscribe to AI
  async function subscribeToAI(
    aiId,
    providerAddress,
    startDate,
    endDate,
    subscriptionFee
  ) {
    try {
      const feeInWei = parseEther(subscriptionFee.toString());

      await writeContracts({
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
        capabilities,
      });

      return true;
    } catch (error) {
      console.error("subscribeToAI error:", error);
      return false;
    }
  }

  // Get subscription status
  async function getSubscriptionStatus(user, aiId) {
    try {
      const provider = createPublicClient({
        chain: account.chain,
        transport: custom(window.ethereum),
      });

      const [isActive, start, end] = await provider.readContract({
        address: WorkLob_ai_address,
        abi: WorkLob_ai_abi,
        functionName: "getSubscriptionStatus",
        args: [user, aiId],
      });

      return {
        isActive,
        startDate: new Date(Number(start) * 1000), // Convert BigInt to Number
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
