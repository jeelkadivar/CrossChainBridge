const TokenEthereum = artifacts.require("TokenEthereum.sol");
const TokenBinance = artifacts.require("TokenBinance.sol");
const BridgeEthereum = artifacts.require("BridgeEthereum.sol");
const BridgeBinance = artifacts.require("BridgeBinance.sol");

module.exports = async function (deployer, network, addresses) {
  if (network === "sepolia_testnet") {
    await deployer.deploy(TokenEthereum);
    const tokenEth = await TokenEthereum.deployed();
    await tokenEth.tokenMint(addresses[0], 1000);
    await deployer.deploy(BridgeEthereum, tokenEth.address);
    const bridgeEth = await BridgeEthereum.deployed();
    await tokenEth.updateAdmin(bridgeEth.address);
  }
  if (network === "binance_testnet") {
    await deployer.deploy(TokenBinance);
    const tokenBsc = await TokenBinance.deployed();
    await tokenBsc.tokenMint(addresses[0], 1000);
    await deployer.deploy(BridgeBinance, tokenBsc.address);
    const bridgeBsc = await BridgeBinance.deployed();
    await tokenBsc.updateAdmin(bridgeBsc.address);
  }
};
