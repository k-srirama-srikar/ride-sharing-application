
// import React, { useState } from "react";
// import styles from "./RequestRide.module.css";
// import { useLoadScript } from "@react-google-maps/api";
// import Autocomplete from "react-google-autocomplete";

// const libraries = ["places"];

// const RequestRide = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const [pickup, setPickup] = useState("");
//   const [dropoff, setDropoff] = useState("");
//   const [pooling, setPooling] = useState(false);
//   const [rideType, setRideType] = useState("standard");
//   const [passengers, setPassengers] = useState(1);


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const rideRequest = {
//       pickup,
//       dropoff,
//       pooling,
//       rideType,
//       passengers
//     };

//     console.log("Ride request submitted:", rideRequest);
//     alert("Ride request submitted!");
//   };

//   if (loadError) return <div>Error loading maps</div>;
//   if (!isLoaded) return <div>Loading maps...</div>;

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Request a New Ride</h2>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <Autocomplete
//           apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//           onPlaceSelected={(place) => setPickup(place.formatted_address)}
//           options={{ types: ["geocode"] }}
//           className={styles.input}
//           placeholder="Pickup Location" 
//         />

//         <Autocomplete
//           apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//           onPlaceSelected={(place) => setDropoff(place.formatted_address)}
//           options={{ types: ["geocode"] }}
//           className={styles.input}
//           placeholder="Dropoff Location"
//         />

//         <div className={styles.fieldGroup}>
//           <label className={styles.label}>Pooling?</label>
//           <select
//             value={pooling}
//             onChange={(e) => setPooling(e.target.value === "true")}
//             className={styles.select}
//           >
//             <option value="false">No</option>
//             <option value="true">Yes</option>
//           </select>
//         </div>

//         <div className={styles.fieldGroup}>
//           <label className={styles.label}>Ride Type:</label>
//           <select
//             value={rideType}
//             onChange={(e) => setRideType(e.target.value)}
//             className={styles.select}
//           >
//             <option value="standard">Standard</option>
//             <option value="premium">Premium</option>
//           </select>
//         </div>

//         <div className={styles.fieldGroup}>
//           <label className={styles.label}>No. of Passengers:</label>
//           <input
//             type="number"
//             min="1"
//             max="6"
//             value={passengers}
//             onChange={(e) => setPassengers(parseInt(e.target.value))}
//             className={styles.input}
//             required
//           />
//          </div>


//         <button type="submit" className={styles.button}>
//           Submit Ride Request
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RequestRide;




























import React, { useState } from "react";
import styles from "./RequestRide.module.css";
import { useLoadScript } from "@react-google-maps/api";
import Autocomplete from "react-google-autocomplete";
import { useNavigate } from "react-router-dom";

const libraries = ["places"];

const RequestRide = () => {
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pooling, setPooling] = useState(false);
  const [rideType, setRideType] = useState("standard");
  const [passengers, setPassengers] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickup || !dropoff) {
      alert("Please fill in both pickup and dropoff locations.");
      return;
    }

    const rideRequest = {
      pickup,
      dropoff,
      pooling,
      rideType,
      passengers,
    };

    console.log("Ride request submitted:", rideRequest);

    // Navigate to the waiting page
    navigate("/rider/waiting");
  };

  if (loadError) return <div>Error loading maps, please try again later.</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Request a New Ride</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Autocomplete
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          onPlaceSelected={(place) => setPickup(place.formatted_address)}
          options={{ types: ["geocode"] }}
          className={styles.input}
          placeholder="Pickup Location"
        />

        <Autocomplete
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          onPlaceSelected={(place) => setDropoff(place.formatted_address)}
          options={{ types: ["geocode"] }}
          className={styles.input}
          placeholder="Dropoff Location"
        />

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Pooling?</label>
          <select
            value={pooling}
            onChange={(e) => setPooling(e.target.value === "true")}
            className={styles.select}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Ride Type:</label>
          <select
            value={rideType}
            onChange={(e) => setRideType(e.target.value)}
            className={styles.select}
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>No. of Passengers:</label>
          <input
            type="number"
            min="1"
            max="6"
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value))}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className={styles.button}>
          Submit Ride Request
        </button>
      </form>
    </div>
  );
};

