// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
interface IERC20 {

    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}