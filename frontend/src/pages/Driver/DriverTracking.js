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
//     },
//   ]);

//   const [newRequest, setNewRequest] = useState({
//     id: 2,
//     name: "Anita Singh",
//     pickup: "Rajiv Chowk, New Delhi",
//     dropoff: "Central Secretariat, New Delhi",
//   });

//   const [completedRides, setCompletedRides] = useState([]);

//   useEffect(() => {
//     if (!isLoaded || !window.google) return;

//     const directionsService = new window.google.maps.DirectionsService();

//     if (currentRides.length === 0) return;

//     const origin = currentRides[0].pickup;
//     const destination = currentRides[currentRides.length - 1].dropoff;

//     const waypoints = currentRides.slice(1, -1).flatMap((ride) => [
//       { location: ride.pickup, stopover: true },
//       { location: ride.dropoff, stopover: true },
//     ]);

//     directionsService.route(
//       {
//         origin,
//         destination,
//         waypoints,
//         travelMode: window.google.maps.TravelMode.DRIVING,
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
//     setCurrentRides([...currentRides, { ...newRequest, pooling: true, rideType: "Standard" }]);
//     setNewRequest(null);
//   };

//   const handleRejectRequest = () => {
//     alert("Request rejected.");
//     setNewRequest(null);
//   };

//   const handleRideComplete = (rideId) => {
//     setCompletedRides([...completedRides, rideId]);
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
//               completedRides.includes(ride.id) ? styles.completed : ""
//             }`}
//           >
//             <p><strong>Rider:</strong> {ride.name}</p>
//             <p><strong>Pickup:</strong> {ride.pickup}</p>
//             <p><strong>Dropoff:</strong> {ride.dropoff}</p>
//             <p><strong>Ride Type:</strong> {ride.rideType}</p>
//             <p><strong>Pooling:</strong> {ride.pooling ? "Yes" : "No"}</p>
//             <button
//               disabled={completedRides.includes(ride.id)}
//               onClick={() => handleRideComplete(ride.id)}
//             >
//               Mark Ride as Done
//             </button>
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





























