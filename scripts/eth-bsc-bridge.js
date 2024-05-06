 const Web3 = require("web3");
 //require('dotenv').config();
 //const sepolia_wss = process.env.SEPOLIA_WSS;
 //const bsc_rpc = process.env.BSC_RPC;
 //const privKey = process.env.PRIVATE_KEY;
 const BridgeEth = require("../build/contracts/BridgeEthereum.json");
 const BridgeBsc = require("../build/contracts/BridgeBinance.json");

// Instantiating web3 object with the Ethereum network's WebSocket URL
const web3Eth = new Web3(
  "wss://eth-sepolia.g.alchemy.com/v2/iEf9zTZN8qzr_Z8nzRhimPfu-Q-2vnnQ"
);

// Instantiating web3 object with the Binance Smart Chain network's RPC URL
const web3Bsc = new Web3("https://data-seed-prebsc-2-s2.bnbchain.org:8545");

// The private key of the wallet to be used as the admin address
const adminPrivKey = "695bc19c9f787174ee8132165915381e7c3c6da256e9b7a90ed5bf4ca0557186";

// Deriving the public address of the wallet using the private key
 const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

// Instantiating the BridgeEth contract with its ABI and address
 const bridgeEth = new web3Eth.eth.Contract(
   BridgeEth.abi,
   BridgeEth.networks["11155111"].address
 );

// Instantiating the BridgeBsc contract with its ABI and address
 const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  BridgeBsc.networks["97"].address
 );

// Listening to Transfer events emitted by the BridgeEth contract
console.log("Listening to the events....");
bridgeEth.events
  .TokenTransfer({ fromBlock: 'latest'})
  .on("data", async (event) => {
    // Destructuring the values from the event
    const { from, to, amount, date, nonce, signature } = event.returnValues; // Defining the method to be called on the BridgeBsc contract
    const tx = bridgeBsc.methods.tokenMint(from, to, amount, nonce, signature);

    // Getting the gas price and gas cost required for the method call
    const [gasPrice, gasCost] = await Promise.all([
      web3Bsc.eth.getGasPrice(),
      tx.estimateGas({ from: admin }),
    ]);

    // Encoding the ABI of the method
    const data = tx.encodeABI();

    // Preparing the transaction data
    const txData = {
      from: admin,
      to: bridgeBsc.options.address,
      data,
      gas: gasCost,
      gasPrice,
    };

    // Sending the transaction to the Binance Smart Chain
    const receipt = await web3Bsc.eth.sendTransaction(txData);

    // Logging the transaction hash
    console.log(`Transaction hash: ${receipt.transactionHash}`);

    // Logging the details of the processed transfer
    console.log(`
Processed transfer:
- from ${from} 
- to ${to} 
- amount ${amount} tokens
- date ${date}
- nonce ${nonce}
`);

});

//   //Listening to events emitted by the BridgeBsc contract
//   bridgeBsc.events
//   .TokenTransfer({ fromBlock: 0, step: 0 })
//   .on("data", async (event) => {
//     // Destructuring the values from the event
//     const { from, to, amount, date, nonce, signature } = event.returnValues; // Defining the method to be called on the BridgeBsc contract
//     const tx = bridgeEth.methods.tokenMint(from, to, amount, nonce, signature);

//     // Getting the gas price and gas cost required for the method call
//     const [gasPrice, gasCost] = await Promise.all([
//       web3Bsc.eth.getGasPrice(),
//       tx.estimateGas({ from: admin }),
//     ]);

//     // Encoding the ABI of the method
//     const data = tx.encodeABI();

//     // Preparing the transaction data
//     const txData = {
//       from: admin,
//       to: bridgeBsc.options.address,
//       data,
//       gas: gasCost,
//       gasPrice,
//     };

//     // Sending the transaction to the Binance Smart Chain
//     const receipt = await web3Bsc.eth.sendTransaction(txData);

//     // Logging the transaction hash
//     console.log(`Transaction hash: ${receipt.transactionHash}`);

//     // Logging the details of the processed transfer
//     console.log(`
// Processed transfer:
// - from ${from} 
// - to ${to} 
// - amount ${amount} tokens
// - date ${date}
// - nonce ${nonce}
// `);
//   });