export default RequestRide;



























// import React, { useState, useContext } from "react"; // Import useContext
// import styles from "./RequestRide.module.css";
// import { useLoadScript } from "@react-google-maps/api";
// import Autocomplete from "react-google-autocomplete";
// import { useNavigate } from "react-router-dom";
// import { submitRideRequest } from "../../services/api"; // Import a new API function
// // Assuming you have an AuthContext providing user info
// // import { AuthContext } from "../../context/AuthContext"; // Adjust path as needed

// const libraries = ["places"];

// const RequestRide = () => {
//   const navigate = useNavigate();
//   // const { user } = useContext(AuthContext); // Get logged-in user info (contains user_id)

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Ensure this is set in your .env.local
//     libraries,
//   });

//   // Store the full place object from Autocomplete
//   const [pickupPlace, setPickupPlace] = useState(null);
//   const [dropoffPlace, setDropoffPlace] = useState(null);
//   const [pooling, setPooling] = useState(false);
//   // These might be sent or used later for filtering/pricing, keep them for now
//   const [rideType, setRideType] = useState("standard");
//   const [passengers, setPassengers] = useState(1);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);


//   // --- Get Rider ID (Crucial!) ---
//   // This needs to come from your authentication state management
//   // Replace this with your actual logic (Context, Redux, Zustand, localStorage)
//   const getRiderId = () => {
//     // Example: Fetching from localStorage after login
//     const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Assuming you store user info here
//     // IMPORTANT: Your backend needs to map this user_id to a rider_id
//     // Or your backend endpoint might just take user_id and figure out the rider_id
//     if (userInfo && userInfo.id) {
//         return userInfo.id; // This should be the user_id from your 'users' table
//     }
//     console.error("Rider ID not found. User might not be logged in.");
//     setError("User information not found. Please log in again.");
//     return null;
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); // Clear previous errors
//     setLoading(true);

//     const riderId = getRiderId(); // Get the rider ID

//     // --- Validation ---
//     if (!riderId) {
//         // Error already set in getRiderId
//         setLoading(false);
//         return; // Stop if no rider ID
//     }
//     if (!pickupPlace || !pickupPlace.geometry || !pickupPlace.geometry.location) {
//       setError("Please select a valid pickup location from the suggestions.");
//       setLoading(false);
//       return;
//     }
//     if (!dropoffPlace || !dropoffPlace.geometry || !dropoffPlace.geometry.location) {
//       setError("Please select a valid dropoff location from the suggestions.");
//       setLoading(false);
//       return;
//     }

//     // --- Extract Coordinates ---
//     const sourceCoords = {
//       latitude: pickupPlace.geometry.location.lat(),
//       longitude: pickupPlace.geometry.location.lng(),
//     };
//     const destinationCoords = {
//       latitude: dropoffPlace.geometry.location.lat(),
//       longitude: dropoffPlace.geometry.location.lng(),
//     };

//     // --- Prepare Payload for Backend ---
//     // Adjust structure based on what your *new* backend endpoint expects
//     const rideRequestPayload = {
//       rider_id: riderId, // Send the user_id, backend maps it to rider
//       source: sourceCoords, // Send coordinates
//       destination: destinationCoords, // Send coordinates
//       pooling: pooling,
//       // Optional: Include other details if your backend needs them for matching/pricing upfront
//       // passengers: passengers,
//       // ride_type: rideType,
//       // You might also send formatted addresses for display purposes on the backend/driver app
//       source_address: pickupPlace.formatted_address,
//       destination_address: dropoffPlace.formatted_address,
//     };

//     console.log("Submitting Ride Request Payload:", rideRequestPayload);

//     try {
//       // --- API Call ---
//       // This function needs to be created in 'src/services/api.js'
//       // It will POST to your new backend endpoint (e.g., /api/rides/initiate-request/)
//       const response = await submitRideRequest(rideRequestPayload);

