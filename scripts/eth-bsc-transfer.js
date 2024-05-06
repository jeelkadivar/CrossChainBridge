//require('dotenv').config();
//const privateKey = process.env.PRIVATE_KEY;
const BridgeEth = artifacts.require("./BridgeEthereum.sol");
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
  const account = await web3.eth.getAccounts();
  const bridgeEth = await BridgeEth.deployed();
  var amount = 0;
  await readFromFile('abc.txt',async (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        done();
    } else {
        amount = await data;
    }
  });
  console.log('Amount:', amount);
  const message = web3.utils
    .soliditySha3(
      { t: "address", v: account[0] },
      { t: "address", v: account[0] },
      { t: "uint256", v: amount },
      { t: "uint256", v: nonce }
    )
    .toString("hex");
  const { signature } = web3.eth.accounts.sign(message, privKey);
  await bridgeEth.tokenBurn(account[0], amount, nonce, signature);
  done();
};



// //const privateKey = process.env.PRIVATE_KEY;
// const BridgeEth = artifacts.require("./BridgeEthereum.sol");
// const privKey = "695bc19c9f787174ee8132165915381e7c3c6da256e9b7a90ed5bf4ca0557186";
// const fs = require('fs');

// function readFromFile(filePath) {
//     return new Promise((resolve, reject) => {
//         fs.readFile(filePath, 'utf8', (err, data) => {
//             if (err) {
//                 console.error('Error reading file:', err);
//                 reject(err);
//             } else {
//                 console.log('File content:', data);
//                 resolve(data);
//             }
//         });
//     });
// }

// module.exports = async (done) => {
//     const nonce = 1; // Need to increment this for each new transfer
//     const account = await web3.eth.getAccounts();
//     const bridgeEth = await BridgeEth.deployed();
    
//     try {
//         var amount = await readFromFile('abc.txt');
//         console.log('Amount:', amount);
        
//         const message = web3.utils
//             .soliditySha3(
//                 { t: "address", v: account[0] },
//                 { t: "address", v: account[0] },
//                 { t: "uint256", v: amount },
//                 { t: "uint256", v: nonce }
//             )
//             .toString("hex");
        
//         const { signature } = web3.eth.accounts.sign(message, privKey);
//         await bridgeEth.tokenBurn(account[0], amount, nonce, signature);
//     } catch (err) {
//         console.error('Error:', err);
//     }

//     done();
// };

