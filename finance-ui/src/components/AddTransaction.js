// src/components/AddTransaction.js
import React, { useState } from 'react';
import axios from '../services/api';
import { useAuth } from '../context/AuthContext'; // ✅ Use auth context

const AddTransaction = ({ onAdd }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  const [date, setDate] = useState('');
  const { authTokens } = useAuth(); // ✅ Access token from context

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authTokens?.access) {
      alert('Please login first.');
      return;
    }

    try {
      const res = await axios.post(
        '/transactions/',
        {
          amount,
          category,
          transaction_type: transactionType,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      alert('Transaction added successfully');

      // ✅ Clear inputs
      setAmount('');
      setCategory('');
      setTransactionType('expense');
      setDate('');

      // ✅ Update transaction list in parent
      if (onAdd) onAdd(res.data);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount: </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category: </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Type: </label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label>Date: </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          Add
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
