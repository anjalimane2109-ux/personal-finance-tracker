import React from 'react';

const AddTransactionForm = ({
    amount,
    setAmount,
    transactionType,
    setTransactionType,
    category,
    setCategory,
    title,
    setTitle,
    dueDate,
    setDueDate,
    handleAddTransaction,
}) => {
    return (
        <div className="dashboard-card transaction-form-card">
            <h3>Add New Transaction</h3>
            <form onSubmit={handleAddTransaction} className="transaction-form">
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    required
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
                <button type="submit" className="add-transaction-button">Add</button>
            </form>
        </div>
    );
};

export default AddTransactionForm;