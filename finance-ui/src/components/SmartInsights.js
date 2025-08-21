import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const SmartInsights = () => {
    const { authTokens } = useAuth();
    const [insights, setInsights] = useState({ saving_tip: null, anomalies: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInsights = async () => {
            if (!authTokens) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/smart-insights/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + String(authTokens.access),
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch smart insights');
                }

                setInsights(data);
                setError(null);

            } catch (err) {
                setError(err.message);
                setInsights({ saving_tip: null, anomalies: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [authTokens]);

    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h3>Smart Insights</h3>
            {loading ? (
                <p>Generating insights...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : (
                <div>
                    {insights.saving_tip ? (
                        <p style={{ color: 'green', fontWeight: 'bold' }}>{insights.saving_tip}</p>
                    ) : (
                        <p>No new saving tips for this month.</p>
                    )}
                    
                    {insights.anomalies.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                            <h4>Unusual Spending Detected!</h4>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {insights.anomalies.map(anomaly => (
                                    <li key={anomaly.id} style={{ borderLeft: '3px solid red', paddingLeft: '10px', margin: '5px 0' }}>
                                        <span style={{ fontWeight: 'bold' }}>{anomaly.title}:</span> ${anomaly.amount}
                                        <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>{anomaly.message}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {insights.anomalies.length === 0 && insights.saving_tip === null && (
                        <p>{insights.message || "No insights to display yet. Add more transactions!"}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SmartInsights;