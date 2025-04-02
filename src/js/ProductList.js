/**
 * @fileoverview Product list component that handles rendering and filtering of products
 * @requires ./utils.mjs
 */
import { qs, renderListWithTemplate } from './utils.mjs';

/**
 * Creates HTML template for a product card
 * @param {Object} product - Product data object
 * @returns {string} HTML string for the product card
 */
const productCardTemplate = (product) => {
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
    ListPrice: listPrice,
  } = product;

  return `
    <li class="product-card">
      <a href="/product_pages/?product=${id}">
        <picture>
          <source media="(min-width: 1500px)" srcset="${extraLargeUrl}">
          <source media="(min-width: 1000px)" srcset="${largeUrl}">
          <source media="(min-width: 800px)" srcset="${mediumUrl}">
          <img
            src="${smallUrl}"
            alt="Image of ${name}"
            loading="lazy"
          >
        </picture>
        <h3 class="card__brand">${brandName}</h3>
        <h2 class="card__name">${name}</h2>
        <p class="product-card__price">${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(listPrice)}</p>
      </a>
    </li>
  `;
};

/**
 * ProductList class responsible for managing product display and filtering
 */
export default class ProductList {
  /**
   * @param {string} category - Product category to display
   * @param {Object} dataSource - Data source with getData method
   * @param {HTMLElement} listElement - DOM element to render products in
   */
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.searchBox = qs('#searchBox');
    this.list = [];
    this.debounceTimeout = null;
    this.debounceDelay = 300; // milliseconds
  }

  /**
   * Renders products to the DOM
   * @param {Array} list - Array of product objects
   * @param {HTMLElement} listElement - DOM element to render products in
   * @param {boolean} clear - Whether to clear the element before rendering
   */
  renderList(list, listElement, clear = false) {
    renderListWithTemplate(productCardTemplate, listElement, list, clear);
  }

  /**
   * Initializes the product list component
   * @returns {Promise<void>}
   */
  async init() {
    try {
      this.list = await this.dataSource.getData(this.category);
      this.renderList(this.list, this.listElement);
      this.initEventListeners();
    } catch (error) {
      console.error('Failed to initialize product list:', error);
      this.renderError();
    }
  }

  /**
   * Sets up event listeners
   */
  initEventListeners() {
    this.searchBox.addEventListener('input', this.handleSearchInput.bind(this));
  }

  /**
   * Handles search input with debounce
   * @param {Event} event - Input event
   */
  handleSearchInput(event) {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.searchProducts(event);
    }, this.debounceDelay);
  }

  /**
   * Filters and displays products based on search query
   * @param {Event} event - Input event
   */
  searchProducts(event) {
    const query = event.target.value.trim().toLowerCase();
    
    if (!query) {
      this.renderList(this.list, this.listElement, true);
      return;
    }
    
    const filteredList = this.list.filter((product) => {
      const productName = product.Name.toLowerCase();
      const brandName = product.Brand.Name.toLowerCase();
      
      return productName.includes(query) || brandName.includes(query);
    });
    
    this.renderList(filteredList, this.listElement, true);
    
    if (filteredList.length === 0) {
      this.renderNoResults();
    }
  }

  /**
   * Renders an error message when data fetching fails
   */
  renderError() {
    this.listElement.innerHTML = `
      <div class="error-message">
        <p>Unable to load products. Please try again later.</p>
      </div>
    `;
  }

  /**
   * Renders a message when no search results are found
   */
  renderNoResults() {
    const noResultsElement = document.createElement('div');
    noResultsElement.className = 'no-results';
    noResultsElement.innerHTML = `
      <p>No products match your search. Try different keywords.</p>
    `;
    
    this.listElement.appendChild(noResultsElement);
  }
}
