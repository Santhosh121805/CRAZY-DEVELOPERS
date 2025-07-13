require('dotenv').config();

module.exports = {
  rpcUrl: process.env.LOCALHOST_RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  contractAddress: process.env.FAMILYFI_CONTRACT_ADDRESS,
  stablecoinAddress: process.env.STABLECOIN_ADDRESS,
  port: process.env.PORT || 3001,
};

