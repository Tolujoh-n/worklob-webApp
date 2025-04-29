import React, { useEffect, useState } from "react";
import placeholderImage from "../../assets/address.jpg"; // Placeholder image
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import API_URL from "../../config";

const Mygigs = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [jobs, setJobs] = useState([]); // Changed from object to array
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [roleFilter, setRoleFilter] = useState("");
  const [jobStatuses, setJobStatuses] = useState([]); // Added state to hold fetched statuses

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let userId;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // Fetch job statuses to filter jobs by status
  const fetchJobStatuses = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/chat/allchats/${userId}`
      );
      const fetchedJobs = response.data;

      // Map job statuses to jobId
      const statuses = fetchedJobs.map((job) => ({
        jobId: job.jobId,
        status: job.status,
      }));
      setJobStatuses(statuses);
    } catch (error) {
      console.error("Error fetching job statuses:", error);
      toast.error("Failed to fetch job statuses.");
      setJobStatuses([]);
    }
  };

  useEffect(() => {
    // Fetch user gigs
    const fetchUserGigs = async () => {
      if (!userId) return; // Ensure userId is available

      try {
        const response = await axios.get(
          `${API_URL}/api/v1/gigJob/userGigs/${userId}`
        );
        // Ensure response data is an array
        setJobs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching user gigs:", error);
        setJobs([]); // Fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserGigs();
    fetchJobStatuses(); // Fetch job statuses when component mounts
  }, [API_URL, userId]);

  const handleChat = async (jobId) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/chat/chatdetails`, {
        params: { jobId },
      });
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

  // Apply filters and sorting
  const filteredJobs = jobs
    .filter((job) => {
      const searchMatch =
        job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const roleMatch = roleFilter
        ? job.role?.toLowerCase() === roleFilter.toLowerCase()
        : true;
      return searchMatch && roleMatch;
    })
    .sort((a, b) => {
      if (sortBy === "latest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  // Create dynamic tabs based on status map and job statuses
  const jobTabs = {
    all: filteredJobs,
    Offered: filteredJobs.filter((job) => job.status === "Offered"),
    inProgress: filteredJobs.filter((job) => job.status === "inProgress"),
    completed: filteredJobs.filter((job) => job.status === "Completed"),
    draft: filteredJobs.filter((job) => job.status === "Draft"),
    archive: filteredJobs.filter((job) =>
      jobStatuses.some(
        (status) => status.jobId === job._id && status.status === "confirmed"
      )
    ), // Filter confirmed jobs for archive
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
    <>
      <div className="pagetitle">
        <h1>My Gigs</h1>
      </div>
      <div className="job-list">
        <div className="nav-toggle">
          {Object.keys(jobTabs).map((tab) => (
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
          {jobTabs[selectedTab].map((job) => (
            <div key={job._id} className="col-lg-12">
              <div className="card job-card">
                <Link to={`/dashboard/gigdetails/${job._id}`}>
                  <div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between align-items-start">
                      <div className="job-details">
                        <span className="badge job-type">Gig Worker</span>
                        <h4>{job.jobTitle || "Untitled Job"}</h4>
                        <span style={{ color: "#ddd", fontSize: "12px" }}>
                          {timeSince(job.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="job-description">
                      {truncateText(job.description, 60)}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="job-amount">
                        {formatPrice(job.budget)}
                      </span>
                      <button className="btn chat-button">
                        <i className="bi bi-people"></i> 1
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Mygigs;
