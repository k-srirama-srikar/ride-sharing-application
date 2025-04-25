import React, { useState } from "react";
import styles from "./RideComplete.module.css";

const RideComplete = () => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const handlePayment = () => {
    alert("Payment Done (mock)");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rating:", rating, "Feedback:", feedback);
    alert("Thank you for your feedback!");
  };

  return (
    <div className={styles.container}>
      <h2>Ride Completed</h2>

      <button className={styles.payBtn} onClick={handlePayment}>
        Pay ₹200 (mock)
      </button>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Rate your ride:</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Star</option>
          ))}
        </select>

        <label>Feedback:</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows="4"
          placeholder="Write your experience..."
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RideComplete;
