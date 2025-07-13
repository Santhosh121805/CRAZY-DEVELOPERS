const express = require('express');
const axios = require('axios');
const { JsonRpcProvider, Wallet, Contract, parseUnits } = require('ethers');
const config = require('./config');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize provider and wallet
const provider = new JsonRpcProvider(config.rpcUrl);
const wallet = new Wallet(config.privateKey, provider);

// Load ABI
const familyFiABI = require('../frontend/src/abis/FamilyFi.json').abi;

// Initialize contract
const familyFi = new Contract(config.contractAddress, familyFiABI, wallet);

// ========= ROUTES ========= //

// Initialize user profile
app.post('/api/initialize-profile', async (req, res) => {
  const { walletAddress } = req.body;
  try {
    const tx = await familyFi.connect(wallet).initializeProfile();
    await tx.wait();
    res.json({ status: 'success', txHash: tx.hash });
  } catch (error) {
    console.error('Initialize profile error:', error);
    res.status(500).json({ error: 'Failed to initialize profile' });
  }
});

// Set budget
app.post('/api/set-budget', async (req, res) => {
  const { walletAddress, amount } = req.body;
  try {
    const tx = await familyFi.connect(wallet).setBudget(parseUnits(amount.toString(), 18));
    await tx.wait();
    res.json({ status: 'success', txHash: tx.hash });
  } catch (error) {
    console.error('Set budget error:', error);
    res.status(500).json({ error: 'Failed to set budget' });
  }
});

// Get financial summary
app.get('/api/financial-summary', async (req, res) => {
  const { walletAddress } = req.query;
  try {
    const result = await familyFi.getFinancialSummary(walletAddress);
    res.json({
      totalBudget: result[0].toString(),
      totalSpent: result[1].toString(),
      loanBalance: result[2].toString(),
      interestRate: result[3].toString(),
      savingsGoal: result[4].toString(),
      savingsBalance: result[5].toString(),
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Failed to fetch financial summary' });
  }
});

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
