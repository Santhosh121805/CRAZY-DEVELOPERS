import React, { useState } from 'react';
import { ethers } from 'ethers';
import FamilyFiABI from '../abis/FamilyFi.json';



const contractAddress = process.env.REACT_APP_FAMILYFI_CONTRACT_ADDRESS;

const SetBudget = () => {
  const [budget, setBudget] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleSetBudget = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask not found');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FamilyFiABI.abi, signer);

      const tx = await contract.setBudget(budget);
      await tx.wait();
      setTxHash(tx.hash);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to set budget');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Set Your Budget</h2>
      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="Enter budget amount"
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={handleSetBudget}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Submit Budget
      </button>
      {txHash && <p className="text-green-600 mt-2">Tx: {txHash}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SetBudget;