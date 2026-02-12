import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../css/dashboard.css';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });
    const navigate = useNavigate();

    // Mock role for now, in real app get from context/localstorage
    const userRole = localStorage.getItem('role') || 'user';

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/events', formData, {
                headers: { Authorization: token }
            });
            alert('Event Created!');
            fetchEvents();
            setFormData({ title: '', description: '', date: '', location: '' });
        } catch (err) {
            alert('Failed. Only Admins can create events.');
        }
    };

    const handleJoin = async (eventId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please login to join events");
                navigate('/login');
                return;
            }
            await axios.post(`http://localhost:5000/api/events/${eventId}/join`, {}, {
                headers: { Authorization: token }
            });
            alert('Successfully Joined!');
            fetchEvents();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to join');
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
                headers: { Authorization: token }
            });
            alert('Event Deleted');
            fetchEvents();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete Failed');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="dashboard-page">
            {/* Dashboard specific Navbar */}
            <nav className="navbar">
                <div className="container nav-container">
                    <div className="nav-brand">
                        <Link to="/" className="nav-logo">EventSys</Link>
                    </div>
                    <div className="nav-menu">
                        <span className="nav-link active">Dashboard</span>
                        <Link to="/create-event" className="nav-link">Create Event</Link>
                        <Link to="/myevents" className="nav-link">My Events</Link>
                        <button onClick={handleLogout} className="btn btn-danger" style={{ border: 'none' }}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container main-content-area">
                <div className="dashboard-header-section">
                    <h2>Event Dashboard</h2>
                </div>

                {/* ADMIN PANEL ACTION */}
                {userRole === 'admin' && (
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to="/create-event" className="btn btn-primary">
                            + Create New Event
                        </Link>
                    </div>
                )}

                <h3>Upcoming Events</h3>
                <div className="events-grid">
                    {events.map(event => (
                        <div key={event._id} className="event-card">
                            <div className="card-body">
                                <div className="card-top">
                                    <div style={{ flex: 1 }}>
                                        <h4 className="event-title">{event.title}</h4>
                                        <div style={{ marginTop: '0.25rem' }}></div>
                                    </div>
                                    <button onClick={() => {
                                        const token = localStorage.getItem('token');
                                        if (!token) {
                                            alert("You must be logged in to delete events");
                                            return;
                                        }
                                        handleDelete(event._id);
                                    }} className="btn btn-danger btn-sm-delete">
                                        Delete
                                    </button>
                                </div>

                                <p className="event-description">{event.description}</p>

                                <div className="event-details">
                                    <div className="detail-item">
                                        📅 {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="detail-item">
                                        📍 {event.location}
                                    </div>
                                    <div className="detail-item">
                                        Attendees: {event.attendees.length}
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer">
                                <button
                                    onClick={() => handleJoin(event._id)}
                                    className="btn btn-primary w-full"
                                >
                                    Join Event
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;