import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import {
  GoogleMap,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
// Make sure your CSS module path is correct (e.g., same folder)
import styles from "./DriverTracking.module.css";

// Keep libraries simple if only places are needed for autocomplete elsewhere.
const libraries = ["places"];

// Define map container style constant for clarity
const mapContainerStyle = { width: "100%", height: "100%" };
// Define initial map center constant
const initialCenter = { lat: 28.6139, lng: 77.209 }; // New Delhi

const DriverTracking = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Ensure this is set in your .env file!
    libraries,
  });

  const [directions, setDirections] = useState(null);
  const [currentRides, setCurrentRides] = useState([
    {
      id: 1,
      name: "Ravi Kumar",
      pickup: "Connaught Place, New Delhi", // P1
      dropoff: "India Gate, New Delhi",     // D1
      pooling: true,
      rideType: "Standard",
    },
  ]);

  const [newRequest, setNewRequest] = useState({
    id: 2,
    name: "Anita Singh",
    pickup: "Rajiv Chowk Metro Station, New Delhi", // Be specific for better geocoding
    dropoff: "Central Secretariat Metro Station, New Delhi", // Be specific
  });

  const [completedRides, setCompletedRides] = useState([]);

  // --- Memoized calculateRoute Function using useCallback ---
  const calculateRoute = useCallback((rides) => {
    // Guard clauses
    if (!window.google || !isLoaded || !rides || rides.length === 0) {
      console.log("calculateRoute: Prerequisites not met.");
      // Clear directions if no rides are provided to calculate for
      if (rides.length === 0) {
          setDirections(null);
      }
      return;
    }

    console.log(`calculateRoute: Calculating for ${rides.length} ride(s).`);

    const directionsService = new window.google.maps.DirectionsService();

    const origin = rides[0].pickup;
    const destination = rides[rides.length - 1].dropoff;
    const waypoints = [];

    // Add first rider's dropoff if > 1 ride
    if (rides.length > 1) {
      waypoints.push({ location: rides[0].dropoff, stopover: true });
    }

    // Add intermediate pickups/dropoffs (riders 2 to n-1)
    for (let i = 1; i < rides.length - 1; i++) {
      waypoints.push({ location: rides[i].pickup, stopover: true });
      waypoints.push({ location: rides[i].dropoff, stopover: true });
    }

    // Add last rider's pickup if > 1 ride
    if (rides.length > 1) {
      waypoints.push({ location: rides[rides.length - 1].pickup, stopover: true });
    }

    console.log("calculateRoute: Request details:", { origin, destination, waypoints });

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true, // Let Google Maps optimize the order
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log("calculateRoute: Directions received:", result);
          setDirections(result); // Update state with the DirectionsResult
        } else {
          console.error(`Directions request failed: ${status}`, result);
          setDirections(null); // Clear previous route on error
          // Consider using a state variable for errors instead of alert
          alert(`Error calculating route: ${status}. Check address validity.`);
        }
      }
    );
    // useCallback dependencies:
    // - isLoaded: Checked at the start, and also a dependency of the useEffect calling this.
    // - setDirections: State setter, stable.
    // No other external variables from component scope are used.
  }, [isLoaded]); // Include isLoaded here as it's used in the guard clause

  // --- useEffect to Recalculate Route ---
  useEffect(() => {
    // Only attempt calculation if the API is loaded.
    // calculateRoute itself handles the case of empty rides.
    if (isLoaded) {
      calculateRoute(currentRides);
    }
    // Dependency array: Now includes the stable calculateRoute function.
    // The effect runs when isLoaded changes, currentRides changes,
    // or (theoretically) if calculateRoute itself were to change (which it won't often due to useCallback).
  }, [isLoaded, currentRides, calculateRoute]);

  // --- Event Handlers ---
  const handleAcceptRequest = () => {
    if (!newRequest) return;
    const rideToAdd = {
      ...newRequest,
      pooling: true,
      rideType: "Pool", // Be more specific maybe?
    };
    // Add the new ride. This state change triggers the useEffect -> calculateRoute
    setCurrentRides(prevRides => [...prevRides, rideToAdd]);
    setNewRequest(null); // Clear the request card
  };

  const handleRejectRequest = () => {
    alert("Request rejected."); // Again, consider a better notification system
    setNewRequest(null);
  };

  const handleRideComplete = (rideId) => {
    setCompletedRides((prev) => {
      if (!prev.includes(rideId)) {
        return [...prev, rideId];
      }
      return prev;
    });
    // As noted in the comment, removing the ride and recalculating
    // would require filtering `currentRides` and calling `setCurrentRides`.
    // Example (if you wanted recalculation):
    // setCurrentRides(prevRides => prevRides.filter(ride => ride.id !== rideId));
  };

  // --- Render Logic ---
  if (loadError) return <div className={styles.errorLoading}>Error loading Google Maps. Please check API key and network.</div>;
  if (!isLoaded) return <div className={styles.loading}>Loading map...</div>;

  return (
    <div className={styles.container}>
      {/* Map Area */}
      <div className={styles.mapContainer}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={initialCenter}
          zoom={12}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true // Good to have
          }}
        >
          {/* Render directions if available */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                  suppressMarkers: false // Show default A, B, C... markers
                  // To customize markers, set true and add <Marker> components
              }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Information Panel */}
      <div className={styles.infoPanel}>
        <h2>Driver Panel</h2>

        {/* List of Current Rides */}
        {currentRides.length > 0 ? (
            currentRides.map((ride) => (
            <div
                key={ride.id}
                className={`${styles.rideCard} ${completedRides.includes(ride.id) ? styles.completed : ""}`}
            >
                <p><strong>Rider:</strong> {ride.name} (ID: {ride.id})</p>
                <p><strong>Pickup:</strong> {ride.pickup}</p>
                <p><strong>Dropoff:</strong> {ride.dropoff}</p>
                {/* <p><strong>Ride Type:</strong> {ride.rideType}</p> */}
                {/* <p><strong>Pooling:</strong> {ride.pooling ? "Yes" : "No"}</p> */}
                <button
                className={styles.completeButton} // Add specific class?
                disabled={completedRides.includes(ride.id)}
                onClick={() => handleRideComplete(ride.id)}
                >
                {completedRides.includes(ride.id) ? "Ride Done" : "Mark as Done"}
                </button>
            </div>
            ))
        ) : (
            // Show message only if there are no current rides AND no new request pending
            !newRequest && <p className={styles.noRidesMessage}>No active rides.</p>
        )}


        {/* New Request Card */}
        {newRequest && (
          <div className={styles.newRequest}>
            <h3>New Pool Request</h3>
            <p><strong>Rider:</strong> {newRequest.name}</p>
            <p><strong>Pickup:</strong> {newRequest.pickup}</p>
            <p><strong>Dropoff:</strong> {newRequest.dropoff}</p>
            <div className={styles.buttonGroup}>
              <button className={styles.acceptButton} onClick={handleAcceptRequest}>Accept</button>
              <button className={styles.rejectButton} onClick={handleRejectRequest}>Reject</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DriverTracking;