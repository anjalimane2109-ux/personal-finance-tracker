import React from 'react';

const AddBillForm = ({
    newBillName,
    setNewBillName,
    newBillAmount,
    setNewBillAmount,
    newBillDueDate,
    setNewBillDueDate,
    handleAddBill
}) => {
    return (
        <div className="dashboard-card bill-form-card">
            <h3>Add New Bill</h3>
            <form onSubmit={handleAddBill} className="transaction-form">
                <input
                    type="text"
                    placeholder="Bill Name"
                    value={newBillName}
                    onChange={(e) => setNewBillName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={newBillAmount}
                    onChange={(e) => setNewBillAmount(e.target.value)}
                    required
                />
                <input
                    type="date"
                    placeholder="Due Date"
                    value={newBillDueDate}
                    onChange={(e) => setNewBillDueDate(e.target.value)}
                    required
                />
                <button type="submit" className="add-transaction-button">Add Bill</button>
            </form>
        </div>
    );
};

export default AddBillForm;