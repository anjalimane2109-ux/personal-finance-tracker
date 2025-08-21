// C:\Users\HP\finance_tracker\finance-ui\src\components\SubscriptionTracker.js

import React from 'react';

const SubscriptionTracker = ({ subscriptions }) => {
    return (
        <div className="dashboard-card subscriptions-card">
            <h3>Subscriptions</h3>
            {subscriptions && subscriptions.length > 0 ? (
                <ul className="subscriptions-list">
                    {subscriptions.map(sub => (
                        <li key={sub.id} className="subscription-item">
                            <p>{sub.name}</p>
                            <p className="subscription-amount">${sub.amount}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">No subscriptions found.</p>
            )}
        </div>
    );
};

export default SubscriptionTracker;