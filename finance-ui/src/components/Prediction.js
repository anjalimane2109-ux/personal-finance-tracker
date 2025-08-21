import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Prediction = () => {
    const { authTokens } = useAuth();
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrediction = async () => {
            if (!authTokens) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/predict-expense/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + String(authTokens.access),
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch prediction');
                }

                setPrediction(data.prediction);
                setError(null);

            } catch (err) {
                setError(err.message);
                setPrediction(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPrediction();
    }, [authTokens]);

    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h3>Next Month's Predicted Expense</h3>
            {loading ? (
                <p>Calculating prediction...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : prediction !== null ? (
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    ${prediction}
                </p>
            ) : (
                <p>Not enough data to make a prediction.</p>
            )}
        </div>
    );
};

export default Prediction;