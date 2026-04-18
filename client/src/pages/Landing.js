import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';
import '../css/landing.css';

const Landing = () => {
    const userRole = localStorage.getItem('role') || 'user';

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const isLoggedIn = token && token !== 'undefined' && token !== 'null';

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
                        {isLoggedIn ? (
                            <>
                                <DarkModeToggle />
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                {userRole === 'admin' && <Link to="/create-event" className="nav-link">Create Event</Link>}
                                {userRole === 'user' && <Link to="/myevents" className="nav-link">My Events</Link>}
                                <button onClick={handleLogout} className="btn btn-danger" >Logout</button>
                            </>
                        ) : (
                            <>
                                <DarkModeToggle />
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
                        <span className="badge-featured">🌟 Welcome to the future of events</span>
                        <h1 className="hero-title">
                            BIT Event Management <br />
                            <span className="highlight-text">Website.</span>
                        </h1>
                        <p className="hero-subtitle">
                            Discover, create, and participate in seamless event experiences on campus. Bring your ideas to life and engage with the community.
                        </p>
                        <div className="hero-buttons">
                            {isLoggedIn ? (
                                <Link to="/dashboard" className="btn btn-primary btn-lg pulse-btn">Explore Dashboard</Link>
                            ) : (
                                <>
                                    <Link to="/register" className="btn btn-primary btn-lg pulse-btn">Get Started Now</Link>
                                    <Link to="/login" className="btn btn-outline btn-lg">Login</Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="hero-image">
                        <div className="illustration-placeholder">
                            <div className="blob-shape blob-1"></div>
                            <div className="blob-shape blob-2"></div>
                            <div className="card-mockup card-1 floating-slow">
                                <div className="mockup-header">Upcoming Event</div>
                                <div className="mockup-content">
                                    <div className="mockup-line w-3/4"></div>
                                    <div className="mockup-line w-1/2"></div>
                                </div>
                            </div>
                            <div className="card-mockup card-2 floating-fast">
                                <div className="mockup-circle"></div>
                                <div className="mockup-content" style={{ marginTop: '1rem' }}>
                                    <div className="mockup-line w-full"></div>
                                    <div className="mockup-line w-5/6"></div>
                                </div>
                                <div className="mockup-button">Join Now</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose EventSys?</h2>
                    <p className="section-subtitle">Everything you need to host and join amazing events, curated beautifully.</p>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3>Easy Registration</h3>
                            <p>Sign up for events with a single click and keep track of your registrations seamlessly.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📅</div>
                            <h3>Smart Scheduling</h3>
                            <p>Never miss an event with detailed timelines, automatic sorting, and location tags.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✨</div>
                            <h3>Beautiful Design</h3>
                            <p>A premium, fast, and responsive user interface that makes event browsing a joy.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} EventSys - BIT Event Management Portal</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
