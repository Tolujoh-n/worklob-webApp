import React, { useState } from "react";
import useImage from "../../assets/img/worklob-coin.png";
import { Link } from "react-router-dom";
import person from "../../assets/address.jpg";

const Postjob = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <>
      <div className="pagetitle">
        <h1>Post a Job</h1>
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
                <h4 className="job-title">Freelance Job</h4>

                <p>I'm looking for a freelancer to complete a task for me.</p>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="job-amount"></span>
                <Link to="/dashboard/freelanceform">
                  <button className="btn chat-button">
                    Post Freelance Job
                  </button>
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
                <h4 className="job-title">Full-time Job</h4>

                <p>I'm looking to hire talent for a long-term position.</p>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="job-amount"></span>
                <Link to="/dashboard/fulltimeform">
                  <button className="btn chat-button">
                    Post Full-time Job
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Postjob;
