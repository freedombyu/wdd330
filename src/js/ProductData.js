/**
 * ProductData Class
 * 
 * Handles API communication for product data retrieval.
 * Makes requests to the server API and processes the responses.
 */

// Base URL from environment variables
const baseURL = import.meta.env.VITE_SERVER_URL;

/**
 * Converts API response to JSON or throws an error
 * @param {Response} res - Fetch API response object
 * @returns {Promise<Object>} - JSON response data
 * @throws {Error} - If response is not ok
 */
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

/**
 * Product data service class
 * Responsible for fetching product information from the API
 */
export default class ProductData {
  /**
   * Create a new ProductData instance
   * @param {string} category - Product category to filter by
   */
  constructor(category) {
    this.category = category;
  }
  
  /**
   * Fetch products by category
   * @param {string} category - Product category to retrieve
   * @returns {Promise<Array>} - Array of product objects
   */
  async getData(category) {
    try {
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await convertToJson(response);
      return data.Result;
    } catch (error) {
      console.error('Error fetching product data:', error);
      return []; // Return empty array if fetch fails
    }
  }

  /**
   * Find a specific product by ID
   * @param {string|number} id - Product ID to look up
   * @returns {Promise<Object>} - Product object
   */
  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await convertToJson(response);
      return data.Result;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return {};
    }
  }
}
