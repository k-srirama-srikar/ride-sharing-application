// import React from "react";
// import styles from "./DriverDashboard.module.css";

// const DriverDashboard = () => {
//   return (
//     <div className={styles.container}>
//       <h1 className={styles.heading}>Welcome, Driver!</h1>
//       <p className={styles.text}>Check your assigned rides and status below.</p>
//       <div className={styles.card}>
//         <p>No active rides</p>
//       </div>
//     </div>
//   );
// };

// export default DriverDashboard;





import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DriverDashboard.module.css";

const DriverDashboard = () => {
  const navigate = useNavigate();

  const handleAcceptRide = () => {
    // Here you can trigger your API call to accept the ride
    console.log("Ride accepted!");
    // Redirect to tracking page
    navigate("/driver/tracking");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome, Driver!</h1>
      <p className={styles.text}>Check your assigned rides and status below.</p>
      <div className={styles.card}>
        <p>Ride request: Connaught Place to AIIMS</p>
        <button className={styles.button} onClick={handleAcceptRide}>
          Accept Ride
        </button>
      </div>
    </div>
  );
};

export default DriverDashboard;
