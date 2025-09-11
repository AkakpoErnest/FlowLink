// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PolicyGuardV0
 * @dev Smart contract for compliant payment links with KYC and sanctions checking
 */
contract PolicyGuardV0 is Ownable, ReentrancyGuard {
    struct Policy {
        bool requireKYC;
        bool checkSanctions;
        address merchant;
        address token;
        uint256 amount;
        bool active;
    }

    // Events
    event PolicySet(
        bytes32 indexed linkId,
        address indexed merchant,
        address token,
        uint256 amount,
        bool requireKYC,
        bool checkSanctions
    );

    event Receipt(
        bytes32 indexed linkId,
        address indexed payer,
        address indexed merchant,
        address token,
        uint256 amount,
        uint256 timestamp,
        uint8 checksBitfield
    );

    event PaymentCompleted(
        bytes32 indexed linkId,
        address indexed payer,
        uint256 amount
    );

    // Storage
    mapping(bytes32 => Policy) public policies;
    mapping(address => bool) public kycVerified;
    mapping(address => bool) public sanctionsBlocked;

    // Admin functions for compliance management
    function setKYCStatus(address user, bool verified) external onlyOwner {
        kycVerified[user] = verified;
    }

    function setSanctionsStatus(address user, bool blocked) external onlyOwner {
        sanctionsBlocked[user] = blocked;
    }

    function batchSetKYC(address[] calldata users, bool[] calldata statuses) external onlyOwner {
        require(users.length == statuses.length, "Arrays length mismatch");
        for (uint i = 0; i < users.length; i++) {
            kycVerified[users[i]] = statuses[i];
        }
    }

    function batchSetSanctions(address[] calldata users, bool[] calldata blocked) external onlyOwner {
        require(users.length == blocked.length, "Arrays length mismatch");
        for (uint i = 0; i < users.length; i++) {
            sanctionsBlocked[users[i]] = blocked[i];
        }
    }

    /**
     * @dev Set policy for a payment link
     * @param linkId Unique identifier for the payment link
     * @param policy Policy configuration
     */
    function setPolicy(bytes32 linkId, Policy calldata policy) external {
        require(policy.merchant != address(0), "Invalid merchant address");
        require(policy.token != address(0), "Invalid token address");
        require(policy.amount > 0, "Amount must be greater than 0");

        policies[linkId] = policy;
        policies[linkId].active = true;

        emit PolicySet(
            linkId,
            policy.merchant,
            policy.token,
            policy.amount,
            policy.requireKYC,
            policy.checkSanctions
        );
    }

    /**
     * @dev Process payment for a specific link
     * @param linkId The payment link identifier
     * @param checksBitfield Encoded compliance check results from backend
     */
    function pay(bytes32 linkId, uint8 checksBitfield) external nonReentrant {
        Policy storage policy = policies[linkId];
        
        require(policy.active, "Payment link not active");
        require(policy.merchant != address(0), "Payment link not found");

        // Check compliance requirements
        if (policy.requireKYC) {
            require(kycVerified[msg.sender], "KYC_REQUIRED");
        }

        if (policy.checkSanctions) {
            require(!sanctionsBlocked[msg.sender], "SANCTIONS_BLOCKED");
        }

        // Transfer tokens from payer to merchant
        IERC20 token = IERC20(policy.token);
        require(
            token.transferFrom(msg.sender, policy.merchant, policy.amount),
            "Transfer failed"
        );

        // Mark policy as used (one-time payment)
        policies[linkId].active = false;

        // Emit receipt event
        emit Receipt(
            linkId,
            msg.sender,
            policy.merchant,
            policy.token,
            policy.amount,
            block.timestamp,
            checksBitfield
        );

        emit PaymentCompleted(linkId, msg.sender, policy.amount);
    }

    /**
     * @dev Get policy details for a payment link
     * @param linkId The payment link identifier
     */
    function getPolicy(bytes32 linkId) external view returns (Policy memory) {
        return policies[linkId];
    }

    /**
     * @dev Check if an address can pay for a specific link
     * @param linkId The payment link identifier
     * @param payer The address attempting to pay
     */
    function canPay(bytes32 linkId, address payer) external view returns (bool, string memory) {
        Policy storage policy = policies[linkId];
        
        if (!policy.active) {
            return (false, "Payment link not active");
        }

        if (policy.merchant == address(0)) {
            return (false, "Payment link not found");
        }

        if (policy.requireKYC && !kycVerified[payer]) {
            return (false, "KYC_REQUIRED");
        }

        if (policy.checkSanctions && sanctionsBlocked[payer]) {
            return (false, "SANCTIONS_BLOCKED");
        }

        return (true, "");
    }

    /**
     * @dev Emergency function to deactivate a payment link
     * @param linkId The payment link identifier
     */
    function deactivateLink(bytes32 linkId) external {
        Policy storage policy = policies[linkId];
        require(
            msg.sender == policy.merchant || msg.sender == owner(),
            "Not authorized"
        );
        
        policy.active = false;
    }
}
