// import React, { useEffect, useRef, useState } from "react";
// import {
//   GoogleMap,
//   useLoadScript,
//   DirectionsRenderer,
// } from "@react-google-maps/api";

// const libraries = ["places"];

// const containerStyle = {
//   width: "100%",
//   height: "80vh",
//   borderRadius: "10px",
//   marginTop: "20px",
// };

// const RideTracking = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const [directions, setDirections] = useState(null);
//   const directionsService = useRef(null);

//   const [pickup] = useState({ lat: 28.6129, lng: 77.229 }); // India Gate
//   const [dropoff] = useState({ lat: 28.605, lng: 77.195 }); // Lodhi Garden

//   useEffect(() => {
//     if (!isLoaded || !window.google || !window.google.maps) return;

//     directionsService.current = new window.google.maps.DirectionsService();

//     directionsService.current.route(
//       {
//         origin: pickup,
//         destination: dropoff,
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === window.google.maps.DirectionsStatus.OK) {
//           setDirections(result);
//         } else {
//           console.error("Error fetching directions", result);
//         }
//       }
//     );
//   }, [isLoaded, pickup, dropoff]);

//   if (loadError) return <div>Error loading maps.</div>;
//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Track Your Ride</h2>
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={pickup}
//         zoom={14}
//       >
//         {directions && <DirectionsRenderer directions={directions} />}
//       </GoogleMap>
//     </div>
//   );
// };

// export default RideTracking;























// import React, { useEffect, useRef, useState } from "react";
// import {
//   GoogleMap,
//   useLoadScript,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import { useNavigate } from "react-router-dom";
// import styles from "./RideTracking.module.css";

// const libraries = ["places"];

// const containerStyle = {
//   width: "100%",
//   height: "80vh",
//   borderRadius: "10px",
// };

// const RideTracking = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const navigate = useNavigate();

//   const [directions, setDirections] = useState(null);
//   const directionsService = useRef(null);

//   const [pickup] = useState({ lat: 28.6129, lng: 77.229 }); // Static pickup
//   const [dropoff] = useState({ lat: 28.605, lng: 77.195 }); // Static drop

//   // TEMP: Mock driver data — will be fetched from backend later
//   const driver = {
//     name: "Rahul Verma",
//     phone: "+91 9876543210",
//     vehicleModel: "Hyundai i20",
//     vehicleNumber: "DL01AB1234",
//   };

//   useEffect(() => {
//     if (!isLoaded || !window.google || !window.google.maps) return;

//     directionsService.current = new window.google.maps.DirectionsService();

//     directionsService.current.route(
//       {
//         origin: pickup,
//         destination: dropoff,
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === window.google.maps.DirectionsStatus.OK) {
//           setDirections(result);
//         } else {
//           console.error("Error fetching directions", result);
//         }
//       }
//     );
//   }, [isLoaded, pickup, dropoff]);

//   const handleRideComplete = () => {
//     navigate("/rider/complete");
//   };

//   if (loadError) return <div>Error loading maps.</div>;
//   if (!isLoaded) return <div>Loading map...</div>;

//   return (
//     <div className={styles.container}>
//       <div className={styles.map}>
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={pickup}
//           zoom={14}
//         >
//           {directions && <DirectionsRenderer directions={directions} />}
//         </GoogleMap>
//       </div>

//       <div className={styles.info}>
//         <h2>Driver Info</h2>
//         <p><strong>Name:</strong> {driver.name}</p>
//         <p><strong>Phone:</strong> {driver.phone}</p>
//         <p><strong>Vehicle:</strong> {driver.vehicleModel}</p>
//         <p><strong>Vehicle Number:</strong> {driver.vehicleNumber}</p>
//         <p><strong>Pickup:</strong> India Gate</p>
//         <p><strong>Dropoff:</strong> Lodhi Garden</p>

//         <button className={styles.completeBtn} onClick={handleRideComplete}>
//           Mark Ride Complete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RideTracking;





























// import React, { useEffect, useRef, useState } from "react";
// import {
//   GoogleMap,
//   useLoadScript,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import { useNavigate } from "react-router-dom";
// import styles from "./RideTracking.module.css";

// const libraries = ["places"];
// const containerStyle = {
//   width: "100%",
//   height: "80vh",
//   borderRadius: "12px",
// };

// const RideTracking = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const navigate = useNavigate();

//   const [directions, setDirections] = useState(null);
//   const directionsService = useRef(null);

//   // Mock data — should be passed via route state or fetched from backend
//   const pickup = "India Gate, New Delhi";
//   const dropoff = "Lodhi Garden, New Delhi";
//   const pooling = true;
//   const rideType = "Premium";
//   const passengers = 2;

//   const driver = {
//     name: "Rahul Verma",
//     phone: "+91 9876543210",
//     vehicleModel: rideType,
//     vehicleNumber: "DL01AB1234",
//   };

//   useEffect(() => {
//     if (!isLoaded || !window.google || !window.google.maps) return;

//     directionsService.current = new window.google.maps.DirectionsService();

//     directionsService.current.route(
//       {
//         origin: pickup,
//         destination: dropoff,
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === window.google.maps.DirectionsStatus.OK) {
//           setDirections(result);
//         } else {
//           console.error("Error fetching directions", result);
//         }
//       }
//     );
//   }, [isLoaded]);

//   const handleComplete = () => {
//     navigate("/rider/complete");
//   };

//   if (loadError) return <div>Error loading map.</div>;
//   if (!isLoaded) return <div>Loading map...</div>;

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.map}>
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={{ lat: 28.6139, lng: 77.209 }}
//           zoom={13}
//         >
//           {directions && <DirectionsRenderer directions={directions} />}
//         </GoogleMap>
//       </div>

