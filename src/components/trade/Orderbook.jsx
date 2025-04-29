import React from "react";

const Orderbook = () => {
  const sellData = [
    { price: "50,700", quantity: "0.4", total: "0.4" },
    { price: "50,680", quantity: "1.0", total: "1.4" },
    { price: "50,660", quantity: "0.7", total: "2.1" },
    { price: "50,640", quantity: "0.6", total: "2.7" },
    { price: "50,620", quantity: "1.2", total: "3.9" },
    { price: "50,600", quantity: "0.8", total: "4.7" },
    { price: "50,580", quantity: "1.5", total: "6.2" },
  ];

  const buyData = [
    { price: "50,400", quantity: "1.2", total: "1.2" },
    { price: "50,380", quantity: "0.9", total: "2.1" },
    { price: "50,360", quantity: "1.3", total: "3.4" },
    { price: "50,340", quantity: "0.5", total: "3.9" },
    { price: "50,320", quantity: "1.1", total: "5.0" },
    { price: "50,300", quantity: "1.7", total: "6.7" },
    { price: "50,280", quantity: "0.8", total: "7.5" },
  ];

  return (
    <div className="orderbook">
      <div className="orderheader">
        <h4 className="orderleft">Order Book</h4>
        <span className="orderright">Recent Trades</span>
      </div>
      <div className="table-container">
        <div className="sell-orders">
          <div style={{ color: "whitesmoke" }} className="order-row">
            <span className="price">Price(USDT)</span>
            <span className="quantity">Qty(BTC)</span>
            <span className="total">Total(BTC)</span>
          </div>
          {sellData.slice(0, 5).map((order, index) => (
            <div key={index} className="order-row">
              <span className="price">{order.price}</span>
              <span className="quantity">{order.quantity}</span>
              <span className="total">{order.total}</span>
            </div>
          ))}
        </div>
        <div className="current-price">
          <span className="arrow-up">↑</span>
          <span>$90,500</span>
        </div>
        <div className="buy-orders">
          {buyData.slice(0, 5).map((order, index) => (
            <div key={index} className="order-row">
              <span className="price">{order.price}</span>
              <span className="quantity">{order.quantity}</span>
              <span className="total">{order.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orderbook;
