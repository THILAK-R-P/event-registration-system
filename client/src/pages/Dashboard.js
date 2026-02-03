import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });
    const navigate = useNavigate();

    // 1. Fetch Events when the page loads
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

    // 2. Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Submit New Event
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Get the stored token
            
            // Note: We send the token in the "headers" so the backend knows who we are
            await axios.post('http://localhost:5000/api/events', formData, {
                headers: { Authorization: token }
            });

            alert('Event Created!');
            fetchEvents(); // Refresh the list
            setFormData({ title: '', description: '', date: '', location: '' }); // Clear form
        } catch (err) {
            alert('Failed to create event. Are you logged in?');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Event Dashboard</h2>
                <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>Logout</button>
            </div>

            {/* --- CREATE EVENT FORM --- */}
            <div style={{ marginBottom: '40px', border: '1px solid #ccc', padding: '20px' }}>
                <h3>Create New Event</h3>
                <form onSubmit={handleSubmit}>
                    <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required style={{ display: 'block', margin: '10px 0' }} />
                    <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required style={{ display: 'block', margin: '10px 0' }} />
                    <input name="date" type="date" value={formData.date} onChange={handleChange} required style={{ display: 'block', margin: '10px 0' }} />
                    <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required style={{ display: 'block', margin: '10px 0' }} />
                    <button type="submit">Create Event</button>
                </form>
            </div>

            {/* --- EVENT LIST --- */}
            <h3>All Upcoming Events</h3>
            {events.map(event => (
                <div key={event._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
                    <h4>{event.title}</h4>
                    <p><b>Date:</b> {new Date(event.date).toLocaleDateString()}</p>
                    <p><b>Location:</b> {event.location}</p>
                    <p>{event.description}</p>
                    <small>Organizer: {event.organizer?.username}</small>
                </div>
            ))}
        </div>
    );
};

export default Dashboard;