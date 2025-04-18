import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Unified function to fetch listings.
 * - If no filters are passed, returns all listings.
 * - If filters are passed (price, city, etc.), returns filtered listings.
 */
export const fetchListings = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};

/**
 * Fetch a single listing by its unique ID (e.g. URL or custom 'id')
 */
export const fetchListingById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching listing with id ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch a specific statistic by type
 * Example: statType = "top_growing_regions"
 */
export const fetchStatByType = async (statType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/stats/${statType}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching stat of type ${statType}:`, error);
    throw error;
  }
};

/**
 * Fetch all available statistics
 */
export const fetchAllStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all stats:", error);
    throw error;
  }
};
