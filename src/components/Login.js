import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/worklob-logo-cp-no-bg.png";
import { Toaster, toast } from "sonner";
import metamask from "../assets/img/metamask.png";
import smartwallet from "../assets/img/smart-wallet.png";
import axios from "axios";
import { useWeb3 } from "../Web3Provider";
import API_URL from "../config";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { connected, walletAddress, connectWallet } = useWeb3();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      toast.error("Please fill all fields!");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/user/signin`, {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login successful!");
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error) {
      console.error("Login error", error);
      const errorMsg = error.response?.data?.msg || "Invalid credentials!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    if (!connected) {
      await connectWallet();
    }
  };

  useEffect(() => {
    const loginWithWallet = async () => {
      if (connected && walletAddress) {
        try {
          const response = await axios.post(
            `${API_URL}/api/v1/user/wallet-login`,
            {
              walletAddress: walletAddress,
            }
          );

          if (response.status === 200) {
            if (response.data.registered) {
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("user", JSON.stringify(response.data.user));
              toast.success("Wallet login successful!");
              navigate("/dashboard");
            } else {
              toast.info("Wallet not registered! Redirecting...");
              navigate("/wallet-register");
            }
          }
        } catch (error) {
          console.error("Wallet login error", error);
          toast.error("An error occurred during wallet login.");
        }
      }
    };

    loginWithWallet();
  }, [connected, walletAddress, navigate]);

  return (
    <div>
      <div id="boxit">
        <div id="logodiv">
          <img id="logoimg" className="mx-auto" src={logo} alt="Logo" />
        </div>
        <div className="auth-box">
          <h2>Login</h2>
          <p>Welcome back!</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username or email"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <button
              style={{ width: "100%" }}
              type="submit"
              id="optionbut"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <button
            style={{ marginBottom: "10px" }}
            onClick={handleWalletLogin}
            id="connbtn"
          >
            <img
              src={smartwallet}
              alt="smart Wallet"
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            />
            Smart Wallet
          </button>
          <button onClick={handleWalletLogin} id="connbtn">
            <img
              src={metamask}
              alt="Wallet"
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            />
            Metamask
          </button>
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default Login;
