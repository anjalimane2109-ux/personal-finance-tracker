import React from 'react';
import './Dashboard.css';

const MissingExpensesCard = ({ reminders, onPreFill }) => {
    return (
        <div className="dashboard-card shopping-reminders-card">
            <h3>Missing Recurring Expenses</h3>
            {reminders && reminders.length > 0 ? (
                <ul className="reminders-list">
                    {reminders.map(reminder => (
                        <li key={reminder.id} className="reminder-item">
                            <p className="reminder-message">{reminder.message}</p>
                            <button
                                onClick={() => onPreFill(reminder.amount, reminder.category, reminder.title)}
                                className="add-from-reminder-button"
                            >
                                Add as Transaction
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">No missing expenses detected.</p>
            )}
        </div>
    );
};

export default MissingExpensesCard;