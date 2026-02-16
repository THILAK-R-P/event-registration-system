import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../css/createEvent.css'; // Reusing create event css

const UpdateEvent = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvent();
        // eslint-disable-next-line
    }, []);

    const fetchEvent = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/events`);
            // The API returns all events, finding the specific one. 
            // Ideally there should be a get-one endpoint, but getEvents returns all.
            // Wait, looking at eventController.js, there is NO getOneEvent.
            // I can use the existing list and find it, or add getOneEvent.
            // Adding getOneEvent is better but I want to minimize backend changes.
            // However, the dashboard has the data. 
            // Let's filter from the list for now.
            const event = res.data.find(e => e._id === id);
            if (event) {
                setFormData({
                    title: event.title,
                    description: event.description,
                    date: event.date.split('T')[0], // Extract date part
                    location: event.location
                });
            }
        } catch (err) {
            console.error(err);
            alert('Failed to fetch event details');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');

            if (role !== 'admin') {
                alert('Only admins can update events');
                navigate('/dashboard');
                return;
            }

            await axios.put(`http://localhost:5000/api/events/${id}`, formData, {
                headers: { Authorization: token }
            });
            alert('Event Updated Successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to update event.');
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
                        <Link to="/create-event" className="nav-link">Create Event</Link>
                        <Link to="/myevents" className="nav-link">My Events</Link>
                        <button onClick={handleLogout} className="btn btn-danger" style={{ border: 'none' }}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container create-event-container">
                <div className="form-card">
                    <div className="form-header">
                        <h2>Update Event</h2>
                        <p>Edit event details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="event-form">
                        <div className="form-group">
                            <label>Event Title</label>
                            <input
                                className="input-field"
                                name="title"
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
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <Link to="/dashboard" className="btn btn-secondary text-dark">Cancel</Link>
                            <button type="submit" className="btn btn-primary">Update Event</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateEvent;
