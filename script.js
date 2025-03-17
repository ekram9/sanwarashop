// Cart Data (Stored in localStorage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update the cart count in the navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Function to add an item to the cart
function addToCart(name, price) {
    const item = cart.find((item) => item.name === name);

    if (item) {
        item.quantity += 1; // Increase quantity if item already exists
    } else {
        cart.push({ name, price, quantity: 1 }); // Add new item to cart
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Save to localStorage
    updateCartCount(); // Update the cart count
    alert(`${name} added to cart!`);
    console.log('Cart data:', cart); // Debugging
}

// Function to display cart items on the cart page
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');

    if (!cartItems || !totalPrice) return; // Exit if elements don't exist

    cartItems.innerHTML = ''; // Clear existing content
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItems.innerHTML += `
            <div class="col-12 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">Price: $${item.price.toFixed(2)}</p>
                        <p class="card-text">Quantity: ${item.quantity}</p>
                        <p class="card-text"><strong>Total: $${itemTotal.toFixed(2)}</strong></p>
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });

    totalPrice.textContent = total.toFixed(2); // Update total price
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove item from cart
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    displayCart(); // Refresh cart display
    updateCartCount(); // Update the cart count
}

// Function to display order summary on the checkout page
function displayOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    const checkoutTotal = document.getElementById('checkout-total');

    if (!orderSummary || !checkoutTotal) return; // Exit if elements don't exist

    orderSummary.innerHTML = ''; // Clear existing content
    let total = 0;

    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        orderSummary.innerHTML += `
            <li class="list-group-item">
                ${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}
            </li>
        `;
    });

    checkoutTotal.textContent = total.toFixed(2); // Update total price
}

// Function to validate the checkout form
function validateCheckoutForm(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    if (!name || !email || !address || !paymentMethod) {
        alert('Please fill out all fields.');
        return false;
    }

    if (paymentMethod === 'card' && (!cardNumber || !expiryDate || !cvv)) {
        alert('Please fill out all card payment details.');
        return false;
    }

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return false;
    }

    // Create order object
    const order = {
        name,
        email,
        address,
        paymentMethod,
        items: cart,
        total: calculateTotal(),
        date: new Date().toLocaleString(),
    };

    // Save order to localStorage
    saveOrder(order);

    // Redirect to confirmation page
    window.location.href = 'confirmation.html';
    return false;
}

// Function to calculate the total price
function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
}

// Function to save the order to localStorage
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Function to display order details on the confirmation page
function displayOrderConfirmation() {
    const orderDetails = document.getElementById('order-details');
    const confirmationTotal = document.getElementById('confirmation-total');

    if (!orderDetails || !confirmationTotal) return; // Exit if elements don't exist

    orderDetails.innerHTML = ''; // Clear existing content
    let total = 0;

    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        orderDetails.innerHTML += `
            <li class="list-group-item">
                ${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}
            </li>
        `;
    });

    confirmationTotal.textContent = total.toFixed(2); // Update total price

    // Clear the cart after displaying the confirmation
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount(); // Update the cart count
}

// Function to validate the contact form
function validateContactForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return false;
    }

    alert('Thank you for contacting us! We will get back to you soon.');
    return false; // Prevent form submission
}

// Update the cart count when the page loads
updateCartCount();

// Display cart items when the cart page loads
if (window.location.pathname.includes('cart.html')) {
    displayCart();
}

// Display order summary when the checkout page loads
if (window.location.pathname.includes('checkout.html')) {
    displayOrderSummary();

    // Show/hide card payment fields based on selected payment method
    const paymentMethod = document.getElementById('payment-method');
    const cardPaymentFields = document.getElementById('card-payment-fields');

    if (paymentMethod && cardPaymentFields) {
        paymentMethod.addEventListener('change', () => {
            if (paymentMethod.value === 'card') {
                cardPaymentFields.style.display = 'block';
            } else {
                cardPaymentFields.style.display = 'none';
            }
        });

        // Initially hide card payment fields
        cardPaymentFields.style.display = 'none';
    }
}

// Display order confirmation when the confirmation page loads
if (window.location.pathname.includes('confirmation.html')) {
    displayOrderConfirmation();
}

// Admin Credentials
const ADMIN_EMAIL = "ove555@gmail.com";
const ADMIN_PASSWORD = "ove55555";

// Function to handle login
function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Save login status in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        // Redirect to admin dashboard
        window.location.href = 'admin.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

// Function to handle logout
function logout() {
    // Remove login status from localStorage
    localStorage.removeItem('isLoggedIn');
    // Redirect to login page
    window.location.href = 'login.html';
}

// Check if the user is logged in
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true' && window.location.pathname.includes('admin.html')) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
    }
}

// Attach login form submission handler
if (window.location.pathname.includes('login.html')) {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Check login status when the page loads
checkLogin();