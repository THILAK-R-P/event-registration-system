import React from 'react';
import { Link } from 'react-router-dom';
import '../css/landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            <nav className="navbar">
                <div className="container nav-container">
                    <div className="nav-brand">
                        <Link to="/" className="nav-logo">EventSys</Link>
                    </div>
                    <div className="nav-menu">
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                        <Link to="/login" className="btn btn-primary">Login</Link>
                    </div>
                </div>
            </nav>

            <header className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1>Manage and Discover Events Seamlessly</h1>
                        <p>The ultimate platform to create, join, and track events with ease. Join our community today.</p>
                        <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
                    </div>
                    {/* Image hidden or centered below in CSS for centered layout request */}

                </div>
            </header>

            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <Link to="/create-event" className="feature-card">
                            <div className="feature-icon">✨</div>
                            <h3>Create Events</h3>
                            <p>Host your own events and manage attendees effortlessly.</p>
                        </Link>
                        <Link to="/dashboard" className="feature-card">
                            <div className="feature-icon">🔍</div>
                            <h3>Discover Events</h3>
                            <p>Find exciting events happening around you and join with one click.</p>
                        </Link>
                        <Link to="/myevents" className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Track Attendees</h3>
                            <p>Keep track of who is coming and manage your guest list.</p>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