//       <div className={styles.sidebar}>
//         <h2>Ride in Progress</h2>
//         <div className={styles.card}>
//           <h3>Driver Info</h3>
//           <p><strong>Name:</strong> {driver.name}</p>
//           <p><strong>Phone:</strong> {driver.phone}</p>
//           <p><strong>Vehicle Model:</strong> {driver.vehicleModel}</p>
//           <p><strong>Vehicle Number:</strong> {driver.vehicleNumber}</p>
//         </div>

//         <div className={styles.card}>
//           <h3>Ride Details</h3>
//           <p><strong>Pickup:</strong> {pickup}</p>
//           <p><strong>Dropoff:</strong> {dropoff}</p>
//           <p><strong>Ride Type:</strong> {rideType}</p>
//           <p><strong>Pooling:</strong> {pooling ? "Yes" : "No"}</p>
//           <p><strong>Passengers:</strong> {passengers}</p>
//         </div>

//         <button className={styles.completeBtn} onClick={handleComplete}>
//           Mark Ride Complete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RideTracking;



























// import React, { useState, useEffect, useRef } from "react";
// import {
//   GoogleMap,
//   DirectionsRenderer,
//   useLoadScript,
// } from "@react-google-maps/api";
// import styles from "./RideTracking.module.css";

// const libraries = ["places"];

// const RideTracking = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const [pickup] = useState("Connaught Place, New Delhi");
//   const [dropoff] = useState("India Gate, New Delhi");
//   const [directions, setDirections] = useState(null);
//   const [rideDistance, setRideDistance] = useState(null);
//   const [rideDuration, setRideDuration] = useState(null);
//   const [fare, setFare] = useState(null);

//   const driverInfo = {
//     name: "Rahul Sharma",
//     vehicleNumber: "DL4CAF1234",
//     phone: "+91 9876543210",
//     rideType: "Standard",
//     pooling: true,
//   };

//   useEffect(() => {
//     if (!isLoaded || !window.google || !window.google.maps) return;

//     const service = new window.google.maps.DirectionsService();

//     const waypoints = driverInfo.pooling
//       ? [{ location: "Rajiv Chowk, New Delhi", stopover: true }]
//       : [];

//     service.route(
//       {
//         origin: pickup,
//         destination: dropoff,
//         waypoints,
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);

//           // 👇 Summing all legs for accurate distance and duration
//           const totalDistance = result.routes[0].legs.reduce(
//             (sum, leg) => sum + leg.distance.value,
//             0
//           );
//           const totalDuration = result.routes[0].legs.reduce(
//             (sum, leg) => sum + leg.duration.value,
//             0
//           );

//           setRideDistance((totalDistance / 1000).toFixed(2) + " km");
//           setRideDuration(Math.ceil(totalDuration / 60) + " mins");

