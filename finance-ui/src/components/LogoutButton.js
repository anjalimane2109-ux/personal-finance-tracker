import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <button 
      onClick={handleLogout} 
      style={{
        padding: '8px 16px',
        backgroundColor: '#d9534f',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px'
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
