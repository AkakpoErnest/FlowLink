// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PaymentLinkFactory is Ownable {
    struct PaymentLink {
        uint256 linkId;
        address creator;
        uint256 policyId;
        bool isActive;
        uint256 createdAt;
    }

    mapping(uint256 => PaymentLink) public paymentLinks;
    mapping(address => uint256[]) public creatorLinks;
    
    uint256 public nextLinkId = 1;
    
    event PaymentLinkCreated(
        uint256 indexed linkId,
        address indexed creator,
        uint256 policyId,
        uint256 createdAt
    );
    
    event PaymentLinkUsed(
        uint256 indexed linkId,
        address indexed payer,
        uint256 amount,
        string txHash,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    function createPaymentLink(
        uint256 policyId
    ) external returns (uint256) {
        uint256 linkId = nextLinkId++;
        
        paymentLinks[linkId] = PaymentLink({
            linkId: linkId,
            creator: msg.sender,
            policyId: policyId,
            isActive: true,
            createdAt: block.timestamp
        });
        
        creatorLinks[msg.sender].push(linkId);
        
        emit PaymentLinkCreated(linkId, msg.sender, policyId, block.timestamp);
        
        return linkId;
    }

    function usePaymentLink(
        uint256 linkId,
        uint256 amount,
        string calldata txHash
    ) external {
        require(paymentLinks[linkId].isActive, "PaymentLink: not active");
        require(paymentLinks[linkId].creator != address(0), "PaymentLink: not found");
        
        emit PaymentLinkUsed(
            linkId,
            msg.sender,
            amount,
            txHash,
            block.timestamp
        );
    }

    function getCreatorLinks(address creator) external view returns (uint256[] memory) {
        return creatorLinks[creator];
    }

    function getPaymentLink(uint256 linkId) external view returns (PaymentLink memory) {
        return paymentLinks[linkId];
    }
}