//       console.log("Ride request submitted successfully:", response);

//       // --- Navigate to Waiting Page ---
//       // Pass the request ID (or relevant data) from the backend response
//       // The waiting page will use this ID to check status
//       navigate("/rider/waiting", { state: { requestId: response.request_id } }); // Assuming backend returns request_id

//     } catch (err) {
//       console.error("Ride request submission failed:", err.response?.data || err.message);
//       setError(err.response?.data?.detail || err.response?.data?.error || "Failed to submit ride request. Please try again.");
//       setLoading(false);
//     }
//     // No finally { setLoading(false) } here because navigation happens on success
//   };

//   if (loadError) return <div>Error loading maps. Please check your API key and network connection.</div>;
//   if (!isLoaded) return <div>Loading maps...</div>;

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Request a New Ride</h2>
//       {error && <p className={styles.errorText}>{error}</p>} {/* Display errors */}
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <div className={styles.fieldGroup}>
//            <label className={styles.label}>Pickup Location:</label>
//            <Autocomplete
//              apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//              onPlaceSelected={(place) => {
//                setPickupPlace(place);
//                setError(""); // Clear error on selection
//              }}
//              options={{ types: ["geocode"] }}
//              className={styles.input}
//              placeholder="Enter Pickup Address"
//            />
//         </div>

//          <div className={styles.fieldGroup}>
//            <label className={styles.label}>Dropoff Location:</label>
//            <Autocomplete
//              apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//              onPlaceSelected={(place) => {
//                  setDropoffPlace(place);
//                  setError(""); // Clear error on selection
//              }}
//              options={{ types: ["geocode"] }}
//              className={styles.input}
//              placeholder="Enter Dropoff Address"
//            />
//          </div>

//         <div className={styles.fieldGroup}>
//           <label className={styles.label}>Pooling?</label>
//           <select
//             value={pooling}
//             onChange={(e) => setPooling(e.target.value === "true")}
//             className={styles.select}
//             disabled={loading}
//           >
//             <option value="false">No (Private Ride)</option>
//             <option value="true">Yes (Share Ride)</option>
//           </select>
//         </div>

//         <div className={styles.fieldGroup}>
//           <label className={styles.label}>Ride Type:</label>
//           <select
//             value={rideType}
//             onChange={(e) => setRideType(e.target.value)}
//             className={styles.select}
//             disabled={loading}
//           >
//             <option value="standard">Standard</option>
//             <option value="premium">Premium</option>
//           </select>
//         </div>

//         <div className={styles.fieldGroup}>
//           <label className={styles.label}>No. of Passengers:</label>
//           <input
//             type="number"
//             min="1"
//             max={pooling ? 2 : 6} // Example: Limit passengers for pooling
//             value={passengers}
//             onChange={(e) => setPassengers(parseInt(e.target.value))}
//             className={styles.input}
//             required
//             disabled={loading}
//           />
//         </div>

//         <button type="submit" className={styles.button} disabled={loading}>
//           {loading ? "Searching..." : "Find Ride"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RequestRide;


















// // src/pages/Rider/RequestRide.js
// import React, { useState, useEffect } from "react"; // Keep useEffect for potential future use, but comment out its body
// import styles from "./RequestRide.module.css";
// import { useLoadScript } from "@react-google-maps/api";
// import Autocomplete from "react-google-autocomplete";
// import { useNavigate } from "react-router-dom";
// import { submitRideRequest } from "../../services/api"; // Import the API function

// const libraries = ["places"]; // Google Maps libraries to load

// const RequestRide = () => {
//   const navigate = useNavigate();
//   // TEMPORARILY removed riderId state fetching
//   // const [riderId, setRiderId] = useState(null);

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   // State for form inputs
//   const [pickupPlace, setPickupPlace] = useState(null);
//   const [dropoffPlace, setDropoffPlace] = useState(null);
//   const [pooling, setPooling] = useState(false);
//   const [rideType, setRideType] = useState("standard");
//   const [passengers, setPassengers] = useState(1);

