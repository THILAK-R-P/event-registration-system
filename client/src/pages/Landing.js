import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role'); // Good practice to clear role as well
        navigate('/');
    };

    return (
        <div className="landing-page">
            <nav className="navbar">
                <div className="container nav-container">
                    <div className="nav-brand">
                        <Link to="/" className="nav-logo">EventSys</Link>
                    </div>
                    <div className="nav-menu">
                        {token ? (
                            <>
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                <Link to="/myevents" className="nav-link">My Events</Link>
                                <button onClick={handleLogout} className="btn btn-danger" style={{ border: 'none', background: 'transparent', color: 'var(--navbar-text)', fontSize: '0.95rem', fontWeight: '500' }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="nav-link">Register</Link>
                                <Link to="/login" className="btn btn-primary">Login</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <header className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1>Manage and Discover Events Seamlessly</h1>
                        <p>The ultimate platform to create, join, and track events with ease. Join our community today.</p>
                        {token ? (
                            <Link to="/dashboard" className="btn btn-primary btn-lg">Explore</Link>
                        ) : (
                            <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
                        )}
                    </div>


                </div>
            </header>


        </div>
    );
};

export default Landing;
