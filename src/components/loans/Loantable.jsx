import React, { useState } from "react";
import coin from "./loanasset/eth.png";
import Penguins from "./loanasset/pengu.jpg";
import Onchain from "./loanasset/onchain-gia.jpg";
import Baseg from "./loanasset/base-god.gif";
import Miggle from "./loanasset/minggle-on-base.gif";
import Lilp from "./loanasset/lil-pudgy.png";
import Punks from "./loanasset/based-punks.gif";

const tableData = [
  {
    collection: "Penguins",
    collectionimg: Penguins,
    avaliablepool: 20.4,
    offerstaken: "0 of 10 offers taken",
    offer: 3,
    interest: 5.56,
    interestrate: "3.49% interest",
    apy: 60,
    duration: 8,
    status: "Active",
  },
  {
    collection: "Onchain Gaias",
    collectionimg: Onchain,
    avaliablepool: 25.43,
    offerstaken: "0 of 10 offers taken",
    offer: 12,
    interest: 15.56,
    interestrate: "3.49% interest",
    apy: 60,
    duration: 8,
    status: "Closed",
  },
  {
    collection: "Base God",
    collectionimg: Baseg,
    avaliablepool: 33.4,
    offerstaken: "0 of 4 offers taken",
    offer: 16,
    interest: 20.56,
    interestrate: "1.49% interest",
    apy: 50,
    duration: 8,
    status: "Active",
  },
  {
    collection: "Miggle on Base",
    collectionimg: Miggle,
    avaliablepool: 30.4,
    offerstaken: "4 of 50 offers taken",
    offer: 1.4,
    interest: 1.56,
    interestrate: "2.49% interest",
    apy: 60,
    duration: 8,
    status: "Closed",
  },
];

const Loantable = () => {
  return (
    <section className="loansec">
      <div className="tbl-content">
        <table cellPadding="0" cellSpacing="0" border="0">
          <thead className="tableheadd">
            <tr>
              <th>Collection</th>
              <th>Borrowed</th>
              <th>APY</th>
              <th>Repay Amount</th>
              <th>Duration</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr>
                <td>
                  <span className="inline-flex-container">
                    <img
                      src={row.collectionimg}
                      className="loan-table-image"
                      alt="coin"
                    />
                    <span className="collection-text d-none d-md-inline">
                      {row.collection}
                    </span>
                  </span>
                </td>
                <td>
                  <div>
                    {row.offer}{" "}
                    <span>
                      <img src={coin} className="coin-table-image" alt="coin" />
                    </span>
                  </div>{" "}
                </td>
                <td>{row.apy} %</td>
                <td>
                  {row.interest}
                  <span>
                    <img src={coin} className="coin-table-image" alt="coin" />
                  </span>
                  <br />
                  <span style={{ fontSize: "10px" }}>{row.interestrate}</span>
                </td>
                <td>{row.duration} Days</td>

                <td>{row.status}</td>
                <td>
                  <button className="loanbtn">Repay</button>
                </td>
              </tr>
            ))}
            {/* Add additional rows here as needed */}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Loantable;