//   // State for UI feedback
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // --- TEMPORARILY COMMENTED OUT RIDER ID FETCHING ---
//   // useEffect(() => {
//   //   try {
//   //     const storedUserInfo = localStorage.getItem('userInfo');
//   //     if (storedUserInfo) {
//   //         const userInfo = JSON.parse(storedUserInfo);
//   //         if (userInfo && userInfo.id) {
//   //             setRiderId(userInfo.id);
//   //         } else {
//   //             console.error("User ID not found in stored user info.");
//   //             // setError("User information incomplete. Please log in again.");
//   //         }
//   //     } else {
//   //         console.error("User info not found in local storage.");
//   //         // setError("You must be logged in to request a ride.");
//   //     }
//   //   } catch (parseError) {
//   //       console.error("Error parsing user info from local storage:", parseError);
//   //       // setError("Failed to load user data. Please log in again.");
//   //   }
//   // }, [navigate]);
//   // --- END OF TEMPORARY COMMENT ---

//   // --- Form Submission Handler ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     // --- TEMPORARILY COMMENTED OUT RIDER ID CHECK ---
//     // if (!riderId) {
//     //     setError("User information is missing. Cannot request ride.");
//     //     setLoading(false);
//     //     return;
//     // }
//     // --- END OF TEMPORARY COMMENT ---

//     // Check if valid places were selected
//     if (!pickupPlace || !pickupPlace.geometry || !pickupPlace.geometry.location) {
//       setError("Please select a valid pickup location from the suggestions.");
//       setLoading(false);
//       return;
//     }
//     if (!dropoffPlace || !dropoffPlace.geometry || !dropoffPlace.geometry.location) {
//       setError("Please select a valid dropoff location from the suggestions.");
//       setLoading(false);
//       return;
//     }
//      if (passengers < 1) {
//       setError("Number of passengers must be at least 1.");
//       setLoading(false);
//       return;
//     }

//     // Extract Coordinates
//     let sourceCoords, destinationCoords;
//     try {
//         sourceCoords = {
//             latitude: pickupPlace.geometry.location.lat(),
//             longitude: pickupPlace.geometry.location.lng(),
//         };
//         destinationCoords = {
//             latitude: dropoffPlace.geometry.location.lat(),
//             longitude: dropoffPlace.geometry.location.lng(),
//         };
//     } catch (coordError) {
//         console.error("Error extracting coordinates:", coordError);
//         setError("Could not get coordinates from selected locations. Please try again.");
//         setLoading(false);
//         return;
//     }

//     // --- Prepare Payload for Backend ---
//     // *** PROVIDE A DUMMY RIDER ID FOR TESTING ***
//     const dummyRiderId = 1; // Replace with a valid user_id from your DB if needed for the API call to succeed
//     const rideRequestPayload = {
//       // rider_id: riderId, // Use dummy ID instead
//       rider_id: dummyRiderId, // <<< USING DUMMY ID
//       source: sourceCoords,
//       destination: destinationCoords,
//       pooling: pooling,
//       passengers: passengers,
//       ride_type: rideType,
//       source_address: pickupPlace.formatted_address,
//       destination_address: dropoffPlace.formatted_address,
//     };

//     console.log("Submitting Ride Request Payload (with dummy riderId):", rideRequestPayload);

//     // --- API Call ---
//     try {
//       const response = await submitRideRequest(rideRequestPayload);
//       console.log("Ride request submitted successfully:", response);

//       // Navigate to Waiting Page on Success - Assuming backend returns request_id
//       if (response && response.request_id) {
//         navigate("/rider/waiting", { state: { requestId: response.request_id } });
//       } else {
//          // *** FOR TESTING NAVIGATION DIRECTLY (if API doesn't return request_id yet): ***
//          console.warn("Backend response missing request_id or API call failed, navigating directly for testing.");
//          // You could force navigation here, but it's better if the API returns the ID.
//          // If you absolutely must navigate without a successful API call returning an ID for testing:
//          const dummyRequestId = Date.now(); // Generate a temporary fake ID
//          navigate("/rider/waiting", { state: { requestId: dummyRequestId } });
//          // *******************************************************************************
//          // setError("Request submitted, but failed to get confirmation ID. Please check your rides.");
//          // setLoading(false);
//       }

