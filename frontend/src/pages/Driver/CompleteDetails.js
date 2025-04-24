// src/pages/Driver/CompleteDetails.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CompleteDetails.module.css';

const CompleteDetails = () => {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    licenseNumber: '',
    vehicleNumber: '',
    vehicleModel: '',
    seatCapacity: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Driver Details Submitted:', form);

    // In real app: save to backend

    navigate('/driver-dashboard', { state: { name: form.fullName } });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Complete Your Details</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="licenseNumber"
          placeholder="License Number"
          value={form.licenseNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={form.vehicleNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="vehicleModel"
          placeholder="Vehicle Model"
          value={form.vehicleModel}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="seatCapacity"
          placeholder="Seat Capacity"
          value={form.seatCapacity}
          onChange={handleChange}
          required
        />
        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
};

export default CompleteDetails;
