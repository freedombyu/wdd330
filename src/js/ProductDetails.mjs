/**
 * @fileoverview Product Details Component
 * Handles the rendering and interaction for product detail pages
 * @author Your Company
 * @version 1.0.0
 */

import { addProductToCart, qs } from './utils.mjs';
import React, { useState, useEffect } from 'react';

/**
 * Creates HTML markup for the product detail view
 * @param {Object} product - The complete product data object
 * @return {string} HTML markup for the product detail
 */
function createProductDetailTemplate(product) {
  const {
    Id: id,
    Brand: { Name: brandName },
    NameWithoutBrand: name,
    Images: {
      PrimarySmall: smallUrl,
      PrimaryMedium: mediumUrl,
      PrimaryLarge: largeUrl,
      PrimaryExtraLarge: extraLargeUrl,
    },
    FinalPrice: finalPrice,
    DescriptionHtmlSimple: description,
    Colors,
  } = product;
  
  // Template implementation would go here
  // This was empty in the original code
}

/**
 * Product added alert component
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the alert
 * @param {Function} props.onClose - Function to call when alert is closed
 * @param {string} props.productName - Name of the product added to cart
 * @param {number} props.timeout - Time in ms before auto-closing (default: 3000)
 * @return {React.Element|null} The alert component or null if not visible
 */
const ProductAddedAlert = ({ show, onClose, productName, timeout = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [show, timeout, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-4 right-4 max-w-sm bg-green-100 border border-green-200 text-green-800 rounded-lg shadow-lg p-4 flex items-center z-50 animate-fade-in">
      <div className="mr-3 text-green-500">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <div className="flex-1">
        <p className="font-medium">
          {productName ? `${productName} added to cart!` : 'Product added to cart!'}
        </p>
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          onClose && onClose();
        }}
        className="ml-4 text-gray-400 hover:text-gray-600" 
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
};

/**
 * ProductDetails class
 * Manages the display and interactions for a product detail page
 */
export default class ProductDetails {
  /**
   * @param {string} productId - The unique identifier for the product
   * @param {Object} dataSource - Data provider with product retrieval methods
   */
  constructor(productId, dataSource) {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    
    if (!dataSource || typeof dataSource.findProductById !== 'function') {
      throw new Error('Valid data source with findProductById method is required');
    }
    
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = null;
    this.containerSelector = null;
  }

  /**
   * Initialize the product details component
   * @param {string} containerSelector - CSS selector for the container element
   * @return {Promise<void>}
   */
  async init(containerSelector = 'main') {
    try {
      this.containerSelector = containerSelector;
      this.product = await this.dataSource.findProductById(this.productId);
      
      if (!this.product) {
        throw new Error(`Product with ID ${this.productId} not found`);
      }
      
      this.render();
      this.attachEventListeners();
    } catch (error) {
      console.error('Failed to initialize product details:', error);
      this.handleError(error);
    }
  }

  /**
   * Render the product details in the specified container
   */
  render() {
    const container = qs(this.containerSelector);
    
    if (!container) {
      console.error(`Container element "${this.containerSelector}" not found`);
      return;
    }
    
    container.insertAdjacentHTML(
      'afterBegin',
      createProductDetailTemplate(this.product)
    );
  }

  /**
   * Attach event listeners to interactive elements
   */
  attachEventListeners() {
    const addToCartButton = qs('#addToCart');
    
    if (addToCartButton) {
      addToCartButton.addEventListener('click', this.handleAddToCart.bind(this));
    }
  }

  /**
   * Handle add to cart button click
   * @param {Event} event - The click event object
   */
  handleAddToCart(event) {
    event.preventDefault();
    
    if (this.product) {
      addProductToCart(this.product);
      this.showAddedToCartAlert();
      this.updateAddToCartUI(event.target);
    }
  }

  /**
   * Show alert that product was added to cart
   */
  showAddedToCartAlert() {
    // For non-React implementations
    alertMessage(`${this.product.NameWithoutBrand} added to cart!`);
    
    // React implementation would use the ProductAddedAlert component:
    // setShowAlert(true);
  }

  /**
   * Update UI after adding product to cart
   * @param {HTMLElement} button - The clicked button element
   */
  updateAddToCartUI(button) {
    // Optional UI feedback when product is added to cart
    button.classList.add('button--success');
    button.textContent = 'Added to Cart';
    
    setTimeout(() => {
      button.classList.remove('button--success');
      button.textContent = 'Add to Cart';
    }, 2000);
  }

  /**
   * Handle errors during initialization or rendering
   * @param {Error} error - The error object
   */
  handleError(error) {
    const container = qs(this.containerSelector);
    
    if (container) {
      container.insertAdjacentHTML(
        'afterBegin',
        `<div class="error-message">
          <p>Sorry, we couldn't load the product details.</p>
          <p>Please try again later or contact customer support.</p>
        </div>`
      );
    }
  }
}

/**
 * Example of how to use the ProductAddedAlert component in a React context
 */
const ProductPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: "Vintage Leather Backpack" });
  
  const handleAddToCart = () => {
    // Your cart logic here
    console.log(`Added ${currentProduct.name} to cart`);
    
    // Show the alert
    setShowAlert(true);
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{currentProduct.name}</h1>
      <p className="mb-4">Premium quality, handcrafted leather backpack.</p>
      <button 
        onClick={handleAddToCart}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        Add to Cart
      </button>
      
      <ProductAddedAlert 
        show={showAlert}
        onClose={() => setShowAlert(false)}
        productName={currentProduct.name}
      />
    </div>
  );
};
