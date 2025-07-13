import React, { useState } from 'react';
import FinancialSummary from './components/FinancialSummary';

function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error('User denied wallet connection:', err);
      }
    } else {
      alert('Please install MetaMask to use this DApp');
    }
  };

  return (
    <div>
      <h1>FamilyFi DApp</h1>
      
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected Wallet: {walletAddress}</p>
          <FinancialSummary walletAddress={walletAddress} />
        </>
      )}
    </div>
  );
}

export default App;
