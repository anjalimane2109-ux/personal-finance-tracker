// src/components/home.js
import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import AddTransaction from './AddTransaction';
import { useAuth } from '../context/AuthContext'; // ✅ Corrected

import Navbar from './Navbar';

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const { user, logout, authTokens } = useAuth();  // ✅ Added authTokens

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!authTokens?.access) {
        console.warn("Authentication token missing.");
        return;
      }

      try {
        const res = await axios.get('/transactions/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        alert('Failed to load transactions');
      }
    };

    fetchTransactions();
  }, [authTokens]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/transactions/${id}/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setTransactions(transactions.filter((tx) => tx.id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      alert('Failed to delete transaction');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {user?.username || 'User'}!</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <AddTransaction onAdd={(newTx) => setTransactions([newTx, ...transactions])} />
      
      <h2>Your Transactions</h2>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul>
          {transactions.map((tx) => (
            <li key={tx.id}>
              <strong>{tx.title}</strong> - {tx.category} | ₹{tx.amount} | {tx.date}
              <button onClick={() => handleDelete(tx.id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
