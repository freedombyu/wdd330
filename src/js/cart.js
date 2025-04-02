import {
  getLocalStorage,
  loadHeaderFooter,
  setLocalStorage,
} from './utils.mjs';

/**
 * Renders the contents of the shopping cart from local storage
 */
function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index)
  );
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
  addQuantityListeners(); // Add listeners for quantity changes
}

/**
 * Creates HTML template for a cart item
 * @param {Object} product - The product data
 * @param {Number} index - The index of the product in the cart array
 * @returns {String} HTML representation of the cart item
 */
function cartItemTemplate(product, index) {
  const {
    Id: id,
    NameWithoutBrand: name,
    Images: {
      PrimarySmall: smallUrl,
      PrimaryMedium: mediumUrl,
      PrimaryLarge: largeUrl,
      PrimaryExtraLarge: extraLargeUrl,
    },
    FinalPrice: finalPrice,
    Colors,
    quantity,
  } = product;

  return `
  <li class="cart-card divider">
    <a href="/product_pages/?product=${id}" class="cart-card__image">
      <picture>
        <source media="(min-width: 1500px)" srcset="${extraLargeUrl}" />
        <source media="(min-width: 1000px)" srcset="${largeUrl}" />
        <source media="(min-width: 800px)" srcset="${mediumUrl}" />
        <img src="${smallUrl}" alt="Image of ${name}" />
      </picture>
    </a>
    <a href="/product/${id}">
      <h2 class="card__name">${name}</h2>
    </a>
    <p class="cart-card__color">${Colors[0].ColorName}</p>
    <div class="cart-card__quantity">
      <label for="quantity-${index}">Qty:</label>
      <input 
        type="number" 
        id="quantity-${index}" 
        data-index="${index}" 
        value="${quantity || 1}" 
        min="1" 
      />
    </div>
    <p class="cart-card__price">$${finalPrice}</p>
  </li>
  `;
}

/**
 * Adds event listeners to quantity input fields
 */
function addQuantityListeners() {
  const quantityInputs = document.querySelectorAll(
    '.cart-card__quantity input'
  );
  quantityInputs.forEach((input) => {
    input.addEventListener('change', updateQuantity);
  });
}

/**
 * Updates quantity of an item in the cart
 * @param {Event} event - The change event
 */
function updateQuantity(event) {
  const index = event.target.dataset.index;
  const newQuantity = parseInt(event.target.value);
  
  if (newQuantity < 1) return; // Prevent invalid quantities

  const cartItems = getLocalStorage('so-cart') || [];
  cartItems[index].quantity = newQuantity;
  setLocalStorage('so-cart', cartItems);
  renderCartContents(); // Re-render cart to reflect changes
}

// Initialize the page
loadHeaderFooter();
renderCartContents();
