import React, { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; 
const ABI = [
  "function getMessage() public view returns (string)",
  "function updateMessage(string memory _text) public"
];

function DAppMain() {
  const [account, setAccount] = useState(null);
  const [storedData, setStoredData] = useState('');
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState(''); // pending, success, error

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } else {
      alert("Hamyon topilmadi!");
    }
  };

  const readData = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const data = await contract.getMessage();
      setStoredData(data);
    } catch (e) { console.error(e); }
  };

  const writeData = async (e) => {
    e.preventDefault();
    if (!userInput) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      
      setStatus('pending');
      const tx = await contract.updateMessage(userInput);
      await tx.wait();
      
      setStatus('success');
      readData();
    } catch (e) {
      setStatus('error');
      console.error(e);
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'Arial' }}>
      <h2 style={{color: '#2c3e50'}}>DApp Control Panel</h2>
      <p>Muallif: Salohiddinova Dilshodaxon</p>
      
      <button onClick={connectWallet} style={styles.btn}>
        {account ? `Ulandi: ${account.slice(0,6)}...` : "Connect Wallet"}
      </button>

      <div style={styles.card}>
        <h4>Blokcheyndagi ma'lumot:</h4>
        <p style={{fontSize: '20px', fontWeight: 'bold'}}>{storedData || "Bo'sh"}</p>
        <button onClick={readData} style={styles.secondaryBtn}>O'qish</button>
      </div>

      <form onSubmit={writeData} style={{marginTop: '30px'}}>
        <input 
          value={userInput} 
          onChange={(e) => setUserInput(e.target.value)} 
          placeholder="Xabar yozing..." 
          style={styles.input}
        />
        <button type="submit" style={styles.submitBtn}>Yozish</button>
      </form>

      <div style={{marginTop: '20px'}}>
        {status === 'pending' && <p style={{color: 'orange'}}>⏳ Tranzaksiya bajarilmoqda...</p>}
        {status === 'success' && <p style={{color: 'green'}}>✅ Muvaffaqiyatli saqlandi!</p>}
        {status === 'error' && <p style={{color: 'red'}}>❌ Xatolik yuz berdi!</p>}
      </div>
    </div>
  );
}

const styles = {
  btn: { padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', margin: '20px auto', width: '300px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  input: { padding: '10px', width: '200px', borderRadius: '5px', border: '1px solid #ccc' },
  submitBtn: { padding: '10px 15px', marginLeft: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px' },
  secondaryBtn: { backgroundColor: '#95a5a6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }
};

export default DAppMain;
