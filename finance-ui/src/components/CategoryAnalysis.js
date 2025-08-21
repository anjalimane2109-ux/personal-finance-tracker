// src/components/CategoryAnalysis.js
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css'; // Make sure this is imported

// Register the new chart components
Chart.register(ArcElement, Tooltip, Legend);

const CategoryAnalysis = () => {
    const { authTokens } = useAuth();
    const [chartData, setChartData] = useState({ datasets: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!authTokens) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/category-analysis/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + String(authTokens.access),
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch category analysis.');
                }

                const data = await response.json();

                if (data.length === 0) {
                    setChartData({ datasets: [] });
                    setLoading(false);
                    return;
                }
                
                const labels = data.map(item => item.category);
                const amounts = data.map(item => item.total_amount);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            data: amounts,
                            backgroundColor: [
                                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                            ],
                            hoverBackgroundColor: [
                                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                            ],
                        },
                    ],
                });
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [authTokens]);

    if (loading) return <p>Loading category analysis...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div className="chart-wrapper"> {/* NEW WRAPPER DIV */}
            <h2>Spending by Category</h2>
            {chartData.datasets.length > 0 ? (
                <div className="chart-container"> {/* NEW CONTAINER DIV */}
                    <Pie data={chartData} />
                </div>
            ) : (
                <p>No expense transactions to analyze.</p>
            )}
        </div>
    );
};

export default CategoryAnalysis;