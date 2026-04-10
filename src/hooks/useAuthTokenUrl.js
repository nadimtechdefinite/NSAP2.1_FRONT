import axios from 'axios';
import { getAuthToken, getUserInfo } from 'utils/storageUtils';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Retrieve user information
    const userInfo = getUserInfo();
    // Check if user information is available and update headers
    if (userInfo) {
      config.headers['userInfo'] = JSON.stringify(userInfo);
      // Add other headers as needed based on your user information
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token has expired, redirect to login page
//       window.location.href = '/nsap/home'; // Redirect to the login page
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance; // Export the axiosInstance
