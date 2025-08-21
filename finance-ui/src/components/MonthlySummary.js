import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const MonthlySummary = () => {
    const { authTokens } = useAuth();
    const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, net_balance: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!authTokens) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/monthly-summary/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + String(authTokens.access),
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch monthly summary.');
                }

                const data = await response.json();
                setSummary(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setSummary({ total_income: 0, total_expense: 0, net_balance: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [authTokens]);

    if (loading) return <p>Loading monthly summary...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div className="summary-container">
            <div className="summary-card income">
                <h4>Income</h4>
                <p>${summary.total_income.toFixed(2)}</p>
            </div>
            <div className="summary-card expense">
                <h4>Expenses</h4>
                <p>${summary.total_expense.toFixed(2)}</p>
            </div>
            <div className="summary-card balance">
                <h4>Net Balance</h4>
                <p>${summary.net_balance.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default MonthlySummary;