import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { BASE_URL } from '../../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    // Validate password (minimum 6 characters)
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form inputs
    if (!validateForm()) return;

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });

      if (res.data.token && res.data.username) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.username));
        alert('Login successful!');
        navigate('/');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error);
      setError(error.response?.data?.message || 'Invalid credentials. Try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <p className="error-message">{emailError}</p>}
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {passwordError && <p className="error-message">{passwordError}</p>}

        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;
