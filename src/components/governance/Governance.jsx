import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./gov.css";

const Governance = () => {
  const [filter, setFilter] = useState("all");
  const filters = ["All", "Voting", "Passed", "Rejected"];
  const [visibleCards, setVisibleCards] = useState(6); // Cards per page
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleFilterChange = (status) => {
    setFilter(status.toLowerCase());
    setVisibleCards(6); // Reset cards shown when filter changes
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleShowMore = () => {
    setVisibleCards((prev) => prev + 6);
  };

  const currentDate = new Date(); // Current date for relative time comparison

  const allCards = [
    {
      voteid: 1,
      title: "Smart Contract Auditor",
      type: "Security",
      description: "Audit Solidity contracts.",
      start_date: "2025-03-01",
      end_date: "2025-03-10",
      voting: "active",
      status: "voting",
    },
    {
      voteid: 2,
      title: "DeFi Risk Analyzer",
      type: "Finance",
      description: "Analyze DeFi protocols.",
      start_date: "2025-03-02",
      end_date: "2025-03-12",
      voting: "active",
      status: "voting",
    },
    {
      voteid: 3,
      title: "Crypto Meme Maker",
      type: "Entertainment",
      description: "Create crypto memes.",
      start_date: "2025-03-05",
      end_date: "2025-03-15",
      voting: "ended",
      status: "passed",
    },
    {
      voteid: 4,
      title: "Code Summarizer",
      type: "Development",
      description: "Summarize code efficiently.",
      start_date: "2025-03-08",
      end_date: "2025-03-18",
      voting: "active",
      status: "failed",
    },
    {
      voteid: 5,
      title: "Tokenomics Architect",
      type: "Economics",
      description: "Build sustainable token models.",
      start_date: "2025-03-10",
      end_date: "2025-03-20",
      voting: "ended",
      status: "passed",
    },
    {
      voteid: 5,
      title: "Tokenomics Architect",
      type: "Economics",
      description: "Build sustainable token models.",
      start_date: "2025-03-10",
      end_date: "2025-03-20",
      voting: "ended",
      status: "passed",
    },
    {
      voteid: 5,
      title: "Tokenomics Architect",
      type: "Economics",
      description: "Build sustainable token models.",
      start_date: "2025-03-10",
      end_date: "2025-03-20",
      voting: "ended",
      status: "passed",
    },
    {
      voteid: 5,
      title: "Tokenomics Architect",
      type: "Economics",
      description: "Build sustainable token models.",
      start_date: "2025-03-10",
      end_date: "2025-03-20",
      voting: "ended",
      status: "passed",
    },
  ];

  // Function to get date status
  const getCardStatus = (card) => {
    const currentDate = new Date();
    const startDate = new Date(card.start_date);
    const endDate = new Date(card.end_date);

    if (currentDate > endDate) {
      const daysAgo = Math.floor(
        (currentDate - endDate) / (1000 * 60 * 60 * 24)
      );
      return `${daysAgo} days ago`;
    } else {
      return startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    }
  };

  const filteredCards = allCards
    .filter(
      (card) =>
        filter === "all" ||
        (filter === "rejected"
          ? card.status === "failed"
          : card.status === filter)
    )
    .filter((card) => card.title.toLowerCase().includes(searchTerm));

  const visibleFilteredCards = filteredCards.slice(0, visibleCards);

  const handleRedirect = () => {
    navigate("/dashboard/govenance_details");
  };

  return (
    <>
      <div className="pagetitle d-flex justify-content-between align-items-center">
        <div>
          <h1>Governance</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/dashboard/governance">Governance</a>
              </li>
              <li className="breadcrumb-item active">Vote</li>
            </ol>
          </nav>
        </div>
        <div>
          <a href="/dashboard/proposal">
            <button className="btn btn-primary mystake-button">
              <i className="bi bi-plus"></i> New Proposal
            </button>
          </a>
        </div>
      </div>

      <div className="container mystake-card">
        <div className="row">
          <div className="col-md-3">
            <div className="mystake-item">
              <p className="mystake-name">Total Proposals</p>
              <p className="mystake-price">112</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mystake-item">
              <p className="mystake-name">Passed Proposals</p>
              <p className="mystake-price">84</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mystake-item">
              <p className="mystake-name">Voting Period</p>
              <p className="mystake-price">5 days</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mystake-item">
              <p className="mystake-name">Deposit Required</p>
              <p className="mystake-price">50 LOB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-12">
        <div className="transaction-history governance">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 governance">
            <div className="w-100 mb-3 mb-md-0">
              <div className="input-group">
                <input
                  id="goveid"
                  type="text"
                  className="form-control search-input"
                  placeholder="Search..."
                  onChange={handleSearch}
                />
                <span className="input-group-text search-icon">
                  <i className="bi bi-search"></i>
                </span>
              </div>
            </div>
            <div
              style={{
                background: "#213743",
                borderRadius: "5px",
                padding: "5px",
              }}
              className="controls"
            >
              {filters.map((filterOption) => (
                <button
                  key={filterOption}
                  className={`chat-button ${
                    filter === filterOption.toLowerCase()
                      ? "active-filterdata"
                      : ""
                  }`}
                  onClick={() => handleFilterChange(filterOption)}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>

          <div className="aiagent container py-4">
            <div className="row">
              {visibleFilteredCards.map((card, index) => (
                <div className="col-md-6 col-lg-4 mb-4" key={index}>
                  <div className="card h-100">
                    <div
                      style={{
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        backgroundColor:
                          card.status === "passed"
                            ? "green"
                            : card.status === "voting"
                            ? "goldenrod"
                            : "red",
                      }}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span className="card-price">{card.status}</span>
                      <span className="card-author">
                        <i
                          className={`bi bi-${
                            card.status === "passed"
                              ? "check-circle"
                              : card.status === "voting"
                              ? "alexa"
                              : "x-circle"
                          }`}
                        ></i>
                      </span>
                    </div>

                    <div className="">
                      <h2 className="card-title h5">{card.title}</h2>
                      <p className="card-description">{card.description}</p>
                    </div>
                    <div className="card-checkk d-flex justify-content-between align-items-center">
                      <span className="card-price">ID:</span>
                      <span className="card-author">{card.voteid}</span>
                    </div>
                    <div className="card-checkk d-flex justify-content-between align-items-center">
                      <span className="card-price">Type:</span>
                      <span className="card-author">{card.type}</span>
                    </div>
                    <div className="card-checkk d-flex justify-content-between align-items-center">
                      {card.voting === "ended" ? (
                        <>
                          {" "}
                          <span className="card-price">Voting Ends:</span>{" "}
                          <span className="card-author">
                            {getCardStatus(card)}
                          </span>{" "}
                        </>
                      ) : (
                        <>
                          {" "}
                          <span className="card-price">Proposed On:</span>{" "}
                          <span className="card-author">
                            {getCardStatus(card)}
                          </span>{" "}
                        </>
                      )}
                    </div>
                    <button onClick={handleRedirect} className="aibut">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {visibleCards < filteredCards.length && (
          <div className="text-center">
            <button className="mystake-button" onClick={handleShowMore}>
              Show More
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Governance;
