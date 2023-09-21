// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract InsurancePool {
    uint premiumPrice;
    address client;

    constructor(uint _premiumPrice, address _client) {
        premiumPrice = _premiumPrice;
        client = _client;
    }

    struct Client {
        uint validEnd;
        uint lastClaimed;
    }

    mapping(address => Client) public clients;

    function payMonthlyPremium() external payable {

        require(
            block.timestamp >= clients[client].validEnd,
            "ACTIVE PREMIUM AVAILABLE"
        );
        require(msg.value >= premiumPrice, "INSUFFICIENT AMOUNT");

        clients[client].validEnd = block.timestamp + 30 days;
    }

    function payYearlyPremium() external payable {
        require(
            block.timestamp >= clients[client].validEnd,
            "ACTIVE PREMIUM AVAILABLE"
        );
        require(
            msg.value == (premiumPrice * 12 * 10) / 9,
            "INSUFFICIENT AMOUNT"
        );

        clients[client].validEnd = block.timestamp + 365 days;
    }

    function claimInsurance(uint _value) external {
        require(
            clients[client].lastClaimed < block.timestamp - 365 days,
            "Last claim happened this year"
        );
        require(
            _value <= premiumPrice * 12 * 2,
            "Requested amount exceeds 2 years worth of premium"
        );
        require(
            address(this).balance >= _value,
            "Insufficient funds to send the user"
        );

        clients[client].lastClaimed = block.timestamp;
        payable(client).transfer(_value);
    }

    function getPremiumPrice() external view returns (uint) {
        return (premiumPrice);
    }

    function getClientDetails( ) external view returns (uint, uint) {
        return (clients[client].validEnd, clients[client].lastClaimed);
    }
}

