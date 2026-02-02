import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <h2>Focus Community Center</h2>
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/facilities">Facilities</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {user.roles?.includes('STAFF') || user.roles?.includes('ADMIN') ? (
                <Link to="/staff">Staff Portal</Link>
              ) : null}
              {user.roles?.includes('ADMIN') ? (
                <Link to="/admin">Admin Panel</Link>
              ) : null}
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
