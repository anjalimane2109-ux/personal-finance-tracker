import React from 'react';
import { Box, Card, CardContent, Typography, Alert, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Reminders = ({ missingExpenses, personalReminders, savingSuggestions, onPreFillTransaction, onMarkAsComplete, onEdit, onDelete }) => {
    
    const allReminders = [
        ...missingExpenses.map(r => ({ ...r, type: 'missing-expense' })),
        ...savingSuggestions.map(r => ({ ...r, type: 'saving-suggestion' })),
        ...personalReminders.filter(r => !r.is_completed).map(r => ({ ...r, type: 'personal' }))
    ];

    if (allReminders.length === 0) {
        return (
            <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
                <Alert severity="info" style={{ width: '100%' }}>You're all caught up! No reminders or suggestions for now.</Alert>
            </div>
        );
    }

    return (
        <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Financial Reminders & Insights</h3>
            {allReminders.map((reminder, index) => (
                <Card key={index} sx={{ mb: 1, bgcolor: '#f5f5f5' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="subtitle1" component="div">
                                    {reminder.title || (reminder.type === 'missing-expense' ? 'Missing Expense' : 'Saving Suggestion')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {reminder.message}
                                </Typography>
                                {reminder.type === 'personal' && reminder.description && (
                                    <Typography variant="caption" color="text.secondary">
                                        Notes: {reminder.description}
                                    </Typography>
                                )}
                            </Box>
                            <Box>
                                {reminder.type === 'missing-expense' && (
                                    <IconButton
                                        color="primary"
                                        aria-label="add transaction"
                                        onClick={() => onPreFillTransaction(reminder.amount, reminder.category, reminder.title)}
                                    >
                                        <AddCircleOutlineIcon />
                                    </IconButton>
                                )}
                                {reminder.type === 'personal' && (
                                    <>
                                        <IconButton
                                            color="primary"
                                            aria-label="edit reminder"
                                            onClick={() => onEdit(reminder)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            aria-label="delete reminder"
                                            onClick={() => onDelete(reminder.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton
                                            color="success"
                                            aria-label="mark as complete"
                                            onClick={() => onMarkAsComplete(reminder.id)}
                                        >
                                            <CheckCircleOutlineIcon />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default Reminders;