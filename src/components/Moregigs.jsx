import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import person from "../assets/address.jpg";
import API_URL from "../config";

const Moregigs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/gigJob/getAllGigJob`
        );
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching job data:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [API_URL]);

  const formatPrice = (budget) => {
    if (typeof budget === "number") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(budget);
    }
    return "N/A";
  };

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  const truncateText = (text, wordLimit) => {
    if (!text || text.trim() === "") return "No description available";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <div className="giginfo">
      <div className="gig-job-header">
        <h3 className="gig-job-sitename">New Gigs</h3>
        <a href="/dashboard/browsegigs" className="gig-job-show-all">
          Show all gig jobs
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-right"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8.5 4.5a.5.5 0 0 1 .5.5v3H12a.5.5 0 0 1 0 1H9v3a.5.5 0 0 1-.8.4l-5-4a.5.5 0 0 1 0-.8l5-4a.5.5 0 0 1 .8.4z"
            />
          </svg>
        </a>
      </div>
      <div className="gig-job-list">
        {jobs.slice(0, 6).map((gig) => (
          <div className="gig-job-card" key={gig._id}>
            <a href={`/dashboard/gigdetails/${gig._id}`}>
              <div className="gig-job-card-body">
                <img
                  src={gig.logo || person}
                  alt="Company Logo"
                  className="gig-job-company-logo"
                />
                <div className="gig-job-details">
                  <h4 className="gig-job-title">{gig.jobTitle}</h4>
                  <p className="gig-job-task-assigner">
                    {gig.postedBy.username}
                  </p>
                  <p className="gig-job-description">
                    {truncateText(gig.description, 20)}
                  </p>
                  <div className="gig-job-tags">
                    {gig.selectedSkills.map((tag, index) => (
                      <span key={index}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="gig-job-card-footer">
                <span className="gig-job-price">{formatPrice(gig.budget)}</span>
                <button className="freelance-more-info-btn">More Info</button>
              </div>
              <div className="gig-job-rating">★★★★☆(4)</div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Moregigs;
