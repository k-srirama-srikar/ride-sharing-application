// import React from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./WaitingPage.module.css";

// const WaitingPage = () => {
//   const navigate = useNavigate();

//   // Simulate driver accepting after 3 min (you'll later replace this with backend signal)
//   React.useEffect(() => {
//     const timer = setTimeout(() => {
//       navigate("/rider-dashboard");
//     }, 180000); // 3 min
//     return () => clearTimeout(timer);
//   }, [navigate]);

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.message}>✅ Ride request submitted!</h2>
//       <p className={styles.subtext}>Please wait while we find a driver for you...</p>
//     </div>
//   );
// };

// export default WaitingPage;


















// src/pages/Rider/WaitingPage.js (or wherever your file is)

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Make sure the path to your CSS module is correct
import styles from "./WaitingPage.module.css";

const WaitingPage = () => {
  const navigate = useNavigate();

  // useEffect runs once when the component mounts
  useEffect(() => {
    console.log("WaitingPage mounted, setting 7-second timer for /rider/tracking...");

    // Set the timer
    const timer = setTimeout(() => {
      console.log("7 seconds elapsed, navigating to /rider/tracking...");
      // *** THIS IS THE CORRECTED PATH ***
      navigate("/rider/tracking");
    }, 7000); // 7000 milliseconds = 7 seconds

    // Cleanup function: clear the timer if the component unmounts before 7 seconds
    return () => {
      console.log("WaitingPage unmounting, clearing timer.");
      clearTimeout(timer);
    };
  }, [navigate]); // Dependency array includes navigate

  return (
    <div className={styles.container}>
      <h2 className={styles.message}>✅ Ride request submitted!</h2>
      <p className={styles.subtext}>
        Please wait, finding your driver
        {/* Optional: Add the loading dots span here if using the CSS */}
        {/* <span className={styles.loadingDots}></span> */}
      </p>
      <p className={styles.redirectInfo}>(You will be redirected shortly)</p>
    </div>
  );
};

export default WaitingPage;