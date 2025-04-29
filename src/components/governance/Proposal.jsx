import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API_URL from "../../config";

const Proposal = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [fileList, setFileList] = useState([]);
  const [dragging, setDragging] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map((file) => file.name);
    if (fileNames.length + fileList.length <= 10) {
      setFileList([...fileList, ...fileNames]);
    } else {
      alert("You can only upload a maximum of 10 files.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const fileNames = files.map((file) => file.name);
    if (fileNames.length + fileList.length <= 10) {
      setFileList([...fileList, ...fileNames]);
    } else {
      alert("You can only upload a maximum of 10 files.");
    }
  };

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const token = localStorage.getItem("token");
  let userId;
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const sanitizedDescription = stripHtmlTags(description);

    const jobData = {
      jobTitle,
      description: sanitizedDescription,
      budget,
      deadline,
      fileList,
      userId,
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/frjobs/freelanceJob`,
        jobData
      );
      console.log("Freelance post successfully", response.data);
      if (response.status === 200) {
        toast.success("Job Posted Successfully");
        setTimeout(() => {
          navigate("/dashboard/cusfreelance");
        }, 2000);
      }
    } catch (e) {
      console.error(
        "Error posting job:",
        e.response ? e.response.data : e.message
      );
    }
  };

  return (
    <>
      <div className="pagetitle">
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard/governance">governance</a>
            </li>
            <li className="breadcrumb-item active">propsal</li>
          </ol>
        </nav>
        <h1>Create a New Proposal</h1>
      </div>
      <div className="freelform">
        <form onSubmit={handleFormSubmit}>
          <div className="freelform__group">
            <label htmlFor="job-title">Proposal Title</label>
            <p>
              Propose any action on WorkLob. TextProposal defines a standard
              text proposal whose changes need to be manually updated in case of
              approval.
            </p>
            <input
              type="text"
              id="job-title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              placeholder="Proposal Title"
            />
          </div>

          <div className="freelform__group">
            <label htmlFor="description">Description</label>
            <ReactQuill
              value={description}
              onChange={setDescription}
              placeholder="Proposal Description"
              style={{
                background: "white",
                borderRadius: "10px",
                color: "black",
              }}
            />
          </div>

          <div className="freelform__group freelform__file-drop-area">
            <label>Files (max 10 files, 10MB each)</label>
            <div
              className={`freelform__drop-zone ${dragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input").click()}
            >
              <p>Drag & drop files here or click to upload</p>
              <input
                id="file-input"
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="freelform__file-names">
              {fileList.map((file, index) => (
                <p key={index}>{file}</p>
              ))}
            </div>
          </div>

          <div className="freelform__group">
            <label htmlFor="budget">Deposit Amount</label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="$0.00"
              required
            />
            <small className="freelform__note">
              For every proposal you create we require you to deposit at least
              100 LOB. This is to ensure that you are an active participant of
              the WorkLob community and you are eligible to make proposals and
              govern the platform moving forward.
            </small>
          </div>

          <div className="freelform__buttons">
            <button
              style={{ width: "50%" }}
              type="submit"
              className="sidebutton"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Proposal;
