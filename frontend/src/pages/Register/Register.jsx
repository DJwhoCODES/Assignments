import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import { BASE_URL } from '../../config';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;

    // Validate username
    if (!username) {
      setUsernameError('Username is required');
      valid = false;
    } else {
      setUsernameError('');
    }

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form inputs
    if (!validateForm()) return;

    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, {
        username,
        email,
        password,
      });

      alert('Registration successful! Please log in.');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed. Try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {usernameError && <p className="error-message">{usernameError}</p>}

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

        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;
