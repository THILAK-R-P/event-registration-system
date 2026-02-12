import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/register.css';


const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert('Registration Successful! Now you can login.');


            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration Failed');
        }
    };

    return (
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
                    <button type="submit" className="btn btn-primary btn-register">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;