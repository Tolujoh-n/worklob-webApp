import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../../../config";

const Chatsidecard = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { jobId } = useParams();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  let applicantId,
    isTalent = false;

  if (token) {
    const decodedToken = jwtDecode(token);
    applicantId = decodedToken.userId;
    isTalent = user.role === "Talent"; // Assuming 'role' defines if user is 'talent'
  }

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/jobs/jobdetails/${jobId}`
        );
        setJob(response.data);
        console.log("Fetched job details:", response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [API_URL, jobId]);

  if (loading) {
    return <div>Loading job details...</div>;
  }

  if (!job) {
    return <div>Error: Job not found</div>;
  }

  // Determine the job type
  const jobType =
    job.jobType === "FullTimeJob"
      ? "Full-time"
      : job.jobType === "RemoteJob"
      ? "Remote"
      : job.jobType === "GigJob"
      ? "Gig"
      : "N/A";

  return (
    <>
      {!isTalent && (
        <div className="card info-card revenue-card">
          <div className="card-body">
            <h5 className="card-title">Job Details: (customer)</h5>
            <h5 className="card-title">
              <i className="fas fa-clock"></i> {jobType}
            </h5>
            <h5 className="card-title">
              <i className="fas fa-dollar-sign"> </i>
              {job.budget} {job.fixedCompensation}
            </h5>
          </div>
        </div>
      )}
      {isTalent && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Your Offer: (talent)</h5>
            <h5 className="card-title">
              <i className="fas fa-clock"></i> {jobType}
            </h5>
            <h5 className="card-title">
              <i className="fas fa-clock"></i> Delivery Days:{" "}
              {job.deliveryDays || "N/A"}
            </h5>
            <h5 className="card-title">
              <i className="fas fa-dollar-sign"> </i>
              {job.budget} {job.fixedCompensation}
            </h5>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatsidecard;
