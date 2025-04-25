// src/services/api.js
import axios from "axios";

// --- Axios Instance Setup ---
const API = axios.create({
  baseURL: "http://localhost:8000/api/", // Your Django backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Interceptors ---

// Request Interceptor: Add the auth token to requests if it exists
API.interceptors.request.use(
  (config) => {
    // Retrieve the access token from local storage (or your state management)
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Add the Authorization header
      // Ensure the scheme matches your backend (e.g., 'Bearer', 'Token')
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response Interceptor (Optional but recommended for handling token refresh)
API.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const originalRequest = error.config;

    // Example: Handle 401 Unauthorized (e.g., token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark to prevent infinite loops

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            // No refresh token, logout or redirect to login
            console.error("No refresh token available.");
            // window.location.href = '/login'; // Example redirect
            return Promise.reject(error);
        }

        // Make a request to your backend's token refresh endpoint
        // Adjust the URL '/auth/token/refresh/' as needed
        const refreshResponse = await axios.post(
            "http://localhost:8000/api/auth/token/refresh/", // Use base axios or configure API instance carefully
            { refresh: refreshToken },
            { headers: { 'Content-Type': 'application/json' } } // Ensure correct headers for this specific request
        );

        const newAccessToken = refreshResponse.data.access;

        // Store the new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Update the Authorization header for the original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return API(originalRequest);

      } catch (refreshError) {
        // Refresh failed, logout or redirect to login
        console.error("Token refresh failed:", refreshError);
        // Clear tokens, logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo"); // Clear user info too
        // window.location.href = '/login'; // Example redirect
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);


// --- Authentication API Calls ---

/**
 * Logs in a user.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} - Backend response (e.g., { access, refresh, user: { id, email, role } })
 */
export const loginUser = async (credentials) => {
  // Adjust endpoint if necessary (e.g., '/token/' for simplejwt)
  const response = await API.post("/auth/login/", credentials);
  // Store user info upon successful login (customize based on response)
  if (response.data.user) {
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
  }
   if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
   }
   if (response.data.refresh) {
      localStorage.setItem('refreshToken', response.data.refresh);
   }
  return response.data;
};

/**
 * Registers a new user.
 * @param {object} userData - User registration data matching backend expectations.
 * @returns {Promise<object>} - Backend response (e.g., user details or success message)
 */
export const registerUser = async (userData) => {
  // Adjust endpoint if necessary
  const response = await API.post("/auth/register/", userData);
  return response.data;
};

// --- Ride Request API Calls ---

/**
 * Submits a new ride request and initiates the driver search process on the backend.
 * @param {object} requestData - { rider_id, source: {latitude, longitude}, destination: {latitude, longitude}, pooling, ... }
 * @returns {Promise<object>} - Backend response, expected to include { request_id: ... }
 */
export const submitRideRequest = async (requestData) => {
  // This endpoint needs to be created in your Django backend
  // It will handle finding drivers and starting the sequential notification
  const response = await API.post("/rides/initiate-request/", requestData);
  return response.data;
};

/**
 * Checks the status of an ongoing ride request. Useful for the waiting page.
 * @param {number | string} requestId - The ID of the ride request.
 * @returns {Promise<object>} - Backend response (e.g., { status: 'searching' | 'matched' | 'no_driver' | 'cancelled', driver_info: {...} | null })
 */
export const checkRideRequestStatus = async (requestId) => {
    const response = await API.get(`/rides/request-status/${requestId}/`); // Endpoint needs to exist on backend
    return response.data;
}


// --- Add other API calls below as needed ---
// Example: Fetch ride history, update profile, etc.


// Export the functions for use in components
export default API; // Can still export the base instance if needed