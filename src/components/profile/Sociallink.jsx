import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import API_URL from "../../config";

const Sociallink = ({ username }) => {
  const [editingSection, setEditingSection] = useState(null);
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    facebook: "",
    twitter: "",
  });

  // Fetch social links data from backend
  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/profile/${username}/sociallinks`
      );
      setSocialLinks(response.data);
      // toast.success("Social links loaded successfully");
    } catch (error) {
      console.error("Error fetching social links data:", error);
      toast.error("Failed to fetch social links data");
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, [username, API_URL]);

  const handleToggleEditing = (section) => {
    setEditingSection(editingSection === section ? null : section);
  };

  const handleSocialLinksChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks({ ...socialLinks, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/api/v1/profile/${username}/sociallinks`,
        socialLinks
      );
      setSocialLinks(response.data);
      toast.success("Social links updated successfully");
      setEditingSection(null);
    } catch (error) {
      console.error("Error updating social links:", error);
      toast.error("Failed to update social links");
    }
  };

  return (
    <>
      <div className="card gigprofile-section">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>Social Links</h2>
          <button
            type="button"
            className="usbutton"
            onClick={() => handleToggleEditing("socialLinks")}
          >
            <FaEdit />
          </button>
        </div>
        <div className="card-body">
          {editingSection === "socialLinks" ? (
            <div className="gigprofile-section-content editing">
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={socialLinks.linkedin}
                  onChange={handleSocialLinksChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="url"
                  name="facebook"
                  value={socialLinks.facebook}
                  onChange={handleSocialLinksChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Twitter</label>
                <input
                  type="url"
                  name="twitter"
                  value={socialLinks.twitter}
                  onChange={handleSocialLinksChange}
                  className="form-control"
                />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleToggleEditing("socialLinks")}
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
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="gigprofile-section-content">
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a href={socialLinks.linkedin}>{socialLinks.linkedin}</a>
              </p>
              <p>
                <strong>Facebook:</strong>{" "}
                <a href={socialLinks.facebook}>{socialLinks.facebook}</a>
              </p>
              <p>
                <strong>Twitter:</strong>{" "}
                <a href={socialLinks.twitter}>{socialLinks.twitter}</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sociallink;
