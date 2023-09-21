// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


import "./interfaces/IERC20.sol";
import "./interfaces/IFACTORY.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

// Organization Contract
contract Organization is Ownable {
    struct Member {
        uint256 initialTokens;
        uint256 vestingPeriod;
        uint256 vestingStartTime;
        string stakeholderRole;
    }

    address[] stakeholders;

    string name;
    string symbol;
    uint256 totalSupply;
    address factory;

    mapping(address => Member) public members;
    address immutable tokenContract;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 initialSupply,
        address _tokenContract,
        address _factory,
        address _admin
    ) Ownable(_admin){
        name = _name;
        symbol = _symbol;
        tokenContract = _tokenContract;
        totalSupply = initialSupply;
        factory = _factory;
    }

    modifier onlyMember() {
        require(members[msg.sender].initialTokens > 0, "Not a member");
        _;
    }

    modifier vestingPeriodOver() {
        Member memory member = members[msg.sender];
        require(
            block.timestamp >= member.vestingStartTime + member.vestingPeriod,
            "Vesting period not over yet"
        );
        _;
    }

    event memberAdded(address member, uint256 amount, string Position);
    event tokensWithdrawn(address member, uint256 amount);

    function getOrganizationDetails()
        external
        view
        returns (string memory, string memory, uint256)
    {
        return (name, symbol, totalSupply);
    }


    function addMember(
        string memory _stakeholderRole,
        address account,
        uint256 initialTokens,
        uint256 vestingPeriod
    ) external onlyOwner {
        require( account != address(0), "Address Zero error");
        IERC20(tokenContract).transferFrom(msg.sender, address(this), initialTokens);
        members[account] = Member({
            initialTokens: initialTokens,
            vestingPeriod: vestingPeriod * 1 days,
            vestingStartTime: block.timestamp,
            stakeholderRole: _stakeholderRole
        });
        stakeholders.push(account);
        IFACTORY(factory).registerUser(account);
        emit memberAdded(account, initialTokens, _stakeholderRole);
    }

    function claimVestedTokens() external onlyMember() vestingPeriodOver() {
        Member storage member = members[msg.sender];
        uint256 claimableTokens = member.initialTokens;
        member.initialTokens = 0;
        member.vestingStartTime = 0;
        IERC20(tokenContract).transfer(msg.sender, claimableTokens);
        emit tokensWithdrawn(msg.sender, claimableTokens);
    }

    function getVestingInfo(
        address account
    ) external view returns (uint256, uint256, uint256) {
        Member memory member = members[account];
        return (
            member.initialTokens,
            member.vestingPeriod,
            member.vestingStartTime
        );
    }
}


