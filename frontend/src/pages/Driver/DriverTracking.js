// import React, { useState, useEffect } from "react";
// import {
//   GoogleMap,
//   DirectionsRenderer,
//   useLoadScript,
// } from "@react-google-maps/api";
// import styles from "./DriverTracking.module.css";

// const libraries = ["places"];

// const DriverTracking = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const [directions, setDirections] = useState(null);
//   const [currentRides, setCurrentRides] = useState([
//     {
//       id: 1,
//       name: "Ravi Kumar",
//       pickup: "Connaught Place, New Delhi",
//       dropoff: "India Gate, New Delhi",
//       pooling: true,
//       rideType: "Standard",
//       completed: false,
//     },
//   ]);

//   const [newRequest, setNewRequest] = useState({
//     id: 2,
//     name: "Anita Singh",
//     pickup: "Rajiv Chowk, New Delhi",
//     dropoff: "India Gate, New Delhi",
//   });

//   useEffect(() => {
//     if (!isLoaded || !window.google || currentRides.length === 0) return;

//     const directionsService = new window.google.maps.DirectionsService();

//     const origin = currentRides[0].pickup;
//     const destination = currentRides[0].dropoff;

//     const waypoints = currentRides
//       .slice(1)
//       .flatMap((ride) => [
//         { location: ride.pickup, stopover: true },
//         { location: ride.dropoff, stopover: true },
//       ]);

//     directionsService.route(
//       {
//         origin,
//         destination,
//         waypoints,
//         travelMode: window.google.maps.TravelMode.DRIVING,
//         optimizeWaypoints: true,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);
//         } else {
//           console.error("Error fetching directions", result);
//         }
//       }
//     );
//   }, [isLoaded, currentRides]);

//   const handleAcceptRequest = () => {
//     const updated = {
//       ...newRequest,
//       pooling: true,
//       rideType: "Standard",
//       completed: false,
//     };
//     setCurrentRides([...currentRides, updated]);
//     setNewRequest(null);
//   };

//   const handleRejectRequest = () => {
//     alert("Request rejected.");
//     setNewRequest(null);
//   };

//   const handleRideComplete = (id) => {
//     setCurrentRides((prev) =>
//       prev.map((ride) =>
//         ride.id === id ? { ...ride, completed: true } : ride
//       )
//     );
//   };

//   if (loadError) return <div>Error loading maps</div>;
//   if (!isLoaded) return <div>Loading map...</div>;

//   return (
//     <div className={styles.container}>
//       <div className={styles.mapContainer}>
//         <GoogleMap
//           mapContainerStyle={{ width: "100%", height: "100%" }}
//           center={{ lat: 28.6139, lng: 77.209 }}
//           zoom={14}
//         >
//           {directions && <DirectionsRenderer directions={directions} />}
//         </GoogleMap>
//       </div>

//       <div className={styles.infoPanel}>
//         <h2>Driver Panel</h2>
//         {currentRides.map((ride) => (
//           <div
//             key={ride.id}
//             className={`${styles.rideCard} ${
//               ride.completed ? styles.completed : ""
//             }`}
//           >
//             <p><strong>Rider:</strong> {ride.name}</p>
//             <p><strong>Pickup:</strong> {ride.pickup}</p>
//             <p><strong>Dropoff:</strong> {ride.dropoff}</p>
//             <p><strong>Ride Type:</strong> {ride.rideType}</p>
//             <p><strong>Pooling:</strong> {ride.pooling ? "Yes" : "No"}</p>
//             {!ride.completed && (
//               <button
//                 className={styles.completeButton}
//                 onClick={() => handleRideComplete(ride.id)}
//               >
//                 Mark Ride as Done
//               </button>
//             )}
//           </div>
//         ))}

//         {newRequest && (
//           <div className={styles.newRequest}>
//             <h3>New Pool Request</h3>
//             <p><strong>Rider:</strong> {newRequest.name}</p>
//             <p><strong>Pickup:</strong> {newRequest.pickup}</p>
//             <p><strong>Dropoff:</strong> {newRequest.dropoff}</p>
//             <div className={styles.buttonGroup}>
//               <button onClick={handleAcceptRequest}>Accept</button>
//               <button onClick={handleRejectRequest}>Reject</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DriverTracking;




//THis was close of what we wanted but accept not working








































import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import styles from "./DriverTracking.module.css";

const libraries = ["places"];

const DriverTracking = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [directions, setDirections] = useState(null);
  const [currentRides, setCurrentRides] = useState([
    {
      id: 1,
      name: "Ravi Kumar",
      pickup: "Connaught Place, New Delhi",
      dropoff: "India Gate, New Delhi",
      pooling: true,
      rideType: "Standard",
    },
  ]);

  const [newRequest, setNewRequest] = useState({
    id: 2,
    name: "Anita Singh",
    pickup: "Rajiv Chowk, New Delhi",
    dropoff: "Central Secretariat, New Delhi",
  });

  const [completedRides, setCompletedRides] = useState([]);

  useEffect(() => {
    if (!isLoaded || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    if (currentRides.length === 0) return;

    const origin = currentRides[0].pickup;
    const destination = currentRides[currentRides.length - 1].dropoff;

    const waypoints = currentRides.slice(1, -1).flatMap((ride) => [
      { location: ride.pickup, stopover: true },
      { location: ride.dropoff, stopover: true },
    ]);

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Error fetching directions", result);
        }
      }
    );
  }, [isLoaded, currentRides]);

  const handleAcceptRequest = () => {
    setCurrentRides([...currentRides, { ...newRequest, pooling: true, rideType: "Standard" }]);
    setNewRequest(null);
  };

  const handleRejectRequest = () => {
    alert("Request rejected.");
    setNewRequest(null);
  };

  const handleRideComplete = (rideId) => {
    setCompletedRides([...completedRides, rideId]);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.mapContainer}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{ lat: 28.6139, lng: 77.209 }}
          zoom={14}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      <div className={styles.infoPanel}>
        <h2>Driver Panel</h2>
        {currentRides.map((ride) => (
          <div
            key={ride.id}
            className={`${styles.rideCard} ${
              completedRides.includes(ride.id) ? styles.completed : ""
            }`}
          >
            <p><strong>Rider:</strong> {ride.name}</p>
            <p><strong>Pickup:</strong> {ride.pickup}</p>
            <p><strong>Dropoff:</strong> {ride.dropoff}</p>
            <p><strong>Ride Type:</strong> {ride.rideType}</p>
            <p><strong>Pooling:</strong> {ride.pooling ? "Yes" : "No"}</p>
            <button
              disabled={completedRides.includes(ride.id)}
              onClick={() => handleRideComplete(ride.id)}
            >
              Mark Ride as Done
            </button>
          </div>
        ))}

        {newRequest && (
          <div className={styles.newRequest}>
            <h3>New Pool Request</h3>
            <p><strong>Rider:</strong> {newRequest.name}</p>
            <p><strong>Pickup:</strong> {newRequest.pickup}</p>
            <p><strong>Dropoff:</strong> {newRequest.dropoff}</p>
            <div className={styles.buttonGroup}>
              <button onClick={handleAcceptRequest}>Accept</button>
              <button onClick={handleRejectRequest}>Reject</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverTracking;
