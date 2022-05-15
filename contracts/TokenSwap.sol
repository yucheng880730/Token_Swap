// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TokenA.sol";
import "./TokenB.sol";

// this contract for swapping tokenA tokenB
contract TokenSwap {

    //ratioAB is the percentage of how much TokenA is worth of TokenB
    uint256 ratioAB;
    uint256 fees;
    address payable admin;

    TokenA public tokenA;
    TokenB public tokenB;

    constructor(address _tokenA, address _tokenB) {

        admin = payable(msg.sender);
        tokenA = TokenA(_tokenA);
        tokenB = TokenB(_tokenB);

        // approve token transfer
        tokenA.approve(address(this), tokenA.totalSupply());
        tokenB.approve(address(this), tokenA.totalSupply());
    }

    modifier onlyAdmin() {
        require(payable(msg.sender) == admin, "Permission denied!!");
        _;
    }

    function setRatio(uint256 _ratio) public onlyAdmin {
        ratioAB = _ratio;
    }

    function getRatio() public view onlyAdmin returns (uint256) {
        return ratioAB;
    }

    function setFees(uint256 _Fees) public onlyAdmin {
        fees = _Fees;
    }

    function getFees() public view onlyAdmin returns (uint256) {
        return fees;
    }

    // transfer TokenA to TokenB
    function swapTKAtoTKB(uint256 amountA) public returns (uint256) {
        // check if amount given is not 0
        // check contract has enough amout of Tokens to exchange
        require(amountA > 0, "amountA must be greater then zero");
        require(
            tokenA.balanceOf(msg.sender) >= amountA,
            "you do not have enough Tokens"
        );

        uint256 exchangeA = uint256(mul(amountA, ratioAB));
        uint256 exchangeAmount = exchangeA -
            uint256((mul(exchangeA, fees)) / 100);
        
        // check if amount exchange is not 0
        // check contract has enough amout of Tokens to exchange
        require(
            exchangeAmount > 0,
            "exchange amount must be greater then zero"
        );
        require(
            tokenB.balanceOf(address(this)) > exchangeAmount,
            "currently the exchange doesn't have enough TokenB"
        );

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.approve(address(msg.sender), exchangeAmount);
        tokenB.transferFrom(
            address(this),
            address(msg.sender),
            exchangeAmount
        );
        return exchangeAmount;
    }

    // transfer TokenB to TokenA
    function swapTKBtoTKA(uint256 amountB) public returns (uint256) {
        // check if amount given is not 0
        // check contract has enough amout of Tokens to exchange
        require(amountB >= ratioAB, "amountB must be greater then ratio");
        require(
            tokenB.balanceOf(msg.sender) >= amountB,
            "you do not have enough Tokens"
        );

        uint256 exchangeA = amountB / ratioAB;
        uint256 exchangeAmount = exchangeA - ((exchangeA * fees) / 100);

        // check if amount exchange is not 0
        // check contract has enough amout of Tokens to exchange
        require(
            exchangeAmount > 0,
            "exchange amount must be greater then zero"
        );
        require(
            tokenA.balanceOf(address(this)) > exchangeAmount,
            "currently the exchange doesnt have enough TokensA"
        );
        tokenB.transferFrom(msg.sender, address(this), amountB);
        tokenA.approve(address(msg.sender), exchangeAmount);
        tokenA.transferFrom(
            address(this),
            address(msg.sender),
            exchangeAmount
        );
        return exchangeAmount;
    }

    function buyTokensA(uint256 amount) public payable onlyAdmin {
        tokenA.buyTokens{value: msg.value}(amount);
    }

    function buyTokensB(uint256 amount) public payable onlyAdmin {
        tokenB.buyTokens{value: msg.value}(amount);
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }
}