import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Configure axios with auth headers
const configureAxios = () => {
  // const token = getAuthToken();
  return {
    headers: {
      "Content-Type": "application/json",
      // Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/**
 * Get all users (admin only)
 * @returns {Promise<Array>} Array of user objects
 */
export const getAllUsers = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/admin/korisnici`,
      configureAxios()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

/**
 * Promote a user to admin role
 * @param {string} userId - The ID of the user to promote
 * @returns {Promise<Object>} Updated user object
 */
export const promoteToAdmin = async (userId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/admin/korisnici/${userId}/promoviraj`,
      {},
      configureAxios()
    );
    return response.data;
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    throw error;
  }
};

/**
 * Demote an admin to customer role
 * @param {string} userId - The ID of the admin to demote
 * @returns {Promise<Object>} Updated user object
 */
export const demoteToCustomer = async (userId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/admin/korisnici/${userId}/demoviraj`,
      {},
      configureAxios()
    );
    return response.data;
  } catch (error) {
    console.error("Error demoting admin to customer:", error);
    throw error;
  }
};
