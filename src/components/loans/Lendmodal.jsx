import React, { useState } from "react";
import pengu from "./loanasset/pengu.jpg";
import coin from "./loanasset/worklob-coin.png";

const Lendmodal = ({ onClose }) => {
  const [collateral_amount, setCollateral_amount] = useState("");
  const [lend_amount, setLend_amount] = useState("");
  const [duration, setDuration] = useState("");
  const [interest_amount, setInterest_amount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Close the modal
    onClose();
  };

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <span
          style={{ cursor: "pointer", textAlign: "right" }}
          className="close"
          onClick={onClose}
        >
          &times;
        </span>

        <div className="maincard">
          <div className="d-flex align-items-center">
            <div className="">
              <img
                src={pengu}
                style={{
                  height: "100%",
                  width: "100px",
                  borderRadius: "10px",
                }}
                alt=""
              />
            </div>
            <div className="ps-3">
              <h5 className="c" style={{ color: "whitesmoke" }}>
                <b>The penguin </b>
              </h5>
              <p>Total in Pool: 12 USDC</p>
            </div>
          </div>
          <br />

          <div className="row">
            <p>Best Offer:</p>

            <div className="col-lg-4 col-md-4 col-sm-6 mb-5">
              <div
                className="icon-box"
                style={{
                  border: "1px solid gray",
                  borderRadius: "10px",
                  paddingLeft: "10px",
                }}
              >
                <p className="title">Amount</p>
                <h5>
                  120 <span>pengu</span>
                </h5>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6 mb-5">
              <div
                className="icon-box"
                style={{
                  border: "1px solid gray",
                  borderRadius: "10px",
                  paddingLeft: "10px",
                }}
              >
                <p className="title">Duration</p>
                <h5>
                  16 <span>Days</span>
                </h5>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 mb-5">
              <div
                className="icon-box"
                style={{
                  border: "1px solid gray",
                  borderRadius: "10px",
                  paddingLeft: "10px",
                }}
              >
                <p className="title">Interest</p>
                <h5>
                  19 <span>%</span>
                </h5>
              </div>
            </div>
          </div>
          <div>
            <h5>
              <b>Collateral: </b>
            </h5>
            <p className="loan-tag">
              <span>
                <i
                  style={{ background: "black", borderRadius: "50%" }}
                  className="bi bi-info"
                ></i>{" "}
              </span>
              If they don't repay on time, you get the NFT that they used as
              collateral instead of the $USDC you lended out.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6 mb-5">
                <div className="form-group">
                  <label className="css-1owdu0o">
                    <div className="css-zkfaav">Requested NFT Collateral </div>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0.00"
                    value={collateral_amount}
                    onChange={(e) => setCollateral_amount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-6 mb-5">
                <div className="form-group">
                  <label className="css-1owdu0o">
                    <div className="css-zkfaav">Duration</div>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="7"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 mb-5">
                <div className="form-group">
                  <label className="css-1owdu0o">
                    <div className="css-zkfaav">Amount to Lend</div>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0.00 USDC"
                    value={lend_amount}
                    onChange={(e) => setLend_amount(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 mb-5">
                <div className="form-group">
                  <label className="css-1owdu0o">
                    <div className="css-zkfaav">Total Interest Amount</div>
                  </label>
                  <input
                    style={{ background: "transparent", color: "whitesmoke" }}
                    type="number"
                    className="form-control"
                    placeholder="0.00 USDC"
                    value={interest_amount}
                    onChange={(e) => setInterest_amount(e.target.value)}
                    disabled
                    required
                  />
                </div>
              </div>
            </div>
            <p>
              The Lender will repay <span className="loan-tag">0.00 USDC</span>.
              Else you can claim the{" "}
              <span className="loan-tag">0.00 Penguin</span> collateral
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <button style={cancelButtonStyle} onClick={onClose}>
                Cancel
              </button>
              <button style={connectButtonStyle} type="submit">
                Connect Wallet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// inline modal css
const modalStyle = {
  display: "block",
  position: "fixed",
  zIndex: 9999,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  overflow: "hidden",
};

const modalContentStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "500px",
  height: "auto",
  maxHeight: "80%",
  overflowY: "auto",
  background: "#1a2c38",
  border: "1px solid gray",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};
const cancelButtonStyle = {
  flex: 1, // Makes the button expand to fill available space
  padding: "12px 16px",
  backgroundColor: "rgb(129, 128, 125)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  textAlign: "center", // Ensures text is centered
};

const connectButtonStyle = {
  flex: 1, // Makes the button expand to fill available space
  padding: "12px 16px",
  backgroundColor: "#5c7e90",
  color: "black",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  textAlign: "center", // Ensures text is centered
};

export default Lendmodal;
