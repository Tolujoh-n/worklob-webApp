import React, { useEffect, useState } from "react";
import person from "../assets/address.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

const Fulltimejob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/jobs/getAlljobs`);
        console.log("Fulltime jobs data:", response.data); // Log to check the response
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
    .filter(
      (job) =>
        selectedRole === "" ||
        job.role.toLowerCase() === selectedRole.toLowerCase()
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
  const formatPrice = (job) => {
    if (!job) return "N/A";

    if (typeof job.fixedCompensation === "number") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(job.fixedCompensation);
    }

    if (
      job.rangeCompensation &&
      job.rangeCompensation.min !== null &&
      job.rangeCompensation.max !== null
    ) {
      return `${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(job.rangeCompensation.min)} - ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(job.rangeCompensation.max)}`;
    }

    return "N/A"; // If no valid budget found
  };

  return (
    <>
      <div className="col-lg-12">
        <div className="pagetitle">
          <h1>Browse Full-time Jobs</h1>
        </div>
        <div className="row">
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
                className="role-filter"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="design">Design</option>
                <option value="development">Development</option>
                <option value="marketing">Marketing</option>
              </select>
              <select
                className="sort-by-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>

            <div className="fulltime-job-list">
              {filteredJobs.length === 0 ? (
                <p>No jobs available at the moment.</p>
              ) : (
                filteredJobs.map((job) => (
                  <div className="job-card" key={job._id}>
                    <Link to={`/dashboard/gigdetails/${job._id}`}>
                      <div className="job-card-header">
                        <img
                          src={job.logo || person}
                          alt="Company Logo"
                          className="company-logo"
                        />
                        <h4 className="job-hr">{job.postedBy.username}</h4>
                        <div className="job-meta">
                          <span className="job-date">
                            {timeSince(job.createdAt)}
                          </span>
                          <i className="save-icon">&#9734;</i>
                        </div>
                      </div>
                      <div className="job-info">
                        <h4 className="job-title">{job.jobTitle}</h4>
                        <p>{truncateText(job.description, 30)}</p>
                        <div className="job-tags">
                          {job.selectedSkills.map((tag, index) => (
                            <span key={index}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                    <br />
                    <div className="freelance-job-card-footer">
                      <p className="freelance-job-price">{formatPrice(job)}</p>
                      <Link to={`/dashboard/gigdetails/${job._id}`}>
                        <button className="freelance-more-info-btn">
                          See details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Fulltimejob;
