

// App.js
import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import RiderDashboard from './pages/Rider/Dashboard';
import DriverDashboard from './pages/Driver/Dashboard';
import DriverTracking from './pages/Driver/DriverTracking';
import RequestRide from './pages/Rider/RequestRide';
import WaitingPage from './pages/Rider/WaitingPage';
import About from './pages/General/About';
import Help from './pages/General/Help';
import CompleteDetails from './pages/Driver/CompleteDetails';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/rider-dashboard" element={<RiderDashboard />} />
        <Route path="/rider/request" element={<RequestRide />} />
        <Route path="/rider/waiting" element={<WaitingPage />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/driver/complete-details" element={<CompleteDetails />} />
        <Route path="/driver/tracking" element={<DriverTracking />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />

      </Routes>
    </>
  );
}

export default App;
