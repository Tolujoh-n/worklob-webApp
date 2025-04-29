// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWorkLobERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract Ownable {
    address public owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract WorkLobStaking is Ownable {
    IWorkLobERC20 public immutable token;
    uint256 public rewardRate;
    uint256 public periodFinish;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    uint256 public totalStaked;
    
    mapping(address => uint256) public balances;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    
    address[] private stakers;
    mapping(address => bool) private hasStaked;
    mapping(address => uint256) public stakeTimestamps;
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardAdded(uint256 rewardAmount, uint256 duration);
    
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }
    
    constructor(IWorkLobERC20 _token) {
        token = _token;
    }
    
    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }
    
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) return rewardPerTokenStored;
        return rewardPerTokenStored + ((lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18 / totalStaked);
    }
    
    function earned(address account) public view returns (uint256) {
        return (balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account]) / 1e18) + rewards[account];
    }
    
    function stake(uint256 amount) external updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        if (!hasStaked[msg.sender]) {
    stakers.push(msg.sender);
    hasStaked[msg.sender] = true;
    stakeTimestamps[msg.sender] = block.timestamp; // Record timestamp
}
        
        balances[msg.sender] += amount;
        totalStaked += amount;
        emit Staked(msg.sender, amount);
    }
    
    function withdraw(uint256 amount) public updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        require(balances[msg.sender] >= amount, "Insufficient staked balance");
        
        balances[msg.sender] -= amount;
        totalStaked -= amount;
        require(token.transfer(msg.sender, amount), "Transfer failed");
        emit Withdrawn(msg.sender, amount);
    }
    
    function getReward() public updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            require(token.transfer(msg.sender, reward), "Reward transfer failed");
            emit RewardPaid(msg.sender, reward);
        }
    }
    
    function exit() external {
        withdraw(balances[msg.sender]);
        getReward();
    }
    
    function notifyRewardAmount(uint256 rewardAmount, uint256 duration) external onlyOwner updateReward(address(0)) {
        if (block.timestamp >= periodFinish) {
            rewardRate = rewardAmount / duration;
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * rewardRate;
            rewardRate = (rewardAmount + leftover) / duration;
        }
        
        uint256 availableBalance = token.balanceOf(address(this));
        require(rewardRate * duration <= availableBalance, "Not enough tokens for reward");
        
        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + duration;
        emit RewardAdded(rewardAmount, duration);
    }

    function getAllStakers() public view returns (
    address[] memory,
    uint256[] memory,
    uint256[] memory,
    uint256[] memory,
    bool[] memory
) {
    uint256 stakerCount = 0;

    for (uint256 i = 0; i < stakers.length; i++) {
        if (balances[stakers[i]] > 0) {
            stakerCount++;
        }
    }

    address[] memory stakerAddresses = new address[](stakerCount);
    uint256[] memory stakedAmounts = new uint256[](stakerCount);
    uint256[] memory rewardsEarned = new uint256[](stakerCount);
    uint256[] memory durations = new uint256[](stakerCount); // You may want to remove this if not needed
    bool[] memory statuses = new bool[](stakerCount);

    uint256 index = 0;
    for (uint256 i = 0; i < stakers.length; i++) {
        address staker = stakers[i];
        if (balances[staker] > 0) {
            stakerAddresses[index] = staker;
            stakedAmounts[index] = balances[staker];
            rewardsEarned[index] = earned(staker);
            durations[index] = 0; // placeholder value since we don't track stake timestamp
            statuses[index] = true;
            index++;
        }
    }

    return (stakerAddresses, stakedAmounts, rewardsEarned, durations, statuses);
}


    
    function getStakerDetails(address account) public view returns (
    address,
    uint256,
    uint256,
    uint256,
    bool
) {
    return (
        account,
        balances[account],
        earned(account),
        0, // placeholder duration
        balances[account] > 0
    );
}

}
