import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const BASE_URL = 'https://personal-finance-tracker-ku87.onrender.com';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (!username || !password) {
            alert('Please enter username and password.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            let data = {};
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            }

            if (response.ok) {
                alert('Sign up successful! Please log in.');
                navigate('/login');
            } else {
                alert(data.error || `Sign up failed (${response.status}). Please try again.`);
            }
        } catch (error) {
            console.error('Signup error:', error.message);
            alert(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Sign Up</h2>
                <form method="POST">
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
                    <button
                        type="button"
                        className="auth-button"
                        onClick={handleSignup}
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                    <p style={{ marginTop: '10px' }}>
                        Already have an account?
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        style={{
                            marginTop: '10px',
                            padding: '10px',
                            width: '100%',
                            cursor: 'pointer',
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;