import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';
import '../css/myevents.css';

const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hourStr, minute] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const paddedHour = hour.toString().padStart(2, '0');
    return `${paddedHour}:${minute} ${ampm}`;
};

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewModalOption, setViewModalOption] = useState({ isOpen: false, event: null });
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

    const filteredEvents = events.filter(event => {
        const locationLower = (event.location || '').toLowerCase();
        const titleLower = (event.title || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return titleLower.includes(searchLower) || locationLower.includes(searchLower);
    });

    return (
        <div className="myevents-page">
            <nav className="navbar">
                <div className="container nav-container">
                    <div className="nav-brand">
                        <Link to="/" className="nav-logo">EventSys</Link>
                    </div>
                    <div className="nav-menu">
                        <DarkModeToggle />
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        {localStorage.getItem('role') === 'admin' && <Link to="/create-event" className="nav-link">Create Event</Link>}
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
                    <>
                        <div className="search-container">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search events by title or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {filteredEvents.length === 0 ? (
                            <div className="no-events-message">No matching events found</div>
                        ) : (
                            <div className="events-grid">
                                {filteredEvents.map(event => (
                                    <div key={event._id} className="event-card">
                                        <div className="card-body">
                                            <h4 className="event-title">{event.title}</h4>

                                            <div className="event-details" style={{ marginTop: '1rem' }}>
                                                <div className="detail-item">
                                                    📅 {new Date(event.date).toLocaleDateString()} {event.time && `at ${formatTime(event.time)}`}
                                                </div>
                                                <div className="detail-item">
                                                    📍 {event.location}
                                                </div>
                                            </div>

                                            <div className="status-badge-container">
                                                <span className="status-badge">✓ Registered</span>
                                            </div>
                                        </div>
                                        <div className="card-footer" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                                            {event.brochureUrl && (
                                                <a
                                                    href={event.brochureUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn w-full"
                                                    style={{ textAlign: 'center', backgroundColor: '#e0e7ff', color: '#4f46e5', border: 'none' }}
                                                >
                                                    View Brochure
                                                </a>
                                            )}
                                            <button onClick={() => setViewModalOption({ isOpen: true, event })} className="btn btn-primary w-full">View Event</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* View Event Modal */}
                {viewModalOption.isOpen && viewModalOption.event && (
                    <div className="absolute-modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="modal-content" style={{
                            background: 'var(--surface-color)', padding: '2rem', borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '500px', width: '90%',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{ marginTop: 0, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{viewModalOption.event.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{viewModalOption.event.description}</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                <div>
                                    <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.9rem' }}>Date & Time</strong>
                                    <span style={{ color: 'var(--text-secondary)' }}>{new Date(viewModalOption.event.date).toLocaleDateString()} {viewModalOption.event.time && `at ${formatTime(viewModalOption.event.time)}`}</span>
                                </div>
                                <div>
                                    <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.9rem' }}>Location</strong>
                                    <span style={{ color: 'var(--text-secondary)' }}>{viewModalOption.event.location}</span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => setViewModalOption({ isOpen: false, event: null })} className="btn btn-cancel">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEvents;