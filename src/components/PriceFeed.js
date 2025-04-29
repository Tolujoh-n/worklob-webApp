import React, { useEffect, useState } from "react";
import axios from "axios";

export const FreelancePriceFeed = ({ budget, setEthValue }) => {
  const [ethPrice, setEthPrice] = useState(null);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        setEthPrice(response.data.ethereum.usd);
      } catch (error) {
        console.error("Error fetching Ethereum price:", error);
      }
    };

    fetchEthPrice();
  }, []);

  useEffect(() => {
    if (ethPrice && budget) {
      const ethEquivalent = (budget / ethPrice).toFixed(5);
      setEthValue(ethEquivalent);
    }
  }, [ethPrice, budget, setEthValue]);

  return (
    <div>
      {budget ? `$${budget} = ${budget / ethPrice} ETH` : "$0 = 0.00000 ETH"}
      <br />
      <p style={{ fontSize: "0.9rem", color: "#ccc" }}>
        Current ETH/USD: ${ethPrice || "Loading..."}
      </p>
    </div>
  );
};

export const FulltimePriceFeed = ({ onPriceFetch }) => {
  const [ethPrice, setEthPrice] = useState(null);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const price = res.data.ethereum.usd;
        setEthPrice(price);
        onPriceFetch(price); // send price to parent
      } catch (error) {
        console.error("Failed to fetch ETH price", error);
      }
    };

    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [onPriceFetch]);

  return (
    <p style={{ fontSize: "0.9rem", color: "#ccc" }}>
      Current ETH/USD: ${ethPrice || "Loading..."}
    </p>
  );
};

export const convertEthToUsd = (ethAmount, ethPrice) => {
  if (!ethAmount || !ethPrice) return "Loading...";
  return (ethAmount * ethPrice).toFixed(2);
};
