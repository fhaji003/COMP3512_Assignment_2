
// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// Load products from localStorage
function loadProducts() {
    return JSON.parse(localStorage.getItem("products"));
}

// Start the app and display the products 
function startApp() {
    displayProducts(products);
}


// Find the container
const list = document.querySelector("#products");

// Builds a card element for a product and returns it
function createProductCard(product) {
    const productCard = document.createElement("article");
    
    const image = document.createElement("img");
    image.src = product.thumbnail;
    image.alt = product.title;

    const title = document.createElement("h2");
    title.textContent = product.title;

    const price = document.createElement("p");
    price.textContent = "$" + product.price;

    const button = document.createElement("button");
    button.textContent = "Add to cart";

    productCard.dataset.id = product.id;

    productCard.appendChild(image);
    productCard.appendChild(title);
    productCard.appendChild(price);
    productCard.appendChild(button);

    return productCard;
}

// Create a product card for each product and append it to the list
function displayProducts(products) {
    for (let product of products) {
        const card = createProductCard(product);
        list.appendChild(card);
    }
}

// Handle click events on the list
list.addEventListener("click", function(event) {
    const id = event.target.parentElement.dataset.id;

    let product = products.find(p => p.id ==id);

    if (event.target.nodeName === "IMG" || event.target.nodeName === "H2") {
        displayProduct(product);
        showView("product-view");

    } else if (event.target.nodeName === "BUTTON") {
        alert("Product ID: " + id + " - " + product.title);
    }
});


// Show the slected view and hide the other views
function showView(viewId) {
    let views = document.querySelectorAll("main > section");
    for (let view of views) {
        view.classList.add("hidden")
    }
    let selectedView = document.querySelector("#" + viewId);
    selectedView.classList.remove("hidden")
}
showView("home-view");

// Make the header buttons switch between views
let header = document.querySelector("header");
//switches views when a header button is clicked
header.addEventListener("click", function(e) {
    let button = e.target;

    if(button.tagName === "SPAN") {
        button = button.parentElement;
    }
    let viewId = button.dataset.view;
    if(viewId) {
        showView(viewId);
    }
});



// Select the About dialog
let dialog = document.querySelector("#about-dialog");

// Open the dialog when About is clicked
let aboutBtn = document.querySelector("#about-btn");
aboutBtn.addEventListener("click", function() {
    dialog.showModal();
});

// function to close the dialog
function closeAbout() {
    dialog.close();
}

// Close the dialog with the close button
let closeBtn = document.querySelector("#close-btn");
closeBtn.addEventListener("click", closeAbout);

// Close the dialog with X button
let closeX = document.querySelector("#close-x");
closeX.addEventListener("click", closeAbout);

// Check if products are already saved
let products = loadProducts();

if (products) {
    console.log("from storage", products.length);
    startApp();

} else {
// fetch the data
let url = "https://dummyjson.com/products?limit=100"

fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data.products.length);
        saveProducts(data.products);
        products = data.products;
        startApp();
    })
    .catch(function(error) {
        console.log(error);
    });
}

// Display the selected product 
function displayProduct(product) {
    let image = document.querySelector("#product-image");
    let title = document.querySelector("#product-title");
    let price = document.querySelector("#product-price");
    let sku = document.querySelector("#product-sku");
    let stock = document.querySelector("#product-stock");
    let rating = document.querySelector("#product-rating");
    let description = document.querySelector("#product-description");

    title.textContent = product.title;
    price.textContent = "$" + product.price;
    sku.textContent = "SKU: " + product.sku;
    stock.textContent = product.availabilityStatus;
    rating.textContent = prodRating(product.rating);
    description.textContent = product.description;

    image.src = product.images[0];
    image.alt = product.title;
}



// Convert a product rating into stars
function prodRating(rating) {
    let roundedRating = Math.round(rating);
    let star = "";

    for (let i =1; i <= 5; i++) {
        if (i <= roundedRating) {
            star += "★";
        } else {
            star += "☆";
        }
    }
    return star;
}
