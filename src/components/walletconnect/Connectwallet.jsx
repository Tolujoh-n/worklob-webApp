import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/address.jpg";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useWeb3 } from "../../Web3Provider";
import { useSmartWallet } from "../../SmartWallet";
import { useWallet } from "../WalletContext";
import API_URL from "../../config";

const Connectwallet = () => {
  const { walletType, setWalletType } = useWallet();

  // Call both hooks unconditionally
  const web3 = useWeb3();
  const smartWallet = useSmartWallet();
  const { connectWallet, walletAddress, connected, disconnectWallet } =
    (walletType === "metamask"
      ? web3
      : walletType === "smartwallet"
      ? smartWallet
      : {}) || {};

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Log localStorage and user for debugging
  console.log("User from localStorage:", user);
  console.log("localStorage content:", localStorage);

  let userId;
  let userRole;

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
  }

  // Safe access to userRole and username
  if (user && user.role) {
    userRole = user.role;
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Add a fallback for user
  const username = user ? user.username : "Guest";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const changeUserRole = async (newRole) => {
    try {
      toast(
        `Switching to ${newRole === "Customer" ? "Customer" : "Freelancer"}...`,
        {
          icon: "🔄",
          duration: 3000,
        }
      );

      const response = await axios.post(`${API_URL}/api/v1/user/change-role`, {
        userId,
        role: newRole,
      });

      if (response.status === 200) {
        const updatedUser = { ...user, role: newRole };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success(
          `Role switched to ${
            newRole === "Customer" ? "Customer" : "Freelancer"
          }!`,
          {
            duration: 2000,
            icon: "✅",
          }
        );

        setTimeout(() => {
          // Add redirection based on the new role
          if (newRole === "Talent") {
            window.location.href = "/dashboard";
          } else if (newRole === "Customer") {
            window.location.href = "/dashboard/customerdash";
          }
        }, 2500);
      }
    } catch (error) {
      console.error("Failed to change role:", error);
      toast.error("Failed to switch roles. Please try again.", {
        duration: 3000,
        icon: "❌",
      });
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Log out from the server
      await axios.post(
        `${API_URL}/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );

      // Disconnect wallet if connected
      if (connected) {
        disconnectWallet();
      }

      // Unset wallet type
      setWalletType(null);

      // Remove user data from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Logout successful!", {
        duration: 2000,
        icon: "✅",
      });

      // Navigate to login page after a delay
      setTimeout(() => {
        setIsLoading(false);
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed. Please try again.", {
        duration: 3000,
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <ul className="d-flex align-items-center">
        <li className="nav-item">
          <Link
            style={{ fontSize: "large" }}
            className="nav-link nav-icon d-none d-md-block"
            to={
              userRole === "Customer"
                ? "/dashboard/postjob"
                : "/dashboard/postgig"
            }
          >
            {userRole === "Customer" ? "Post Job" : "Post Gig"}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link nav-icon" to="/dashboard/chat">
            <i className="bi bi-chat-dots"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link nav-icon" to="/dashboard">
            <i className="bi bi-bell"></i>
          </Link>
        </li>
        <li className="nav-item pe-3 position-relative" ref={dropdownRef}>
          <button
            className="nav-link nav-profile d-flex align-items-center pe-0"
            onClick={toggleDropdown}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <img src={logo} alt="Profile" className="rounded-circle" />
            {/* Safely access username */}
            <span className="d-none d-md-block ps-2">{username}</span>
            <i className="bi bi-caret-down-fill ps-1"></i>
          </button>

          {isDropdownOpen && (
            <ul className="custom-dropdown">
              <li>
                <Link className="dropdown-item" to="/dashboard/profile">
                  View your Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/dashboard/settings">
                  Settings
                </Link>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    changeUserRole(
                      userRole === "Customer" ? "Talent" : "Customer"
                    )
                  }
                >
                  {userRole === "Customer"
                    ? "Switch to Talent"
                    : "Switch to Customer"}
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item"
                  style={{ background: "none", border: "none" }}
                  onClick={handleLogout}
                  disabled={isLoading} // Disable button when loading
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Loading Spinner (Optional) */}
      {isLoading && <div className="loading-spinner">Loading...</div>}
    </>
  );
};

export default Connectwallet;
