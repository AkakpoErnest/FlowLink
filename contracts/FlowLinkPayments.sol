// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract FlowLinkPayments {
    address public owner;

    event PaymentProcessed(
        bytes32 indexed paymentLinkId,
        address indexed payer,
        address indexed recipient,
        address token,
        uint256 amount,
        uint256 timestamp
    );

    constructor() {
        owner = msg.sender;
    }

    function pay(
        bytes32 paymentLinkId,
        address recipient,
        address token,
        uint256 amount
    ) external {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");

        IERC20(token).transferFrom(msg.sender, recipient, amount);

        emit PaymentProcessed(
            paymentLinkId,
            msg.sender,
            recipient,
            token,
            amount,
            block.timestamp
        );
    }

    // For native HSK payments
    function payNative(
        bytes32 paymentLinkId,
        address payable recipient
    ) external payable {
        require(recipient != address(0), "Invalid recipient");
        require(msg.value > 0, "Must send HSK");

        recipient.transfer(msg.value);

        emit PaymentProcessed(
            paymentLinkId,
            msg.sender,
            recipient,
            address(0),
            msg.value,
            block.timestamp
        );
    }
}
