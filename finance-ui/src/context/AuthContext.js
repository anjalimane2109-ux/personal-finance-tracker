import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );

    const [user, setUser] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        if (storedTokens) {
            try {
                const token = JSON.parse(storedTokens).access;
                const decoded = jwtDecode(token);
                return { username: decoded.username, user_id: decoded.user_id };
            } catch (e) {
                console.error("Failed to decode token from localStorage", e);
                localStorage.removeItem('authTokens'); // Clear invalid tokens
                return null;
            }
        }
        return null;
    });

    const navigate = useNavigate();

    // This loginUser function does NOT take 'e' directly as a parameter
    // and does NOT call e.preventDefault()
    const loginUser = async ({ username, password }) => {
        try {
            const response = await fetch('http://localhost:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                setAuthTokens(data);
                const decodedToken = jwtDecode(data.access);
                setUser({ username: decodedToken.username, user_id: decodedToken.user_id });
                localStorage.setItem('authTokens', JSON.stringify(data));
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                alert(`Login failed: ${errorData.detail || 'Please check your credentials.'}`);
            }
        } catch (e) {
            console.error('Login request failed', e);
            alert('A network error occurred. Please try again.');
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/');
    };

    const updateToken = async () => {
        const storedTokens = JSON.parse(localStorage.getItem('authTokens'));
        if (!storedTokens || !storedTokens.refresh) {
            logoutUser();
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh: storedTokens.refresh })
            });

            if (response.ok) {
                const data = await response.json();
                const decodedToken = jwtDecode(data.access);
                setAuthTokens(data);
                setUser({ username: decodedToken.username, user_id: decodedToken.user_id });
                localStorage.setItem('authTokens', JSON.stringify(data));
            } else {
                logoutUser();
            }
        } catch (e) {
            console.error('Failed to refresh token', e);
            logoutUser();
        }
    };
    
    useEffect(() => {
        if (authTokens) {
            const interval = setInterval(() => {
                updateToken();
            }, 1000 * 60 * 4); 

            return () => clearInterval(interval);
        }
    }, [authTokens, updateToken]);


    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};