// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WorklobAIMarketplace {
    struct Subscription {
        address user;
        uint256 aiId;
        uint256 startDate;
        uint256 endDate;
    }

    // Mapping from user address to AI ID to Subscription
    mapping(address => mapping(uint256 => Subscription)) public subscriptions;
    
    // Array of all subscriptions for enumeration
    Subscription[] public allSubscriptions;

    event SingleUsePaid(
        address indexed user, 
        address indexed provider, 
        uint256 aiId, 
        uint256 amount
    );
    
    event SubscriptionCreated(
        address indexed user, 
        address indexed provider, 
        uint256 aiId, 
        uint256 startDate, 
        uint256 endDate, 
        uint256 amount
    );

    // Pay for single use of AI agent
    function payForSingleUse(
        uint256 aiId, 
        address provider, 
        uint256 singleFee
    ) external payable {
        require(provider != address(0), "Invalid provider address");
        require(msg.value == singleFee, "Incorrect payment amount");

        (bool sent, ) = provider.call{value: msg.value}("");
        require(sent, "Failed to send payment to provider");

        emit SingleUsePaid(msg.sender, provider, aiId, msg.value);
    }

    // Subscribe to AI agent for a period
    function subscribeToAI(
        uint256 aiId,
        address provider,
        uint256 startDate,
        uint256 endDate,
        uint256 subscriptionFee
    ) external payable {
        require(provider != address(0), "Invalid provider address");
        require(endDate > startDate, "End date must be after start date");
        require(msg.value == subscriptionFee, "Incorrect subscription fee");

        (bool sent, ) = provider.call{value: msg.value}("");
        require(sent, "Failed to send payment to provider");

        // Create or update subscription
        Subscription storage sub = subscriptions[msg.sender][aiId];
        if (sub.endDate > block.timestamp) {
            // Extend existing active subscription
            sub.endDate = endDate;
        } else {
            // Create new subscription
            sub.user = msg.sender;
            sub.aiId = aiId;
            sub.startDate = startDate;
            sub.endDate = endDate;
            
            allSubscriptions.push(sub);
        }

        emit SubscriptionCreated(
            msg.sender, 
            provider, 
            aiId, 
            startDate, 
            endDate, 
            msg.value
        );
    }

    // Get subscription status for a user and AI agent
    function getSubscriptionStatus(
        address user, 
        uint256 aiId
    ) external view returns (bool isActive, uint256 startDate, uint256 endDate) {
        Subscription storage sub = subscriptions[user][aiId];
        bool active = block.timestamp >= sub.startDate && block.timestamp <= sub.endDate;
        return (active, sub.startDate, sub.endDate);
    }

    // Get all subscriptions for a specific AI agent
    function getAllSubscriptionsForAI(
        uint256 aiId
    ) external view returns (Subscription[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allSubscriptions.length; i++) {
            if (allSubscriptions[i].aiId == aiId) {
                count++;
            }
        }

        Subscription[] memory result = new Subscription[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allSubscriptions.length; i++) {
            if (allSubscriptions[i].aiId == aiId) {
                result[index] = allSubscriptions[i];
                index++;
            }
        }
        return result;
    }

    // Check if a user's subscription to an AI is currently active
    function isSubscriptionActive(
        address user, 
        uint256 aiId
    ) public view returns (bool) {
        Subscription storage sub = subscriptions[user][aiId];
        return block.timestamp >= sub.startDate && block.timestamp <= sub.endDate;
    }
}