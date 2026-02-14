import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/myevents.css';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await axios.get('http://localhost:5000/api/events/myevents', {
                    headers: { Authorization: token }
                });
                setEvents(res.data);
            } catch (err) {
                console.error(err);

            }
        };
        fetchMyEvents();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="myevents-page">
            <nav className="navbar">
                <div className="container nav-container">
                    <div className="nav-brand">
                        <Link to="/" className="nav-logo">EventSys</Link>
                    </div>
                    <div className="nav-menu">
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/create-event" className="nav-link">Create Event</Link>
                        <span className="nav-link active">My Events</span>
                        <button onClick={handleLogout} className="btn btn-danger" style={{ border: 'none' }}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container main-content-area">
                <div className="dashboard-header-section">
                    <h2>My Registrations</h2>
                    <Link to="/dashboard" className="btn btn-secondary">← Back to Dashboard</Link>
                </div>

                {events.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't joined any events yet.</p>
                        <Link to="/dashboard" className="btn btn-primary">Browse Events</Link>
                    </div>
                ) : (
                    <div className="events-grid">
                        {events.map(event => (
                            <div key={event._id} className="event-card">
                                <div className="card-body">
                                    <h4 className="event-title">{event.title}</h4>

                                    <div className="event-details" style={{ marginTop: '1rem' }}>
                                        <div className="detail-item">
                                            📅 {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        <div className="detail-item">
                                            📍 {event.location}
                                        </div>
                                    </div>

                                    <div className="status-badge-container">
                                        <span className="status-badge">✓ Registered</span>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-primary w-full">View Event</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEvents;