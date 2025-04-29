import React from "react";
import Referredusers from "./Referredusers";
import Withdrawals from "./Withdrawals";

const Referrals = () => {
  return (
    <>
      <div className="col-xl-12">
        <h5 className="card-title">Referrals</h5>

        <div className="wallet-container">
          {/* First Column */}
          <div className="wallet-column">
            <div className="wallet-header">
              <h2 style={{ fontSize: "30px" }}>Wallet Address</h2>
            </div>
            <p style={{ fontFamily: "sans-serif", fontSize: "large" }}>
              Invite your friends and colleagues to buy a Gig and receive 50% of
              the commission fee paid to WorkLob! To invite a user to purchase a
              Gig or accept a regular Job, simply copy the unique link and send
              it to them. <br />
              You can also share Gigs and Jobs using our social media buttons.
            </p>
            <button className="walletbtn">
              <i className="bi bi-link"></i> Copy referrals link
            </button>
            <div class="share-container">
              <p>Share referral link</p>
              <div class="social-icons">
                <a href="#" class="icon facebook" aria-label="Facebook">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="icon twitter" aria-label="Twitter">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="icon telegram" aria-label="Telegram">
                  <i class="fab fa-telegram-plane"></i>
                </a>
                <a href="#" class="icon linkedin" aria-label="LinkedIn">
                  <i class="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <br />
          </div>

          {/* Second Column */}
          <div className="wallet-column">
            <div className="wallet-card">
              <div className="wallet-header">
                <h2>Bonus</h2>
                <span>Balance: 0.00 USDT</span>

                <span>
                  {" "}
                  <button className="chat-button">
                    Withdraw <i className="bi bi-box-arrow-up-right"></i>
                  </button>
                </span>
              </div>
              <div className="bonus-details">
                <p>
                  Referred Users: <span>5</span>
                </p>
                <p>
                  Referral Bonus: <span>10 USDT</span>
                  <span>10 USDT</span>
                </p>
                <p>
                  Job Mining Bonus: <span>15 USDT</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="leaderboard">
            <ul
              style={{ background: "#1a2c38" }}
              className="nav nav-tabs nav-tabs-bordered"
            >
              <li className="nav-item">
                <button
                  style={{ color: "white" }}
                  className="nav-link active"
                  data-toggle="tab"
                  data-target="#game-settings"
                >
                  Referred Users
                </button>
              </li>

              <li className="nav-item">
                <button
                  style={{ color: "white" }}
                  className="nav-link"
                  data-toggle="tab"
                  data-target="#game-list"
                >
                  Withdrawals
                </button>
              </li>
            </ul>
            <br />
            <div className="tab-content pt-2">
              <div className="tab-pane fade show active" id="game-settings">
                <Referredusers />
              </div>

              <div className="tab-pane fade" id="game-list">
                <Withdrawals />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Referrals;
