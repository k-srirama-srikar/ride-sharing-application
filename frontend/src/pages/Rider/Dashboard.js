// import React from "react";
// import styles from "./RiderDashboard.module.css";

// const RiderDashboard = () => {
//   return (
//     <div className={styles.container}>
//       <h1 className={styles.heading}>Welcome, Rider!</h1>
//       <p className={styles.text}>Find a ride or track your bookings below.</p>
//       <div className={styles.card}>
//         <p>No current bookings</p>
//       </div>
//     </div>
//   );
// };

// export default RiderDashboard;


// pages/Rider/Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RiderDashboard.module.css";

const RiderDashboard = () => {
  const navigate = useNavigate();

  // These will be fetched from database in the future
  const currentBooking = null;
  const recentRides = [];

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome, Rider!</h1>
      <p className={styles.text}>Find a ride or Recent Bookings</p>

      <button className={styles.requestButton} onClick={() => navigate("/rider/request")}>
        🚖 Request a New Ride
      </button>

      <div className={styles.card}>
        <h3>Current Booking</h3>
        {currentBooking ? (
          <p>{/* Display booking details here */}</p>
        ) : (
          <p>No current bookings</p>
        )}
      </div>

      <div className={styles.card}>
        <h3>Recent Rides</h3>
        {recentRides.length === 0 ? (
          <p>No recent rides</p>
        ) : (
          <ul>
            {recentRides.slice(0, 3).map((ride, index) => (
              <li key={index}>{/* Preview ride info */}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;
