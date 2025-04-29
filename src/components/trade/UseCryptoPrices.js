// src/hooks/useCryptoPrices.js
import { useState, useEffect } from "react";
import axios from "axios";

const useCryptoPrices = () => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              ids: "bitcoin,ethereum,binancecoin",
              order: "market_cap_desc",
              per_page: 3,
              page: 1,
              sparkline: false,
            },
          }
        );

        const data = res.data;

        setPrices({
          "BTC/USDT": {
            price: `$${data
              .find((coin) => coin.id === "bitcoin")
              .current_price.toLocaleString()}`,
            change: `${data
              .find((coin) => coin.id === "bitcoin")
              .price_change_percentage_24h.toFixed(2)}%`,
            high: `$${data
              .find((coin) => coin.id === "bitcoin")
              .high_24h.toLocaleString()}`,
            low: `$${data
              .find((coin) => coin.id === "bitcoin")
              .low_24h.toLocaleString()}`,
          },
          "ETH/USDT": {
            price: `$${data
              .find((coin) => coin.id === "ethereum")
              .current_price.toLocaleString()}`,
            change: `${data
              .find((coin) => coin.id === "ethereum")
              .price_change_percentage_24h.toFixed(2)}%`,
            high: `$${data
              .find((coin) => coin.id === "ethereum")
              .high_24h.toLocaleString()}`,
            low: `$${data
              .find((coin) => coin.id === "ethereum")
              .low_24h.toLocaleString()}`,
          },
          "BNB/USDT": {
            price: `$${data
              .find((coin) => coin.id === "binancecoin")
              .current_price.toLocaleString()}`,
            change: `${data
              .find((coin) => coin.id === "binancecoin")
              .price_change_percentage_24h.toFixed(2)}%`,
            high: `$${data
              .find((coin) => coin.id === "binancecoin")
              .high_24h.toLocaleString()}`,
            low: `$${data
              .find((coin) => coin.id === "binancecoin")
              .low_24h.toLocaleString()}`,
          },
        });
      } catch (err) {
        console.error("Error fetching crypto prices:", err);
      }
    };

    fetchPrices();

    const interval = setInterval(fetchPrices, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return prices;
};

export default useCryptoPrices;
