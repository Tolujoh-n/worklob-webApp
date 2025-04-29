import React, { useEffect, useState } from "react";
import useimage from "../assets/address.jpg";
import Moregigs from "./Moregigs";
import Gigdetailsmodal from "./Gigdetailsmodal";
import Buygigmodal from "./Buygigmodal";
import { FaFacebook, FaTwitter, FaTelegram, FaLinkedin } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Morejobs from "./Morejobs";
import Followhr from "./Followhr";
import API_URL from "../config";

const Gigdetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(true);
  const { jobId } = useParams();

  const openBuyModal = () => setIsBuyModalOpen(true);
  const closeBuyModal = () => setIsBuyModalOpen(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));
  let userRole = user?.role;
  console.log("User Role:", userRole);
  // console.log(user)
  let applicantId;
  if (token) {
    const decodedToken = jwtDecode(token);
    applicantId = decodedToken.userId;
    // console.log(userId);
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/jobs/jobdetails/${jobId}`
        );
        setJobs(response.data);
        console.log("Fetched job details:", response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setJobs(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [API_URL, jobId]);

  if (loading) {
    return <div>Loading job details...</div>;
  }

  if (!jobs) {
    return <div>Error: Job not found</div>;
  }

  return (
    <div className="giginfo gig-details-container row">
      <div className="col-lg-8 gig-info">
        <div className="gig-info-header d-flex align-items-center">
          <img src={useimage} alt="Gig" className="gig-image" />
          <div className="gig-info-text">
            <h2 className="gig-name">{jobs.postedBy.username}</h2>
            <div className="gig-rating">Rating: ★★★★☆</div>
          </div>
        </div>
        <h3 className="gig-title">{jobs.jobTitle}</h3>
        <p style={{ color: "whitesmoke" }} className="gig-description">
          {jobs.description}
        </p>
        <div className="job-tags">
          {jobs.selectedSkills.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="col-lg-4 gig-sidebar">
        {user?.role === "Talent" ? (
          <div
            style={{ border: "1px solid whitesmoke" }}
            className="card info-card"
          >
            <div className="card-body">
              <h5 className="card-title">
                {" "}
                $ {jobs.budget} {jobs.fixedCompensation}
              </h5>
              <p className="gig-balance">ETH, USDT</p>

              <div className="gig-actions">
                <button
                  style={{
                    borderRadius: "20px",
                    width: "100%",
                    marginBottom: "15px",
                  }}
                  className="sidebutton"
                  onClick={openModal}
                >
                  Apply for this job
                </button>
                <button
                  style={{ borderRadius: "20px", width: "100%" }}
                  className="sidebutton"
                >
                  Save for later
                </button>
              </div>

              <div className="gig-share">
                <p style={{ color: "whitesmoke" }}>Share this job:</p>
                <div className="share-container">
                  <div className="social-icons">
                    <a href="#" className="icon facebook" aria-label="Facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="icon twitter" aria-label="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="icon telegram" aria-label="Telegram">
                      <i className="fab fa-telegram-plane"></i>
                    </a>
                    <a href="#" className="icon linkedin" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ border: "1px solid whitesmoke" }} className="card">
            <div className="card-body">
              <h5 className="card-title">Terms of work:</h5>
              <p className="gig-balance">
                $ {jobs.budget} {jobs.fixedCompensation}
              </p>
              <p className="gig-balance">purchases: </p>

              <div className="gig-actions">
                <button
                  style={{
                    borderRadius: "20px",
                    width: "100%",
                    marginBottom: "15px",
                  }}
                  className="sidebutton"
                  onClick={openBuyModal} // Open Buy modal on button click
                >
                  Buy this gig
                </button>
                <button
                  style={{ borderRadius: "20px", width: "100%" }}
                  className="sidebutton"
                >
                  Save for later
                </button>
              </div>

              <div className="gig-share">
                <p style={{ color: "whitesmoke" }}>Share this job:</p>
                <div className="share-container">
                  <div className="social-icons">
                    <a href="#" className="icon facebook" aria-label="Facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="icon twitter" aria-label="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="icon telegram" aria-label="Telegram">
                      <i className="fab fa-telegram-plane"></i>
                    </a>
                    <a href="#" className="icon linkedin" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Hiring Managers */}
        <div className="card">
          <Followhr />
        </div>
      </div>

      {/* More Gigs Section */}
      <div className="col-lg-12">
        {userRole === "Talent" ? <Morejobs /> : <Moregigs />}
      </div>

      <Gigdetailsmodal
        applicantId={applicantId}
        jobId={jobId}
        recruiterImage={useimage}
        recruiterName={jobs.postedBy.username}
        jobTitle={jobs.jobTitle}
        userRole={userRole}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Buy gig Modal */}
      <Buygigmodal
        applicantId={applicantId}
        jobId={jobId}
        recruiterImage={useimage}
        recruiterName={jobs.postedBy.username}
        jobTitle={jobs.jobTitle}
        userRole={userRole}
        isOpen={isBuyModalOpen}
        onClose={closeBuyModal}
      />
    </div>
  );
};

export default Gigdetails;
