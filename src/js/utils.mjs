// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export const getParam = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
};

export const addProductToCart = (product) => {
  const cartItems = getLocalStorage('so-cart') || [];
  const existingItemIndex = cartItems.findIndex(
    (item) => item.Id === product.Id,
  );

  if (existingItemIndex > -1) {
    // If product already exists, update its quantity
    cartItems[existingItemIndex].quantity += 1;
  } else {
    // Otherwise, add the product to the cart
    product.quantity = 1;
    cartItems.push(product);
  }

  setLocalStorage('so-cart', cartItems);
};

export const renderListWithTemplate = (
  templateFunction,
  parentElement,
  list,
  clear = false,
  position = 'afterBegin',
) => {
  const htmlStrins = list.map(templateFunction);
  if (clear) {
    parentElement.innerHTML = '';
  }
  parentElement.insertAdjacentHTML(position, htmlStrins.join(''));
};

export const renderWithTemplate = (template, parentElement, data, callback) => {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
};

export const loadTemplate = async (path) => {
  const response = await fetch(path);
  return response.text();
};

export const loadHeaderFooter = async () => {
  const header = await loadTemplate('../partials/header.html');
  const headerElement = qs('#header');
  const footer = await loadTemplate('../partials/footer.html');
  const footerElement = qs('#footer');

  renderWithTemplate(header, headerElement);
  renderWithTemplate(footer, footerElement);
};

// utils.mjs
export function alertMessage(message, scroll = true) {
  // Create the alert element
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `<p>${message}</p><span class="close">X</span>`;
  
  // Add styles sleepOutside 
  alert.style.backgroundColor = '#F2994A';
  alert.style.color = '#000';
  alert.style.padding = '10px';
  alert.style.margin = '10px 0';
  alert.style.display = 'flex';
  alert.style.justifyContent = 'space-between';
  alert.style.alignItems = 'center';
  
  // Get the main element and insert the alert at the top
  const main = document.querySelector('main');
  main.prepend(alert);
  
  // Add event listener to close button
  const closeButton = alert.querySelector('.close');
  closeButton.addEventListener('click', () => {
    main.removeChild(alert);
  });
  
  // Scroll to the top if needed
  if (scroll) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