//           // 💰 Fare calculation (basic version)
//           const baseFare = driverInfo.rideType === "premium" ? 60 : 30;
//           const perKmRate = driverInfo.rideType === "premium" ? 18 : 10;
//           const poolingDiscount = driverInfo.pooling ? 0.85 : 1;

//           const fareAmount = (baseFare + perKmRate * (totalDistance / 1000)) * poolingDiscount;
//           setFare("₹" + fareAmount.toFixed(0));
//         } else {
//           console.error("Error fetching directions", result);
//         }
//       }
//     );
//   }, [isLoaded, pickup, dropoff, driverInfo.pooling, driverInfo.rideType]);

//   if (loadError) return <div>Error loading maps...</div>;
//   if (!isLoaded) return <div>Loading maps...</div>;

//   return (
//     <div className={styles.container}>
//       <div className={styles.mapContainer}>
//         <GoogleMap
//           mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "10px" }}
//           center={{ lat: 28.6139, lng: 77.209 }}
//           zoom={13}
//         >
//           {directions && <DirectionsRenderer directions={directions} />}
//         </GoogleMap>
//       </div>

//       <div className={styles.detailsPanel}>
//         <h2>Driver Details</h2>
//         <p><strong>Name:</strong> {driverInfo.name}</p>
//         <p><strong>Vehicle:</strong> {driverInfo.vehicleNumber}</p>
//         <p><strong>Phone:</strong> {driverInfo.phone}</p>
//         <p><strong>Ride Type:</strong> {driverInfo.rideType}</p>
//         <p><strong>Pooling:</strong> {driverInfo.pooling ? "Yes" : "No"}</p>
//         <hr />
//         <p><strong>Pickup:</strong> {pickup}</p>
//         <p><strong>Dropoff:</strong> {dropoff}</p>
//         {rideDistance && rideDuration && (
//           <>
//             <p><strong>Distance:</strong> {rideDistance}</p>
//             <p><strong>Duration:</strong> {rideDuration}</p>
//             <p><strong>Estimated Fare:</strong> {fare}</p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RideTracking;













































// import React, { useState, useEffect } from "react";
// import {
//   GoogleMap,
//   DirectionsRenderer,
//   useLoadScript,
// } from "@react-google-maps/api";
// import { useNavigate } from "react-router-dom";
// import styles from "./RideTracking.module.css";

// const libraries = ["places"];

// const RideTracking = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const [pickup] = useState("Connaught Place, New Delhi");
//   const [dropoff] = useState("India Gate, New Delhi");
//   const [directions, setDirections] = useState(null);
//   const [rideDistance, setRideDistance] = useState(null);
//   const [rideDuration, setRideDuration] = useState(null);
//   const [fare, setFare] = useState(null);
//   const navigate = useNavigate();

//   const driverInfo = {
//     name: "Rahul Sharma",
//     vehicleNumber: "DL4CAF1234",
//     phone: "+91 9876543210",
//     rideType: "Standard",
//     pooling: true,
//   };

//   useEffect(() => {
//     if (!isLoaded || !window.google || !window.google.maps) return;

//     const service = new window.google.maps.DirectionsService();
//     const waypoints = driverInfo.pooling
//       ? [{ location: "Rajiv Chowk, New Delhi", stopover: true }]
//       : [];

//     service.route(
//       {
//         origin: pickup,
//         destination: dropoff,
//         waypoints,
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);

//           const totalDistance = result.routes[0].legs.reduce(
//             (sum, leg) => sum + leg.distance.value,
//             0
//           );
//           const totalDuration = result.routes[0].legs.reduce(
//             (sum, leg) => sum + leg.duration.value,
//             0
//           );

//           setRideDistance((totalDistance / 1000).toFixed(2) + " km");
//           setRideDuration(Math.ceil(totalDuration / 60) + " mins");

//           const baseFare = driverInfo.rideType === "premium" ? 60 : 30;
//           const perKmRate = driverInfo.rideType === "premium" ? 18 : 10;
//           const poolingDiscount = driverInfo.pooling ? 0.85 : 1;

//           const fareAmount =
//             (baseFare + perKmRate * (totalDistance / 1000)) * poolingDiscount;
//           setFare("\u20B9" + fareAmount.toFixed(0));
//         } else {
//           console.error("Error fetching directions", result);
//         }
//       }
//     );
//   }, [isLoaded, pickup, dropoff, driverInfo.pooling, driverInfo.rideType]);

