

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; // Import the CSS module

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('rider');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fake login logic
    console.log('Login submitted:', { email, password, role });

    // Navigate to the correct dashboard based on role
    if (role === 'rider') {
      navigate('/rider-dashboard');
    } else {
      navigate('/driver-dashboard');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Log in to your account</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className={styles.input}
            onChange={(e) => setRole(e.target.value)}
            value={role}
          >
            <option value="rider">Rider</option>
            <option value="driver">Driver</option>
          </select>
          <button type="submit" className={styles.button}>Login</button>
        </form>
        <p className={styles.signupText}>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
