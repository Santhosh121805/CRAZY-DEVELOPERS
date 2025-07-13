// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Oracle {
    uint public price;

    function setPrice(uint _price) public {
        price = _price;
    }

    function getPrice() public view returns (uint) {
        return price;
    }
}
