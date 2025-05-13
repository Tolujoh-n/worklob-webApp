import React, { useState } from "react";
import coin from "./loanasset/usdc.png";
import Penguins from "./loanasset/pengu.jpg";
import Onchain from "./loanasset/onchain-gia.jpg";
import Baseg from "./loanasset/base-god.gif";
import Miggle from "./loanasset/minggle-on-base.gif";
import Lilp from "./loanasset/lil-pudgy.png";
import Punks from "./loanasset/based-punks.gif";
import Borrowmodal from "./Borrowmodal";

const tableData = [
  {
    collection: "Penguins",
    collectionimg: Penguins,
    avaliablepool: 20.4,
    offerstaken: "0 of 10 offers taken",
    bestoffer: 12,
    interest: 0.56,
    interestrate: "3.49% interest",
    apy: 60,
    duration: 7,
    offers: [
      { bestoffer: 11, interest: 0.5, duration: 5 },
      { bestoffer: 10.5, interest: 0.48, duration: 6 },
      { bestoffer: 11, interest: 0.5, duration: 5 },
      { bestoffer: 10.5, interest: 0.48, duration: 6 },
    ],
  },
  {
    collection: "Onchain Gaias",
    collectionimg: Onchain,
    avaliablepool: 25.43,
    offerstaken: "0 of 10 offers taken",
    bestoffer: 14,
    interest: 0.6,
    interestrate: "3.59% interest",
    apy: 65,
    duration: 8,
    offers: [
      { bestoffer: 13.5, interest: 0.55, duration: 6 },
      { bestoffer: 13, interest: 0.52, duration: 7 },
    ],
  },
  {
    collection: "Base God",
    collectionimg: Baseg,
    avaliablepool: 25.43,
    offerstaken: "0 of 10 offers taken",
    bestoffer: 14,
    interest: 0.6,
    interestrate: "3.59% interest",
    apy: 65,
    duration: 8,
    offers: [
      { bestoffer: 13.5, interest: 0.55, duration: 6 },
      { bestoffer: 13, interest: 0.52, duration: 7 },
      { bestoffer: 11, interest: 0.5, duration: 5 },
      { bestoffer: 10.5, interest: 0.48, duration: 6 },
      { bestoffer: 11, interest: 0.5, duration: 5 },
      { bestoffer: 10.5, interest: 0.48, duration: 6 },
    ],
  },
  {
    collection: "Miggle on Base",
    collectionimg: Miggle,
    avaliablepool: 25.43,
    offerstaken: "0 of 10 offers taken",
    bestoffer: 14,
    interest: 0.6,
    interestrate: "3.59% interest",
    apy: 65,
    duration: 8,
    offers: [
      { bestoffer: 13.5, interest: 0.55, duration: 6 },
      { bestoffer: 13, interest: 0.52, duration: 7 },
    ],
  },
  {
    collection: "Lil Pudgy",
    collectionimg: Lilp,
    avaliablepool: 25.43,
    offerstaken: "0 of 10 offers taken",
    bestoffer: 14,
    interest: 0.6,
    interestrate: "3.59% interest",
    apy: 65,
    duration: 8,
    offers: [
      { bestoffer: 13.5, interest: 0.55, duration: 6 },
      { bestoffer: 13, interest: 0.52, duration: 7 },
    ],
  },
  {
    collection: "Based Punks",
    collectionimg: Punks,
    avaliablepool: 25.43,
    offerstaken: "0 of 10 offers taken",
    bestoffer: 14,
    interest: 0.6,
    interestrate: "3.59% interest",
    apy: 65,
    duration: 8,
    offers: [
      { bestoffer: 13.5, interest: 0.55, duration: 6 },
      { bestoffer: 13, interest: 0.52, duration: 7 },
    ],
  },
  // Add more rows as needed
];

const Borrow = () => {
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const [isBorrowmodalOpen, setIsBorrowmodalOpen] = useState(false);

  const handleViewOffersClick = (index) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };

  const handleBorrowmodalClick = () => {
    setIsBorrowmodalOpen(true);
  };

  const handleCloseBorrowmodal = () => {
    setIsBorrowmodalOpen(false);
  };

  return (
    <>
      <section className="loansec">
        <div className="tbl-content">
          <table cellPadding="0" cellSpacing="0" border="0">
            <thead className="tableheadd">
              <tr>
                <th>Collection</th>
                <th>Available Pool</th>
                <th>Best Offer</th>
                <th>Interest</th>
                <th>Duration</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <React.Fragment key={index}>
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
                      {row.avaliablepool}{" "}
                      <span>
                        <img
                          src={coin}
                          className="coin-table-image"
                          alt="coin"
                        />
                      </span>
                      <br />
                      <span style={{ fontSize: "10px" }}>
                        {row.offerstaken}
                      </span>
                    </td>
                    <td>
                      <div>
                        {row.bestoffer}{" "}
                        <span>
                          <img
                            src={coin}
                            className="coin-table-image"
                            alt="coin"
                          />
                        </span>
                        <br />
                        <span
                          className="viewoffers"
                          onClick={() => handleViewOffersClick(index)}
                          style={{ cursor: "pointer", color: "blue" }}
                        >
                          View offers
                        </span>
                      </div>
                    </td>
                    <td>
                      {row.interest}{" "}
                      <span>
                        <img
                          src={coin}
                          className="coin-table-image"
                          alt="coin"
                        />
                      </span>
                    </td>
                    <td>{row.duration} days</td>
                    <td>
                      <button
                        onClick={handleBorrowmodalClick}
                        className="loanbtn"
                      >
                        Borrow
                      </button>
                    </td>
                  </tr>
                  {expandedRowIndex === index &&
                    row.offers.map((offer, subIndex) => (
                      <tr key={subIndex} className="sub-row">
                        <td></td>
                        <td>-</td>
                        <td>
                          {offer.bestoffer}{" "}
                          <span>
                            <img
                              src={coin}
                              className="coin-table-image"
                              alt="coin"
                            />
                          </span>
                        </td>
                        <td>
                          {row.interest}{" "}
                          <span>
                            <img
                              src={coin}
                              className="coin-table-image"
                              alt="coin"
                            />
                          </span>
                        </td>
                        <td>{offer.duration} days</td>
                        <td>
                          <button
                            onClick={handleBorrowmodalClick}
                            className="loanbtn"
                          >
                            Borrow
                          </button>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isBorrowmodalOpen && <Borrowmodal onClose={handleCloseBorrowmodal} />}
    </>
  );
};

export default Borrow;