//   if (loadError) return <div>Error loading maps...</div>;
//   if (!isLoaded) return <div>Loading maps...</div>;

//   return (
//     <div className={styles.container}>
//       <div className={styles.mapContainer}>
//         <GoogleMap
//           mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "10px" }}
//           center={{ lat: 28.6139, lng: 77.209 }}
//           zoom={15}
//         >
//           {directions && <DirectionsRenderer directions={directions} />}
//         </GoogleMap>
//       </div>

//       <div className={styles.detailsPanel}>
//         <h2>Driver Details</h2>
//         <p><strong>Name:</strong> {driverInfo.name}</p>
//         <p><strong>Vehicle:</strong> {driverInfo.vehicleNumber}</p>
//         <p><strong>Phone:</strong> {driverInfo.phone}</p>
//         <p><strong>Ride Type:</strong> {driverInfo.rideType}</p>
//         <p><strong>Pooling:</strong> {driverInfo.pooling ? "Yes" : "No"}</p>
//         <hr />
//         <p><strong>Pickup:</strong> {pickup}</p>
//         <p><strong>Dropoff:</strong> {dropoff}</p>
//         {rideDistance && rideDuration && (
//           <>
//             <p><strong>Distance:</strong> {rideDistance}</p>
//             <p><strong>Duration:</strong> {rideDuration}</p>
//             <p><strong>Estimated Fare:</strong> {fare}</p>
//           </>
//         )}
//         <button className={styles.doneButton} onClick={() => navigate("/rider/complete")}>Ride Done</button>
//       </div>
//     </div>
//   );
// };

// export default RideTracking;































import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import styles from "./RideTracking.module.css";

const libraries = ["places"];

