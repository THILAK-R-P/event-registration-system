import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../css/createEvent.css';

const CreateEvent = () => {
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login first');
                navigate('/login');
                return;
            }
            await axios.post('http://localhost:5000/api/events', formData, {
                headers: { Authorization: token }
            });
            alert('Event Created Successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed. Only Admins can create events.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="create-event-page">
            <nav className="navbar">
                <div className="container nav-container">
                    <div className="nav-brand">
                        <Link to="/" className="nav-logo">EventSys</Link>
                    </div>
                    <div className="nav-menu">
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <span className="nav-link active">Create Event</span>
                        <Link to="/myevents" className="nav-link">My Events</Link>
                        <button onClick={handleLogout} className="btn btn-danger" style={{ border: 'none' }}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container create-event-container">
                <div className="form-card">
                    <div className="form-header">
                        <h2>Create New Event</h2>
                        <p>Fill in the details to host a new event.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="event-form">
                        <div className="form-group">
                            <label>Event Title</label>
                            <input
                                className="input-field"
                                name="title"
                                placeholder="e.g. Annual Tech Conference"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="input-field textarea-field"
                                name="description"
                                placeholder="Describe the event..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    className="input-field"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    className="input-field"
                                    name="location"
                                    placeholder="e.g. New York Convention Center"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <Link to="/dashboard" className="btn btn-secondary text-dark">Cancel</Link>
                            <button type="submit" className="btn btn-primary">Create Event</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
