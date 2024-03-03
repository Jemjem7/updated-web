document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        // Assume validation and authentication logic here
        // For simplicity, let's assume successful login
        document.querySelector(".login-container").style.display = "none";
        document.querySelector(".navbar").style.display = "block";
        navigateTo("home"); // Navigate to the home page after login

        // Display products after successful login
        displayProducts();
    });
});

function navigateTo(page) {
    var pages = document.querySelectorAll(".products");
    pages.forEach(function(item) {
        item.style.display = "none";
    });
    document.getElementById(page).style.display = "block";
}

function displayProducts() {
    const mostPopProducts = document.querySelector(".most-popular-products");
    const jsonFile = "products.json";

    fetch(jsonFile)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            data.forEach((product) => {
                const { id, name, description, price, images } = product;
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');

                const productImg = document.createElement('div');
                productImg.classList.add('product-card__img');
                productImg.innerHTML = `<img src="${images[0].url}" alt="${name}" />`;

                const productDesc = document.createElement('div');
                productDesc.classList.add('product-card__description');
                productDesc.innerHTML = `
                    <h3>${name}</h3>
                    <p class="product-card__price">${price}</p>
                    <p>${description}</p>
                `;

                const addToCartButton = document.createElement('button');
                addToCartButton.classList.add('btn-add-to-cart');
                addToCartButton.textContent = 'Add to Cart';

                productDesc.appendChild(addToCartButton);

                productCard.appendChild(productImg);
                productCard.appendChild(productDesc);

                mostPopProducts.appendChild(productCard);
            });

            // Add event listeners to all "Add to Cart" buttons
            const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', addToCart);
            });
        });
}

// Function para idagdag ang produkto sa cart
function addToCartList(product) {
    // I-check kung mayroon nang existing cart o wala
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Idagdag ang produkto sa cart
    cart.push(product);

    // I-save ang bagong cart sa localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Ipakita ang listahan ng mga produkto sa cart
    displayCart();
}

// Function para ipakita ang listahan ng mga produkto sa cart
function displayCart() {
    const cartList = document.querySelector('.cart-list');
    cartList.innerHTML = ''; // I-clear ang list bago i-display ang bagong laman

    // Kumuha ng data mula sa localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Loop sa bawat item sa cart at idagdag ito sa list
    cart.forEach((product, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.name} - ${product.price}`;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn-delete');
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.index = index; // Set the index as a data attribute for identification

        listItem.appendChild(deleteButton);
        cartList.appendChild(listItem);
    });

    // Check if cart list is empty, hide cart container if empty
    const cartContainer = document.querySelector('.cart-container');
    if (cart.length === 0) {
        cartContainer.style.display = 'none';
    } else {
        cartContainer.style.display = 'block';
    }
}

// Function para i-handle ang event ng pag-click sa "Add to Cart" button
function addToCart(event) {
    // Kumuha ng impormasyon ng produkto mula sa button
    const productCard = event.target.closest('.product-card');
    const productName = productCard.querySelector('.product-card__description h3').textContent;
    const productPrice = productCard.querySelector('.product-card__price').textContent;

    // Lumikha ng object para sa produkto
    const product = {
        name: productName,
        price: productPrice
    };

    // Idagdag ang produkto sa cart
    addToCartList(product);
}

// Function para i-handle ang event sa pag-click sa "Delete" button sa cart item
function deleteCartItem(event) {
    // Kumuha sa index sa cart item nga gi-click ang "Delete" button
    const index = event.target.dataset.index;

    // Kumuha sa existing cart gikan sa localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // I-remove ang item sa cart base sa index nga gi-click
    cart.splice(index, 1);

    // I-save ang bag-ong cart sa localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Ipakita ang updated nga listahan sa cart
    displayCart();
}

// Tawgon ang displayCart function sa pagsugod sa page load
displayCart();

// I-listen ang click event sa tanang "Delete" button sa cart items
const deleteButtons = document.querySelectorAll('.btn-delete');
deleteButtons.forEach(button => {
    button.addEventListener('click', deleteCartItem);
});
