const assert = require("assert");

const TokenA = artifacts.require("TokenA");
const TokenB = artifacts.require("TokenB");

contract("Token", (accounts) => {
  it("Testing TokenA name", async () => {
    const TokenInstance = await TokenA.deployed();
    const result = await TokenInstance.name.call();
    assert.equal("TokenA", result);
  });

  it("Testing TokenB name", async () => {
    const TokenInstance = await TokenB.deployed();
    const result = await TokenInstance.name.call();
    assert.equal("TokenB", result);
  });

  it("Testing TokenA symbol", async () => {
    const TokenInstance = await TokenA.deployed();
    const result = await TokenInstance.symbol.call();
    assert.equal("TKA", result);
  });

  it("Testing TokenB symbol", async () => {
    const TokenInstance = await TokenB.deployed();
    const result = await TokenInstance.symbol.call();
    assert.equal("TKB", result);
  });

  it("Testing TokenA initial supply", async () => {
    const TokenInstance = await TokenA.deployed();
    const result = await TokenInstance.totalSupply.call();
    assert.equal(1000000 * 10 ** 18, result);
  });

  it("Testing TokenB initial supply", async () => {
    const TokenInstance = await TokenB.deployed();
    const result = await TokenInstance.totalSupply.call();
    assert.equal(1000000 * 10 ** 18, result);
  });

  it("Testing TokenA price is correct", async () => {
    const TokenInstance = await TokenA.deployed();
    const result = await TokenInstance.tokenPrice.call();
    assert.equal(1000, result);
  });

  it("Testing TokenB price is correct", async () => {
    const TokenInstance = await TokenB.deployed();
    const result = await TokenInstance.tokenPrice.call();
    assert.equal(1000, result);
  });

  it("Testing TokenA buy function", async () => {
    const TokenInstance = await TokenA.deployed();
    const receiptA = await TokenInstance.buyTokens(1000, {
      from: accounts[0],
      value: 1000 * 1000 + 5000,
    });
    const approve = await TokenInstance.approve(TokenInstance.address, 5);
    const allowanceValue = await TokenInstance.allowance(
      accounts[0],
      TokenInstance.address
    );
    assert.equal(allowanceValue, 5);
  });

  it("Testing TokenB buy function", async () => {
    const TokenInstance = await TokenB.deployed();
    const receiptB = await TokenInstance.buyTokens(1000, {
      from: accounts[0],
      value: 1000 * 1000 + 5000,
    });
    const approve = await TokenInstance.approve(TokenInstance.address, 1000);
    const allowanceValue = await TokenInstance.allowance(
      accounts[0],
      TokenInstance.address
    );
    assert.equal(allowanceValue, 1000);
  });
});
