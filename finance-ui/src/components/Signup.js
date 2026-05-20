import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const BASE_URL = 'https://personal-finance-tracker-ku87.onrender.com';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/signup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            // ✅ FIX 1: Safely parse JSON — avoid crash if server returns HTML
            let data = {};
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                // ✅ FIX 2: Show the actual HTTP status to help debug
                alert(`Server error (${response.status}): Endpoint not found. Check your backend route.`);
                return;
            }

            if (response.ok) {
                alert('Sign up successful! Please log in.');
                navigate('/login');
            } else {
                alert(data.error || `Sign up failed (${response.status}). Please try again.`);
            }
        } catch (error) {
            // ✅ FIX 3: Log the real error message for debugging
            console.error('Signup error:', error.message);
            alert(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // ... rest of JSX stays the same

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
                    <button
                        type="submit"
                        className="auth-button"
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