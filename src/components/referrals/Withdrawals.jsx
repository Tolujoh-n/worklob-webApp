import React, { useState } from "react";

const Withdrawals = () => {
  // Initialize state for transaction data
  const [transactions, setTransactions] = useState([
    {
      type: "Deposit",
      date: "2024-08-30",
      cryptocurrency: "ETH",
      transactionId: "0x3e123456789abcdef",
      amount: "100 ETH",
    },
    {
      type: "Withdrawal",
      date: "2024-08-28",
      cryptocurrency: "LOB",
      transactionId: "0x3ea1b2c3d4e5f67890",
      amount: "50 LOB",
    },
    {
      type: "Swap",
      date: "2024-08-27",
      cryptocurrency: "ETH to LOB",
      transactionId: "0x3eabcdef123456789",
      amount: "25 ETH",
    },
    {
      type: "Deposit",
      date: "2024-08-26",
      cryptocurrency: "USDT",
      transactionId: "0x3e0f9e8d7c6b5a4321",
      amount: "200 USDT",
    },
  ]);
  return (
    <section className="tablecss">
      <div className="tbl-content">
        <table cellPadding="0" cellSpacing="0" border="0">
          <thead className="tableheadd">
            <tr>
              <th>Type & Date</th>
              <th>Cryptocurrency</th>
              <th>Transaction ID</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr>
                <td>
                  {" "}
                  {transaction.type} - {transaction.date}
                </td>
                <td>{transaction.cryptocurrency}</td>
                <td>{transaction.transactionId}</td>
                <td>{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Withdrawals;
