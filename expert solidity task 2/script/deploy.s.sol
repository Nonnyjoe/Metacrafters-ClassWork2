// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/InsuranceFactory.sol";



contract deploy is Script {
    InsurancePoolFactory _InsurancePoolFactory;
    address _admin = payable(0xA771E1625DD4FAa2Ff0a41FA119Eb9644c9A46C8);
    address _user = payable(0xBB9F947cB5b21292DE59EFB0b1e158e90859dddb);
    address token = 0x203eef5b8ac17d3d59071b393067b64A52ADA681;
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        _InsurancePoolFactory = new InsurancePoolFactory(token, _admin);
        _InsurancePoolFactory.createInsurancePool(0.001 ether);
        IERC20(token).transfer(address(_InsurancePoolFactory), (200 * 10**18));
        _InsurancePoolFactory.createColateralPool{value: 0.001 ether}();
        vm.stopBroadcast();
    }


    
}

