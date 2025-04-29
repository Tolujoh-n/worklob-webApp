import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/address.jpg";
import eth from "../../assets/img/eth.png";
import worklob from "../../assets/img/worklob-coin.png";
import "./chat.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_URL from "../../config";

const Chat = () => {
  const [activeCategory, setActiveCategory] = useState("Freelance");
  const [ethBalance, setEthBalance] = useState("0");
  const [worklobBalance, setWorklobBalance] = useState("0");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  let userId;

  const user = JSON.parse(localStorage.getItem("user"));
  let userRole = user?.role;
  console.log("User Role:", userRole);

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/chat/allchats/${userId}`
        );
        const fetchedJobs = response.data;

        // Log jobId, status, and applicantRole to the console
        const jobStatuses = fetchedJobs.map((job) => ({
          jobId: job.jobId,
          status: job.status,
          applicantRole: job.applicantRole,
        }));
        console.log("Job statuses with applicant roles:", jobStatuses);

        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [API_URL, userId, userRole]);

  const filteredChats = jobs.filter((chat) => {
    if (activeCategory === "Freelance") return chat.jobType === "FreelanceJob";
    if (activeCategory === "Full-Time") return chat.jobType === "FullTimeJob";
    if (activeCategory === "GigJob") return chat.jobType === "GigJob";
    if (activeCategory === "Archived") return chat.isArchived;
    return true;
  });

  return (
    <>
      <div className="pagetitle">
        <h1>Chats</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard">Home</a>
            </li>
            <li className="breadcrumb-item active">Chat</li>
          </ol>
        </nav>
      </div>
      <div className="col-lg-8">
        <div className="row">
          <div className="job-list">
            <div className="nav-toggle">
              <button
                className={activeCategory === "Freelance" ? "active" : ""}
                onClick={() => setActiveCategory("Freelance")}
              >
                Freelance
              </button>
              <button
                className={activeCategory === "Full-Time" ? "active" : ""}
                onClick={() => setActiveCategory("Full-Time")}
              >
                Full-Time
              </button>
              <button
                className={activeCategory === "GigJob" ? "active" : ""}
                onClick={() => setActiveCategory("GigJob")}
              >
                GigJob
              </button>
              <button
                className={activeCategory === "Archived" ? "active" : ""}
                onClick={() => setActiveCategory("Archived")}
              >
                Archived
              </button>
            </div>

            <div className="row">
              <div className="chat-list">
                {loading ? (
                  <p>Loading chats...</p>
                ) : (
                  filteredChats.map((chat) => (
                    <Link
                      key={chat._id}
                      to={`/dashboard/chatdetails/${chat.jobId}/chat/${chat._id}`}
                      className="chat-item-link"
                    >
                      <div
                        className={`chat-item ${
                          chat.isRead ? "read" : "unread"
                        }`}
                      >
                        <img src={logo} alt="profile" className="chat-image" />
                        <div className="chat-details">
                          <div className="chat-header">
                            <div className="chat-name">
                              {chat.sender._id !== userId
                                ? chat.sender.username
                                : chat.receiver.username}
                            </div>
                            <span className="chat-date">
                              {new Date(chat.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="chat-job">{chat.jobTitle}</div>
                          <div className="chat-message">
                            {chat.message.substring(0, 30)}
                            {chat.message.length > 30 ? "..." : ""}
                          </div>
                        </div>
                        {!chat.isRead && (
                          <div className="unread-count">
                            {chat.unreadMessages || 1}{" "}
                            {/* Placeholder for unread messages */}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card info-card revenue-card">
          <div className="card-body">
            <h5 className="card-title">Escrow Funds:</h5>
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                <img id="balance" src={eth} alt="" />
              </div>
              <div className="ps-3">
                <h6>{ethBalance} ETH</h6>
              </div>
            </div>
            <hr />
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                <img id="balance" src={worklob} alt="" />
              </div>
              <div className="ps-3">
                <h6>{worklobBalance} LOB</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
