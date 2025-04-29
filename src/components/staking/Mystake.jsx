import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import lobcoin from "../../assets/img/worklob-coin.png";
import { useWeb3 } from "../../Web3Provider";
import {
  WorkLobStaking_abi,
  WorkLobStaking_address,
  LOB_TOKEN_ABI,
  LOB_TOKEN_ADDRESS,
} from "../Constants";
import { ethers } from "ethers";
import { Toaster, toast } from "sonner";

const Mystake = () => {
  const navigate = useNavigate();
  const { connectWallet, connected, baseETHBalance, lobBalance, account } =
    useWeb3();
  const [rewardRate, setRewardRate] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [userStakedAmount, setUserStakedAmount] = useState(0);
  const [userRewards, setUserRewards] = useState(0);
  const [userTotalStaked, setUserTotalStaked] = useState(0);
  const [userClaimableRewards, setUserClaimableRewards] = useState(0);
  const [stakingData, setStakingData] = useState([]);
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    if (connected) {
      loadStakingData();
    }
  }, [connected]);

  const loadStakingData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const stakingContract = new ethers.Contract(
        WorkLobStaking_address,
        WorkLobStaking_abi,
        signer
      );

      const rate = await stakingContract.rewardRate();
      setRewardRate(ethers.utils.formatUnits(rate, 18));

      const totalStakedAmount = await stakingContract.totalStaked();
      setTotalStaked(ethers.utils.formatUnits(totalStakedAmount, 18));

      const userDetails = await stakingContract.getStakerDetails(account);
      setUserStakedAmount(ethers.utils.formatUnits(userDetails[1], 18));
      setUserRewards(ethers.utils.formatUnits(userDetails[2], 18));
      setUserClaimableRewards(ethers.utils.formatUnits(userDetails[2], 18));
      setUserTotalStaked(ethers.utils.formatUnits(userDetails[3], 18));
    } catch (error) {
      console.error("Error loading staking data:", error);
    }
  };

  useEffect(() => {
    const fetchStakingData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const stakingContract = new ethers.Contract(
        WorkLobStaking_address,
        WorkLobStaking_abi,
        signer
      );
      const allStakers = await stakingContract.getAllStakers();
      const stakers = allStakers[0].map((address, index) => ({
        validator: address,
        stakedAmount: ethers.utils.formatEther(allStakers[1][index]),
        rewards: ethers.utils.formatEther(allStakers[2][index]),
        duration: allStakers[3][index].toNumber(),
        status: allStakers[4][index] ? "Active" : "Ended",
      }));

      const userOnlyStakes = stakers.filter(
        (s) => s.validator.toLowerCase() === account.toLowerCase()
      );
      setStakingData(userOnlyStakes);
    };

    if (account) fetchStakingData();
  }, [account]);

  const handleClaimRewards = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const stakingContract = new ethers.Contract(
        WorkLobStaking_address,
        WorkLobStaking_abi,
        signer
      );

      const tx = await stakingContract.getReward();
      await tx.wait();
      toast.success("Successfully claimed your rewards!");
      loadStakingData();
    } catch (error) {
      console.error("Error claiming rewards:", error);
      toast.error("Error claiming rewards.");
    }
  };

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  const handleStakeMore = () => {
    navigate("/dashboard/staking");
  };

  const truncateAddress = (address) =>
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  const filteredStakingData = stakingData.filter((data) =>
    filter === "active" ? data.status === "Active" : data.status === "Ended"
  );

  return (
    <>
      <Toaster richColors />
      <div className="container mystake-card">
        <div className="row">
          <div className="col-md-4">
            <div className="mystake-item">
              <p className="mystake-name">My Staked Amount</p>
              <p className="mystake-price">{userStakedAmount} LOB</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mystake-item">
              <p className="mystake-name">Total Staking Value</p>
              <p className="mystake-price">{totalStaked} LOB $0.00</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mystake-item">
              <p className="mystake-name">Claimable Rewards</p>
              <p className="mystake-price">{userClaimableRewards} LOB $0.00</p>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 d-flex justify-content-end gap-2">
            <button className="mystake-button" onClick={handleClaimRewards}>
              Claim Rewards
            </button>
            <button className="mystake-button" onClick={handleStakeMore}>
              Stake More
            </button>
          </div>
        </div>
      </div>

      <div className="col-lg-12">
        <div className="transaction-history-card">
          <div className="transaction-history">
            <div className="controls">
              <button
                className={`chat-button ${
                  filter === "active" ? "active-filterdata" : ""
                }`}
                onClick={() => handleFilterChange("active")}
              >
                Active
              </button>
              <button
                className={`chat-button ${
                  filter === "ended" ? "active-filterdata" : ""
                }`}
                onClick={() => handleFilterChange("ended")}
              >
                Ended
              </button>
            </div>

            <table className="transaction-table">
              <thead>
                <tr className="table-header">
                  <th>Staker Address</th>
                  <th>Staked Amount</th>
                  <th>Rewards Earned</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStakingData.length > 0 ? (
                  filteredStakingData.map((data, index) => (
                    <tr key={index} className="table-row">
                      <td className="col col-4" data-label="Address">
                        <h6>{truncateAddress(data.validator)}</h6>
                      </td>
                      <td className="col col-2" data-label="Staked Amount">
                        <h6>{data.stakedAmount} LOB</h6>
                      </td>
                      <td className="col col-2" data-label="Rewards Earned">
                        <h6>{data.rewards} LOB</h6>
                      </td>
                      <td className="col col-2" data-label="Duration">
                        <h6>{data.duration}</h6>
                      </td>
                      <td className="col col-2" data-label="Status">
                        <h6>{data.status}</h6>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="notadata">
                        <i className="bi bi-database"></i>
                        <h4>No data</h4>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mystake;
