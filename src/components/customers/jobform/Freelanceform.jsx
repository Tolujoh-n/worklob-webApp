import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API_URL from "../../../config";
import { FreelancePriceFeed } from "../../PriceFeed";
import skillsData from "./Roles_skills.json";

const availableSkills = skillsData.availableSkills;

const Freelanceform = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const [ethValue, setEthValue] = useState("0.00000");

  const navigate = useNavigate();

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((selected) => selected !== skill));
  };

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
      selectedSkills,
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
              <a href="/dashboard/customerdash">dashboard</a>
            </li>
            <li className="breadcrumb-item active">freelance job</li>
          </ol>
        </nav>
        <h1>Create a Freelance Job</h1>
      </div>
      <div className="freelform">
        <form onSubmit={handleFormSubmit}>
          <div className="freelform__group">
            <label htmlFor="job-title">Job Title</label>
            <input
              type="text"
              id="job-title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              placeholder="Enter job title"
            />
          </div>

          <div className="freelform__group">
            <label htmlFor="skills">Skills Required</label>
            <input
              type="text"
              id="skills"
              value={skillInput}
              onChange={handleSkillInputChange}
              placeholder="Type to filter skills..."
              autoComplete="off"
            />
            {skillInput && (
              <ul className="freelform__skills-dropdown">
                {availableSkills
                  .filter((skill) =>
                    skill.toLowerCase().includes(skillInput.toLowerCase())
                  )
                  .map((skill) => (
                    <li key={skill} onClick={() => handleSkillSelect(skill)}>
                      {skill}
                    </li>
                  ))}
              </ul>
            )}
            <div className="freelform__tags">
              {selectedSkills.map((tag, index) => (
                <span key={index} className="freelform__tag">
                  {tag}
                  <button
                    type="button"
                    className="freelform__remove-tag"
                    onClick={() => handleRemoveSkill(tag)}
                  >
                    &#x2716;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="freelform__group">
            <label htmlFor="description">Description</label>
            <ReactQuill
              value={description}
              onChange={setDescription}
              placeholder="Describe the project in detail..."
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
            <label htmlFor="budget">Budget</label>
            <input
              type="number"
              id="budget"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="$0.00"
              required
            />
            <FreelancePriceFeed budget={budget} setEthValue={setEthValue} />
          </div>

          <div className="freelform__group">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Select deadline"
              required
            />
          </div>

          <div className="freelform__buttons">
            <button type="button" className="usbutton">
              Save as Draft
            </button>
            <button
              style={{ width: "50%" }}
              type="submit"
              className="sidebutton"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Freelanceform;
