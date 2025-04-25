// src/pages/Driver/DriverTracking2.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

// Import the CSS module
import styles from './DriverTracking2.module.css';

// Add 'geometry' library for proximity checks
const libraries = ["places", "geometry"];

// Style applied DIRECTLY to GoogleMap component (required by the component)
const mapContainerStyle = {
  width: "100%",
  height: "65vh", // Adjust height as needed
};

// --- Configuration ---
const PROXIMITY_TOLERANCE_DEGREES = 0.012; // Approx 1.3km
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
const DriverTracking2 = () => { // Renamed Component
  // --- Load Google Maps API Script ---
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // --- State Variables ---
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [currentRide, setCurrentRide] = useState(initialRide);
  const [driverLocation, setDriverLocation] = useState(initialRide.origin);
  const [infoMessage, setInfoMessage] = useState("Initializing map and route...");
  const [riderCount, setRiderCount] = useState(1);

  // --- Refs for Google Maps Objects ---
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);
  const driverMarkerRef = useRef(null);

  // --- Map Load Callback ---
  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    if (window.google?.maps?.DirectionsService && window.google?.maps?.DirectionsRenderer) {
      directionsService.current = new window.google.maps.DirectionsService();
      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true, // We draw our own P/D markers
        polylineOptions: { // Optional: Style the route line
            strokeColor: '#007bff',
            strokeOpacity: 0.8,
            strokeWeight: 6
        }
      });
      console.log("Directions Service and Renderer initialized.");
    } else {
      console.error("Google Maps Directions Service/Renderer not loaded.");
      setInfoMessage("Error: Google Maps components failed to load.");
    }
  }, []); // Empty deps - runs once on map load

  // --- Effect for Driver Location Simulation ---
  useEffect(() => {
    let intervalId = null;
    if (isLoaded && map) { // Also check if map is loaded before starting simulation
      intervalId = setInterval(() => {
        setDriverLocation(prevLoc => {
          // Basic simulation - move slightly northeast
          // In a real app, this would come from a GPS source or backend
          if (prevLoc && typeof prevLoc.lat === 'number' && typeof prevLoc.lng === 'number') {
            return { lat: prevLoc.lat + 0.0001, lng: prevLoc.lng + 0.0001 };
          }
          return prevLoc;
        });
      }, DRIVER_UPDATE_INTERVAL_MS);
      console.log("Driver location simulation started.");
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log("Driver location simulation stopped.");
      }
    };
  }, [isLoaded, map]); // Depend on API and map load status

  // --- Effect to Calculate and Display Route ---
  useEffect(() => {
    if (!isLoaded || !map || !directionsService.current || !currentRide.origin || !currentRide.destination) {
      console.log("Route calculation prerequisites not met.");
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
      optimizeWaypoints: true,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.current.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        console.log("Route calculated successfully:", result);
        setDirections(result);
        if (directionsRenderer.current) {
          directionsRenderer.current.setDirections(result);
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
          directionsRenderer.current.setDirections({ routes: [] });
        }
      }
    });
  }, [isLoaded, map, currentRide, riderCount]); // Recalculate on these changes


  // --- Function to generate marker data ---
  const getRideMarkers = useCallback(() => {
    const markers = [];
    if (currentRide.origin?.lat && currentRide.origin?.lng) {
      markers.push({ id: "P1", position: currentRide.origin, label: "P1", title: "Pickup 1" });
    }
    if (Array.isArray(currentRide.waypoints)) {
      currentRide.waypoints.forEach((waypoint, index) => {
        if (waypoint.location?.lat && waypoint.location?.lng) {
          const pointNumber = Math.floor(index / 2) + 2; // Starts from 2
          const pointType = index % 2 === 0 ? 'P' : 'D'; // Alternate P, D
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
  }, [currentRide]);

  // --- Proximity Check Function ---
  const isLocationNearRoute = useCallback((location, route) => {
    if (!window.google?.maps?.geometry || !location || typeof location.lat !== 'number' || typeof location.lng !== 'number' || !route?.overview_path || route.overview_path.length === 0) {
      console.warn("Proximity Check: Invalid input or geometry library not ready.");
      return false;
    }
    const point = new window.google.maps.LatLng(location.lat, location.lng);
    const routePolyline = new window.google.maps.Polyline({ path: route.overview_path });
    try {
      const isNear = window.google.maps.geometry.poly.isLocationOnEdge(point, routePolyline, PROXIMITY_TOLERANCE_DEGREES);
      console.log(`Proximity Check: Point ${formatLatLng(location)} near route? ${isNear}`);
      return isNear;
    } catch (error) {
      console.error("Proximity Check Error:", error);
      return false;
    }
  }, []); // No dependencies needed here


  // --- Handle New Pooling Request ---
  const handleNewPoolingRequest = useCallback((newRequest, newRiderNumber) => {
    if (!newRequest?.pickup?.lat || !newRequest?.dropoff?.lat || typeof newRiderNumber !== 'number') {
      console.error("Invalid pooling request data:", newRequest, newRiderNumber);
      setInfoMessage("Error: Invalid pooling request data.");
      return;
    }
    setInfoMessage(`Processing pooling request for Rider ${newRiderNumber}...`);
    console.log(`New request Rider ${newRiderNumber}:`, newRequest);

    if (!directions?.routes?.[0]) {
      console.error("Cannot process pool request: No current route.");
      setInfoMessage("Error: No current route available for pooling check.");
      return;
    }
    const currentRoute = directions.routes[0];

    const isPickupNear = isLocationNearRoute(newRequest.pickup, currentRoute);
    const isDropoffNear = isLocationNearRoute(newRequest.dropoff, currentRoute);

    if (isPickupNear && isDropoffNear) {
      console.log(`Rider ${newRiderNumber} ACCEPTED.`);
      setInfoMessage(`Rider ${newRiderNumber} accepted! Adding to route...`);
      const newWaypoints = [
        ...currentRide.waypoints,
        { location: newRequest.pickup, stopover: true },
        { location: newRequest.dropoff, stopover: true },
      ];
      setCurrentRide(prevRide => ({ ...prevRide, waypoints: newWaypoints }));
      setRiderCount(newRiderNumber); // Update the latest rider number
    } else {
      const reason = !isPickupNear ? 'Pickup' : 'Dropoff';
      console.log(`Rider ${newRiderNumber} REJECTED: ${reason} too far.`);
      setInfoMessage(`Pooling rejected for Rider ${newRiderNumber}: New ${reason} point too far from route.`);
    }
  }, [directions, currentRide.waypoints, isLocationNearRoute]); // Dependencies


  // --- Reset Function ---
  const resetToInitialRide = useCallback(() => {
    console.log("Resetting route to initial state.");
    setCurrentRide(initialRide);
    setDriverLocation(initialRide.origin);
    setDirections(null); // Clear directions object
    setRiderCount(1);
    if (directionsRenderer.current) {
      directionsRenderer.current.setDirections({ routes: [] }); // Clear route line visually
    }
    setInfoMessage("Route reset to initial rider (Rider 1).");
  }, []); // No dependencies


  // --- Render Logic ---
  if (loadError) {
    return <div className={`${styles.container} ${styles.infoMessage} ${styles.infoError}`}>Error loading maps: {loadError.message}. Check API key and network connection.</div>;
  }
  if (!isLoaded) {
    return <div className={`${styles.container} ${styles.infoMessage}`}>Loading Map...</div>;
  }

  const rideMarkers = getRideMarkers();
  const isError = infoMessage.startsWith("Error") || infoMessage.includes("rejected");
  const infoMessageClass = `${styles.infoMessage} ${isError ? styles.infoError : styles.infoSuccess}`;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Driver Route Tracking (Simulation)</h2>

      {/* Info Message Display */}
      {infoMessage && (
        <div className={infoMessageClass}>
          {infoMessage}
        </div>
      )}

      {/* Map Container */}
      <div className={styles.mapWrapper}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle} // Use the constant defined above
          center={driverLocation}
          zoom={13} // Slightly zoomed out
          onLoad={onMapLoad}
          options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true, // Allow fullscreen
              zoomControl: true, // Keep zoom
              gestureHandling: 'cooperative' // Better for touch devices
           }}
        >
          {/* Driver Marker */}
          {driverLocation && (
            <Marker
              ref={driverMarkerRef}
              position={driverLocation}
              title={"Driver Location"}
              icon={{ path: window.google?.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 7, fillColor: "#0d6efd", fillOpacity: 1, strokeWeight: 2, strokeColor: "#ffffff", rotation: 0 }} // Adjusted color/size
              zIndex={100}
            />
          )}

          {/* Ride Stop Markers */}
          {rideMarkers.map(marker => (
            <Marker
              key={marker.id}
              position={marker.position}
              label={{ text: marker.label, color: "white", fontWeight: "bold", fontSize: '11px' }}
              title={marker.title}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 9, // Slightly larger
                fillColor: marker.label.startsWith('P') ? "#198754" : "#dc3545", // Bootstrap green/red
                fillOpacity: 0.9,
                strokeWeight: 1.5,
                strokeColor: "#ffffff"
              }}
              zIndex={50} // Ensure they are below driver
            />
          ))}
          {/* Route line drawn by directionsRenderer */}
        </GoogleMap>
      </div>

      {/* Simulation Controls */}
      <div className={styles.controlsContainer}>
        <button
          onClick={() => handleNewPoolingRequest({
            pickup: { lat: 28.6260, lng: 77.2260 }, // P2 Near
            dropoff: { lat: 28.6135, lng: 77.2200 }, // D2 Near
            riderId: "RIDER_002",
          }, 2)}
          className={`${styles.button} ${styles.buttonRider2}`}
          disabled={!directions || riderCount >= 2}
          title={!directions ? "Calculate initial route first" : riderCount >= 2 ? "Rider 2 already added" : "Add Rider 2 (Near Pickup/Dropoff)"}
        >
          Simulate Rider 2 (Near)
        </button>

        <button
          onClick={() => handleNewPoolingRequest({
            pickup: { lat: 28.5980, lng: 77.2275 }, // P3 Near
            dropoff: { lat: 28.5890, lng: 77.2120 }, // D3 Near
            riderId: "RIDER_003",
          }, 3)}
          className={`${styles.button} ${styles.buttonRider3}`}
          disabled={!directions || riderCount < 2 || riderCount >= 3}
           title={riderCount < 2 ? "Add Rider 2 first" : riderCount >= 3 ? "Rider 3 already added" : "Add Rider 3 (Near Pickup/Dropoff)"}
        >
          Simulate Rider 3 (Near)
        </button>

        <button
          onClick={() => handleNewPoolingRequest({
            pickup: { lat: 28.6500, lng: 77.1950 }, // P4 Far
            dropoff: { lat: 28.5280, lng: 77.2190 }, // D4 Far
            riderId: "RIDER_004",
          }, 4)} // Technically rider 4, but logic rejects if P/D far
          className={`${styles.button} ${styles.buttonFar}`}
          disabled={!directions}
          title={!directions ? "Calculate initial route first" : "Simulate adding Rider whose points are far"}
        >
          Simulate Pool (Far)
        </button>

        <button
          onClick={resetToInitialRide}
          className={`${styles.button} ${styles.buttonReset}`}
          title="Reset map to only Rider 1's route"
        >
          Reset Route
        </button>
      </div>

      {/* Current Ride State Details */}
      <div className={styles.rideStateDetails}>
        <strong>Current Ride State:</strong>
        <div><span>Origin (P1):</span> {formatLatLng(currentRide.origin)}</div>
        <div>
          <span>Waypoints:</span>
          {currentRide.waypoints.length > 0
             ? currentRide.waypoints.map((wp, i) => (
                <React.Fragment key={`wp-${i}`}>
                  {i > 0 ? ", " : ""}
                  <span>{`${i % 2 === 0 ? 'P' : 'D'}${Math.floor(i/2)+2}:`}</span>
                  {formatLatLng(wp.location)}
                </React.Fragment>
               ))
             : " None"
          }
        </div>
        <div><span>Destination (D1):</span> {formatLatLng(currentRide.destination)}</div>
        <div><span>Active Riders:</span> {riderCount}</div>
      </div>
    </div>
  );
};

export default DriverTracking2; // Renamed Export