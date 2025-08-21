import React from 'react';

const AddSubscriptionForm = ({
    newSubscriptionName,
    setNewSubscriptionName,
    newSubscriptionAmount,
    setNewSubscriptionAmount,
    newSubscriptionBillingDate,
    setNewSubscriptionBillingDate,
    handleAddSubscription
}) => {
    return (
        <div className="dashboard-card subscription-form-card">
            <h3>Add New Subscription</h3>
            <form onSubmit={handleAddSubscription} className="transaction-form">
                <input
                    type="text"
                    placeholder="Subscription Name"
                    value={newSubscriptionName}
                    onChange={(e) => setNewSubscriptionName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={newSubscriptionAmount}
                    onChange={(e) => setNewSubscriptionAmount(e.target.value)}
                    required
                />
                <input
                    type="date"
                    placeholder="Billing Date"
                    value={newSubscriptionBillingDate}
                    onChange={(e) => setNewSubscriptionBillingDate(e.target.value)}
                    required
                />
                <button type="submit" className="add-transaction-button">Add Subscription</button>
            </form>
        </div>
    );
};

export default AddSubscriptionForm;