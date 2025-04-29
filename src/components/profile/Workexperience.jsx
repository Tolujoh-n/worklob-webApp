import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import API_URL from "../../config";

const Workexperience = ({ username }) => {
  const [editingSection, setEditingSection] = useState(null);
  const [workExperience, setWorkExperience] = useState([]);

  // Fetch work experience data from backend
  const fetchWorkExperience = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/profile/${username}/workexperience`
      );
      setWorkExperience(response.data);
      // toast.success("Work experience loaded successfully");
    } catch (error) {
      console.error("Error fetching work experience data:", error);
      toast.error("Failed to fetch work experience data");
    }
  };

  useEffect(() => {
    fetchWorkExperience();
  }, [username, API_URL]);

  const handleToggleEditing = (section) => {
    setEditingSection(editingSection === section ? null : section);
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const newWorkExperience = [...workExperience];
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
    setWorkExperience(newWorkExperience);
  };

  const addWorkExperience = () => {
    setWorkExperience([
      ...workExperience,
      {
        company: "",
        role: "",
        years: "",
        currentlyWorking: false,
        description: "",
      },
    ]);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/api/v1/profile/${username}/workexperience`,
        { workExperience }
      );
      setWorkExperience(response.data);
      toast.success("Work experience updated successfully");
      setEditingSection(null);
    } catch (error) {
      console.error("Error updating work experience:", error);
      toast.error("Failed to update work experience");
    }
  };

  return (
    <>
      <div className="card gigprofile-section">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>Work Experience</h2>
          <button
            type="button"
            className="usbutton"
            onClick={() => handleToggleEditing("workExperience")}
          >
            <FaEdit />
          </button>
        </div>
        <div className="card-body">
          {editingSection === "workExperience" ? (
            <div className="gigprofile-section-content editing">
              {workExperience.map((work, index) => (
                <div
                  style={{ borderBottom: "1px solid white" }}
                  key={index}
                  className="form-group"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <label>Company</label>
                      <input
                        type="text"
                        value={work.company}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "company",
                            e.target.value
                          )
                        }
                        className="form-control"
                      />
                      <label>Role</label>
                      <input
                        type="text"
                        value={work.role}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "role",
                            e.target.value
                          )
                        }
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Years</label>
                      <input
                        type="text"
                        value={work.years}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "years",
                            e.target.value
                          )
                        }
                        className="form-control"
                      />
                      <label>Description</label>
                      <textarea
                        value={work.description}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      checked={work.currentlyWorking}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "currentlyWorking",
                          e.target.checked
                        )
                      }
                      className="form-check-input"
                    />
                    <label className="form-check-label">
                      Currently Working
                    </label>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="usbutton"
                onClick={addWorkExperience}
              >
                <FaPlus /> Add Work Experience
              </button>
              <br />
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleToggleEditing("workExperience")}
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

              <button
                type="button"
                className="usbutton"
                onClick={() => handleToggleEditing("workExperience")}
              >
                <FaPlus /> Add Work Experience
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Workexperience;