const RideTracking = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const navigate = useNavigate();
  const location = useLocation(); // Use location to potentially get ride details

  // --- Get Ride Details ---
  // These should ideally come from the previous page (WaitingPage) or an API call
  // Using placeholder values for now, replace with actual data fetching
  const {
      rideId = Date.now(), // <<-- IMPORTANT: Get the actual ride ID! Using timestamp as placeholder
      pickupLocation = "Connaught Place, New Delhi", // Placeholder
      dropoffLocation = "India Gate, New Delhi", // Placeholder
      initialDriverInfo = { // Placeholder
        name: "Rohit Sharma",
        vehicleNumber: "DL4CAF1234",
        phone: "+91 9876543210",
        rideType: "Standard",
        pooling: true,
      }
  } = location.state || {};


  // State for map and ride details
  const [pickup] = useState(pickupLocation);
  const [dropoff] = useState(dropoffLocation);
  const [driverInfo] = useState(initialDriverInfo); // Use passed or default driver info
  const [directions, setDirections] = useState(null);
  const [rideDistance, setRideDistance] = useState(null);
  const [rideDuration, setRideDuration] = useState(null);
  const [fare, setFare] = useState(null); // Will be calculated

  // Effect to calculate route and fare
  useEffect(() => {
    // Ensure Maps API is loaded
    if (!isLoaded || !window.google || !window.google.maps) return;

    // Ensure we have pickup and dropoff locations
    if (!pickup || !dropoff) {
        console.error("Pickup or dropoff location missing.");
        return; // Don't proceed without locations
    }


    const directionsService = new window.google.maps.DirectionsService();
    const waypoints = driverInfo.pooling
      ? [{ location: "Rajiv Chowk, New Delhi", stopover: true }] // TODO: Replace with actual pooling waypoints if available
      : [];

    directionsService.route(
      {
        origin: pickup,
        destination: dropoff,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirections(result);

          // Safely calculate total distance and duration
          let totalDistance = 0;
          let totalDuration = 0;
          if (result.routes?.[0]?.legs) {
              result.routes[0].legs.forEach(leg => {
                  totalDistance += leg.distance?.value || 0;
                  totalDuration += leg.duration?.value || 0;
              });
          } else {
              console.warn("Directions result missing legs information.");
          }


          setRideDistance((totalDistance / 1000).toFixed(2) + " km");
          setRideDuration(Math.ceil(totalDuration / 60) + " mins");

          // Calculate fare (ensure totalDistance is in meters for calculation)
          const distanceInKm = totalDistance / 1000;
          const baseFare = driverInfo.rideType === "premium" ? 60 : 30;
          const perKmRate = driverInfo.rideType === "premium" ? 18 : 10;
          const poolingDiscount = driverInfo.pooling ? 0.85 : 1; // Example pooling discount

          // Basic fare calculation - adjust based on your actual pricing model
          const calculatedFare = (baseFare + perKmRate * distanceInKm) * poolingDiscount;

          // Format fare with currency symbol (ensure calculatedFare is a valid number)
          if (!isNaN(calculatedFare)) {
            setFare("\u20B9" + calculatedFare.toFixed(0)); // Using Rupee symbol
          } else {
            console.error("Fare calculation resulted in NaN.");
            setFare("N/A"); // Fallback if calculation fails
          }

        } else {
          console.error(`Error fetching directions ${result?.toString()}, Status: ${status}`);
          setFare("N/A"); // Set fare to N/A on error
        }
      }
    );
  // Dependencies for recalculation
  }, [isLoaded, pickup, dropoff, driverInfo.pooling, driverInfo.rideType]); // Include all variables from outside used inside

  // --- Navigation Handler ---
  const handleRideDone = () => {
      // Ensure fare has been calculated and rideId is available before navigating
      if (fare && fare !== "N/A" && rideId) {
         navigate("/rider/complete", {
             state: {
                 rideId: rideId,        // Pass the actual ride ID
                 fare: fare,            // Pass the calculated fare string (e.g., "₹200")
                 driverName: driverInfo.name // Pass the driver's name
             }
         });
      } else {
          console.error("Cannot navigate to complete page: Fare or Ride ID is missing.", { fare, rideId });
          // Optionally show an alert to the user
          alert("Could not finalize ride details. Please try again later.");
      }
  };


  // Render logic
  if (loadError) return <div className={styles.errorText}>Error loading maps. Please check your API key or network connection.</div>;
  if (!isLoaded) return <div className={styles.loadingText}>Loading map and calculating route...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.mapContainer}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "8px" }} // Slightly less rounded
          // Center map based on directions if available, otherwise fallback
          center={directions?.routes[0]?.legs[0]?.start_location || { lat: 28.6139, lng: 77.209 }}
          zoom={13} // Adjust zoom as needed
          options={{ // Disable some controls for cleaner look
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
          }}
        >
          {/* Render directions if available */}
          {directions && <DirectionsRenderer
              directions={directions}
              options={{ // Customize route appearance
                  polylineOptions: {
                      strokeColor: '#007bff', // Blue route line
                      strokeWeight: 5,
                      strokeOpacity: 0.8,
                  },
                  suppressMarkers: true // Hide default A/B markers if you add custom ones
              }}
           />}
           {/* TODO: Add custom markers for pickup, dropoff, driver location */}
        </GoogleMap>
      </div>

      <div className={styles.detailsPanel}>
        <h2>Ride Progress</h2>
        {/* Driver Info Section */}
        <div className={styles.detailSection}>
            <h4>Driver Details</h4>
            <p><strong>Name:</strong> {driverInfo.name}</p>
            <p><strong>Vehicle:</strong> {driverInfo.vehicleNumber}</p>
            <p><strong>Phone:</strong> <a href={`tel:${driverInfo.phone}`}>{driverInfo.phone}</a></p>
            <p><strong>Type:</strong> {driverInfo.rideType} {driverInfo.pooling ? "(Pooling)" : ""}</p>
        </div>

        {/* Ride Info Section */}
        <div className={styles.detailSection}>
            <h4>Ride Details</h4>
            <p><strong>Pickup:</strong> {pickup}</p>
            <p><strong>Dropoff:</strong> {dropoff}</p>
            {rideDistance && rideDuration ? (
            <>
                <p><strong>Est. Distance:</strong> {rideDistance}</p>
                <p><strong>Est. Duration:</strong> {rideDuration}</p>
                <p><strong>Estimated Fare:</strong> <span className={styles.fareHighlight}>{fare || "Calculating..."}</span></p>
            </>
            ) : (
                <p>Calculating route details...</p>
            )}
        </div>

        {/* Action Button */}
        <button
            className={styles.doneButton}
            onClick={handleRideDone} // Use the handler function
            disabled={!fare || fare === "N/A" || !rideId} // Disable if fare/rideId missing
        >
            Ride Completed
        </button>
      </div>
    </div>
  );
};

export default RideTracking;