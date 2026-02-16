import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';


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
            alert('Login Successful!');


            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);

            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Login Failed');
        }
    };

    return (
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
    );
};
export default Login;