/**
 * Base URL for API requests
 */
const baseURL = "http://server-nodejs.cit.byui.edu:3000/";

/**
 * Convert fetch response to JSON and handle errors
 * @param {Response} res - The fetch response object
 * @return {Promise<Object>} The JSON response or throws an error
 */
async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

/**
 * ExternalServices class to handle API interactions
 */
export default class ExternalServices {
  /**
   * Create a new ExternalServices instance
   * @param {string} category - Optional category for product data
   */
  constructor(category) {
    // Constructor no longer needs to store category or path
    // Left empty for potential future initialization
  }

  /**
   * Fetch product data for a specific category
   * @param {string} category - Product category to fetch
   * @return {Promise<Array>} Array of products in the category
   */
  async getData(category) {
    const response = await fetch(baseURL + `products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  /**
   * Find product by ID
   * @param {string} id - Product ID to search for
   * @return {Promise<Object>} Product details
   */
  async findProductById(id) {
    const response = await fetch(baseURL + `product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  /**
   * Process checkout with order data
   * @param {Object} payload - Order data for checkout
   * @return {Promise<Object>} Checkout result
   */
  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(baseURL + "checkout/", options).then(convertToJson);
  }
}

/**
 * Example of checkout form event listener implementation
 * This would typically be in a separate checkout.js file
 */
function setupCheckoutListener() {
  document.querySelector('#checkoutSubmit')
    .addEventListener('click', (e) => {
      e.preventDefault();
      const form = document.forms['checkout'];
      const valid = form.checkValidity();
      
      if (valid) {
        myCheckout.checkout();
      } else {
        form.reportValidity();
      }
    });
}


