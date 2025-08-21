// C:\Users\HP\finance_tracker\finance-ui\src\components\ShoppingReminders.js

import React from 'react';

const ShoppingReminders = ({ reminders, onPreFill }) => {
    return (
        <div className="dashboard-card shopping-reminders-card">
            <h3 className="reminders-title">
                <span className="reminder-icon">🛒</span>
                Smart Shopping Reminders
            </h3>
            {reminders && reminders.length > 0 ? (
                <ul className="reminders-list">
                    {reminders.map((reminder, index) => (
                        <li key={index} className="reminder-item">
                            <div className="reminder-message">
                                <p>{reminder.message}</p>
                                <p className="text-muted">
                                    Suggested amount: **${parseFloat(reminder.suggested_amount).toFixed(2)}**
                                </p>
                            </div>
                            <button 
                                className="add-reminder-button"
                                onClick={() => onPreFill(reminder.suggested_amount, reminder.category, reminder.message)}
                            >
                                Add as Transaction
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">No potential missing expenses found.</p>
            )}
        </div>
    );
};

export default ShoppingReminders;