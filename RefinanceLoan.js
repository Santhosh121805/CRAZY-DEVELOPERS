import React, { useState } from 'react';
import axios from 'axios';

function RefinanceLoan() {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [baseRate, setBaseRate] = useState("10");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/refinance", {
        walletAddress,
        amount,
        baseRate
      });
      alert(`Success! TxHash: ${res.data.txHash}`);
    } catch (err) {
      console.error(err);
      alert("Refinance failed");
    }
  };

  return (
    <div>
      <h3>Refinance with Stablecoin</h3>
      <form onSubmit={handleSubmit}>
        <input value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="Wallet Address" />
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <input value={baseRate} onChange={e => setBaseRate(e.target.value)} placeholder="Base Rate %" />
        <button type="submit">Refinance</button>
      </form>
    </div>
  );
}

export default RefinanceLoan;
