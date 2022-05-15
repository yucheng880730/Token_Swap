const assert = require("assert");

const TokenSwap = artifacts.require("TokenSwap");
const TokenA = artifacts.require("TokenA");
const TokenB = artifacts.require("TokenB");

contract("TokenSwap", (accounts) => {
  it("Testing the swapTKAtoTKB function", async () => {
    const TokenSwapInstance = await TokenSwap.deployed();
    const TokenAInstance = await TokenA.deployed();
    const TokenBInstance = await TokenB.deployed();

    const receiptA = await TokenSwapInstance.buyTokensA(1000, {
      from: accounts[0],
      value: 1000 * 1000 + 5000,
    });
    const receiptB = await TokenSwapInstance.buyTokensB(1000, {
      from: accounts[0],
      value: 1000 * 1000 + 5000,
    });

    const ratio = await TokenSwapInstance.setRatio(3);
    const fees = await TokenSwapInstance.setFees(30);

    const tokensBought = await TokenAInstance.buyTokens(10, {
      from: accounts[0],
      value: 1000 * 1000 + 5000,
    });

    const approve = await TokenAInstance.approve(TokenSwapInstance.address, 5);

    const allowanceValue = await TokenAInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );

    assert.equal(allowanceValue, 5);

    const exchangeAmount = await TokenSwapInstance.swapTKAtoTKB(5, {
      from: accounts[0],
    });

    let allowanceValueAfter = await TokenAInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );

    assert.equal(allowanceValueAfter, 0);

    const balanceOfB = await TokenBInstance.balanceOf(
      TokenSwapInstance.address
    );

    // console.log("smart contract balance of token B: " + balanceOfB);
    assert.equal(balanceOfB, 989);

    const balanceOfA = await TokenAInstance.balanceOf(
      TokenSwapInstance.address
    );

    // console.log("smart contract balance of token A: " + balanceOfA);
    assert.equal(balanceOfA, 1005);

    const balanceTKA = await TokenAInstance.balanceOf.call(accounts[0]);
    const balanceTKB = await TokenBInstance.balanceOf.call(accounts[0]);

    assert.equal(balanceTKA, 5);
    assert.equal(balanceTKB, 11);
  });

  it("Testing the swapTKBtoTKA function", async () => {
    const TokenSwapInstance = await TokenSwap.deployed();
    const TokenAInstance = await TokenA.deployed();
    const TokenBInstance = await TokenB.deployed();

    const ratio = await TokenSwapInstance.setRatio(5);
    const fees = await TokenSwapInstance.setFees(30);

    const tokensBought = await TokenBInstance.buyTokens(500, {
      from: accounts[0],
      value: 1000 * 1000 + 5000,
    });

    const approve = await TokenBInstance.approve(
      TokenSwapInstance.address,
      250
    );

    const allowanceValue = await TokenBInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );

    assert.equal(allowanceValue, 250);

    const exchangeAmount = await TokenSwapInstance.swapTKBtoTKA(250, {
      from: accounts[0],
    });

    let allowanceValueAfter = await TokenBInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );

    assert.equal(allowanceValueAfter, 0);

    const balanceOfA = await TokenAInstance.balanceOf(
      TokenSwapInstance.address
    );

    // 1005 - 35
    // console.log("smart contract balance of token A: " + balanceOfA);
    assert.equal(balanceOfA, 970);

    const balanceOfB = await TokenBInstance.balanceOf(
      TokenSwapInstance.address
    );

    // 989 + 250
    // console.log("smart contract balance of token B: " + balanceOfB);
    assert.equal(balanceOfB, 1239);

    const balanceTKA = await TokenAInstance.balanceOf.call(accounts[0]);
    const balanceTKB = await TokenBInstance.balanceOf.call(accounts[0]);

    // TKA => (50-15) + 5 = 40
    // TKB => 250 + 11 = 261
    assert.equal(balanceTKA, 40);
    assert.equal(balanceTKB, 261);
  });
});
