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
//     googleMapsApiKey: "AIzaSyAppFXEnV-7uIz605C8ht9r-PcQ_gexOXw", // Replace with env var later
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













































import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import styles from "./RideTracking.module.css";

const libraries = ["places"];

const RideTracking = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [pickup] = useState("Connaught Place, New Delhi");
  const [dropoff] = useState("India Gate, New Delhi");
  const [directions, setDirections] = useState(null);
  const [rideDistance, setRideDistance] = useState(null);
  const [rideDuration, setRideDuration] = useState(null);
  const [fare, setFare] = useState(null);
  const navigate = useNavigate();

  const driverInfo = {
    name: "Rahul Sharma",
    vehicleNumber: "DL4CAF1234",
    phone: "+91 9876543210",
    rideType: "Standard",
    pooling: true,
  };

  useEffect(() => {
    if (!isLoaded || !window.google || !window.google.maps) return;

    const service = new window.google.maps.DirectionsService();
    const waypoints = driverInfo.pooling
      ? [{ location: "Rajiv Chowk, New Delhi", stopover: true }]
      : [];

    service.route(
      {
        origin: pickup,
        destination: dropoff,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);

          const totalDistance = result.routes[0].legs.reduce(
            (sum, leg) => sum + leg.distance.value,
            0
          );
          const totalDuration = result.routes[0].legs.reduce(
            (sum, leg) => sum + leg.duration.value,
            0
          );

          setRideDistance((totalDistance / 1000).toFixed(2) + " km");
          setRideDuration(Math.ceil(totalDuration / 60) + " mins");

          const baseFare = driverInfo.rideType === "premium" ? 60 : 30;
          const perKmRate = driverInfo.rideType === "premium" ? 18 : 10;
          const poolingDiscount = driverInfo.pooling ? 0.85 : 1;

          const fareAmount =
            (baseFare + perKmRate * (totalDistance / 1000)) * poolingDiscount;
          setFare("\u20B9" + fareAmount.toFixed(0));
        } else {
          console.error("Error fetching directions", result);
        }
      }
    );
  }, [isLoaded, pickup, dropoff, driverInfo.pooling, driverInfo.rideType]);

  if (loadError) return <div>Error loading maps...</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.mapContainer}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "10px" }}
          center={{ lat: 28.6139, lng: 77.209 }}
          zoom={15}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      <div className={styles.detailsPanel}>
        <h2>Driver Details</h2>
        <p><strong>Name:</strong> {driverInfo.name}</p>
        <p><strong>Vehicle:</strong> {driverInfo.vehicleNumber}</p>
        <p><strong>Phone:</strong> {driverInfo.phone}</p>
        <p><strong>Ride Type:</strong> {driverInfo.rideType}</p>
        <p><strong>Pooling:</strong> {driverInfo.pooling ? "Yes" : "No"}</p>
        <hr />
        <p><strong>Pickup:</strong> {pickup}</p>
        <p><strong>Dropoff:</strong> {dropoff}</p>
        {rideDistance && rideDuration && (
          <>
            <p><strong>Distance:</strong> {rideDistance}</p>
            <p><strong>Duration:</strong> {rideDuration}</p>
            <p><strong>Estimated Fare:</strong> {fare}</p>
          </>
        )}
        <button className={styles.doneButton} onClick={() => navigate("/rider/complete")}>Ride Done</button>
      </div>
    </div>
  );
};

export default RideTracking;
