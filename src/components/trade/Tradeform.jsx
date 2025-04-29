import React, { useState } from "react";

const TradeForm = () => {
  const [tradeType, setTradeType] = useState("Spot");
  const [orderType, setOrderType] = useState("Limit");
  const [buySell, setBuySell] = useState("Buy");
  const [leverage, setLeverage] = useState("10X");
  const [marginType, setMarginType] = useState("Isolated");
  const [tpSlChecked, setTpSlChecked] = useState(false);

  return (
    <div className="trade-container">
      {/* Trade Type Toggle */}
      <div className="toggle-group">
        <button
          className={tradeType === "Spot" ? "active" : ""}
          onClick={() => setTradeType("Spot")}
        >
          Spot
        </button>
        <button
          className={tradeType === "Futures" ? "active" : ""}
          onClick={() => setTradeType("Futures")}
        >
          Futures
        </button>
      </div>

      {/* Futures Dropdowns */}
      {tradeType === "Futures" && (
        <div className="dropdown-group">
          <select
            value={marginType}
            onChange={(e) => setMarginType(e.target.value)}
          >
            <option>Isolated</option>
            <option>Cross</option>
          </select>
          <select
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
          >
            {["5X", "10X", "15X", "20X", "50X", "100X"].map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </div>
      )}

      {/* Available Balance */}
      <div className="balance-display">
        <span>Available</span>
        <span>1000 USDT</span>
      </div>

      {/* Order Type Toggle */}
      <div className="toggle-group order-type">
        <button
          className={orderType === "Limit" ? "active" : ""}
          onClick={() => setOrderType("Limit")}
        >
          Limit
        </button>
        <button
          className={orderType === "Market" ? "active" : ""}
          onClick={() => setOrderType("Market")}
        >
          Market
        </button>
      </div>

      {/* Inputs */}
      {orderType === "Limit" && (
        <>
          <div className="input-box">
            <input type="number" placeholder="$0.00" />
            <span>USDT</span>
          </div>
          <div className="input-box">
            <input type="number" placeholder="$0.00" />
            <span>USDT</span>
          </div>
          <div className="market-inputs">
            <div className="progress-bar">
              <input type="range" min="0" max="100" />
            </div>
          </div>
        </>
      )}
      {orderType === "Market" && (
        <>
          <div className="input-box">
            <input type="number" placeholder="$0.00" />
            <span>USDT</span>
          </div>
          <div className="market-inputs">
            <div className="progress-bar">
              <input type="range" min="0" max="100" />
            </div>
          </div>
        </>
      )}

      {/* entry info preview */}
      <div className="info-display">
        <div>
          <span>Qty:</span>
          <span>0/0BTC</span>
        </div>
        <div>
          <span>Cost:</span>
          <span>0/0USDT</span>
        </div>
        <div>
          <span>Liquidity Price:</span>
          <span>$0</span>
        </div>
      </div>

      {/* TP/SL Checkbox */}
      <div className="tp-sl">
        <label>
          <input
            type="checkbox"
            checked={tpSlChecked}
            onChange={() => setTpSlChecked(!tpSlChecked)}
          />{" "}
          TP/SL
        </label>
        {tpSlChecked && (
          <>
            <input type="number" placeholder="Take Profit" />
            <input type="number" placeholder="Stop Loss" />
          </>
        )}
      </div>

      {/* Buy/Sell Button */}
      <div className="trade-buttons">
        <button className="buy-btn">Buy</button>
        <button className="sell-btn">Sell</button>
      </div>
    </div>
  );
};

export default TradeForm;
