import React, { useState, useEffect } from "react";
import axios from "axios";
import profile from "../../assets/address.jpg";
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import API_URL from "../../config";

function Profile({ username }) {
  const token = localStorage.getItem("token");
  const us = JSON.parse(localStorage.getItem("user"));

  let userName;

  if (token) {
    const decodedToken = jwtDecode(token);
  }
  if (us && us.username) {
    userName = us.username;
  }

  const [personalInfo, setPersonalInfo] = useState({});
  const [workExperience, setWorkExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [socialLinks, setSocialLinks] = useState({});

  useEffect(() => {
    // Fetch personal info
    axios
      .get(`${API_URL}/api/v1/profile/${username}`)
      .then((response) => setPersonalInfo(response.data))
      .catch((error) => console.error("Error fetching personal info:", error));

    // Fetch social links
    axios
      .get(`${API_URL}/api/v1/profile/${username}/sociallinks`)
      .then((response) => setSocialLinks(response.data))
      .catch((error) => console.error("Error fetching social links:", error));

    // Fetch work experience
    axios
      .get(`${API_URL}/api/v1/profile/${username}/workexperience`)
      .then((response) => setWorkExperience(response.data))
      .catch((error) =>
        console.error("Error fetching work experience:", error)
      );

    // Fetch education
    axios
      .get(`${API_URL}/api/v1/profile/${username}/education`)
      .then((response) => setEducation(response.data))
      .catch((error) => console.error("Error fetching education:", error));

    // Fetch portfolio
    axios
      .get(`${API_URL}/api/v1/profile/${username}/freelanceinfo`)
      .then((response) => setPortfolio(response.data.portfolio))
      .catch((error) => console.error("Error fetching portfolio:", error));
  }, [username, API_URL]);

  return (
    <>
      <div className="col-lg-12">
        <section className="section profile">
          <div className="row">
            <div className="col-xl-12">
              <div className="card" style={{ position: "relative" }}>
                <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                  <img
                    src={personalInfo.profileImage || profile}
                    alt="Profile"
                    className="rounded-circle"
                  />
                  <h2>{personalInfo.name}</h2>
                  {/* <h2>{personalInfo.email}</h2> */}
                  <div className="social-links mt-2">
                    <a
                      href={socialLinks.twitter}
                      className="twitter"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a
                      href={socialLinks.facebook}
                      className="facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a
                      href={socialLinks.linkedin}
                      className="linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                  <p className="small fst-italic">{personalInfo.bio}</p>
                  <a
                    href={`/dashboard/${username}`}
                    className="link-icon linktopro"
                  >
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-xl-12">
              {/* Work Experience Section */}
              <div className="card gigprofile-section">
                <div
                  style={{ background: "goldenrod", color: "black" }}
                  className="card-header d-flex justify-content-between align-items-center"
                >
                  <h2>Work Experience</h2>
                </div>
                <div className="card-body">
                  <div className="gigprofile-section-content">
                    <div className="work-experience row">
                      {workExperience.map((work, index) => (
                        <div className="col-md-6" key={index}>
                          <div id="workparam">
                            <p>
                              <strong>Company:</strong> {work.company}
                            </p>
                            <p>
                              <strong>Role:</strong> {work.role}
                            </p>
                            <p>
                              <strong>Years:</strong> {work.years}
                            </p>
                            <p>
                              <strong>Description:</strong> {work.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="card gigprofile-section">
                <div
                  style={{ background: "goldenrod", color: "black" }}
                  className="card-header d-flex justify-content-between align-items-center"
                >
                  <h2>Education</h2>
                </div>
                <div className="card-body">
                  <div className="gigprofile-section-content">
                    <div className="work-experience row">
                      {education.map((edu, index) => (
                        <div className="col-md-6" key={index}>
                          <div id="workparam">
                            <p>
                              <strong>Institution:</strong> {edu.institution}
                            </p>
                            <p>
                              <strong>Graduation Year:</strong>{" "}
                              {edu.graduationYear}
                            </p>
                            <p>
                              <strong>Level of Study:</strong>{" "}
                              {edu.levelOfStudy}
                            </p>
                            <p>
                              <strong>Major:</strong> {edu.major}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Section */}
              <div className="card gigprofile-section">
                <div
                  style={{ background: "goldenrod", color: "black" }}
                  className="card-header d-flex justify-content-between align-items-center"
                >
                  <h2>Portfolio</h2>
                </div>
                <br />
                <div className="card-body">
                  <div className="gigprofile-section-content">
                    <div className="portfolio-list row">
                      {portfolio.map((project, index) => (
                        <div className="col-md-6" key={index}>
                          <div
                            style={{
                              border: "1px solid white",
                              borderRadius: "10px",
                              padding: "10px",
                            }}
                            id="portfolio-item"
                          >
                            <p>
                              <strong>Project Name:</strong>{" "}
                              {project.projectName}
                            </p>
                            <p>
                              <strong>Description:</strong>{" "}
                              {project.description}
                            </p>
                            <div className="file-list">
                              {project.files.map((file, i) => (
                                <div key={i} className="file-item">
                                  <FaFileAlt className="file-icon" />
                                  <p
                                    style={{ color: "black" }}
                                    className="filetag-name"
                                  >
                                    {file}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Profile;
