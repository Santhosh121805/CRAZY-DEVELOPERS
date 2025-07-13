import React, { useState } from 'react';

const FinancialSummary = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/financial-summary?walletAddress=${walletAddress}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setSummary(null);
      } else {
        setSummary(data);
        setError('');
      }
    } catch (err) {
      setError('Failed to fetch summary');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Get Financial Summary</h2>
      <input type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Enter wallet address" className="border p-2 w-full mb-4" />
      <button onClick={fetchSummary} className="bg-blue-500 text-white px-4 py-2 rounded">Fetch Summary</button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {summary && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <p><strong>Total Budget:</strong> {summary.totalBudget}</p>
          <p><strong>Total Spent:</strong> {summary.totalSpent}</p>
          <p><strong>Loan Balance:</strong> {summary.loanBalance}</p>
          <p><strong>Savings Goal:</strong> {summary.savingsGoal}</p>
          <p><strong>Savings Balance:</strong> {summary.savingsBalance}</p>
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;