import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';
import '../css/login.css';
import { toast } from 'react-toastify';


const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            toast.success('Login Successful!');


            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);

            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login Failed');
        }
    };

    return (
        <div className="login-page">
            <nav className="navbar">
                <div className="container nav-container">
                    <div className="nav-brand">
                        <Link to="/" className="nav-logo">EventSys</Link>
                    </div>
                    <div className="nav-menu">
                        <DarkModeToggle />
                        <Link to="/register" className="nav-link">Register</Link>
                        <span className="nav-link active">Login</span>
                    </div>
                </div>
            </nav>
            <div className="login-container">
            <div className="form-container">
                <h2 className="form-title">Login</h2>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-primary btn-login">Login</button>
                </form>
            </div>
        </div>
        </div>
    );
};
export default Login;