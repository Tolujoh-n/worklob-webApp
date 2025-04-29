import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaEdit } from "react-icons/fa";
import person from "../../assets/address.jpg";
import axios from "axios";
import API_URL from "../../config";

const Personalinfo = ({ username }) => {
  const [editingSection, setEditingSection] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    website: "",
    country: "",
    bio: "",
    skills: [],
    profileImage: person,
  });
  const [isNewProfile, setIsNewProfile] = useState(true);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile for username:", username); // Debugging
      const response = await axios.get(`${API_URL}/api/v1/profile/${username}`);
      const profileData = response.data;
      console.log("Profile Data fetched from API:", profileData); // Log the fetched profile data

      setPersonalInfo(profileData);
      setIsNewProfile(false);
      // toast.success("Profile loaded successfully");
    } catch (error) {
      console.error("Error fetching profile data:", error); // Improved logging
      toast.error("Failed to fetch profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username, API_URL]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleProfileImageChange = (e) => {
    setProfileImageFile(e.target.files[0]);
    setPersonalInfo({
      ...personalInfo,
      profileImage: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleToggleEditing = (section) => {
    setEditingSection(editingSection === section ? null : section);
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("name", personalInfo.name);
      formData.append("website", personalInfo.website);
      formData.append("country", personalInfo.country);
      formData.append("bio", personalInfo.bio);
      formData.append("skills", personalInfo.skills.join(", "));
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      // Log the FormData content
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await axios.put(
        `${API_URL}/api/v1/profile/${username}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from API:", response.data); // Log the response from the backend
      setPersonalInfo(response.data);
      toast.success("Profile updated successfully");
      setEditingSection(null); // Close the edit form
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        `Failed to update profile: ${
          error.response ? error.response.data.error : error.message
        }`
      );
    }
  };

  return (
    <>
      <div className="card gigprofile-section">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>Personal Information</h2>
          <button
            type="button"
            className="usbutton"
            onClick={() => handleToggleEditing("personalInfo")}
          >
            <FaEdit />
          </button>
        </div>
        <div className="card-body">
          {editingSection === "personalInfo" ? (
            <div className="gigprofile-section-content editing">
              <div className="gigprofile-profile-image">
                <img
                  src={personalInfo.profileImage || person}
                  alt="Profile"
                  className="profile-image"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="form-control"
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={personalInfo.name}
                      onChange={handlePersonalInfoChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      name="website"
                      value={personalInfo.website}
                      onChange={handlePersonalInfoChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={personalInfo.country}
                      onChange={handlePersonalInfoChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={personalInfo.bio}
                      onChange={handlePersonalInfoChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Skills</label>
                    <input
                      type="text"
                      name="skills"
                      value={personalInfo.skills.join(", ")}
                      onChange={(e) =>
                        handlePersonalInfoChange({
                          target: {
                            name: "skills",
                            value: e.target.value
                              .split(",")
                              .map((skill) => skill.trim()),
                          },
                        })
                      }
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleToggleEditing("personalInfo")}
                  >
                    Cancel
                  </button>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    className="usbutton"
                    onClick={handleSaveChanges}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="gigprofile-section-content">
              <div className="gigprofile-profile-image">
                <img
                  src={personalInfo.profileImage || person}
                  alt="Profile"
                  className="profile-image"
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div>
                    <p>
                      <strong>Name:</strong> {personalInfo.name}
                    </p>
                    <p>
                      <strong>Skills:</strong> {personalInfo.skills.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Website:</strong>{" "}
                    <a href={personalInfo.website}>{personalInfo.website}</a>
                    <br />
                    <strong>Country:</strong> {personalInfo.country}
                  </p>
                </div>
                <div className="col-md-12">
                  <p>
                    <strong>Bio:</strong> {personalInfo.bio}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Personalinfo;
