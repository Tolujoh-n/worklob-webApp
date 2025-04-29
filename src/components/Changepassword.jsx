import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import axios from "axios";
import API_URL from "../config";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    renewPassword: "",
  });
  const navigate = useNavigate();
  const userId = "670b9bd5f791f0011f067886";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.renewPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/user/change-password/${userId}`,
        {
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      );
      toast.success("Password changed");

      setTimeout(() => {
        navigate("/dashboard/settings");
      }, 2000);
    } catch (error) {
      console.log("Change password error:", error);
      toast.error(
        error.response.data.msg ||
          "An error occurred while changing the password!"
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <label
            style={{ color: "#b1bad3" }}
            htmlFor="currentPassword"
            className="col-md-4 col-lg-3 col-form-label"
          >
            Current Password
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="currentPassword"
              type="password"
              className="form-control"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <label
            style={{ color: "#b1bad3" }}
            htmlFor="newPassword"
            className="col-md-4 col-lg-3 col-form-label"
          >
            New Password
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="newPassword"
              type="password"
              className="form-control"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <label
            style={{ color: "#b1bad3" }}
            htmlFor="renewPassword"
            className="col-md-4 col-lg-3 col-form-label"
          >
            Re-enter New Password
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="renewPassword"
              type="password"
              className="form-control"
              id="renewPassword"
              value={formData.renewPassword}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="usbutton">
            Change Password
          </button>
        </div>
      </form>
      <Toaster />
    </>
  );
};

export default ChangePassword;
