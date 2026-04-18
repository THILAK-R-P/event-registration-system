import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';
import '../css/register.css';
import { toast } from 'react-toastify';


const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isConfirming, setIsConfirming] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsConfirming(true);
    };

    const confirmRegistration = async () => {
        setIsConfirming(false);
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            toast.success('Registration Successful!');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration Failed');
        }
    };

    const cancelRegistration = () => {
        setIsConfirming(false);
    };

    return (
        <div className="register-page">
            <nav className="navbar">
                <div className="container nav-container">
                    <div className="nav-brand">
                        <Link to="/" className="nav-logo">EventSys</Link>
                    </div>
                    <div className="nav-menu">
                        <DarkModeToggle />
                        <span className="nav-link active">Register</span>
                        <Link to="/login" className="nav-link">Login</Link>
                    </div>
                </div>
            </nav>
            <div className="register-container">
            <div className="form-container">
                <h2 className="form-title">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            className="input-field"
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            className="input-field"
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            className="input-field"
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn btn-cancel w-full" onClick={() => navigate('/')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary w-full">Register</button>
                    </div>
                </form>
            </div>

            {/* Confirm Registration Modal */}
            {isConfirming && (
                <div className="absolute-modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="modal-content" style={{
                        background: 'var(--surface-color)', padding: '2rem', borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ marginTop: 0, fontSize: '1.25rem', color: 'var(--text-color)' }}>Confirm Registration</h3>
                        <p style={{ margin: '1rem 0', color: 'var(--text-color)' }}>Are you sure you want to register with these details?</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={cancelRegistration} className="btn btn-cancel">Cancel</button>
                            <button onClick={confirmRegistration} className="btn btn-primary">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default Register;