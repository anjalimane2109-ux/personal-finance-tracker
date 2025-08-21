import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // CHANGED: useHistory is now useNavigate
import './Auth.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // CHANGED: Initialize useNavigate

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                alert('Sign up successful! Please log in.');
                navigate('/login'); // CHANGED: Use the navigate function
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Sign up failed.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignup}>
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
                    <button type="submit" className="auth-button">Sign Up</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;