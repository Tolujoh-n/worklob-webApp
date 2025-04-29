import React, { useState } from "react";
import Personalinfo from "./Personalinfo";
import Workexperience from "./Workexperience";
import Education from "./Education";
import Sociallink from "./Sociallink";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import API_URL from "../../config";

const EditProfile = () => {
  const token = localStorage.getItem("token");

  let userId;

  const user = JSON.parse(localStorage.getItem("user"));
  let userRole = user?.role;
  console.log("User Role:", userRole);
  console.log("User ID:", user);

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
  }

  // Add a fallback for user
  const username = user ? user.username : "Guest";

  return (
    <div className="gigprofile container">
      {/* Personal Information Section */}
      <Personalinfo username={username} />

      {/* Work Experience Section */}
      <Workexperience username={username} />

      {/* Education Section */}
      <Education username={username} />

      {/* Social Links Section */}
      <Sociallink username={username} />
    </div>
  );
};

export default EditProfile;