//     } catch (err) {
//       console.error("Ride request submission failed:", err.response?.data || err.message || err);
//       setError(err.response?.data?.detail || err.response?.data?.error || "Failed to submit ride request (API error).");
//       // *** FOR TESTING NAVIGATION EVEN ON API ERROR: ***
//       console.warn("API call failed, navigating directly for testing.");
//       const dummyRequestIdOnError = Date.now(); // Generate a temporary fake ID
//       navigate("/rider/waiting", { state: { requestId: dummyRequestIdOnError } });
//       // ***************************************************
//       // setLoading(false); // Usually set loading false here, but navigation happens now
//     }
//   };

//   // --- Render Logic ---
//   if (loadError) return <div className={styles.errorText}>Error loading maps. Please check your API key and network connection, then refresh the page.</div>;
//   if (!isLoaded) return <div className={styles.loadingText}>Loading maps...</div>;

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Request a New Ride</h2>
//       {error && <p className={styles.errorText}>{error}</p>}

//       <form onSubmit={handleSubmit} className={styles.form}>
//         {/* ... (rest of the form inputs remain the same) ... */}

//          {/* Pickup Location Input */}
//          <div className={styles.fieldGroup}>
//            <label htmlFor="pickup-location" className={styles.label}>Pickup Location:</label>
//            <Autocomplete
//              apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//              onPlaceSelected={(place) => {
//                setPickupPlace(place);
//                if (place?.geometry) setError("");
//              }}
//              options={{ types: ["geocode", "establishment"] }}
//              className={styles.input}
//              placeholder="Enter Pickup Address"
//              id="pickup-location"
//              disabled={loading}
//            />
//         </div>

//          {/* Dropoff Location Input */}
//          <div className={styles.fieldGroup}>
//            <label htmlFor="dropoff-location" className={styles.label}>Dropoff Location:</label>
//            <Autocomplete
//              apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//              onPlaceSelected={(place) => {
//                  setDropoffPlace(place);
//                  if (place?.geometry) setError("");
//              }}
//              options={{ types: ["geocode", "establishment"] }}
//              className={styles.input}
//              placeholder="Enter Dropoff Address"
//              id="dropoff-location"
//              disabled={loading}
//            />
//          </div>

//         {/* Pooling Option */}
//         <div className={styles.fieldGroup}>
//           <label htmlFor="pooling-select" className={styles.label}>Pooling?</label>
//           <select
//             id="pooling-select"
//             value={pooling}
//             onChange={(e) => setPooling(e.target.value === "true")}
//             className={styles.select}
//             disabled={loading}
//           >
//             <option value="false">No (Private Ride)</option>
//             <option value="true">Yes (Share Ride)</option>
//           </select>
//         </div>

//         {/* Ride Type Option */}
//         <div className={styles.fieldGroup}>
//           <label htmlFor="rideType-select" className={styles.label}>Ride Type:</label>
//           <select
//             id="rideType-select"
//             value={rideType}
//             onChange={(e) => setRideType(e.target.value)}
//             className={styles.select}
//             disabled={loading}
//           >
//             <option value="standard">Standard</option>
//             <option value="premium">Premium</option>
//           </select>
//         </div>

//         {/* Passengers Input */}
//         <div className={styles.fieldGroup}>
//           <label htmlFor="passengers-input" className={styles.label}>No. of Passengers:</label>
//           <input
//             id="passengers-input"
//             type="number"
//             min="1"
//             max={pooling ? 2 : 6}
//             value={passengers}
//             onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
//             className={styles.input}
//             required
//             disabled={loading}
//           />
//         </div>


//         {/* Submit Button - Removed !riderId check from disabled */}
//         <button type="submit" className={styles.button} disabled={loading}>
//           {loading ? "Searching..." : "Find Ride"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RequestRide;