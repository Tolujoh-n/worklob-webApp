import React, { useState } from "react";
import { useWeb3 } from "../../Web3Provider";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // Needed for Pie chart
import "./gov.css";

// Dummy data for voters
const dummyVoters = [
  { wallet: "0x1234567890abcdef1234567890abcdef", vote: "Yes" },
  { wallet: "0xabcdefabcdefabcdefabcdefabcdefabcd", vote: "No" },
  { wallet: "0x7890abcdef1234567890abcdef123456", vote: "Abstain" },
  { wallet: "0xabcdef1234567890abcdefabcdef1234", vote: "No with Veto" },
  { wallet: "0x567890abcdefabcdefabcdefabcdefab", vote: "Yes" },
  { wallet: "0x123456abcdefabcdefabcdefabcdef1234", vote: "No" },
  { wallet: "0x7890abcdefabcdefabcdefabcdefabcd123", vote: "Yes" },
  { wallet: "0xabcdefabcdefabcdefabcdefabcdef5678", vote: "No with Veto" },
  { wallet: "0x7890abcdef1234567890abcdef1234567", vote: "Abstain" },
  { wallet: "0xabcdefabcdefabcdefabcdefabcdef3456", vote: "Yes" },
  { wallet: "0x567890abcdefabcdefabcdefabcdef6789", vote: "No" },
  { wallet: "0x1234567890abcdef1234567890abcdef12", vote: "No" },
];

const GovenanceDetails = () => {
  const [voting, setVoting] = useState("ended");
  const { connectWallet, shortenAddress, walletAddress, connected } = useWeb3();
  const [selectedVote, setSelectedVote] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Pie chart data
  const pieData = {
    labels: ["Yes", "No", "Abstain", "No with Veto"],
    datasets: [
      {
        data: [60, 30, 2, 8],
        backgroundColor: ["goldenrod", "gray", "ash", "blue"],
      },
    ],
  };

  // Pagination
  const totalPages = Math.ceil(dummyVoters.length / itemsPerPage);
  const displayedVoters = dummyVoters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle vote selection
  const handleVoteSelect = (vote) => {
    setSelectedVote(vote);
  };

  return (
    <>
      <div className="pagetitle">
        <h1>Change the brand topology to bluew</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard/governance">governance</a>
            </li>
            <li className="breadcrumb-item active">proposal</li>
          </ol>
        </nav>
      </div>

      {/* Full-screen Centered Big Card */}
      <div className="justify-content-center align-items-center vh-60">
        <div className="wallet-card justify-content-center align-items-center">
          <div className="">
            <p className="card-description">
              In the context of blockchain, a governance page details the rules,
              processes, and mechanisms by which a blockchain network, project,
              or community makes decisions and evolves, ensuring its long-term
              sustainability and direction. Here, 'governance' refers to
              decision making and control, with a focus on who has these
              capabilities. A compulsory requirement for a Blockchain project's
              success is that it maintains decentralisation.
            </p>
            <hr />
          </div>
          <div className="card-checkk d-flex justify-content-between align-items-center">
            <span className="card-price">ID:</span>
            <span className="card-author">205</span>
          </div>
          <hr />
          <div className="card-checkk d-flex justify-content-between align-items-center">
            <span className="card-price">Deposit:</span>
            <span className="card-author">200 LOB</span>
          </div>
          <hr />

          <div className="card-checkk d-flex justify-content-between align-items-center">
            <span className="card-price">Type:</span>
            <span className="card-author">Gig Dispute</span>
          </div>
          <hr />

          <div className="card-checkk d-flex justify-content-between align-items-center">
            {voting === "ended" ? (
              <>
                {" "}
                <span className="card-price">Voting Ends:</span>{" "}
                <span className="card-author">March 16th 2025</span>{" "}
              </>
            ) : (
              <>
                {" "}
                <span className="card-price">Proposed On:</span>{" "}
                <span className="card-author">Jan 4th 2025</span>{" "}
              </>
            )}
          </div>
          <hr />
        </div>
      </div>

      <div className="container">
        <br></br>
        <div className="row">
          <h4>Results</h4>
          <div className="col-md-4">
            <div className="thresold-item">
              <p className="thresold-price">Quorum</p>
              <p className="thresold-name">44.5%</p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="card-price"></span>
                <span className="card-author">Quorum has been reached</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "44.5%" }}></div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="thresold-item">
              <p className="thresold-price">Threshold</p>
              <p className="thresold-name">80%</p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="card-price">50% Yes</span>
                <span className="card-author">12.00% No</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "80%" }}></div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="thresold-item">
              <p className="thresold-price">Voting Period</p>
              <p className="thresold-name">4 out of 7 days</p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="card-price"></span>
                <span className="card-author">Open</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(4 / 7) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <br></br>

        <div className="row">
          <div className="col-md-6">
            <h4>Vote</h4>
            <div className="thresold-item">
              <div className="card-checkk d-flex justify-content-between align-items-center">
                <span className="card-price">
                  <p className="thresold-price">Total</p>
                  <p className="thresold-name">100K LOB</p>
                  <p>
                    Voting Ends <br /> Mar 21st, 2025
                  </p>
                </span>
                <span className="card-author">
                  {/* Pie chart */}
                  <Pie data={pieData} width={200} height={200} />
                </span>
              </div>
              <br></br>
              <div className="row">
                {["Yes", "No", "Abstain", "No with Veto"].map((vote) => (
                  <div
                    className={`col-md-6 vote-card ${
                      selectedVote === vote ? "active" : ""
                    }`}
                    key={vote}
                    onClick={() => handleVoteSelect(vote)}
                  >
                    <div className="vote-card-content">
                      <p>{vote}</p>
                      {selectedVote === vote && (
                        <span className="checkmark">✔</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mystake-button full-width-btn">
                {connected ? "Vote" : "Connect Wallet"}
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <h4>Voters</h4>
            <div className="thresold-item">
              <table className="table">
                <thead>
                  <tr>
                    <th>Voter</th>
                    <th>Vote</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedVoters.map((voter, index) => (
                    <tr key={index}>
                      <td>{shortenAddress(voter.wallet)}</td>
                      <td>{voter.vote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <button
                  className="btn btn-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  className="btn btn-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GovenanceDetails;
