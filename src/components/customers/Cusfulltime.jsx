import React, { useEffect, useState } from "react";
import useImage from "../../assets/address.jpg";
import { Link, useNavigate } from "react-router-dom";
import person from "../../assets/address.jpg";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_URL from "../../config";

const Cusfulltime = () => {
  const [selectedTab, setSelectedTab] = useState("Published");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  let userId;
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
  }

  const navigate = useNavigate();

  const handleChat = async (jobId) => {
    console.log("Job ID:", jobId);
    try {
      const response = await axios.get(`${API_URL}/api/v1/chat/chatdetails`, {
        params: { jobId },
      });
      console.log("Chat response:", response.data);

      if (response.data.length > 0) {
        const chatId = response.data[0]._id;
        navigate(`/dashboard/chatdetails/${jobId}/chat/${chatId}`);
      } else {
        console.error("No chat found for this job");
      }
    } catch (error) {
      console.error("Error navigating applied job data:", error);
    }
  };

  useEffect(() => {
    const fetchCustomerJobs = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/jobs/getAlljobs/${userId}`
        );
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching customer jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerJobs();
  }, [API_URL, userId]);

  if (loading) {
    return <p>Loading jobs...</p>;
  }

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

  const truncateText = (text, wordLimit) => {
    if (!text || text.trim() === "") return "No description available";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <>
      <div className="pagetitle">
        <h1>My Jobs</h1>
      </div>
      <div className="job-list">
        <div className="nav-toggle">
          <button
            className={selectedTab === "Published" ? "active" : ""}
            onClick={() => setSelectedTab("Published")}
          >
            Published
          </button>
          <button
            className={selectedTab === "Drafts" ? "active" : ""}
            onClick={() => setSelectedTab("Drafts")}
          >
            Drafts
          </button>
          <button
            className={selectedTab === "Archive" ? "active" : ""}
            onClick={() => setSelectedTab("Archive")}
          >
            Archive
          </button>
        </div>

        {!jobs.length && <p className="no-jobs-message">No jobs found.</p>}

        <div className="row">
          <div className="fulltime-job-list">
            {jobs.map((job) => (
              <div className="job-card" key={job._id}>
                <Link to={`/dashboard/gigdetails/${job._id}`}>
                  <div className="job-card-header">
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
                    <p>{job.paragraph}</p>
                  </div>
                </Link>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="job-amount">{job.budget}</span>
                  <button className="btn chat-button">
                    <i className="bi bi-people"></i> 1
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cusfulltime;