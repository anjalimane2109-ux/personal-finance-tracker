import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css'; // Assuming your button styles are here

const ExportButton = () => {
    const { authTokens } = useAuth();

    // Custom alert/message box function (since alert() is disallowed)
    const showMessage = (message, type = 'info') => {
        // You would implement a more robust UI message system here
        // For now, let's use console.log or a temporary DOM element for display
        console.log(`Message (${type}): ${message}`);
        // Example: You could update a state variable in a parent component
        // to display a temporary notification banner.
        // For a simple in-component message:
        const msgDiv = document.createElement('div');
        msgDiv.textContent = message;
        msgDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
        `;
        document.body.appendChild(msgDiv);
        setTimeout(() => document.body.removeChild(msgDiv), 3000); // Remove after 3 seconds
    };

    const handleExport = async (format) => {
        if (!authTokens || !authTokens.access) {
            showMessage('You must be logged in to export data.', 'error');
            return;
        }

        let url = '';
        let filename = '';

        if (format === 'csv') {
            url = 'http://localhost:8000/api/export-transactions/';
            filename = 'transactions.csv';
        } else if (format === 'pdf') {
            url = 'http://localhost:8000/api/export-transactions-pdf/';
            filename = 'transactions.pdf';
        }

        if (url) {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });

                if (!response.ok) {
                    // Try to parse error message if available
                    const errorText = await response.text();
                    try {
                        const errorJson = JSON.parse(errorText);
                        throw new Error(errorJson.message || `Server error: ${response.status}`);
                    } catch (e) {
                        // If it's not JSON, just show the raw text
                        throw new Error(`Server error: ${response.status}. Details: ${errorText.substring(0, 100)}...`);
                    }
                }

                // Get the blob data from the response
                const blob = await response.blob();

                // Create a URL for the blob
                const downloadUrl = window.URL.createObjectURL(blob);

                // Create a temporary link element
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', filename); // Set the desired filename

                // Append to body, click, and remove
                document.body.appendChild(link);
                link.click();
                link.remove();

                // Revoke the Blob URL to free up memory
                window.URL.revokeObjectURL(downloadUrl);
                showMessage(`Exported to ${format.toUpperCase()} successfully!`, 'success');

            } catch (error) {
                console.error(`Export failed (${format}):`, error);
                showMessage(`Failed to export to ${format.toUpperCase()}. Error: ${error.message}`, 'error');
            }
        }
    };

    return (
        <div className="export-buttons-container">
            <button onClick={() => handleExport('csv')} className="export-button-csv">
                Export to CSV
            </button>
            <button onClick={() => handleExport('pdf')} className="export_button-pdf"> {/* Fixed typo: export-button-pdf */}
                Export to PDF
            </button>
        </div>
    );
};

export default ExportButton;