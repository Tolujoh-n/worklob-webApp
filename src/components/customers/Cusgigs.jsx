import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import person from "../../assets/address.jpg"; // Fallback image
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import API_URL from "../../config";

const Cusgigs = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let userId;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const statusMap = {
    all: "all",
    applied: "applied",
    offered: "offered",
    inProgress: "inProgress",
    completed: "completed",
    archived: "confirmed", // 'confirmed' maps to archived
  };

  const fetchJobStatuses = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/chat/allchats/${userId}`
      );
      const fetchedJobs = response.data;

      // Log jobId and status to the console
      const jobStatuses = fetchedJobs.map((job) => ({
        jobId: job.jobId,
        status: job.status,
      }));
      console.log("Job statuses:", jobStatuses);

      return jobStatuses;
    } catch (error) {
      console.error("Error fetching job statuses:", error);
      toast.error("Failed to fetch job statuses.");
      return [];
    }
  };

  const handleChat = async (jobId) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/chat/chatdetails`, {
        params: { jobId },
      });

      if (response.data.length > 0) {
        const chat = response.data.find(
          (chat) => chat.sender === userId || chat.receiver === userId
        );

        if (chat) {
          const chatId = chat._id;
          navigate(`/dashboard/chatdetails/${jobId}/chat/${chatId}`);
        } else {
          toast.error("You don't have permission to view this chat.");
        }
      } else {
        toast.error("No chat found for this job.");
      }
    } catch (error) {
      console.error("Error navigating to chat details:", error);
      toast.error("Failed to load chat details.");
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/application/buy-gigjobs/${userId}`
        );
        const allAppliedJobs = response.data.appliedJobs || [];
        const jobStatuses = await fetchJobStatuses();

        // Map statuses to jobs
        const jobsWithStatuses = allAppliedJobs.map((job) => {
          const statusEntry = jobStatuses.find(
            (status) => status.jobId === job.jobDetails._id
          );
          return {
            ...job,
            status: statusEntry ? statusEntry.status : "unknown",
          };
        });

        console.log("Jobs with statuses:", jobsWithStatuses);
        setJobs(jobsWithStatuses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [API_URL, userId]);

  // Filter jobs whenever the selectedTab changes
  useEffect(() => {
    const filterJobs = (tab, jobList) => {
      const filtered =
        tab === "all"
          ? jobList
          : jobList.filter((job) => job.status === statusMap[tab]);
      setFilteredJobs(filtered);
    };

    filterJobs(selectedTab, jobs); // Reapply the filter whenever selectedTab or jobs change
  }, [selectedTab, jobs]); // Dependencies include selectedTab and jobs

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
      <div className="pagetitle">
        <h1>My Gigs</h1>
      </div>
      <div className="job-list">
        <div className="nav-toggle">
          {Object.keys(statusMap).map((tab) => (
            <button
              key={tab}
              className={selectedTab === tab ? "active" : ""}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="row">
          <div className="fulltime-job-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const jobDetails = job.jobDetails || {};
                const postedBy = jobDetails.postedBy || {};

                return (
                  <div className="job-card" key={jobDetails._id}>
                    <Link to={`/dashboard/gigdetails/${jobDetails._id}`}>
                      <div className="job-card-header">
                        <img
                          src={person}
                          alt="Company Logo"
                          className="company-logo"
                        />
                        <div className="job-hr">
                          <h4 className="job-head">
                            {postedBy.username || "HR Name"}
                          </h4>
                          <div className="job-rating">
                            <span className="stars">★★★★☆</span>
                            <span className="rating-count">(25)</span>
                          </div>
                        </div>

                        <div className="job-meta">
                          <span className="job-date">
                            {jobDetails.createdAt
                              ? new Date(
                                  jobDetails.createdAt
                                ).toLocaleDateString()
                              : "No Date"}
                          </span>
                          <i className="save-icon">&#9734;</i>
                        </div>
                      </div>
                      <div className="job-info">
                        <h4 className="job-title">
                          {jobDetails.jobTitle || "Job Title"}
                        </h4>
                        <p>
                          {truncateText(jobDetails.description, 30) ||
                            "Job description not available"}
                        </p>
                      </div>
                    </Link>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="job-amount">
                        $ {jobDetails.budget || "N/A"}
                      </span>
                      <button
                        className="btn chat-button"
                        onClick={() => {
                          handleChat(jobDetails._id);
                        }}
                      >
                        <i className="bi bi-chat"></i> Chat
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No jobs found for the selected tab.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cusgigs;
