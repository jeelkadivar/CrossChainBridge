const BridgeBsc = artifacts.require("./BridgeBinance.sol");
const privKey = "695bc19c9f787174ee8132165915381e7c3c6da256e9b7a90ed5bf4ca0557186";
const fs = require('fs');

function readFromFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            callback(err, null);
        } else {
            console.log('File content:', data);
            callback(null, data);
        }
    });
}

module.exports = async (done) => {
  const nonce = 1; //Need to increment this for each new transfer
  const accounts = await web3.eth.getAccounts();
  const bridgeBsc = await BridgeBsc.deployed();
  const amount = 0;
  readFromFile('abc.txt', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        done();
    } else {
        amount = data;
    }
  });
  console.log('Amount:', amount);
  const message = web3.utils
    .soliditySha3(
      { t: "address", v: accounts[0] },
      { t: "address", v: accounts[0] },
      { t: "uint256", v: amount },
      { t: "uint256", v: nonce }
    )
    .toString("hex");
  const { signature } = web3.eth.accounts.sign(message, privKey);
  await bridgeBsc.burn(accounts[0], amount, nonce, signature);
  done();
};