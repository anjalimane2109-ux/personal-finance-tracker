// C:\Users\HP\finance_tracker\finance-ui\src\components\GoalTracker.js

import React from 'react';

const GoalTracker = ({ goals }) => {
    return (
        <div className="dashboard-card goals-card">
            <h3>Savings Goals</h3>
            {goals && goals.length > 0 ? (
                <ul className="goals-list">
                    {goals.map(goal => (
                        <li key={goal.id} className="goal-item">
                            <p>{goal.name}</p>
                            <p className="goal-progress">${goal.current_amount} / ${goal.target_amount}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">No goals set. Add a new goal to start tracking!</p>
            )}
        </div>
    );
};

export default GoalTracker;