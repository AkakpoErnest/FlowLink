// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PolicyRegistry is Ownable {
    struct Policy {
        uint256 policyId;
        bytes32 rulesHash;
        address creator;
        uint256 createdAt;
        bool isActive;
    }

    mapping(uint256 => Policy) public policies;
    mapping(address => uint256[]) public creatorPolicies;
    
    uint256 public nextPolicyId = 1;
    
    event PolicyRegistered(
        uint256 indexed policyId,
        address indexed creator,
        bytes32 rulesHash,
        uint256 createdAt
    );

    constructor() Ownable(msg.sender) {}

    function registerPolicy(
        bytes32 rulesHash
    ) external returns (uint256) {
        uint256 policyId = nextPolicyId++;
        
        policies[policyId] = Policy({
            policyId: policyId,
            rulesHash: rulesHash,
            creator: msg.sender,
            createdAt: block.timestamp,
            isActive: true
        });
        
        creatorPolicies[msg.sender].push(policyId);
        
        emit PolicyRegistered(policyId, msg.sender, rulesHash, block.timestamp);
        
        return policyId;
    }

    function getPolicy(uint256 policyId) external view returns (Policy memory) {
        return policies[policyId];
    }

    function getCreatorPolicies(address creator) external view returns (uint256[] memory) {
        return creatorPolicies[creator];
    }

    function verifyPolicyHash(uint256 policyId, bytes32 rulesHash) external view returns (bool) {
        return policies[policyId].rulesHash == rulesHash;
    }
}

