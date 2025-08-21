import React from 'react';

const AddReminderForm = ({
    newReminderTitle,
    setNewReminderTitle,
    newReminderDescription,
    setNewReminderDescription,
    newReminderDate,
    setNewReminderDate,
    editingReminderId,
    handleAddReminder,
    handleUpdateReminder,
    setEditingReminderId
}) => {
    return (
        <div className="dashboard-card reminder-form-card">
            <h3>{editingReminderId ? 'Edit Reminder' : 'Add New Reminder'}</h3>
            <form 
                onSubmit={editingReminderId ? handleUpdateReminder : handleAddReminder}
                className="reminder-form"
            >
                <input
                    type="text"
                    placeholder="Title"
                    value={newReminderTitle}
                    onChange={(e) => setNewReminderTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description (Optional)"
                    value={newReminderDescription}
                    onChange={(e) => setNewReminderDescription(e.target.value)}
                />
                <input
                    type="date"
                    value={newReminderDate}
                    onChange={(e) => setNewReminderDate(e.target.value)}
                    required
                />
                <div className="reminder-form-buttons">
                    <button type="submit" className="add-transaction-button">
                        {editingReminderId ? 'Update' : 'Add'}
                    </button>
                    {editingReminderId && (
                        <button 
                            type="button" 
                            className="cancel-button" 
                            onClick={() => setEditingReminderId(null)}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddReminderForm;