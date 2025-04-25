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






























import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
// Make sure your CSS module path is correct
import styles from "./DriverTracking.module.css";

// Keep libraries simple if only places are needed for autocomplete elsewhere,
// otherwise, DirectionsService doesn't strictly require it here.
const libraries = ["places"];

const DriverTracking = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [directions, setDirections] = useState(null); // Stores the DirectionsResult object
  const [currentRides, setCurrentRides] = useState([
    // Initial ride (Rider 1)
    {
      id: 1,
      name: "Ravi Kumar",
      pickup: "Connaught Place, New Delhi", // P1
      dropoff: "India Gate, New Delhi",     // D1
      pooling: true, // Assuming initial ride can be pooled with
      rideType: "Standard",
    },
  ]);

  // State for the incoming request card
  const [newRequest, setNewRequest] = useState({
    id: 2,
    name: "Anita Singh",
    pickup: "Rajiv Chowk, New Delhi",      // P2 (Example)
    dropoff: "Central Secretariat, New Delhi", // D2 (Example)
  });

  // State to track completed ride IDs for UI styling/disabling buttons
  const [completedRides, setCompletedRides] = useState([]);

  // --- Modified calculateRoute Function ---
  const calculateRoute = (rides) => {
    // Guard clauses: Ensure API is loaded and there are rides
    if (!window.google || !isLoaded || !rides || rides.length === 0) {
        console.log("calculateRoute: Prerequisites not met (API loaded, rides exist).");
        return;
    }

    console.log(`calculateRoute: Calculating for ${rides.length} rides.`);

    const directionsService = new window.google.maps.DirectionsService();

    // --- Define Origin and Destination ---
    // Origin is always the first ride's pickup
    const origin = rides[0].pickup;
    // Destination is the *last* ride's dropoff (the API will optimize the order to reach it)
    const destination = rides[rides.length - 1].dropoff;

    // --- Build Waypoints ---
    const waypoints = [];
    // The goal is to include all intermediate pickup and dropoff points
    // between the absolute origin (P1) and the absolute destination (Dn).
    // The API will optimize the order of visiting these waypoints.

    // Add the first rider's dropoff (D1) if there's more than one ride
    if (rides.length > 1) {
        waypoints.push({ location: rides[0].dropoff, stopover: true });
    }

    // Add pickup (Pi) and dropoff (Di) for all riders *between* the first and the last
    // (i.e., from the second rider up to the second-to-last rider)
    for (let i = 1; i < rides.length - 1; i++) {
        waypoints.push({ location: rides[i].pickup, stopover: true });
        waypoints.push({ location: rides[i].dropoff, stopover: true });
    }

    // Add the *last* rider's pickup (Pn) if there's more than one ride
    // (their dropoff is the overall destination)
    if (rides.length > 1) {
         waypoints.push({ location: rides[rides.length - 1].pickup, stopover: true });
    }

    console.log("calculateRoute: Request details:", { origin, destination, waypoints });

    // --- Make the Directions Request ---
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints, // Pass the collected intermediate stops
        travelMode: window.google.maps.TravelMode.DRIVING,
        // *** KEY CHANGE: Enable waypoint optimization ***
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log("calculateRoute: Directions received successfully:", result);
          setDirections(result); // Update state with the new DirectionsResult
        } else {
          console.error("Directions request failed due to " + status, result);
          // Optionally clear old directions or show an error message
          setDirections(null);
          alert(`Error calculating route: ${status}. Please check locations.`);
        }
      }
    );
  };

  // --- useEffect to Recalculate Route ---
  // Recalculates whenever the API is loaded or the list of current rides changes
  useEffect(() => {
    if (isLoaded && currentRides.length > 0) {
      calculateRoute(currentRides);
    } else if (isLoaded && currentRides.length === 0) {
        // Optionally clear directions if all rides are removed
        setDirections(null);
    }
    // Dependency array: triggers when isLoaded changes or currentRides array reference changes
  }, [isLoaded, currentRides]);

  // --- Event Handlers ---

  // Handles accepting the new pool request
  const handleAcceptRequest = () => {
    if (!newRequest) return; // Should not happen if button is visible

    // Create the new ride object from the request
    const rideToAdd = {
        ...newRequest, // includes id, name, pickup, dropoff
        pooling: true,   // Mark as pooled
        rideType: "Standard", // Or determine based on request
    };

    // Update the list of current rides
    // This state change will trigger the useEffect above, which calls calculateRoute
    const updatedRides = [...currentRides, rideToAdd];
    setCurrentRides(updatedRides);

    // Clear the new request card from the UI
    setNewRequest(null);
  };

  // Handles rejecting the new pool request
  const handleRejectRequest = () => {
    alert("Request rejected.");
    setNewRequest(null); // Clear the request card
  };

  // Handles marking a ride as complete (for UI purposes)
  const handleRideComplete = (rideId) => {
    // Add the rideId to the list of completed rides
    setCompletedRides((prev) => {
      // Avoid duplicates if button somehow clicked twice
      if (!prev.includes(rideId)) {
        return [...prev, rideId];
      }
      return prev;
    });

    // NOTE: This example does NOT remove the ride from `currentRides` or recalculate
    // the route when marking as done. To do that, you would need to:
    // 1. Filter `currentRides` to remove the completed one.
    // 2. Call `setCurrentRides` with the filtered list.
    // This would then trigger the route recalculation. For simplicity,
    // this version only updates the UI state (`completedRides`).
  };

  // --- Render Logic ---

  if (loadError) return <div>Error loading Google Maps. Please check your API key and network connection.</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className={styles.container}>
      {/* Map Area */}
      <div className={styles.mapContainer}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          // Center on New Delhi initially, or could center on first ride's origin
          center={{ lat: 28.6139, lng: 77.209 }}
          zoom={12} // Adjust zoom as needed
          options={{ streetViewControl: false, mapTypeControl: false }} // Optional: simplify controls
        >
          {/* DirectionsRenderer draws the route line based on the 'directions' state */}
          {directions && (
            <DirectionsRenderer
                directions={directions}
                options={{
                    suppressMarkers: false // Let DirectionsRenderer show default A, B, C markers
                    // If you want custom markers instead, set suppressMarkers: true
                    // and add <Marker> components looping through route legs/steps
                }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Information Panel */}
      <div className={styles.infoPanel}>
        <h2>Driver Panel</h2>

        {/* List of Current Rides */}
        {currentRides.map((ride) => (
          <div
            key={ride.id}
            // Apply 'completed' style if rideId is in completedRides array
            className={`${styles.rideCard} ${completedRides.includes(ride.id) ? styles.completed : ""}`}
          >
            <p><strong>Rider:</strong> {ride.name} (ID: {ride.id})</p>
            <p><strong>Pickup:</strong> {ride.pickup}</p>
            <p><strong>Dropoff:</strong> {ride.dropoff}</p>
            <p><strong>Ride Type:</strong> {ride.rideType}</p>
            <p><strong>Pooling:</strong> {ride.pooling ? "Yes" : "No"}</p>
            <button
              disabled={completedRides.includes(ride.id)} // Disable if already marked done
              onClick={() => handleRideComplete(ride.id)}
            >
              {completedRides.includes(ride.id) ? "Done" : "Mark Ride as Done"}
            </button>
          </div>
        ))}

        {/* New Request Card */}
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

        {/* Message if no rides */}
        {currentRides.length === 0 && !newRequest && (
            <p>No active rides or requests.</p>
        )}
      </div>
    </div>
  );
};

export default DriverTracking;