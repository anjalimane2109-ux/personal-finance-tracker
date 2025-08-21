import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault(); // This is correctly here

        // Add a check to ensure fields are not empty
        if (!username || !password) {
            alert('Please enter a username and password.');
            return;
        }

        // The loginUser function is in AuthContext.js
        // It handles sending the request to the /api/token/ endpoint
        loginUser({ username, password }); // Correctly passing an object
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="auth-form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter Username"
                            required
                        />
                    </div>
                    <div className="auth-form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;