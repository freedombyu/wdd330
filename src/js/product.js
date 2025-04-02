/**
* Product Details Page Script
* Initializes single product view based on URL product parameter
*/
import { getParam, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.js';
import ProductDetails from './ProductDetails.mjs';

// Extract product ID from URL parameters
const productId = getParam('product');

// Initialize data source for tents category
const dataSource = new ProductData('tents');

// Create product details instance with the specified product ID
const product = new ProductDetails(productId, dataSource);

// Load shared header and footer components
loadHeaderFooter();

// Initialize product details view
product.init();

