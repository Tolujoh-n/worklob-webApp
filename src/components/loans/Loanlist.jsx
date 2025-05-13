import React from "react";
import coin from "./loanasset/usdc.png";
import Loantable from "./Loantable";

const Loanlist = () => {
  return (
    <>
      <div className="pagetitle">
        <h1> My Loans</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard/loan">Loans</a>
            </li>
            <li className="breadcrumb-item active">my loans</li>
          </ol>
        </nav>
      </div>
      <section id="featured-services" className="featured-services">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p id="para">
                These are the NFTs you have used as collateral for loans
                (borrowed against). To retain ownership of your NFT, you must
                fully repay these loans before the expiration date. Failure to
                repay the loans by the expiration date will result in the loss
                of your NFT.
              </p>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 mb-5">
              <div className="icon-box">
                <h4 className="title">TOTAL BORROWED</h4>
                <h5>
                  0{" "}
                  <span>
                    <img src={coin} className="coin-table-image" alt="coin" />
                  </span>
                </h5>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 mb-5">
              <div className="icon-box">
                <h4 className="title">TOTAL ACTIVE LOANS</h4>
                <h5>
                  0{" "}
                  <span>
                    <img src={coin} className="coin-table-image" alt="coin" />
                  </span>
                </h5>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 mb-5">
              <div className="icon-box">
                <h4 className="title">TOTAL INTEREST OWED</h4>
                <h5>
                  0{" "}
                  <span>
                    <img src={coin} className="coin-table-image" alt="coin" />
                  </span>
                </h5>
              </div>
            </div>

            <div className="col-lg-12 col-md-12 col-sm-12 mb-5">
              <div className="input-group">
                <input
                  type="text"
                  style={{
                    background: "transparent",
                    color: "gray",
                    border: "2px solid gray",
                    borderRadius: "20px 0px 0px 20px",
                  }}
                  className="form-control rounded-20"
                  placeholder="Search collection..."
                  aria-label="Search"
                  aria-describedby="search-icon"
                />
                <button
                  className="btn btn-outline-secondary"
                  style={{
                    background: "#5e95b3",
                    color: "whitesmoke",
                  }}
                  type="button"
                  id="search-icon"
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
            <Loantable />
          </div>
        </div>
      </section>
    </>
  );
};

export default Loanlist;
