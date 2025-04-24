// // src/pages/Driver/DriverTracking.js
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { GoogleMap, useLoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";

// // Add 'geometry' library for proximity checks
// const libraries = ["places", "geometry"];

// const containerStyle = {
//   width: "100%",
//   height: "70vh",
//   borderRadius: "10px",
//   marginTop: "10px",
// };

// // --- Configuration ---
// const MAX_DISTANCE_FROM_ROUTE_METERS = 1000; // 1km
// // Adjusted Tolerance: Slightly larger to account for route deviations & degree approximation
// const PROXIMITY_TOLERANCE_DEGREES = 0.012; // Approx 1.3km
// const DRIVER_UPDATE_INTERVAL_MS = 5000;

// // Example Initial Ride (P1 -> D1)
// const initialRide = {
//   // P1: Connaught Place (Outer Circle)
//   origin: { lat: 28.6328, lng: 77.2196 },
//   // D1: India Gate
//   destination: { lat: 28.6129, lng: 77.2295 },
//   waypoints: [],
// };

// const defaultCenter = initialRide.origin;

// const DriverTracking = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   // --- State Variables ---
//   const [map, setMap] = useState(null);
//   const [directions, setDirections] = useState(null);
//   const [currentRide, setCurrentRide] = useState(initialRide);
//   const [driverLocation, setDriverLocation] = useState(initialRide.origin);
//   const [infoMessage, setInfoMessage] = useState("Initializing map and route...");
//   const [riderCount, setRiderCount] = useState(1); // Track number of accepted riders

//   // Refs
//   const directionsService = useRef(null);
//   const directionsRenderer = useRef(null);
//   const driverMarkerRef = useRef(null);

//   // --- Map Load Callback ---
//   const onMapLoad = useCallback((mapInstance) => {
//     setMap(mapInstance);
//     if (window.google && window.google.maps) {
//       directionsService.current = new window.google.maps.DirectionsService();
//       directionsRenderer.current = new window.google.maps.DirectionsRenderer({
//         map: mapInstance,
//         suppressMarkers: true, // Use our custom markers
//       });
//     } else {
//       console.error("Google Maps JavaScript API not loaded.");
//       setInfoMessage("Error: Google Maps API not loaded.");
//     }
//   }, []);

//   // --- Effect for Driver Location Simulation ---
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDriverLocation(prevLoc => ({
//         lat: prevLoc.lat + 0.0001,
//         lng: prevLoc.lng + 0.0001,
//       }));
//     }, DRIVER_UPDATE_INTERVAL_MS);
//     return () => clearInterval(interval);
//   }, []);

//   // --- Effect to Calculate Route ---
//   useEffect(() => {
//     if (!isLoaded || !map || !directionsService.current || !currentRide.origin || !currentRide.destination) {
//       return;
//     }

//     console.log("Calculating route for:", currentRide);
//     setInfoMessage(`Calculating route for Rider 1 ${riderCount > 1 ? `and ${riderCount - 1} pooler(s)` : ''}...`);

//     const request = {
//       origin: currentRide.origin,
//       destination: currentRide.destination,
//       waypoints: currentRide.waypoints.map(wp => ({ location: wp.location, stopover: wp.stopover })),
//       optimizeWaypoints: true, // IMPORTANT for pooling efficiency
//       travelMode: window.google.maps.TravelMode.DRIVING,
//     };

//     directionsService.current.route(request, (result, status) => {
//       if (status === window.google.maps.DirectionsStatus.OK) {
//         console.log("Route calculated:", result);
//         setDirections(result);
//         if (directionsRenderer.current) {
//           directionsRenderer.current.setDirections(result);
//         }
//         // Update info message based on how many riders are now included
//         let message = `Route displayed for Rider 1`;
//         if (riderCount > 1) {
//             message += ` and ${riderCount - 1} pooler(s).`;
//         } else {
//             message += ".";
//         }
//          if (result.routes[0]?.warnings && result.routes[0].warnings.length > 0) {
//              message += ` Warnings: ${result.routes[0].warnings.join(', ')}`;
//              console.warn("Directions warnings:", result.routes[0].warnings);
//          }
//         setInfoMessage(message);
//         // Example: Fit bounds to the new route
//         // if (map && result.routes[0]?.bounds) {
//         //     map.fitBounds(result.routes[0].bounds);
//         // }

//       } else {
//         console.error("Error fetching directions:", status, result);
//         setInfoMessage(`Error calculating route: ${status}`);
//         setDirections(null);
//         if (directionsRenderer.current) {
//           directionsRenderer.current.setDirections(null);
//         }
//       }
//     });
//   }, [isLoaded, map, currentRide, riderCount]); // Rerun when ride or riderCount changes

//    // --- Function to get Marker points based on currentRide ---
//    const getRideMarkers = () => {
//     const markers = [];
//     if (currentRide.origin) {
//       markers.push({ id: "P1", position: currentRide.origin, label: "P1", title: "Pickup 1" });
//     }
//     currentRide.waypoints.forEach((waypoint, index) => {
//       const pointNumber = Math.floor(index / 2) + 2; // Rider 2, 3, ...
//       const pointType = index % 2 === 0 ? 'P' : 'D'; // P or D
//       markers.push({
//         id: `${pointType}${pointNumber}`,
//         position: waypoint.location,
//         label: `${pointType}${pointNumber}`,
//         title: `${pointType === 'P' ? 'Pickup' : 'Dropoff'} ${pointNumber}`,
//       });
//     });
//     if (currentRide.destination) {
//        markers.push({ id: "D1", position: currentRide.destination, label: "D1", title: "Dropoff 1" });
//     }
//     return markers;
//    };

//   // --- Proximity Check Function ---
//   const isLocationNearRoute = (location, route) => {
//     if (!window.google || !window.google.maps.geometry || !location || !route || !route.overview_path || route.overview_path.length === 0) {
//       console.warn("Proximity Check: Missing data, geometry library, or empty route path.");
//       return false;
//     }

//     const point = new window.google.maps.LatLng(location.lat, location.lng);
//     const routePolyline = new window.google.maps.Polyline({ path: route.overview_path });

//     console.log(`Proximity Check: Checking point ${JSON.stringify(location)} against route with ${route.overview_path.length} points.`);
//     console.log(`Proximity Check: Using tolerance (degrees): ${PROXIMITY_TOLERANCE_DEGREES}`);

//     try {
//         const isNear = window.google.maps.geometry.poly.isLocationOnEdge(
//             point,
//             routePolyline,
//             PROXIMITY_TOLERANCE_DEGREES
//         );
//         console.log(`Proximity Check: Result for ${JSON.stringify(location)} - Is near? ${isNear}`);
//         return isNear;
//     } catch (error) {
//         console.error("Proximity Check: Error during isLocationOnEdge calculation:", error);
//         // Handle potential errors, e.g., if the polyline data is invalid
//         return false;
//     }
//   };


//   // --- Function to Handle New Pooling Request ---
//   const handleNewPoolingRequest = (newRequest, newRiderNumber) => {
//     setInfoMessage(`Processing pooling request for Rider ${newRiderNumber}...`);
//     console.log(`Received new request for Rider ${newRiderNumber}:`, newRequest);

//     if (!directions || !directions.routes || directions.routes.length === 0) {
//       console.error("Cannot process pooling request: No current route available.");
//       setInfoMessage("Error: No current route for pooling.");
//       return;
//     }

//     const currentRoute = directions.routes[0];

//     // Check proximity
//     const isPickupNear = isLocationNearRoute(newRequest.pickup, currentRoute);
//     const isDropoffNear = isLocationNearRoute(newRequest.dropoff, currentRoute);

//     if (isPickupNear && isDropoffNear) {
//       // --- ACCEPTED ---
//       console.log(`Rider ${newRiderNumber} accepted: Pickup and Dropoff are near the route.`);
//       setInfoMessage(`Rider ${newRiderNumber} accepted! Adding to route...`);

//       const newWaypoints = [
//         ...currentRide.waypoints,
//         { location: newRequest.pickup, stopover: true }, // Px
//         { location: newRequest.dropoff, stopover: true }, // Dx
//       ];

//       // Update state to trigger route recalculation
//       setCurrentRide(prevRide => ({
//         ...prevRide,
//         waypoints: newWaypoints,
//       }));
//       setRiderCount(newRiderNumber); // Update the rider count state

//     } else {
//       // --- REJECTED ---
//       const reason = !isPickupNear ? 'Pickup' : 'Dropoff';
//       console.log(`Rider ${newRiderNumber} rejected: ${reason} location too far from route.`, { isPickupNear, isDropoffNear });
//       setInfoMessage(`Pooling rejected for Rider ${newRiderNumber}: New ${reason} point is too far from the current route.`);
//       // Do NOT update currentRide or riderCount
//     }
//   };

//   // --- Reset Function ---
//    const resetToInitialRide = () => {
//      setCurrentRide(initialRide);
//      setDriverLocation(initialRide.origin);
//      setDirections(null);
//      setRiderCount(1); // Reset rider count
//      if (directionsRenderer.current) {
//        directionsRenderer.current.setDirections(null);
//      }
//      setInfoMessage("Route reset to initial rider (Rider 1).");
//    };

//   // --- Render Logic ---
//   if (loadError) return <div>Error loading maps. Check API key and network. Is the key restricted?</div>;
//   if (!isLoaded) return <div>Loading Map...</div>;

//   const rideMarkers = getRideMarkers();

//   return (
//     <div style={{ padding: "15px", fontFamily: "Arial, sans-serif" }}>
//       <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Driver Route Tracking</h2>

//       {infoMessage && (
//         <div style={{
//             padding: "10px",
//             marginBottom: "15px",
//             backgroundColor: infoMessage.startsWith("Error") || infoMessage.includes("rejected") ? "#ffdddd" : "#e0f7fa",
//             border: `1px solid ${infoMessage.startsWith("Error") || infoMessage.includes("rejected") ? "#f44336" : "#00bcd4"}`,
//             color: infoMessage.startsWith("Error") || infoMessage.includes("rejected") ? "#a94442" : "#006064",
//             borderRadius: "5px",
//             textAlign: "center"
//          }}>
//           {infoMessage}
//         </div>
//       )}

//       <div style={{ border: '1px solid #ccc', borderRadius: '10px', overflow: 'hidden' }}>
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={driverLocation}
//           zoom={14}
//           onLoad={onMapLoad}
//           options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
//         >
//           {/* Route line is handled by DirectionsRenderer */}

//           {/* Driver Marker */}
//            {driverLocation && (
//              <Marker
//                 ref={driverMarkerRef}
//                 position={driverLocation}
//                 title={"Driver Location"}
//                 icon={{ path: window.google?.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 6, fillColor: "#007bff", fillOpacity: 1, strokeWeight: 2, strokeColor: "#ffffff", rotation: 0 }}
//                 zIndex={100}
//              />
//            )}

//            {/* Ride Markers (P1, D1, P2, D2...) */}
//            {rideMarkers.map(marker => (
//              <Marker
//                key={marker.id}
//                position={marker.position}
//                label={{ text: marker.label, color: "white", fontWeight: "bold" }}
//                title={marker.title}
//                icon={{ path: window.google?.maps.SymbolPath.CIRCLE, scale: 8, fillColor: marker.label.startsWith('P') ? "#4CAF50" : "#f44336", fillOpacity: 1, strokeWeight: 1, strokeColor: "#ffffff" }}
//              />
//            ))}
//         </GoogleMap>
//       </div>

//       {/* --- Simulation Controls --- */}
//       <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "10px" }}>
//         <button
//           onClick={() => handleNewPoolingRequest({
//             // Rider 2 (Near P1->D1 route)
//             // P2: Near Barakhamba Road / Modern School
//             pickup: { lat: 28.6260, lng: 77.2260 },
//             // D2: Near National Museum / Rajpath crossing
//             dropoff: { lat: 28.6135, lng: 77.2200 },
//             riderId: "RIDER_002",
//           }, 2)} // Pass rider number 2
//           style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#4CAF50", color: "white" }}
//           disabled={!directions || riderCount >= 2} // Disable if no route or if Rider 2 already added
//         >
//           Simulate Rider 2 (Near)
//         </button>

//         <button
//           onClick={() => handleNewPoolingRequest({
//             // Rider 3 (Near potentially updated P1,P2 -> D1,D2 route)
//             // P3: Near Khan Market / Lodhi Estate area
//             pickup: { lat: 28.5980, lng: 77.2275 },
//             // D3: Near Safdarjung Tomb area
//             dropoff: { lat: 28.5890, lng: 77.2120 },
//             riderId: "RIDER_003",
//           }, 3)} // Pass rider number 3
//           style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#2196F3", color: "white" }}
//           disabled={!directions || riderCount < 2 || riderCount >= 3} // Disable if Rider 2 not added or Rider 3 already added
//         >
//           Simulate Rider 3 (Near)
//         </button>

//          <button
//           onClick={() => handleNewPoolingRequest({
//             // Rider 4 (Far from any likely route)
//             // P4: Karol Bagh Market
//             pickup: { lat: 28.6500, lng: 77.1950 },
//             // D4: Saket (Select Citywalk)
//             dropoff: { lat: 28.5280, lng: 77.2190 },
//             riderId: "RIDER_004",
//           }, 4)} // Pass rider number 4
//           style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#f44336", color: "white" }}
//           disabled={!directions} // Can always try to simulate 'far', but check against current route
//         >
//           Simulate Rider 4 (Far)
//         </button>

//          <button
//           onClick={resetToInitialRide}
//           style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#ff9800", color: "white" }}
//         >
//           Reset Route
//         </button>
//       </div>

//       {/* Optional: Display current ride details */}
//       <div style={{ marginTop: "15px", fontSize: "0.9em", backgroundColor: "#eee", padding: "10px", borderRadius: "5px" }}>
//          <strong>Current Ride State:</strong>
//          <div>Origin (P1): {JSON.stringify(currentRide.origin)}</div>
//          <div>Waypoints (P2, D2,...): {currentRide.waypoints.length > 0 ? JSON.stringify(currentRide.waypoints.map(wp => wp.location)) : "None"}</div>
//          <div>Destination (D1): {JSON.stringify(currentRide.destination)}</div>
//          <div>Active Riders: {riderCount}</div>
//       </div>
//     </div>
//   );
// };

// export default DriverTracking;






























































// // src/pages/Driver/DriverTracking.js
// import React, { useState, useEffect, useRef, useCallback } from "react";
// // FIXED: Removed unused DirectionsRenderer import
// import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

// // Add 'geometry' library for proximity checks
// const libraries = ["places", "geometry"];

// const containerStyle = {
//   width: "100%",
//   height: "70vh",
//   borderRadius: "10px",
//   marginTop: "10px",
// };

// // --- Configuration ---
// // FIXED: Removed unused MAX_DISTANCE_FROM_ROUTE_METERS
// // Adjusted Tolerance: Slightly larger to account for route deviations & degree approximation
// const PROXIMITY_TOLERANCE_DEGREES = 0.012; // Approx 1.3km
// const DRIVER_UPDATE_INTERVAL_MS = 5000;

// // Example Initial Ride (P1 -> D1)
// const initialRide = {
//   // P1: Connaught Place (Outer Circle)
//   origin: { lat: 28.6328, lng: 77.2196 },
//   // D1: India Gate
//   destination: { lat: 28.6129, lng: 77.2295 },
//   waypoints: [],
// };

// // FIXED: Removed unused defaultCenter
// // const defaultCenter = initialRide.origin;

// const DriverTracking = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   // --- State Variables ---
//   const [map, setMap] = useState(null);
//   const [directions, setDirections] = useState(null);
//   const [currentRide, setCurrentRide] = useState(initialRide);
//   const [driverLocation, setDriverLocation] = useState(initialRide.origin);
//   const [infoMessage, setInfoMessage] = useState("Initializing map and route...");
//   const [riderCount, setRiderCount] = useState(1); // Track number of accepted riders

//   // Refs
//   const directionsService = useRef(null);
//   const directionsRenderer = useRef(null); // This ref is used to control the renderer instance
//   const driverMarkerRef = useRef(null);

//   // --- Map Load Callback ---
//   const onMapLoad = useCallback((mapInstance) => {
//     setMap(mapInstance);
//     if (window.google && window.google.maps && window.google.maps.DirectionsService && window.google.maps.DirectionsRenderer) {
//       directionsService.current = new window.google.maps.DirectionsService();
//       directionsRenderer.current = new window.google.maps.DirectionsRenderer({
//         map: mapInstance,
//         suppressMarkers: true, // Use our custom markers
//       });
//     } else {
//       console.error("Google Maps JavaScript API or required services not loaded.");
//       setInfoMessage("Error: Google Maps API components not loaded.");
//     }
//   }, []);

//   // --- Effect for Driver Location Simulation ---
//   useEffect(() => {
//     let intervalId = null;
//     if(isLoaded) { // Only run simulation if maps are loaded
//         intervalId = setInterval(() => {
//         setDriverLocation(prevLoc => {
//              if (prevLoc && typeof prevLoc.lat === 'number' && typeof prevLoc.lng === 'number') {
//                 return { lat: prevLoc.lat + 0.0001, lng: prevLoc.lng + 0.0001 };
//              }
//              return prevLoc; // Return previous location if it was invalid
//         });
//         }, DRIVER_UPDATE_INTERVAL_MS);
//     }
//     return () => { // Cleanup interval on unmount or if isLoaded changes
//         if (intervalId) clearInterval(intervalId);
//     };
//   }, [isLoaded]); // Rerun only if isLoaded changes

//   // --- Effect to Calculate Route ---
//   // Extract complex dependencies for useEffect clarity
//   const originString = JSON.stringify(currentRide.origin);
//   const destinationString = JSON.stringify(currentRide.destination);
//   const waypointsString = JSON.stringify(currentRide.waypoints);

//   useEffect(() => {
//     // Guard Clauses
//     if (!isLoaded || !map || !directionsService.current || !currentRide.origin || !currentRide.destination) {
//       return;
//     }

//     console.log("Calculating route for:", currentRide); // <<< READS currentRide
//     // Set info message based on rider count
//     setInfoMessage(`Calculating route for Rider 1 ${riderCount > 1 ? `and ${riderCount - 1} pooler(s)` : ''}...`);

//     const request = {
//       origin: currentRide.origin,
//       destination: currentRide.destination,
//       waypoints: currentRide.waypoints.map(wp => ({ location: wp.location, stopover: true })), // Ensure stopover is true for waypoints
//       optimizeWaypoints: true,
//       travelMode: window.google.maps.TravelMode.DRIVING,
//     };

//     directionsService.current.route(request, (result, status) => {
//       if (status === window.google.maps.DirectionsStatus.OK) {
//         console.log("Route calculated:", result);
//         setDirections(result);
//         if (directionsRenderer.current) {
//           directionsRenderer.current.setDirections(result); // Display route line via ref
//         }

//         let message = `Route displayed for Rider 1`;
//         message += (riderCount > 1) ? ` and ${riderCount - 1} pooler(s).` : ".";
//         if (result.routes[0]?.warnings?.length > 0) {
//              message += ` Warnings: ${result.routes[0].warnings.join(', ')}`;
//              console.warn("Directions warnings:", result.routes[0].warnings);
//          }
//         setInfoMessage(message);

//       } else {
//         console.error("Error fetching directions:", status, result);
//         setInfoMessage(`Error calculating route: ${status}`);
//         setDirections(null);
//         if (directionsRenderer.current) {
//           directionsRenderer.current.setDirections({routes: []}); // Clear route on error
//         }
//       }
//     });
//   // FIXED: Added currentRide itself to the dependency array because it's read directly in the console.log
//   }, [isLoaded, map, originString, destinationString, waypointsString, riderCount, currentRide]);


//    // --- Function to get Marker points based on currentRide ---
//    // Use useCallback to memoize if needed, though not strictly necessary if only used here
//    const getRideMarkers = useCallback(() => {
//     const markers = [];
//     if (currentRide.origin?.lat && currentRide.origin?.lng) {
//       markers.push({ id: "P1", position: currentRide.origin, label: "P1", title: "Pickup 1" });
//     }
//     if (Array.isArray(currentRide.waypoints)) {
//         currentRide.waypoints.forEach((waypoint, index) => {
//           if (waypoint.location?.lat && waypoint.location?.lng) { // Check for valid data
//              const pointNumber = Math.floor(index / 2) + 2;
//              const pointType = index % 2 === 0 ? 'P' : 'D';
//              markers.push({
//                 id: `${pointType}${pointNumber}`,
//                 position: waypoint.location,
//                 label: `${pointType}${pointNumber}`,
//                 title: `${pointType === 'P' ? 'Pickup' : 'Dropoff'} ${pointNumber}`,
//              });
//           }
//         });
//     }
//     if (currentRide.destination?.lat && currentRide.destination?.lng) {
//        markers.push({ id: "D1", position: currentRide.destination, label: "D1", title: "Dropoff 1" });
//     }
//     return markers;
//    }, [currentRide]); // Recreate only if currentRide changes

//   // --- Proximity Check Function ---
//   const isLocationNearRoute = useCallback((location, route) => {
//     // Validate inputs
//     if (!window.google?.maps?.geometry || !location || typeof location.lat !== 'number' || typeof location.lng !== 'number' || !route?.overview_path || route.overview_path.length === 0) {
//       console.warn("Proximity Check: Missing data, geometry library, or empty route path.");
//       return false;
//     }

//     const point = new window.google.maps.LatLng(location.lat, location.lng);
//     const routePolyline = new window.google.maps.Polyline({ path: route.overview_path });

//     console.log(`Proximity Check: Checking point ${JSON.stringify(location)} against route with ${route.overview_path.length} points.`);
//     console.log(`Proximity Check: Using tolerance (degrees): ${PROXIMITY_TOLERANCE_DEGREES}`);

//     try {
//         const isNear = window.google.maps.geometry.poly.isLocationOnEdge(
//             point,
//             routePolyline,
//             PROXIMITY_TOLERANCE_DEGREES
//         );
//         console.log(`Proximity Check: Result for ${JSON.stringify(location)} - Is near? ${isNear}`);
//         return isNear;
//     } catch (error) {
//         console.error("Proximity Check: Error during isLocationOnEdge calculation:", error);
//         return false;
//     }
//   }, []); // No dependencies needed, relies on args and google global


//   // --- Function to Handle New Pooling Request ---
//   // Use useCallback if this function might be passed down or used in dependencies
//   const handleNewPoolingRequest = useCallback((newRequest, newRiderNumber) => {
//     // Validate inputs
//     if (!newRequest?.pickup || !newRequest?.dropoff || typeof newRiderNumber !== 'number') {
//         console.error("Invalid pooling request data received:", newRequest, newRiderNumber);
//         setInfoMessage("Error processing pooling request: Invalid data.");
//         return;
//     }

//     setInfoMessage(`Processing pooling request for Rider ${newRiderNumber}...`);
//     console.log(`Received new request for Rider ${newRiderNumber}:`, newRequest);

//     if (!directions?.routes?.[0]) { // Check safely for route existence
//       console.error("Cannot process pooling request: No current route available.");
//       setInfoMessage("Error: No current route for pooling.");
//       return;
//     }

//     const currentRoute = directions.routes[0];

//     // Check proximity using memoized function
//     const isPickupNear = isLocationNearRoute(newRequest.pickup, currentRoute);
//     const isDropoffNear = isLocationNearRoute(newRequest.dropoff, currentRoute);

//     if (isPickupNear && isDropoffNear) {
//       // --- ACCEPTED ---
//       console.log(`Rider ${newRiderNumber} accepted: Pickup and Dropoff are near the route.`);
//       setInfoMessage(`Rider ${newRiderNumber} accepted! Adding to route...`);

//       const newWaypoints = [
//         ...currentRide.waypoints, // Read current waypoints
//         { location: newRequest.pickup, stopover: true },
//         { location: newRequest.dropoff, stopover: true },
//       ];

//       // Use functional updates for state setters
//       setCurrentRide(prevRide => ({
//         ...prevRide,
//         waypoints: newWaypoints,
//       }));
//       setRiderCount(newRiderNumber); // Set rider count

//     } else {
//       // --- REJECTED ---
//       const reason = !isPickupNear ? 'Pickup' : 'Dropoff';
//       console.log(`Rider ${newRiderNumber} rejected: ${reason} location too far from route.`, { isPickupNear, isDropoffNear });
//       setInfoMessage(`Pooling rejected for Rider ${newRiderNumber}: New ${reason} point is too far from the current route.`);
//     }
//     // Dependencies: functions/state read inside
//   }, [directions, currentRide.waypoints, isLocationNearRoute]);


//   // --- Reset Function ---
//    const resetToInitialRide = useCallback(() => {
//      setCurrentRide(initialRide);
//      setDriverLocation(initialRide.origin);
//      setDirections(null);
//      setRiderCount(1);
//      if (directionsRenderer.current) {
//        directionsRenderer.current.setDirections({routes: []}); // Clear route on map
//      }
//      setInfoMessage("Route reset to initial rider (Rider 1).");
//    }, []); // No dependencies needed


//   // --- Render Logic ---
//   if (loadError) return <div>Error loading maps: {loadError.message}. Check API key and network.</div>;
//   if (!isLoaded) return <div>Loading Map...</div>;

//   const rideMarkers = getRideMarkers(); // Get markers based on current state

//   return (
//     <div style={{ padding: "15px", fontFamily: "Arial, sans-serif" }}>
//       <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Driver Route Tracking</h2>

//       {infoMessage && (
//         <div style={{
//             padding: "10px", marginBottom: "15px", borderRadius: "5px", textAlign: "center",
//             backgroundColor: infoMessage.startsWith("Error") || infoMessage.includes("rejected") ? "#ffdddd" : "#e0f7fa",
//             border: `1px solid ${infoMessage.startsWith("Error") || infoMessage.includes("rejected") ? "#f44336" : "#00bcd4"}`,
//             color: infoMessage.startsWith("Error") || infoMessage.includes("rejected") ? "#a94442" : "#006064",
//          }}>
//           {infoMessage}
//         </div>
//       )}

//       <div style={{ border: '1px solid #ccc', borderRadius: '10px', overflow: 'hidden' }}>
//         <GoogleMap
//           mapContainerStyle={containerStyle} // Use the defined style constant
//           center={driverLocation}
//           zoom={14}
//           onLoad={onMapLoad}
//           options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
//         >
//           {/* Driver Marker */}
//            {driverLocation && (
//              <Marker
//                 ref={driverMarkerRef}
//                 position={driverLocation}
//                 title={"Driver Location"}
//                 icon={{ path: window.google?.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 6, fillColor: "#007bff", fillOpacity: 1, strokeWeight: 2, strokeColor: "#ffffff", rotation: 0 }}
//                 zIndex={100}
//              />
//            )}

//            {/* Ride Markers (P1, D1, P2, D2...) */}
//            {rideMarkers.map(marker => (
//              <Marker
//                key={marker.id} // Important: Add unique key for list items
//                position={marker.position}
//                label={{ text: marker.label, color: "white", fontWeight: "bold" }}
//                title={marker.title}
//                icon={{ path: window.google?.maps.SymbolPath.CIRCLE, scale: 8, fillColor: marker.label.startsWith('P') ? "#4CAF50" : "#f44336", fillOpacity: 1, strokeWeight: 1, strokeColor: "#ffffff" }}
//              />
//            ))}
//             {/* Route line itself is managed by directionsRenderer.current.setDirections() */}
//         </GoogleMap>
//       </div>

//       {/* --- Simulation Controls --- */}
//       <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "10px" }}>
//         <button
//           onClick={() => handleNewPoolingRequest({
//             pickup: { lat: 28.6260, lng: 77.2260 },
//             dropoff: { lat: 28.6135, lng: 77.2200 },
//             riderId: "RIDER_002",
//           }, 2)}
//           style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#4CAF50", color: "white" }}
//           disabled={!directions || riderCount >= 2}
//         >
//           Simulate Rider 2 (Near)
//         </button>

//         <button
//           onClick={() => handleNewPoolingRequest({
//             pickup: { lat: 28.5980, lng: 77.2275 },
//             dropoff: { lat: 28.5890, lng: 77.2120 },
//             riderId: "RIDER_003",
//           }, 3)}
//           style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#2196F3", color: "white" }}
//           disabled={!directions || riderCount < 2 || riderCount >= 3}
//         >
//           Simulate Rider 3 (Near)
//         </button>

//          <button
//           onClick={() => handleNewPoolingRequest({
//             pickup: { lat: 28.6500, lng: 77.1950 },
//             dropoff: { lat: 28.5280, lng: 77.2190 },
//             riderId: "RIDER_004",
//           }, 4)}
//           style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#f44336", color: "white" }}
//           disabled={!directions}
//         >
//           Simulate Rider 4 (Far)
//         </button>

//          <button
//           onClick={resetToInitialRide}
//           style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#ff9800", color: "white" }}
//         >
//           Reset Route
//         </button>
//       </div>

//       {/* Optional: Display current ride details */}
//       {/* Using JSON.stringify for simplicity here */}
//       <div style={{ marginTop: "15px", fontSize: "0.9em", backgroundColor: "#eee", padding: "10px", borderRadius: "5px" }}>
//          <strong>Current Ride State:</strong>
//          <div>Origin (P1): {JSON.stringify(currentRide.origin)}</div>
//          <div>Waypoints (P2, D2,...): {currentRide.waypoints.length > 0 ? JSON.stringify(currentRide.waypoints.map(wp => wp.location)) : "None"}</div>
//          <div>Destination (D1): {JSON.stringify(currentRide.destination)}</div>
//          <div>Active Riders: {riderCount}</div>
//       </div>
//     </div>
//   );
// };

// export default DriverTracking;
















































// the above code is working, below is testing, PERFECTLY working, gemini says its better than the above one
// But this has a huge problem 
// but if there is a path A to B for rider 1 and travels 99% of the route now another person requests having pick and dro p within 1 km of the route of the original route
// but now driver might be very far away from the pickup like when pick up of new rider 2 is near 500meters of pickup of A and drop near 500meters of B now he made a request







































// src/pages/Driver/DriverTracking.js
import React, { useState, useEffect, useRef, useCallback } from "react";
// Correct Imports: Marker used, DirectionsRenderer handled by ref
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

// Add 'geometry' library for proximity checks
const libraries = ["places", "geometry"];

// Style applied to GoogleMap component below
const containerStyle = {
  width: "100%",
  height: "70vh", // Or 100% if its parent container controls height
  borderRadius: "10px",
  marginTop: "10px",
};

// --- Configuration ---
// Tolerance for proximity check (approx 1.3km)
const PROXIMITY_TOLERANCE_DEGREES = 0.012;
// Simulation interval for driver movement
const DRIVER_UPDATE_INTERVAL_MS = 5000;

// Example Initial Ride (P1 -> D1)
const initialRide = {
  origin: { lat: 28.6328, lng: 77.2196 }, // P1: Connaught Place
  destination: { lat: 28.6129, lng: 77.2295 }, // D1: India Gate
  waypoints: [],
};

// --- Helper Function for LatLng String Formatting ---
const formatLatLng = (latLng) => {
    if (!latLng) return "N/A";
    if (typeof latLng.lat !== 'number' || typeof latLng.lng !== 'number') {
        console.warn("Invalid LatLng format for formatting:", latLng);
        return "Invalid Coords";
    }
    return `${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}`;
};

// --- Main Component ---
const DriverTracking = () => {
  // --- Load Google Maps API Script ---
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // --- State Variables ---
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null); // Directions result object
  const [currentRide, setCurrentRide] = useState(initialRide); // Current ride details
  const [driverLocation, setDriverLocation] = useState(initialRide.origin); // Driver's position
  const [infoMessage, setInfoMessage] = useState("Initializing map and route..."); // UI feedback
  const [riderCount, setRiderCount] = useState(1); // Count of accepted riders

  // --- Refs for Google Maps Objects ---
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null); // To display the route line
  const driverMarkerRef = useRef(null);   // Optional ref for driver marker

  // --- Map Load Callback ---
  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    if (window.google?.maps?.DirectionsService && window.google?.maps?.DirectionsRenderer) {
      directionsService.current = new window.google.maps.DirectionsService();
      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true, // We draw our own P/D markers
      });
    } else {
      console.error("Google Maps Directions Service/Renderer not loaded.");
      setInfoMessage("Error: Google Maps components failed to load.");
    }
  }, []); // Empty deps - runs once on load

  // --- Effect for Driver Location Simulation ---
  useEffect(() => {
    let intervalId = null;
    if (isLoaded) {
      intervalId = setInterval(() => {
        setDriverLocation(prevLoc => {
          if (prevLoc && typeof prevLoc.lat === 'number' && typeof prevLoc.lng === 'number') {
            return { lat: prevLoc.lat + 0.0001, lng: prevLoc.lng + 0.0001 };
          }
          return prevLoc;
        });
      }, DRIVER_UPDATE_INTERVAL_MS);
    }
    return () => { // Cleanup interval
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoaded]); // Depends only on API load status

  // --- Effect to Calculate and Display Route ---
  useEffect(() => {
    // Guard Clauses: Don't run if prerequisites aren't met
    if (!isLoaded || !map || !directionsService.current || !currentRide.origin || !currentRide.destination) {
      return;
    }

    console.log("Calculating route for:", currentRide);
    setInfoMessage(`Calculating route for Rider 1 ${riderCount > 1 ? `and ${riderCount - 1} pooler(s)` : ''}...`);

    const request = {
      origin: currentRide.origin,
      destination: currentRide.destination,
      waypoints: Array.isArray(currentRide.waypoints)
                   ? currentRide.waypoints.map(wp => ({ location: wp.location, stopover: true }))
                   : [],
      optimizeWaypoints: true, // Let API optimize the order of stops
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.current.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        console.log("Route calculated:", result);
        setDirections(result);
        if (directionsRenderer.current) {
          directionsRenderer.current.setDirections(result); // Draw route line
        }

        let message = `Route displayed for Rider 1`;
        message += (riderCount > 1) ? ` and ${riderCount - 1} pooler(s).` : ".";
        if (result.routes[0]?.warnings?.length > 0) {
          message += ` Warnings: ${result.routes[0].warnings.join(', ')}`;
          console.warn("Directions warnings:", result.routes[0].warnings);
        }
        setInfoMessage(message);

      } else {
        console.error("Error fetching directions:", status, result);
        setInfoMessage(`Error calculating route: ${status}. Check locations.`);
        setDirections(null);
        if (directionsRenderer.current) {
          directionsRenderer.current.setDirections({ routes: [] }); // Clear route visually
        }
      }
    });
    // Dependency: Recalculate if map/API ready, or if ride details (origin/dest/waypoints) or rider count change
  }, [isLoaded, map, currentRide, riderCount]);


  // --- Function to generate marker data based on current ride state ---
  const getRideMarkers = useCallback(() => {
    const markers = [];
    if (currentRide.origin?.lat && currentRide.origin?.lng) {
      markers.push({ id: "P1", position: currentRide.origin, label: "P1", title: "Pickup 1" });
    }
    if (Array.isArray(currentRide.waypoints)) {
      currentRide.waypoints.forEach((waypoint, index) => {
        if (waypoint.location?.lat && waypoint.location?.lng) {
          const pointNumber = Math.floor(index / 2) + 2;
          const pointType = index % 2 === 0 ? 'P' : 'D';
          markers.push({
            id: `${pointType}${pointNumber}`,
            position: waypoint.location,
            label: `${pointType}${pointNumber}`,
            title: `${pointType === 'P' ? 'Pickup' : 'Dropoff'} ${pointNumber}`,
          });
        }
      });
    }
    if (currentRide.destination?.lat && currentRide.destination?.lng) {
      markers.push({ id: "D1", position: currentRide.destination, label: "D1", title: "Dropoff 1" });
    }
    return markers;
  }, [currentRide]); // Depends only on currentRide

  // --- Proximity Check Function ---
  const isLocationNearRoute = useCallback((location, route) => {
    if (!window.google?.maps?.geometry || !location || typeof location.lat !== 'number' || typeof location.lng !== 'number' || !route?.overview_path || route.overview_path.length === 0) {
      console.warn("Proximity Check: Invalid input data or geometry library not ready.");
      return false;
    }

    const point = new window.google.maps.LatLng(location.lat, location.lng);
    const routePolyline = new window.google.maps.Polyline({ path: route.overview_path });

    console.log(`Proximity Check: Checking point ${formatLatLng(location)} against route with ${route.overview_path.length} points.`);
    console.log(`Proximity Check: Using tolerance (degrees): ${PROXIMITY_TOLERANCE_DEGREES}`);

    try {
      const isNear = window.google.maps.geometry.poly.isLocationOnEdge(point, routePolyline, PROXIMITY_TOLERANCE_DEGREES);
      console.log(`Proximity Check: Result for ${formatLatLng(location)} - Is near? ${isNear}`);
      return isNear;
    } catch (error) {
      console.error("Proximity Check: Error during isLocationOnEdge calculation:", error);
      return false;
    }
  }, []); // Relies only on args and google global


  // --- Function to Handle New Pooling Request (Immediate Acceptance/Rejection) ---
  const handleNewPoolingRequest = useCallback((newRequest, newRiderNumber) => {
    // Validate inputs
    if (!newRequest?.pickup?.lat || !newRequest?.pickup?.lng || !newRequest?.dropoff?.lat || !newRequest?.dropoff?.lng || typeof newRiderNumber !== 'number') {
      console.error("Invalid pooling request data received:", newRequest, newRiderNumber);
      setInfoMessage("Error processing pooling request: Invalid data.");
      return;
    }

    setInfoMessage(`Processing pooling request for Rider ${newRiderNumber}...`);
    console.log(`Received new request for Rider ${newRiderNumber}:`, newRequest);

    // Ensure current directions are available for checking
    if (!directions?.routes?.[0]) {
      console.error("Cannot process pooling request: No current route available.");
      setInfoMessage("Error: No current route for pooling.");
      return;
    }
    const currentRoute = directions.routes[0];

    // Check proximity for BOTH pickup and dropoff
    const isPickupNear = isLocationNearRoute(newRequest.pickup, currentRoute);
    const isDropoffNear = isLocationNearRoute(newRequest.dropoff, currentRoute);

    if (isPickupNear && isDropoffNear) {
      // --- ACCEPTED ---
      console.log(`Rider ${newRiderNumber} accepted: Pickup and Dropoff are near the route.`);
      setInfoMessage(`Rider ${newRiderNumber} accepted! Adding to route...`);

      const newWaypoints = [
        ...currentRide.waypoints,
        { location: newRequest.pickup, stopover: true },
        { location: newRequest.dropoff, stopover: true },
      ];

      // Update state to trigger route recalculation via useEffect
      setCurrentRide(prevRide => ({ ...prevRide, waypoints: newWaypoints }));
      setRiderCount(newRiderNumber); // Update count

    } else {
      // --- REJECTED ---
      const reason = !isPickupNear ? 'Pickup' : 'Dropoff';
      console.log(`Rider ${newRiderNumber} rejected: ${reason} location too far from route.`, { isPickupNear, isDropoffNear });
      setInfoMessage(`Pooling rejected for Rider ${newRiderNumber}: New ${reason} point is too far from the current route.`);
    }
    // Dependencies: Read directions, currentRide.waypoints. Use isLocationNearRoute. Set state.
  }, [directions, currentRide.waypoints, isLocationNearRoute]);


  // --- Reset Function ---
  const resetToInitialRide = useCallback(() => {
    setCurrentRide(initialRide);
    setDriverLocation(initialRide.origin);
    setDirections(null);
    setRiderCount(1);
    if (directionsRenderer.current) {
      directionsRenderer.current.setDirections({ routes: [] }); // Clear route visually
    }
    setInfoMessage("Route reset to initial rider (Rider 1).");
  }, []); // No dependencies


  // --- Render Logic ---
  if (loadError) return <div>Error loading maps: {loadError.message}. Check API key and network.</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  const rideMarkers = getRideMarkers(); // Get markers for current ride state

  return (
    // Main container div
    <div style={{ padding: "15px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Driver Route Tracking</h2>

      {/* Info Message Display */}
      {infoMessage && (
        <div style={{
          padding: "10px", marginBottom: "15px", borderRadius: "5px", textAlign: "center",
          backgroundColor: infoMessage.startsWith("Error") || infoMessage.includes("rejected") ? "#ffdddd" : "#e0f7fa",
          border: `1px solid ${infoMessage.startsWith("Error") || infoMessage.includes("rejected") ? "#f44336" : "#00bcd4"}`,
          color: infoMessage.startsWith("Error") || infoMessage.includes("rejected") ? "#a94442" : "#006064",
        }}>
          {infoMessage}
        </div>
      )}

      {/* Map Container */}
      <div style={{ border: '1px solid #ccc', borderRadius: '10px', overflow: 'hidden' }}>
        <GoogleMap
          mapContainerStyle={containerStyle} // Apply the style constant
          center={driverLocation} // Center on driver's location
          zoom={14}
          onLoad={onMapLoad}
          options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }} // Simplify map controls
        >
          {/* Driver Marker */}
          {driverLocation && (
            <Marker
              ref={driverMarkerRef}
              position={driverLocation}
              title={"Driver Location"}
              icon={{ path: window.google?.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 6, fillColor: "#007bff", fillOpacity: 1, strokeWeight: 2, strokeColor: "#ffffff", rotation: 0 }}
              zIndex={100} // Ensure driver marker is on top
            />
          )}

          {/* Ride Stop Markers (P1, D1, P2, D2...) */}
          {rideMarkers.map(marker => (
            <Marker
              key={marker.id} // React needs a unique key for list items
              position={marker.position}
              label={{ text: marker.label, color: "white", fontWeight: "bold" }}
              title={marker.title}
              icon={{ path: window.google?.maps.SymbolPath.CIRCLE, scale: 8, fillColor: marker.label.startsWith('P') ? "#4CAF50" : "#f44336", fillOpacity: 1, strokeWeight: 1, strokeColor: "#ffffff" }}
            />
          ))}
          {/* Route line is drawn by directionsRenderer ref via setDirections() */}
        </GoogleMap>
      </div>

      {/* --- Simulation Controls --- */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "10px" }}>
        <button
          onClick={() => handleNewPoolingRequest({
            pickup: { lat: 28.6260, lng: 77.2260 }, // P2
            dropoff: { lat: 28.6135, lng: 77.2200 }, // D2
            riderId: "RIDER_002",
          }, 2)}
          style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#4CAF50", color: "white" }}
          disabled={!directions || riderCount >= 2} // Disable if no route or R2 already added
        >
          Simulate Rider 2 (Near)
        </button>

        <button
          onClick={() => handleNewPoolingRequest({
            pickup: { lat: 28.5980, lng: 77.2275 }, // P3
            dropoff: { lat: 28.5890, lng: 77.2120 }, // D3
            riderId: "RIDER_003",
          }, 3)}
          style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#2196F3", color: "white" }}
          disabled={!directions || riderCount < 2 || riderCount >= 3} // Disable if R2 not added or R3 already added
        >
          Simulate Rider 3 (Near)
        </button>

        <button
          onClick={() => handleNewPoolingRequest({
            pickup: { lat: 28.6500, lng: 77.1950 }, // P4 Far
            dropoff: { lat: 28.5280, lng: 77.2190 }, // D4 Far
            riderId: "RIDER_004",
          }, 4)}
          style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#f44336", color: "white" }}
          disabled={!directions} // Can always attempt 'Far' if route exists
        >
          Simulate Rider 4 (Far)
        </button>

        <button
          onClick={resetToInitialRide}
          style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#ff9800", color: "white" }}
        >
          Reset Route
        </button>
      </div>

      {/* Optional: Display current ride state details */}
      <div style={{ marginTop: "15px", fontSize: "0.9em", backgroundColor: "#eee", padding: "10px", borderRadius: "5px" }}>
        <strong>Current Ride State:</strong>
        <div>Origin (P1): {formatLatLng(currentRide.origin)}</div>
        <div>
          Waypoints (P2, D2,...):{' '}
          {currentRide.waypoints.length > 0
             ? currentRide.waypoints.map((wp, i) => ( // Display formatted waypoints
                ` ${i % 2 === 0 ? 'P' : 'D'}${Math.floor(i/2)+2}: ${formatLatLng(wp.location)}`
               )).join(',')
             : " None"
          }
        </div>
        <div>Destination (D1): {formatLatLng(currentRide.destination)}</div>
        <div>Active Riders: {riderCount}</div>
      </div>
    </div>
  );
};

export default DriverTracking;