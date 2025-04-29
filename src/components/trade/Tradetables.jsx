import React, { useState } from "react";

const Tradetables = () => {
  const [activeTab, setActiveTab] = useState("Orders");

  const handleClick = (tab) => {
    setActiveTab(tab);
  };

  // Dummy data for each table
  const ordersData = [
    {
      pair: "BTC/USDT",
      side: "Buy",
      price: "$50,500",
      size: "0.5 BTC",
      pnl: "20 USDT",
      tpSl: "45000 / 55000",
    },
    {
      pair: "ETH/USDT",
      side: "Sell",
      price: "$1,800",
      size: "1 ETH",
      pnl: "-10 USDT",
      tpSl: "1700 / 1900",
    },
    {
      pair: "XRP/USDT",
      side: "Buy",
      price: "$0.50",
      size: "1000 XRP",
      pnl: "5 USDT",
      tpSl: "0.45 / 0.55",
    },
    {
      pair: "ADA/USDT",
      side: "Sell",
      price: "$0.32",
      size: "500 ADA",
      pnl: "-2 USDT",
      tpSl: "0.30 / 0.35",
    },
    {
      pair: "DOGE/USDT",
      side: "Buy",
      price: "$0.08",
      size: "2000 DOGE",
      pnl: "3 USDT",
      tpSl: "0.07 / 0.09",
    },
  ];

  const positionsData = [
    {
      pair: "BTC/USDT",
      side: "Buy",
      price: "$50,500",
      size: "0.5 BTC",
      pnl: "20 USDT",
      tpSl: "45000 / 55000",
    },
    {
      pair: "ETH/USDT",
      side: "Sell",
      price: "$1,800",
      size: "1 ETH",
      pnl: "-10 USDT",
      tpSl: "1700 / 1900",
    },

    {
      pair: "DOT/USDT",
      side: "Buy",
      price: "$6",
      size: "100 DOT",
      pnl: "2 USDT",
      tpSl: "5 / 7",
    },
  ];

  const historyData = [
    {
      pair: "BTC/USDT",
      side: "Buy",
      price: "$50,500",
      size: "0.5 BTC",
      pnl: "20 USDT",
    },
    {
      pair: "ETH/USDT",
      side: "Sell",
      price: "$1,800",
      size: "1 ETH",
      pnl: "-10 USDT",
    },
    {
      pair: "XRP/USDT",
      side: "Buy",
      price: "$0.50",
      size: "1000 XRP",
      pnl: "5 USDT",
    },
    {
      pair: "ADA/USDT",
      side: "Sell",
      price: "$0.32",
      size: "500 ADA",
      pnl: "-2 USDT",
    },
    {
      pair: "DOGE/USDT",
      side: "Buy",
      price: "$0.08",
      size: "2000 DOGE",
      pnl: "3 USDT",
    },
    {
      pair: "DOGE/USDT",
      side: "Buy",
      price: "$0.08",
      size: "2000 DOGE",
      pnl: "3 USDT",
    },
  ];

  const renderTableRows = (data) =>
    data.map((row, index) => (
      <tr key={index}>
        {Object.values(row).map((value, i) => (
          <td key={i}>{value}</td>
        ))}
        {activeTab !== "History" && (
          <td>
            <button className="tradetablebtn">Close</button>
          </td>
        )}
      </tr>
    ));

  return (
    <>
      <div className="stakebuttonn">
        <div
          style={{
            background: "#213743",
            padding: "10px",
            borderRadius: "20px",
          }}
          className="checkstake"
        >
          <button
            className={`stakes-button ${
              activeTab === "Orders" ? "active" : ""
            }`}
            onClick={() => handleClick("Orders")}
          >
            Orders ({ordersData.length})
          </button>
          <button
            className={`stakes-button ${
              activeTab === "Positions" ? "active" : ""
            }`}
            onClick={() => handleClick("Positions")}
          >
            Positions ({positionsData.length})
          </button>
          <button
            className={`stakes-button ${
              activeTab === "History" ? "active" : ""
            }`}
            onClick={() => handleClick("History")}
          >
            Trade History ({historyData.length})
          </button>
        </div>
      </div>

      {activeTab === "Orders" && (
        <section className="tablecss">
          <div className="tbl-content">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead className="tableheadd">
                <tr>
                  <th>Pair</th>
                  <th>Side</th>
                  <th>Price</th>
                  <th>Size</th>
                  <th>PnL</th>
                  <th>TP/SL</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{renderTableRows(ordersData)}</tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "Positions" && (
        <section className="tablecss">
          <div className="tbl-content">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead className="tableheadd">
                <tr>
                  <th>Pair</th>
                  <th>Side</th>
                  <th>Price</th>
                  <th>Size</th>
                  <th>PnL</th>
                  <th>TP/SL</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{renderTableRows(positionsData)}</tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "History" && (
        <section className="tablecss">
          <div className="tbl-content">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead className="tableheadd">
                <tr>
                  <th>Pair</th>
                  <th>Side</th>
                  <th>Price</th>
                  <th>Size</th>
                  <th>PnL</th>
                </tr>
              </thead>
              <tbody>{renderTableRows(historyData)}</tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
};

export default Tradetables;
