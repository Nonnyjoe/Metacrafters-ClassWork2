// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/OrganizationFactory.sol";
import {MyToken} from "../src/erc20.sol";

contract deploy is Script {
    OrganizationFactory _OrganizationFactory;
    MyToken _MyToken;
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        _OrganizationFactory = new OrganizationFactory();
        _MyToken = new MyToken();
        _OrganizationFactory.createOrganization("MyToken", "MKT", 100000 * 10**18, address(_MyToken));
        vm.stopBroadcast();
    }
    
}
