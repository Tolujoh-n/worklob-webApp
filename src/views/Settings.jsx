import React from "react";
import Editprofile from "../components/profile/Editprofile";
import Subscribe from "../components/Subscribe";
import Profile from "../components/profile/Profile";
import Freelancepro from "../components/profile/Freelancepro";
import Fulltimeprofile from "../components/profile/Fulltimeprofile";
import Changepassword from "../components/Changepassword";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import API_URL from "../config";

function Settings() {
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
    <>
      <div className="col-lg-12">
        <section className="section profile">
          <div className="row">
            <div className="col-xl-12">
              <div style={{ background: "#213743" }} className="card">
                <div className="card-body pt-3">
                  <ul className="nav nav-tabs nav-tabs-bordered">
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        style={{
                          color: "whitesmoke",
                          background: "transparent",
                        }}
                        data-toggle="tab"
                        data-target="#profile-edit"
                      >
                        Profile
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className="nav-link"
                        style={{
                          color: "whitesmoke",
                          background: "transparent",
                        }}
                        data-toggle="tab"
                        data-target="#game-set"
                      >
                        Edit Profile
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className="nav-link"
                        style={{
                          color: "whitesmoke",
                          background: "transparent",
                        }}
                        data-toggle="tab"
                        data-target="#game-settings"
                      >
                        Freelance
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className="nav-link"
                        style={{
                          color: "whitesmoke",
                          background: "transparent",
                        }}
                        data-toggle="tab"
                        data-target="#game-list"
                      >
                        Full Time
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className="nav-link"
                        style={{
                          color: "whitesmoke",
                          background: "transparent",
                        }}
                        data-toggle="tab"
                        data-target="#profile-settings"
                      >
                        Email Settings
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        style={{
                          color: "whitesmoke",
                          background: "transparent",
                        }}
                        className="nav-link"
                        data-toggle="tab"
                        data-target="#profile-change-password"
                      >
                        Change Password
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content pt-2">
                    <div
                      className="tab-pane fade show active profile-edit"
                      id="profile-edit"
                    >
                      <Profile username={username} />
                    </div>
                    <div className="tab-pane fade pt-3" id="game-set">
                      <Editprofile username={username} />
                    </div>

                    <div className="tab-pane fade pt-3" id="game-settings">
                      <Freelancepro username={username} />
                    </div>

                    <div className="tab-pane fade pt-3" id="game-list">
                      <Fulltimeprofile username={username} />
                    </div>

                    <div className="tab-pane fade pt-3" id="profile-settings">
                      <Subscribe />
                    </div>
                    <div
                      className="tab-pane fade pt-3"
                      id="profile-change-password"
                    >
                      <Changepassword />
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

export default Settings;
