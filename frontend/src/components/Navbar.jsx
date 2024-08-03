import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Search</Link>
      <div className="auth-links">
        {isAuthenticated ? (
          <>
            <Link to="/favorites" className="btn-primary">Favorites</Link>
            <Link to="/history" className="btn-primary">History</Link>
            <button className="btn-secondary" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
