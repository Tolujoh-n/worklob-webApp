// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WorklobJOB {
    struct Job {
        string jobId;
        string customerId;
        string talentId;
        address customerWallet;
        address talentWallet;
        uint256 amount;
        uint256 status; // 0: Not started, 1: Deposited, 2: Completed, 3: Confirmed
        string chatId;
    }

    mapping(string => Job) public jobs;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function deposit(
        string memory _jobId,
        string memory _customerId,
        string memory _talentId,
        address _customerWallet,
        uint256 _amount,
        string memory _chatId
    ) public payable {
        require(msg.value == _amount, "Amount mismatch");
        Job storage job = jobs[_jobId];
        job.jobId = _jobId;
        job.customerId = _customerId;
        job.talentId = _talentId;
        job.customerWallet = _customerWallet;
        job.amount = _amount;
        job.chatId = _chatId;
        job.status = 1;
    }

    function complete(
        string memory _jobId,
        string memory _customerId,
        string memory _talentId,
        address _talentWallet,
        string memory _chatId
    ) public {
        Job storage job = jobs[_jobId];
        require(
            keccak256(bytes(job.customerId)) == keccak256(bytes(_customerId)) &&
            keccak256(bytes(job.talentId)) == keccak256(bytes(_talentId)),
            "Invalid customer or talent ID"
        );
        require(job.status == 1, "Job is not deposited yet");
        job.talentWallet = _talentWallet;
        job.chatId = _chatId;
        job.status = 2;
    }

    function confirm(
        string memory _jobId,
        string memory _customerId,
        string memory _talentId,
        address _customerWallet,
        string memory _chatId
    ) public {
        Job storage job = jobs[_jobId];
        require(
            keccak256(bytes(job.customerId)) == keccak256(bytes(_customerId)) &&
            keccak256(bytes(job.talentId)) == keccak256(bytes(_talentId)),
            "Invalid customer or talent ID"
        );
        require(job.status == 2, "Job is not completed yet");

        job.customerWallet = _customerWallet;
        job.chatId = _chatId;
        job.status = 3;

        address talentWallet = job.talentWallet;
        require(talentWallet != address(0), "Talent wallet not set");

        uint256 amountToTalent = (job.amount * 95) / 100;
        uint256 remainingAmount = job.amount - amountToTalent;

        payable(talentWallet).transfer(amountToTalent);
        payable(owner).transfer(remainingAmount);
    }
}
