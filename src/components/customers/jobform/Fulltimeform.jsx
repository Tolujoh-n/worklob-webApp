import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API_URL from "../../../config";
import { FulltimePriceFeed } from "../../PriceFeed";

import skillsData from "./Roles_skills.json";

const availableSkills = skillsData.availableSkills;
const roles = skillsData.roles;

const Fulltimeform = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [workplaceType, setWorkplaceType] = useState("");
  const [role, setRole] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [compensationType, setCompensationType] = useState("Monthly");
  const [compensationMode, setCompensationMode] = useState("Fixed");
  const [fixedCompensation, setFixedCompensation] = useState("");
  const [rangeCompensation, setRangeCompensation] = useState({
    min: "",
    max: "",
  });
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [ethPrice, setEthPrice] = useState(0);
  const [usdFixed, setUsdFixed] = useState("");
  const [usdRange, setUsdRange] = useState({ min: "", max: "" });

  const [ethCompensation, setEthCompensation] = useState({
    fixed: null,
    range: { min: null, max: null },
  });

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let userId;
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
    // console.log(userId);
  }
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  useEffect(() => {
    if (!ethPrice || ethPrice === 0) return;

    if (compensationMode === "Fixed" && usdFixed) {
      setEthCompensation({
        fixed: (usdFixed / ethPrice).toFixed(5),
        range: { min: null, max: null },
      });
    }

    if (compensationMode === "Range" && (usdRange.min || usdRange.max)) {
      setEthCompensation({
        fixed: null,
        range: {
          min: usdRange.min ? (usdRange.min / ethPrice).toFixed(5) : null,
          max: usdRange.max ? (usdRange.max / ethPrice).toFixed(5) : null,
        },
      });
    }
  }, [usdFixed, usdRange, ethPrice, compensationMode]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const sanitizedDescription = stripHtmlTags(description);
    console.log({
      jobTitle,
      employmentType,
      workplaceType,
      role,
      workExperience,
      selectedSkills,
      compensationType,
      compensationMode,
      fixedCompensation,
      rangeCompensation,
      description,
      userId,
    });

    const jobData = {
      jobTitle,
      employmentType,
      workplaceType,
      role,
      workExperience,
      selectedSkills,
      compensationType,
      compensationMode,
      fixedCompensation,
      rangeCompensation,
      description: sanitizedDescription,
      userId,
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/jobs/fulltimejob`,
        jobData
      );
      console.log("Job posted successfully:", response.data);
      if (response.status === 200) {
        toast.success("Job Posted Successfully");
        setTimeout(() => {
          navigate("/dashboard/cusfulltime");
        }, 2000);
      }
    } catch (e) {
      console.error(
        "Error posting job:",
        e.response ? e.response.data : e.message
      );
    }
  };

  const handleRoleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedRoles(roles[selectedCategory] || []);
  };
  // Handle skill input changes
  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  // Handle skill selection
  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillInput(""); // Clear input after selecting
    }
  };

  // Remove skill from selected list
  const handleRemoveSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((selected) => selected !== skill));
  };

  return (
    <div className="pagetitle">
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/dashboard/customerdash">dashboard</a>
          </li>
          <li className="breadcrumb-item active">full time job</li>
        </ol>
      </nav>
      <h1>Create a Full Time Job</h1>
      <form className="fulltimeform" onSubmit={handleFormSubmit}>
        <div className="fulltimeform__group full-width">
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

        <div className="fulltimeform__group half-width">
          <label htmlFor="employment-type">Employment Type</label>
          <select
            id="employment-type"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
          >
            <option value="">Select employment type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="fulltimeform__group half-width">
              <label htmlFor="workplace-type">Workplace Type</label>
              <select
                id="workplace-type"
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
              >
                <option value="">Select workplace type</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Office">Office</option>
              </select>
            </div>
          </div>

          <div className="col-md-6">
            <div className="fulltimeform__group half-width">
              <label htmlFor="role-category">Role Category</label>
              <select id="role-category" onChange={handleRoleCategoryChange}>
                <option value="">Select role category</option>
                {Object.keys(roles).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-md-6">
            <div className="fulltimeform__group half-width">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select role</option>
                {selectedRoles.map((r, index) => (
                  <option key={index} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-md-6">
            <div className="fulltimeform__group half-width">
              <label htmlFor="work-experience">Work Experience</label>
              <select
                id="work-experience"
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
              >
                <option value="">Select work experience</option>
                <option value="1 year">1 year</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3+ years">3+ years</option>
              </select>
            </div>
          </div>
        </div>

        <div className="fulltimeform__group full-width">
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

        <div className="fulltimeform__group full-width">
          <label>Compensation</label>
          <div className="compensation-toggle">
            <button
              type="button"
              onClick={() => setCompensationType("Monthly")}
              className={compensationType === "Monthly" ? "active" : ""}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setCompensationType("Annually")}
              className={compensationType === "Annually" ? "active" : ""}
            >
              Annually
            </button>
          </div>
          <div className="compensation-mode">
            <label>
              <input
                type="radio"
                name="compensation"
                value="Fixed"
                checked={compensationMode === "Fixed"}
                onChange={() => setCompensationMode("Fixed")}
              />
              Fixed
            </label>
            <label>
              <input
                type="radio"
                name="compensation"
                value="Range"
                checked={compensationMode === "Range"}
                onChange={() => setCompensationMode("Range")}
              />
              Range
            </label>
          </div>

          <FulltimePriceFeed onPriceFetch={setEthPrice} />

          {compensationMode === "Fixed" ? (
            <>
              <input
                type="number"
                placeholder="$0.00"
                value={fixedCompensation}
                onChange={(e) => setFixedCompensation(Number(e.target.value))}
              />
              <p>
                ≈ {(Number(fixedCompensation) / (ethPrice || 1)).toFixed(5)} ETH
              </p>
            </>
          ) : (
            <>
              <input
                type="number"
                placeholder="Min - $0.00"
                value={rangeCompensation.min}
                onChange={(e) =>
                  setRangeCompensation((prev) => ({
                    ...prev,
                    min: Number(e.target.value),
                  }))
                }
              />
              <span style={{ margin: "0 8px" }}>|</span>
              <input
                type="number"
                placeholder="Max - $0.00"
                value={rangeCompensation.max}
                onChange={(e) =>
                  setRangeCompensation((prev) => ({
                    ...prev,
                    max: Number(e.target.value),
                  }))
                }
              />
              <p>
                ≈ Min:{" "}
                {(Number(rangeCompensation.min) / (ethPrice || 1)).toFixed(5)}{" "}
                ETH | Max:{" "}
                {(Number(rangeCompensation.max) / (ethPrice || 1)).toFixed(5)}{" "}
                ETH
              </p>
            </>
          )}
        </div>

        <div className="fulltimeform__group">
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

        <div className="freelform__buttons">
          <button type="button" className="usbutton">
            Save as Draft
          </button>
          <button style={{ width: "50%" }} type="submit" className="sidebutton">
            Publish
          </button>
        </div>
      </form>
    </div>
  );
};

export default Fulltimeform;
