import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import person from "../assets/address.jpg";
import Modal from "./Modal";
import API_URL from "../config";

const Freelance = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    const fetchFrJobs = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/frjobs/getAllFreelance`
        );
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching job data:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFrJobs();
  }, [API_URL]);

  const formatPrice = (budget) => {
    if (typeof budget === "number") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(budget);
    }
    return "N/A"; // Handle missing or incorrect budget data
  };
  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval;

    if (seconds < 60) return `${seconds} seconds ago`;
    interval = Math.floor(seconds / 60);
    if (interval < 60) return `${interval} minutes ago`;
    interval = Math.floor(interval / 60);
    if (interval < 24) return `${interval} hours ago`;
    interval = Math.floor(interval / 24);
    if (interval < 30) return `${interval} days ago`;
    interval = Math.floor(interval / 30);
    if (interval < 12) return `${interval} months ago`;
    interval = Math.floor(interval / 12);
    return `${interval} years ago`;
  };

  const filteredJobs = jobs
    .filter(
      (job) =>
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    .sort((a, b) => {
      if (sortBy === "latest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

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
    <>
      <div className="col-lg-12">
        <div className="pagetitle">
          <h1>Browse Freelance Work</h1>
        </div>
        <div className="row">
          {/* Filter Section */}
          <div className="col-lg-12">
            <div className="filter-section">
              <input
                type="text"
                className="search-bar"
                placeholder="Search for jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="sort-by-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div className="freelance-job-list">
              {filteredJobs.map((job) => (
                <div className="freelance-job-card" key={job._id}>
                  <Link to={`/dashboard/gigdetails/${job._id}`}>
                    <div className="freelance-job-card-body">
                      <img
                        src={job.logo || person}
                        alt="Company Logo"
                        className="freelance-company-logo"
                      />
                      <div className="freelance-job-details">
                        <h4 className="freelance-job-title">{job.jobTitle}</h4>
                        <p className="freelance-task-assigner">
                          {job.postedBy.username}
                        </p>
                        <span style={{ color: "#ddd", fontSize: "12px" }}>
                          {timeSince(job.createdAt)}
                        </span>
                        <p className="freelance-job-description">
                          {truncateText(job.description, 30)}
                        </p>
                        <div className="freelance-job-tags">
                          {job.selectedSkills.map((tag, index) => (
                            <span key={index} className="job-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="freelance-job-card-footer">
                    <p className="freelance-job-price">
                      {formatPrice(job.budget)}
                    </p>
                    <Link to={`/dashboard/gigdetails/${job._id}`}>
                      <button className="freelance-more-info-btn">
                        See details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Freelance;