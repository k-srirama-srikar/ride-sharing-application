import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Signup.module.css';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'rider',
    // Rider-specific
    preferred_payment_method: '',
    preferred_ride_type: '',
    // Driver-specific
    phone: '',
    licenseNumber: '',
    vehicle_number: '',
    vehicle_model: '',
    seat_capacity: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2); // go to next step
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup submitted:', form);

    // Later: send data to backend

    if (form.role === 'rider') {
      navigate('/rider-dashboard');
    } else {
      navigate('/driver-dashboard');
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign Up</h2>

        {step === 1 && (
          <form onSubmit={handleNext} className={styles.form}>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="rider">Rider</option>
              <option value="driver">Driver</option>
            </select>
            <button type="submit" className={styles.button}>Next</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className={styles.form}>
            {form.role === 'rider' ? (
              <>
                <select
                  name="preferred_payment_method"
                  value={form.preferred_payment_method}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </select>

                <select
                  name="preferred_ride_type"
                  value={form.preferred_ride_type}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">Select Ride Type</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </>
            ) : (
              <>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
                <input
                  type="text"
                  placeholder="License Number"
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
                <input
                  type="text"
                  placeholder="Vehicle Number"
                  name="vehicle_number"
                  value={form.vehicle_number}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
                <input
                  type="text"
                  placeholder="Vehicle Model"
                  name="vehicle_model"
                  value={form.vehicle_model}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
                <input
                  type="number"
                  placeholder="Seat Capacity"
                  name="seat_capacity"
                  value={form.seat_capacity}
                  onChange={handleChange}
                  className={styles.input}
                  min="1"
                  required
                />
              </>
            )}
            <button type="submit" className={styles.button}>Sign Up</button>
          </form>
        )}

        <p className={styles.loginText}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
