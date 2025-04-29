import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API_URL from "../config";

const Buygigmodal = ({
  recruiterImage,
  recruiterName,
  jobTitle,
  jobId,
  userRole,
  applicantId,
  isOpen,
  onClose,
}) => {
  const [cvFile, setCvFile] = useState(null);
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole !== "Customer") {
      toast.error("Switch to a Customer Role to Apply for jobs");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("applicantId", applicantId);
    formData.append("description", description);
    formData.append("cvFile", cvFile);
    formData.append("userRole", userRole); // Add this line

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/application/buyGig`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const chatId = response.data.chatId;
      if (response.status === 200) {
        toast.success("Application Submitted Successfully");
        setTimeout(() => {
          navigate(`/dashboard/chatdetails/${jobId}/chat/${chatId}`);
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          ×
        </span>
        <h2>Buy gigs - {jobTitle}</h2>
        <div className="recruiter-info">
          <img
            src={recruiterImage}
            alt={recruiterName}
            className="recruiter-image"
          />
          <div>
            <h4>{recruiterName}</h4>
            <p>{jobTitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Your Application"
            required
          ></textarea>

          <label>Attach Doc</label>
          <input type="file" onChange={handleFileChange} required />

          <button type="submit" className="usbutton">
            Buy this Gig
          </button>
        </form>
      </div>
    </div>
  );
};

export default Buygigmodal;
