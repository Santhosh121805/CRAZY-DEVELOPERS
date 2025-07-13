require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: process.env.LOCALHOST_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};



