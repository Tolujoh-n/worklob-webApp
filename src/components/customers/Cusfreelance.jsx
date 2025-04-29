import React, { useEffect, useState } from "react";
import useImage from "../../assets/address.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_URL from "../../config";

const Cusfreelance = () => {
  const [selectedTab, setSelectedTab] = useState("all");
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
          `${API_URL}/api/v1/frjobs/getAllFreelance/${userId}`
        );
        setJobs(response.data);
        console.log("Data type of jobs:", typeof response.data);
        console.log(response.data);
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

  // Function to generate random reviews for each job
  const generateRandomReviews = () => {
    const ratings = Math.floor(Math.random() * 5) + 1; // Random rating between 1 and 5
    const reviews = Math.floor(Math.random() * 100) + 1; // Random number of reviews between 1 and 100
    return { ratings, reviews };
  };

  // Function to format budget as currency
  const formatBudget = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
            className={selectedTab === "all" ? "active" : ""}
            onClick={() => setSelectedTab("all")}
          >
            All
          </button>
          <button
            className={selectedTab === "Posted" ? "active" : ""}
            onClick={() => setSelectedTab("Posted")}
          >
            Posted
          </button>
          <button
            className={selectedTab === "progress" ? "active" : ""}
            onClick={() => setSelectedTab("progress")}
          >
            In Progress
          </button>
          <button
            className={selectedTab === "completed" ? "active" : ""}
            onClick={() => setSelectedTab("completed")}
          >
            Completed
          </button>
        </div>

        {/* Show "No jobs found" message if no jobs */}
        {!jobs.length && <p className="no-jobs">No jobs found.</p>}

        <div className="row">
          {jobs.map((job) => {
            const { ratings, reviews } = generateRandomReviews();

            return (
              <div key={job._id} className="col-lg-12">
                <div className="card job-card">
                  <Link to={`/dashboard/gigdetails/${job._id}`}>
                    <div className="card-body">
                      <span className="badge job-type">Freelance</span>

                      <div className="d-flex flex-wrap justify-content-between align-items-start">
                        <div className="job-details">
                          <h4>{job.jobTitle}</h4>
                          <p className="job-date">
                            {new Date(job.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="job-description">
                        {truncateText(job.description, 60)}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="job-amount">
                          {formatBudget(job.budget)}
                        </span>
                        <button className="btn chat-button">
                          <i className="bi bi-people"></i> 1
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Cusfreelance;
