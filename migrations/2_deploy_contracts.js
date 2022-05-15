let TokenA = artifacts.require("TokenA");
let TokenB = artifacts.require("TokenB");
let Tokenswap = artifacts.require("TokenSwap");

module.exports = async function (deployer) {
  // deploy(Total supply & price)
  const tokenA = await deployer.deploy(TokenA, 1000000, 1000);
  const tokenB = await deployer.deploy(TokenB, 1000000, 1000);
  return deployer.deploy(Tokenswap, TokenA.address, TokenB.address);
};
