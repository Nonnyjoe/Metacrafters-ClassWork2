// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./Organization.sol";

contract OrganizationFactory {
    mapping(address => address) ownerToOrganization;
    mapping(address => address[]) userToOrganizations;
    mapping(address => bool) isChild;

    modifier validChild {
        require (isChild[msg.sender] == true, "NOT A VALID CHILD");
        _;
    }

    constructor() {}

    function createOrganization(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address tokenContract
    ) external {
       Organization newOrganization = new Organization(
            name,
            symbol,
            initialSupply,
            tokenContract,
            address(this),
            address(msg.sender)
        );
        ownerToOrganization[msg.sender] = address(newOrganization);
        isChild[address(newOrganization)] = true;
    }

    function registerUser(address user) validChild() external  {
        userToOrganizations[user].push(msg.sender);
    }

    function getOrganization(address newOwner) view external returns(address) {
        require(address(newOwner) != address(0), "address Zero");
        address org = ownerToOrganization[newOwner];
        return org;
    }

    function getUserVests(address user) view external returns (address[] memory) {
        require(address(user) != address(0), "address Zero");
        return userToOrganizations[user];
    }


    
}