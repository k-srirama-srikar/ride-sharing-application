  // import React, { useState } from "react";
  // import styles from "./RideComplete.module.css";

  // const RideComplete = () => {
  //   const [rating, setRating] = useState(5);
  //   const [feedback, setFeedback] = useState("");

  //   const handlePayment = () => {
  //     alert("Payment Done (mock)");
  //   };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     console.log("Rating:", rating, "Feedback:", feedback);
  //     alert("Thank you for your feedback!");
  //   };

  //   return (
  //     <div className={styles.container}>
  //       <h2>Ride Completed</h2>

  //       <button className={styles.payBtn} onClick={handlePayment}>
  //         Pay ₹200 (mock)
  //       </button>

  //       <form onSubmit={handleSubmit} className={styles.form}>
  //         <label>Rate your ride:</label>
  //         <select value={rating} onChange={(e) => setRating(e.target.value)}>
  //           {[5, 4, 3, 2, 1].map((r) => (
  //             <option key={r} value={r}>{r} Star</option>
  //           ))}
  //         </select>

  //         <label>Feedback:</label>
  //         <textarea
  //           value={feedback}
  //           onChange={(e) => setFeedback(e.target.value)}
  //           rows="4"
  //           placeholder="Write your experience..."
  //         />

  //         <button type="submit">Submit</button>
  //       </form>
  //     </div>
  //   );
  // };

  // export default RideComplete;




























  import React, { useState, useEffect } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
  import styles from "./RideComplete.module.css";
  // import { submitRatingFeedback } from "../../services/api"; // TODO: Uncomment and implement
  
  const RideComplete = () => {
    const location = useLocation();
    const navigate = useNavigate();
  
    // --- Get data passed from RideTracking or previous page ---
    // Provide clearer defaults if state is missing
    const { rideId = null, fare = "--", driverName = "Your Driver" } = location.state || {};
  
    const [rating, setRating] = useState(0); // 0 means no rating selected yet
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [paymentDone, setPaymentDone] = useState(false); // Track mock payment status
  
    useEffect(() => {
      // Check if essential data is missing on component mount
      if (!rideId || fare === "--") {
        console.warn("Ride ID or Fare is missing. State:", location.state);
        setError("Ride details incomplete. Cannot process payment or feedback correctly.");
        // Optional: Redirect if data is critical and missing
        // setTimeout(() => navigate('/rider-dashboard'), 3000);
      }
    }, [rideId, fare, location.state, navigate]);
  
    const handlePayment = () => {
      if (fare === "--" || paymentDone) return; // Prevent action if no fare or already paid
  
      // --- Mock Payment Logic ---
      console.log(`Mock Payment of ${fare} initiated for Ride ID: ${rideId}`);
      alert(`Payment of ${fare} processed successfully (mock)!`);
      setPaymentDone(true); // Update state
      setError(""); // Clear any previous errors
    };
  
    const handleSubmitFeedback = async (e) => {
      e.preventDefault();
      setError("");
  
      if (rating === 0) {
        setError("Please select a star rating before submitting.");
        return;
      }
      if (!rideId) {
        setError("Cannot submit feedback: Ride ID is missing.");
        return;
      }
  
      setIsSubmitting(true);
      console.log(
        `Submitting Feedback for Ride ID: ${rideId} - Rating: ${rating}, Feedback: "${feedback}"`
      );
  
      try {
        // --- TODO: API Call ---
        // const payload = { rideId, rating, feedback };
        // await submitRatingFeedback(payload);
  
        await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate API call
  
        alert("Thank you for your feedback!");
        navigate("/rider-dashboard"); // Navigate after successful submission
  
      } catch (err) {
        console.error("Failed to submit feedback:", err);
        setError(
          err.response?.data?.detail ||
            "An error occurred while submitting feedback. Please try again."
        );
        setIsSubmitting(false); // Allow retry
      }
    };
  
    return (
      <div className={styles.pageContainer}> {/* Changed class name */}
        <div className={styles.card}>
          <div className={styles.iconContainer}>
              {/* Optional: Add an icon like a checkmark */}
              <svg className={styles.checkmarkIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                  <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
          </div>
          <h2 className={styles.title}>Ride Completed!</h2>
          <p className={styles.subtitle}>
            Hope you enjoyed your ride with {driverName}.
          </p>
  
          {/* --- Payment Section --- */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Payment</h3>
            <p className={styles.fareText}>
              Final Fare: <span className={styles.fareAmount}>{fare}</span>
            </p>
            <button
              className={`${styles.button} ${styles.payButton} ${
                paymentDone ? styles.paymentDone : ""
              }`}
              onClick={handlePayment}
              disabled={paymentDone || fare === "--"} // Disable if paid or no fare
            >
              {paymentDone ? "Payment Successful" : `Pay Now`}
            </button>
          </div>
  
          {/* --- Rating and Feedback Form --- */}
          <form onSubmit={handleSubmitFeedback} className={`${styles.section} ${styles.form}`}>
            <h3 className={styles.sectionTitle}>Rate Your Experience</h3>
  
            {/* Star Rating */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Your Rating:</label>
              <div className={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button" // Prevent form submission on star click
                    key={star}
                    className={`${styles.star} ${
                      hoverRating >= star || (!hoverRating && rating >= star)
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => !isSubmitting && setRating(star)}
                    onMouseEnter={() => !isSubmitting && setHoverRating(star)}
                    onMouseLeave={() => !isSubmitting && setHoverRating(0)}
                    aria-label={`Rate ${star} Stars`} // Accessibility
                    disabled={isSubmitting}
                  >
                    ★ {/* Unicode Star */}
                  </button>
                ))}
              </div>
            </div>
  
            {/* Feedback Textarea */}
            <div className={styles.fieldGroup}>
              <label htmlFor="feedback" className={styles.label}>
                Feedback (Optional):
              </label>
              <textarea
                id="feedback"
                className={styles.textarea}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="4"
                placeholder="Tell us about your ride..."
                disabled={isSubmitting}
              />
            </div>
  
            {/* Error Message Display */}
            {error && <p className={styles.errorText}>{error}</p>}
  
            {/* Submit Button */}
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
              disabled={isSubmitting || rating === 0 || !rideId || fare === '--'} // More comprehensive disable check
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default RideComplete;