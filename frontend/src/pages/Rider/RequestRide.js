
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

