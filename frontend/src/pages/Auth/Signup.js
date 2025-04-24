
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css'; // Import CSS module

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('rider');

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // 🚧 Replace this with actual signup logic once backend is ready
    console.log('Signup submitted:', { name, email, password, role });

    // ✅ Later: replace above with fetch/axios call to your backend
    // Example:
    // try {
    //   const res = await fetch('http://localhost:5000/api/signup', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, email, password, role }),
    //   });
    //   if (!res.ok) throw new Error('Signup failed');
    //   const data = await res.json(); // token or user info
    //   navigate(role === 'rider' ? '/rider/dashboard' : '/driver/dashboard');
    // } catch (err) {
    //   alert('Error: ' + err.message);
    //   return;
    // }

    // Redirect to appropriate dashboard
    if (role === 'rider') {
      navigate('/rider-dashboard');
    } else {
      alert('Signup successful! Please complete your driver details....');

      navigate('/driver/complete-details');
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Sign up to get started</p>
        <form onSubmit={handleSignup} className={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="rider">Rider</option>
            <option value="driver">Driver</option>
          </select>
          <button type="submit" className={styles.button}>Sign Up</button>
        </form>
        <p className={styles.loginText}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
