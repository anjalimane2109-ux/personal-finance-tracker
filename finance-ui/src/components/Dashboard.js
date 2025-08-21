import React, { useState, useEffect, useCallback } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

import './Dashboard.css';
import SubscriptionTracker from './SubscriptionTracker'; 
import GoalTracker from './GoalTracker'; 
import BillReminders from './BillReminders'; 
import ShoppingReminders from './ShoppingReminders'; 
import Reminders from './Reminders';

import AddTransactionForm from './forms/AddTransactionForm';
import AddReminderForm from './forms/AddReminderForm';
import AddSubscriptionForm from './forms/AddSubscriptionForm';
import AddGoalForm from './forms/AddGoalForm';
import AddBillForm from './forms/AddBillForm';
import Prediction from './Prediction'; 
import ExportButton from './ExportButton'; 

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Removed isAuthenticated prop, now uses useAuth() directly
const Dashboard = () => {
    const { authTokens, user, logoutUser } = useAuth(); // Get user and authTokens from context
    
    const [transactions, setTransactions] = useState([]);
    const [monthlySummary, setMonthlySummary] = useState(null);
    const [categoryAnalysis, setCategoryAnalysis] = useState(null);
    const [smartInsights, setSmartInsights] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [bills, setBills] = useState([]);
    const [shoppingReminders, setShoppingReminders] = useState([]); 

    const [missingExpenses, setMissingExpenses] = useState([]);
    const [personalReminders, setPersonalReminders] = useState([]);
    const [savingSuggestions, setSavingSuggestions] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for Transaction form
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('expense');
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState(''); // This should be YYYY-MM-DD from input[type="date"]

    // State for Personal Reminder form
    const [newReminderTitle, setNewReminderTitle] = useState('');
    const [newReminderDescription, setNewReminderDescription] = useState('');
    const [newReminderDate, setNewReminderDate] = useState(''); // This should be YYYY-MM-DD
    const [editingReminderId, setEditingReminderId] = useState(null);
    
    // State for Subscription form
    const [newSubscriptionName, setNewSubscriptionName] = useState('');
    const [newSubscriptionAmount, setNewSubscriptionAmount] = useState('');
    const [newSubscriptionBillingDate, setNewSubscriptionBillingDate] = useState(''); // This should be YYYY-MM-DD
    const [newSubscriptionCategory, setNewSubscriptionCategory] = useState('Subscriptions'); 
    
    // State for Goal form
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTargetAmount, setNewGoalTargetAmount] = useState('');
    const [newGoalSavedAmount, setNewGoalSavedAmount] = useState('');
    const [newGoalEndDate, setNewGoalEndDate] = useState(''); // This should be YYYY-MM-DD
    
    // State for Bill form
    const [newBillName, setNewBillName] = useState('');
    const [newBillAmount, setNewBillAmount] = useState('');
    const [newBillDueDate, setNewBillDueDate] = useState(''); // This should be YYYY-MM-DD
    
    // Moved fetchAllDashboardData into useCallback and updated dependencies
    const fetchAllDashboardData = useCallback(async () => {
        try {
            setLoading(true);

            // Check for authentication token before making API calls
            if (!authTokens || !authTokens.access) {
                console.error("Authentication token not found. User might not be logged in or token expired.");
                setLoading(false);
                setError("Please log in to view your dashboard.");
                return; // Exit if no valid token
            }

            const urls = [
                'http://localhost:8000/api/transactions/',
                'http://localhost:8000/api/monthly-summary/',
                'http://localhost:8000/api/category-analysis/',
                'http://localhost:8000/api/smart-insights/',
                'http://localhost:8000/api/subscriptions/',
                'http://localhost:8000/api/goals/',
                'http://localhost:8000/api/bills/',
                'http://localhost:8000/api/smart-shopping-reminders/',
                'http://localhost:8000/api/missing-expenses/',
                'http://localhost:8000/api/reminders/',
                'http://localhost:8000/api/saving-suggestion/',
            ];

            const token = authTokens.access;
            const headers = { 'Authorization': `Bearer ${token}` };

            const fetchPromises = urls.map(url =>
                fetch(url, { headers })
                    .then(response => {
                        if (response.status === 401) {
                            // If 401, token is invalid/expired. Log out the user via context.
                            logoutUser(); // Call logoutUser from context
                            throw new Error('Unauthorized'); // Propagate error to catch block
                        }
                        if (!response.ok) {
                            const contentType = response.headers.get("content-type");
                            if (contentType && contentType.indexOf("application/json") !== -1) {
                                return response.json().then(errorData => {
                                    throw new Error(JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
                                });
                            } else {
                                return response.text().then(text => {
                                    throw new Error(`Server returned non-JSON response (Status: ${response.status}). Response text: ${text.substring(0, 100)}...`);
                                });
                            }
                        }
                        return response.json();
                    })
            );

            const [
                transactionsResult,
                monthlySummaryResult,
                categoryAnalysisResult,
                smartInsightsResult,
                subscriptionsResult,
                goalsResult,
                billsResult,
                shoppingRemindersResult,
                missingExpensesResult,
                personalRemindersResult,
                savingSuggestionsResult,
            ] = await Promise.all(fetchPromises);

            setTransactions(transactionsResult || []);
            setSubscriptions(subscriptionsResult || []);
            setGoals(goalsResult || []);
            setBills(billsResult || []);
            setShoppingReminders(shoppingRemindersResult || []);
            
            setMonthlySummary(monthlySummaryResult || null);
            setCategoryAnalysis(categoryAnalysisResult || null);
            setSmartInsights(smartInsightsResult || null);
            
            setMissingExpenses(missingExpensesResult || []);
            setPersonalReminders(personalRemindersResult || []);
            setSavingSuggestions(savingSuggestionsResult || []);
            
            setError(null);
        } catch (err) {
            console.error("Fetch error:", err);
            // Only set error message if it's not the 'Unauthorized' one handled by logoutUser
            if (err.message !== 'Unauthorized') {
                setError(`Failed to fetch dashboard data. Details: ${err.message}`);
            }
            setMonthlySummary(null);
            setCategoryAnalysis(null);
            setSmartInsights(null);
            setTransactions([]);
            setSubscriptions([]);
            setGoals([]);
            setBills([]);
            setShoppingReminders([]);
            setMissingExpenses([]);
            setPersonalReminders([]);
            setSavingSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, [authTokens, logoutUser]); // authTokens and logoutUser are dependencies

    useEffect(() => {
        // Only fetch data if user is actually authenticated
        if (user) {
            fetchAllDashboardData();
        } else {
            // If user is null (not authenticated), set loading to false and show message
            setLoading(false);
            setError("Please log in to view your dashboard.");
        }
    }, [user, fetchAllDashboardData]); // Depend on user and fetchAllDashboardData

    // Helper function to format date to YYYY-MM-DD (remains the same)
    const formatDateToYYYYMMDD = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ''; // Check if date is valid
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // All handleAdd/Update/Delete functions below will also need to be updated to use authTokens.access
    // I will include one example (handleAddTransaction) and assume similar updates for others.
    // However, for this turn, the crucial part is getting the dashboard to render at all.

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        const url = 'http://localhost:8000/api/transactions/';
        
        if (!authTokens || !authTokens.access) {
            setError('Authentication token not found. Please log in.');
            return;
        }

        const token = authTokens.access;
        const newTransaction = {
            title: title,
            amount: parseFloat(amount),
            transaction_type: transactionType,
            category: category,
            date: dueDate, 
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTransaction)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add transaction');
            }
            
            setAmount('');
            setTransactionType('expense');
            setCategory('');
            setTitle('');
            setDueDate('');
            
            fetchAllDashboardData(); 
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePreFillTransaction = (amount, category, description) => {
        setAmount(amount);
        setTransactionType('expense');
        setCategory(category);
        setTitle(description);
        window.scrollTo({
            top: document.querySelector('.transaction-form-card').offsetTop,
            behavior: 'smooth'
        });
    };
    
    const handleMarkReminderAsComplete = async (reminderId) => {
        if (!authTokens || !authTokens.access) {
            setError('Authentication token not found. Please log in.');
            return;
        }
        
        const url = `http://localhost:8000/api/reminders/${reminderId}/`;
        const token = authTokens.access;

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ is_completed: true })
            });

            if (!response.ok) {
                throw new Error('Failed to mark reminder as complete');
            }
            
            fetchAllDashboardData();
        } catch (err) {
            console.error("Error marking reminder as complete:", err);
            setError('Failed to mark reminder as complete.');
        }
    };

    const handleAddReminder = async (e) => {
        e.preventDefault();
        const url = 'http://localhost:8000/api/reminders/';
        
        if (!authTokens || !authTokens.access) {
            setError('Authentication token not found. Please log in.');
            return;
        }
    
        const newReminder = {
            title: newReminderTitle,
            due_date: newReminderDate, // Assuming YYYY-MM-DD
        };
    
        if (newReminderDescription) {
            newReminder.description = newReminderDescription;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`
                },
                body: JSON.stringify(newReminder)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData) || 'Failed to add reminder');
            }
    
            setNewReminderTitle('');
            setNewReminderDescription('');
            setNewReminderDate('');
    
            fetchAllDashboardData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditReminder = (reminder) => {
        setEditingReminderId(reminder.id);
        setNewReminderTitle(reminder.title);
        setNewReminderDescription(reminder.description || '');
        setNewReminderDate(reminder.due_date); 
        window.scrollTo({
            top: document.querySelector('.reminder-form-card').offsetTop,
            behavior: 'smooth'
        });
    };

    const handleUpdateReminder = async (e) => {
        e.preventDefault();
        if (!editingReminderId) return;

        const url = `http://localhost:8000/api/reminders/${editingReminderId}/`;
        const updatedReminder = {
            title: newReminderTitle,
            due_date: newReminderDate, // Assuming YYYY-MM-DD
        };
        
        if (newReminderDescription) {
            updatedReminder.description = newReminderDescription;
        }

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`
                },
                body: JSON.stringify(updatedReminder)
            });

            if (!response.ok) {
                throw new Error('Failed to update reminder');
            }

            setEditingReminderId(null);
            setNewReminderTitle('');
            setNewReminderDescription('');
            setNewReminderDate('');
            fetchAllDashboardData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteReminder = async (reminderId) => {
        if (!window.confirm("Are you sure you want to delete this reminder?")) {
            return;
        }

        const url = `http://localhost:8000/api/reminders/${reminderId}/`;
        
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete reminder');
            }

            fetchAllDashboardData();
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleAddSubscription = async (e) => {
        e.preventDefault();
        const url = 'http://localhost:8000/api/subscriptions/';
        
        if (!authTokens || !authTokens.access) {
            setError('Authentication token not found. Please log in.');
            return;
        }
        
        if (!newSubscriptionName || !newSubscriptionAmount || !newSubscriptionBillingDate || !newSubscriptionCategory) {
            setError('Please fill in all subscription fields.');
            return;
        }
        
        const formattedDueDate = formatDateToYYYYMMDD(newSubscriptionBillingDate);
        if (!formattedDueDate) {
            setError('Invalid billing date. Please select a valid date.');
            return;
        }

        const newSubscription = {
            title: newSubscriptionName,
            amount: parseFloat(newSubscriptionAmount),
            category: newSubscriptionCategory, 
            due_date: formattedDueDate, 
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`
                },
                body: JSON.stringify(newSubscription)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData) || 'Failed to add subscription');
            }
            
            setNewSubscriptionName('');
            setNewSubscriptionAmount('');
            setNewSubscriptionBillingDate('');
            setNewSubscriptionCategory('Subscriptions'); 
            setError(null);
            
            fetchAllDashboardData(); 
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleAddGoal = async (e) => {
        e.preventDefault();
        const url = 'http://localhost:8000/api/goals/';
        
        if (!authTokens || !authTokens.access) {
            setError('Authentication token not found. Please log in.');
            return;
        }

        const formattedEndDate = formatDateToYYYYMMDD(newGoalEndDate);
        if (!formattedEndDate) {
            setError('Invalid end date. Please select a valid date.');
            return;
        }


        const newGoal = {
            name: newGoalName,
            target_amount: parseFloat(newGoalTargetAmount),
            saved_amount: parseFloat(newGoalSavedAmount) || 0,
            end_date: formattedEndDate, 
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`
                },
                body: JSON.stringify(newGoal)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData) || 'Failed to add goal');
            }
            
            setNewGoalName('');
            setNewGoalTargetAmount('');
            setNewGoalSavedAmount('');
            setNewGoalEndDate('');
            
            fetchAllDashboardData(); 
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleAddBill = async (e) => {
        e.preventDefault();
        const url = 'http://localhost:8000/api/bills/';
        
        if (!authTokens || !authTokens.access) {
            setError('Authentication token not found. Please log in.');
            return;
        }
        
        if (!newBillName || !newBillAmount || !newBillDueDate) {
            setError('Please fill in all bill fields.');
            return;
        }

        const formattedDueDate = formatDateToYYYYMMDD(newBillDueDate);
        if (!formattedDueDate) {
            setError('Invalid due date. Please select a valid date.');
            return;
        }


        const newBill = {
            title: newBillName, 
            amount: parseFloat(newBillAmount),
            due_date: formattedDueDate, 
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`
                },
                body: JSON.stringify(newBill)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData) || 'Failed to add bill');
            }
            
            setNewBillName('');
            setNewBillAmount('');
            setNewBillDueDate('');
            
            fetchAllDashboardData(); 
        } catch (err) {
            setError(err.message);
        }
    };

    // Render loading or error message first
    if (loading) {
        return <div className="loading-message">Loading dashboard...</div>;
    }

    // Only show "Please log in" if there's no user and not currently loading.
    if (!user && !loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-700">{error || "Please log in to view your dashboard."}</p>
            </div>
        );
    }
    
    // If we reach here, it means loading is false and user is NOT null
    // So we can safely render the full dashboard
    const monthlySummaryData = {
        labels: monthlySummary ? monthlySummary.labels : [],
        datasets: [
            {
                label: 'Income',
                data: monthlySummary ? monthlySummary.income : [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.1,
            },
            {
                label: 'Expenses',
                data: monthlySummary ? monthlySummary.expense : [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.1,
            },
        ],
    };

    const categoryLabels = categoryAnalysis ? Object.keys(categoryAnalysis) : [];
    const categoryData = categoryAnalysis ? Object.values(categoryAnalysis) : [];

    const categoryAnalysisData = {
        labels: categoryLabels,
        datasets: [
            {
                data: categoryData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(199, 199, 199, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome to Your Dashboard</h1>
                <button onClick={logoutUser} className="logout-button">Logout</button>
            </header>

            <div className="dashboard-grid">
                <Prediction /> 
                <ExportButton /> 

                <Reminders 
                    missingExpenses={missingExpenses}
                    personalReminders={personalReminders}
                    savingSuggestions={savingSuggestions}
                    onPreFillTransaction={handlePreFillTransaction}
                    onMarkAsComplete={handleMarkReminderAsComplete}
                    onEdit={handleEditReminder} 
                    onDelete={handleDeleteReminder} 
                />
            
                <AddTransactionForm 
                    amount={amount}
                    setAmount={setAmount}
                    transactionType={transactionType}
                    setTransactionType={setTransactionType}
                    category={category}
                    setCategory={setCategory}
                    title={title}
                    setTitle={setTitle}
                    dueDate={dueDate}
                    setDueDate={setDueDate}
                    handleAddTransaction={handleAddTransaction}
                />
                
                <AddReminderForm 
                    newReminderTitle={newReminderTitle}
                    setNewReminderTitle={setNewReminderTitle}
                    newReminderDescription={newReminderDescription}
                    setNewReminderDescription={setNewReminderDescription}
                    newReminderDate={newReminderDate}
                    setNewReminderDate={setNewReminderDate}
                    editingReminderId={editingReminderId}
                    handleAddReminder={handleAddReminder}
                    handleUpdateReminder={handleUpdateReminder}
                    setEditingReminderId={setEditingReminderId}
                />
                
                <AddSubscriptionForm 
                    newSubscriptionName={newSubscriptionName}
                    setNewSubscriptionName={setNewSubscriptionName}
                    newSubscriptionAmount={newSubscriptionAmount}
                    setNewSubscriptionAmount={setNewSubscriptionAmount}
                    newSubscriptionBillingDate={newSubscriptionBillingDate}
                    setNewSubscriptionBillingDate={setNewSubscriptionBillingDate}
                    newSubscriptionCategory={newSubscriptionCategory} 
                    setNewSubscriptionCategory={setNewSubscriptionCategory} 
                    handleAddSubscription={handleAddSubscription}
                />

                <AddBillForm
                    newBillName={newBillName}
                    setNewBillName={setNewBillName}
                    newBillAmount={newBillAmount}
                    setNewBillAmount={setNewBillAmount}
                    newBillDueDate={newBillDueDate}
                    setNewBillDueDate={newBillDueDate}
                    handleAddBill={handleAddBill}
                />

                <AddGoalForm
                    newGoalName={newGoalName}
                    setNewGoalName={setNewGoalName}
                    newGoalTargetAmount={newGoalTargetAmount}
                    setNewGoalTargetAmount={setNewGoalTargetAmount}
                    newGoalSavedAmount={newGoalSavedAmount}
                    setNewGoalSavedAmount={setNewGoalSavedAmount}
                    newGoalEndDate={newGoalEndDate}
                    setNewGoalEndDate={setNewGoalEndDate}
                    handleAddGoal={handleAddGoal}
                />

                {shoppingReminders.length > 0 && (
                    <ShoppingReminders 
                        reminders={shoppingReminders} 
                        onPreFill={handlePreFillTransaction}
                    />
                )}
                
                <div className="dashboard-card transaction-list-card">
                    <h3>Your Transactions</h3>
                    {transactions.length > 0 ? (
                        <ul className="transactions-list">
                            {transactions.map(transaction => (
                                <li key={transaction.id} className="transaction-item">
                                    <div className="transaction-details">
                                        <p className="text-muted">{transaction.date}</p>
                                        <p className="transaction-title">{transaction.title}</p>
                                        <p className="text-muted">Category: {transaction.category}</p>
                                    </div>
                                    <div className={`transaction-amount ${transaction.transaction_type}`}>
                                        {transaction.transaction_type === 'expense' ? '-' : '+'}${transaction.amount}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">No transactions found.</p>
                    )}
                </div>

                <div className="dashboard-card chart-section">
                    <div className="chart-item">
                        <h3>Monthly Summary</h3>
                        <div className="chart-container">
                            <Line data={monthlySummaryData} />
                        </div>
                    </div>
                    <div className="chart-item">
                        <h3>Spending by Category</h3>
                        <div className="chart-container">
                            <Pie data={categoryAnalysisData} />
                        </div>
                    </div>
                </div>

                <div className="dashboard-card subscriptions-goals-card">
                    <SubscriptionTracker subscriptions={subscriptions} />
                    <GoalTracker goals={goals} />
                </div>

                <div className="dashboard-card bill-reminders-card">
                    <BillReminders bills={bills} />
                </div>
                
            </div>
        </div>
    );
};

export default Dashboard;