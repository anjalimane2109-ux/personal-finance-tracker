import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const HistoricalTrendsChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>Not enough data to display historical trends.</p>;
    }

    const chartData = {
        labels: data.map(item => item.month),
        datasets: [
            {
                label: 'Total Income',
                data: data.map(item => item.income),
                borderColor: 'rgba(76, 175, 80, 1)', // Green
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                tension: 0.4,
                fill: false,
            },
            {
                label: 'Total Expense',
                data: data.map(item => item.expense),
                borderColor: 'rgba(244, 67, 54, 1)', // Red
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                tension: 0.4,
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Income vs Expense',
                color: '#2c3e50',
                font: {
                    size: 16
                }
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount ($)'
                },
                beginAtZero: true
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default HistoricalTrendsChart;