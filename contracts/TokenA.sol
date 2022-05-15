// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20 {
    uint256 public tokenPrice;
    uint256 public tokensSold;

    constructor(uint256 initialSupply, uint256 _tokenPrice)
        ERC20("TokenA", "TKA")
    {
        tokenPrice = _tokenPrice;
        // ERC20 tokens have 18 decimals
        // number of tokens minted = initia lSupply * 10
        _mint(address(this), initialSupply * 10**decimals());
    }

    // multiply function
    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function buyTokens(uint256 numberOfTokens) external payable {
       
        // Require that value is equal to tokens
        require(msg.value >= mul(numberOfTokens, tokenPrice));

        // Require that the contract has enough tokens
        require(this.balanceOf(address(this)) >= numberOfTokens);

        // Require transfer is success
        require(this.transfer(msg.sender, numberOfTokens));

        // keep track of tokensSold
        tokensSold += numberOfTokens;
    }
}