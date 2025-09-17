// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {PaymentLinkFactory} from "../src/PaymentLinkFactory.sol";
import {PolicyRegistry} from "../src/PolicyRegistry.sol";
import {PayrollExecutor} from "../src/PayrollExecutor.sol";

contract DeploySepolia is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PolicyRegistry
        PolicyRegistry policyRegistry = new PolicyRegistry();
        console.log("PolicyRegistry deployed to:", address(policyRegistry));

        // Deploy PaymentLinkFactory
        PaymentLinkFactory paymentLinkFactory = new PaymentLinkFactory();
        console.log("PaymentLinkFactory deployed to:", address(paymentLinkFactory));

        // Deploy PayrollExecutor
        PayrollExecutor payrollExecutor = new PayrollExecutor();
        console.log("PayrollExecutor deployed to:", address(payrollExecutor));

        vm.stopBroadcast();

        // Save addresses to file
        string memory addresses = string.concat(
            "POLICY_REGISTRY_ADDRESS=", vm.toString(address(policyRegistry)), "\n",
            "PAYMENT_LINK_FACTORY_ADDRESS=", vm.toString(address(paymentLinkFactory)), "\n",
            "PAYROLL_EXECUTOR_ADDRESS=", vm.toString(address(payrollExecutor)), "\n"
        );
        vm.writeFile("./.env.sepolia", addresses);
    }
}

