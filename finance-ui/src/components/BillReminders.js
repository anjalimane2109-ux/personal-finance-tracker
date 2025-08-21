// C:\Users\HP\finance_tracker\finance-ui\src\components\BillReminders.js

import React from 'react';

const BillReminders = ({ bills }) => {
    return (
        <div className="dashboard-card bills-card">
            <h3>Upcoming Bills</h3>
            {bills && bills.length > 0 ? (
                <ul className="bills-list">
                    {bills.map(bill => (
                        <li key={bill.id} className="bill-item">
                            <p>{bill.name}</p>
                            <p className="bill-due-date">{bill.due_date}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">No upcoming bills.</p>
            )}
        </div>
    );
};

export default BillReminders;