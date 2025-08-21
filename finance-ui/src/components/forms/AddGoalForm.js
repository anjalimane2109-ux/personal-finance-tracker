import React from 'react';

const AddGoalForm = ({
    newGoalName,
    setNewGoalName,
    newGoalTargetAmount,
    setNewGoalTargetAmount,
    newGoalSavedAmount,
    setNewGoalSavedAmount,
    newGoalEndDate,
    setNewGoalEndDate,
    handleAddGoal
}) => {
    return (
        <div className="dashboard-card goal-form-card">
            <h3>Add New Goal</h3>
            <form onSubmit={handleAddGoal} className="transaction-form">
                <input
                    type="text"
                    placeholder="Goal Name"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Target Amount"
                    value={newGoalTargetAmount}
                    onChange={(e) => setNewGoalTargetAmount(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Saved Amount (Optional)"
                    value={newGoalSavedAmount}
                    onChange={(e) => setNewGoalSavedAmount(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="End Date"
                    value={newGoalEndDate}
                    onChange={(e) => setNewGoalEndDate(e.target.value)}
                    required
                />
                <button type="submit" className="add-transaction-button">Add Goal</button>
            </form>
        </div>
    );
};

export default AddGoalForm;