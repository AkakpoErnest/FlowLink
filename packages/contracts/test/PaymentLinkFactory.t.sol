// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {PaymentLinkFactory} from "../src/PaymentLinkFactory.sol";

contract PaymentLinkFactoryTest is Test {
    PaymentLinkFactory public factory;
    address public owner = makeAddr("owner");
    address public user = makeAddr("user");

    function setUp() public {
        vm.prank(owner);
        factory = new PaymentLinkFactory();
    }

    function testCreatePaymentLink() public {
        vm.prank(user);
        uint256 linkId = factory.createPaymentLink(1);
        
        assertEq(linkId, 1);
        
        (uint256 id, address creator, uint256 policyId, bool isActive, uint256 createdAt) = factory.paymentLinks(linkId);
        assertEq(id, 1);
        assertEq(creator, user);
        assertEq(policyId, 1);
        assertTrue(isActive);
        assertTrue(createdAt > 0);
    }

    function testUsePaymentLink() public {
        vm.prank(user);
        uint256 linkId = factory.createPaymentLink(1);
        
        vm.prank(user);
        factory.usePaymentLink(linkId, 1000, "0x123");
        
        // Check that event was emitted
        vm.expectEmit(true, true, true, true);
        emit PaymentLinkFactory.PaymentLinkUsed(linkId, user, 1000, "0x123", block.timestamp);
    }

    function testGetCreatorLinks() public {
        vm.prank(user);
        factory.createPaymentLink(1);
        
        vm.prank(user);
        factory.createPaymentLink(2);
        
        uint256[] memory links = factory.getCreatorLinks(user);
        assertEq(links.length, 2);
        assertEq(links[0], 1);
        assertEq(links[1], 2);
    }
}

