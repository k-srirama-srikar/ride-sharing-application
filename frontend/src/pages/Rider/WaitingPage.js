import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WaitingPage.module.css";

const WaitingPage = () => {
  const navigate = useNavigate();

  // Simulate driver accepting after 3 min (you'll later replace this with backend signal)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/rider-dashboard");
    }, 180000); // 3 min
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <h2 className={styles.message}>✅ Ride request submitted!</h2>
      <p className={styles.subtext}>Please wait while we find a driver for you...</p>
    </div>
  );
};

export default WaitingPage;
