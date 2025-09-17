// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PayrollExecutor is Ownable {
    struct PayrollBatch {
        uint256 batchId;
        address creator;
        uint256 policyId;
        uint256 createdAt;
        bool isActive;
    }

    mapping(uint256 => PayrollBatch) public batches;
    mapping(address => uint256[]) public creatorBatches;
    
    uint256 public nextBatchId = 1;
    
    event PayrollBatchCreated(
        uint256 indexed batchId,
        address indexed creator,
        uint256 policyId,
        uint256 createdAt
    );
    
    event PayrollItemProcessed(
        uint256 indexed batchId,
        address indexed recipient,
        uint256 amount,
        uint256 policyId,
        string txHash,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    function createPayrollBatch(
        uint256 policyId
    ) external returns (uint256) {
        uint256 batchId = nextBatchId++;
        
        batches[batchId] = PayrollBatch({
            batchId: batchId,
            creator: msg.sender,
            policyId: policyId,
            createdAt: block.timestamp,
            isActive: true
        });
        
        creatorBatches[msg.sender].push(batchId);
        
        emit PayrollBatchCreated(batchId, msg.sender, policyId, block.timestamp);
        
        return batchId;
    }

    function processPayrollItem(
        uint256 batchId,
        address recipient,
        uint256 amount,
        string calldata txHash
    ) external {
        require(batches[batchId].isActive, "PayrollExecutor: batch not active");
        require(batches[batchId].creator != address(0), "PayrollExecutor: batch not found");
        
        emit PayrollItemProcessed(
            batchId,
            recipient,
            amount,
            batches[batchId].policyId,
            txHash,
            block.timestamp
        );
    }

    function getBatch(uint256 batchId) external view returns (PayrollBatch memory) {
        return batches[batchId];
    }

    function getCreatorBatches(address creator) external view returns (uint256[] memory) {
        return creatorBatches[creator];
    }
}

