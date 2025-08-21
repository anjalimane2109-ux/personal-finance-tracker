import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access'); // remove JWT token
    alert('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>💸 Finance Tracker</h2>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/add" style={styles.link}>Add Transaction</Link>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    margin: 0,
  },
  links: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
  },
  logoutBtn: {
    backgroundColor: '#EF5350',
    border: 'none',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Navbar;
