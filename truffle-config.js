//require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "maple awake venue away spider rival boil jewel net artist resource video";
//const mnemonic = process.env.ACC_MNEMONIC;
//const sepolia_wss = process.env.SEPOLIA_WSS;
//const bsc_rpc = process.env.BSC_RPC;

module.exports = {
  networks: {
    sepolia_testnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          "wss://eth-sepolia.g.alchemy.com/v2/iEf9zTZN8qzr_Z8nzRhimPfu-Q-2vnnQ",
          0,
          1
        ),
      network_id: 11155111, // Sepolia's Network id
      chain_id: 11155111,
      skipDryRun: true,
      networkCheckTimeout: 100000,
    },
    binance_testnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          "https://data-seed-prebsc-2-s2.bnbchain.org:8545"
        ),
      skipDryRun: true,
      network_id: 97, // Binance Smart Chain testnet's id
      chain_id: 97,
      networkCheckTimeout: 100000,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
     timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13", // Fetch exact version from solc-bin
    },
  },
};