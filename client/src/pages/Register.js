import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send data to the Register endpoint
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert('Registration Successful! Now you can login.');
            
            // Redirect user to Login page
            navigate('/'); 
        } catch (err) {
            alert(err.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username" 
                    onChange={handleChange} 
                    required 
                    style={{ display: 'block', margin: '10px 0', padding: '8px' }}
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    onChange={handleChange} 
                    required 
                    style={{ display: 'block', margin: '10px 0', padding: '8px' }}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    onChange={handleChange} 
                    required 
                    style={{ display: 'block', margin: '10px 0', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px 20px' }}>Register</button>
            </form>
        </div>
    );
};

export default Register;