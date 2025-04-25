

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
import DriverTracking2 from './pages/Driver/DriverTracking2';
import RequestRide from './pages/Rider/RequestRide';
import WaitingPage from './pages/Rider/WaitingPage';
import RideTracking from "./pages/Rider/RideTracking";
import RideComplete from './pages/Rider/RideComplete';
import About from './pages/General/About';
import Help from './pages/General/Help';

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
        <Route path="/rider/tracking" element={<RideTracking />} />
        <Route path="/rider/complete" element={<RideComplete />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/driver/tracking" element={<DriverTracking />} />
        <Route path="/driver/tracking2" element={<DriverTracking2 />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />

      </Routes>
    </>
  );
}

export default App;
