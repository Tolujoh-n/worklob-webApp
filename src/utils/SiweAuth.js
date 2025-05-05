import { SiweMessage } from "siwe";
import { BASE_TESTNET_PARAMS } from "../components/Constants";
import API_URL from "../config";

export const signInWithEthereum = async (address, signer) => {
  const domain = window.location.host;
  const origin = window.location.origin;

  const message = new SiweMessage({
    domain,
    address,
    statement: "Sign in with Coinbase Smart Wallet",
    uri: origin,
    version: "1",
    chainId: BASE_TESTNET_PARAMS.chainId,
  }).prepareMessage();

  const signature = await signer.signMessage(message);

  const res = await fetch(`${API_URL}/api/v1/smartwallet/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, signature }),
  });

  if (!res.ok) {
    throw new Error("SIWE authentication failed");
  }

  return true;
};
