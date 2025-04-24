// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:8000/api', // Update this if your Django backend is hosted differently
// });

// // Example: request a ride
// export const requestRide = (rideData) => {
//   return API.post('/rides/request/', rideData);
// };

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // Change if needed
});

export const loginUser = (data) => API.post("/auth/token/login/", data);
export const signupUser = (data) => API.post("/auth/users/", data);
export const requestRide = (data) => API.post("/rides/request/", data);
