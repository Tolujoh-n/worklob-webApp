import React from "react";
import coin from "./loanasset/usdc.png";
import Statstable from "./Statstable";

const LoanPortfolio = () => {
  return (
    <>
      <div className="pagetitle">
        <h1> My Lending statistics</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard/loan">loans</a>
            </li>
            <li className="breadcrumb-item active">portfolio</li>
          </ol>
        </nav>
      </div>
      <section id="featured-services" className="featured-services">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-6 mb-5">
              <div className="icon-box">
                <h5 className="title">TOTAL INTEREST EARNED</h5>
                <h5>
                  <b>0</b>{" "}
                  <span>
                    <img src={coin} className="coin-table-image" alt="coin" />
                  </span>
                </h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 mb-5">
              <div className="icon-box">
                <h5 className="title">TOTAL ACTIVE LOAN VALUE</h5>
                <h5>
                  <b>0</b>{" "}
                  <span>
                    <img src={coin} className="coin-table-image" alt="coin" />
                  </span>
                </h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 mb-5">
              <div className="icon-box">
                <h5 className="title">TOTAL OFFER VALUE</h5>
                <h5>
                  <b>0</b>{" "}
                  <span>
                    <img src={coin} className="coin-table-image" alt="coin" />
                  </span>
                </h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 mb-5">
              <div className="icon-box">
                <h5 className="title">FORCECLOSE</h5>
                <h5>
                  <b>0</b>{" "}
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
            <Statstable />
          </div>
        </div>
      </section>
    </>
  );
};

export default LoanPortfolio;
