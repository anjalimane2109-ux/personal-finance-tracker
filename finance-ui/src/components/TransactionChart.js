import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No expense data to display chart.</p>;
    }

    const chartData = {
        labels: data.map(item => item.category),
        datasets: [
            {
                label: 'Expenses by Category',
                // FIX: Changed 'total_expense' to 'total_amount' to match the Django API response
                data: data.map(item => parseFloat(item.total_amount)), 
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Expenses by Category',
                color: '#2c3e50',
                font: {
                    size: 16
                }
            },
        },
    };

    return <Pie data={chartData} options={options} />;
};

export default TransactionChart;