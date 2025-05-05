import { createSmartWalletClient } from "@coinbase/onchainkit";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const smartWallet = await createSmartWalletClient({
  chain: baseSepolia,
  transport: http(),
  appId: "your_app_id_from_coinbase_dev_dashboard",
  appName: "Your App Name",
  appLogoUrl: "https://yourdomain.com/logo.png",
  relayUrl: "https://relay.wallet.coinbase.com/rpc", // fixed
});

export { smartWallet };
