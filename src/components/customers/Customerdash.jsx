import React, { useState } from "react";
import useImage from "../../assets/img/worklob-coin.png";
import { Link } from "react-router-dom";
import person from "../../assets/address.jpg";

const Customerdash = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <>
      <div className="pagetitle">
        <h1>Get work done with WorkLob</h1>
        <p>
          On WorkLob, you can publish Freelance & Full-time Jobs or choose from
          over 30,000 Gigs!
        </p>
      </div>
      <div className="job-list">
        <div className="row">
          <div className="fulltime-job-list">
            <div className="job-card">
              <div className="job-card-header">
                <img
                  src={useImage}
                  alt="Company Logo"
                  className="company-logo"
                />
              </div>
              <div className="job-info">
                <h4 className="job-title">Post a Job</h4>

                <p>
                  Post Freelance & Full-time Jobs to hire talent specific for
                  what you need!
                </p>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="job-amount"></span>
                <Link to="/dashboard/postjob">
                  <button className="btn chat-button">Post Job</button>
                </Link>
              </div>
            </div>
            <div className="job-card">
              <div className="job-card-header">
                <img
                  src={useImage}
                  alt="Company Logo"
                  className="company-logo"
                />
              </div>
              <div className="job-info">
                <h4 className="job-title">Browse our Gigs</h4>

                <p>
                  Choose from more than 56 categories of fixed-price services to
                  find an expert who can meet your needs today!
                </p>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="job-amount"></span>
                <Link to="/dashboard/browsegigs">
                  <button className="btn chat-button">Browse Gigs</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customerdash;
