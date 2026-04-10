import axiosInstance from 'hooks/useAuthTokenUrl';
import config from 'config';

// Function to fetch menu items from the API
export const fetchMenuItemsFromAPI = async () => {
  try {
    const apiBaseUrl = config.API_BASE_URL;
    const findUserLoginMenuUrl = `${apiBaseUrl}/login/getUserLoginMenu`;
    const response = await axiosInstance.get(findUserLoginMenuUrl);
    return response.data; // Return the data directly
  } catch (error) {
    console.error('Error fetching menu items:', error);
    if (error.response && error.response.status === 500) {
      localStorage.clear();
    }
    return []; // Return an empty array or handle the error as preferred
  }
};
