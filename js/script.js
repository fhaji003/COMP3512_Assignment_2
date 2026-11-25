import config from '../data-minifed.json' with { type: 'json' };

// Get the first 20 products
const first20 = config.products.slice(0, 20);

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
displayProducts(first20);

// Handle click events on the list
list.addEventListener("click", (event) => {
    const id = event.target.parentElement.dataset.id;

    if (event.target.nodeName === "IMG") {
        alert("Product ID: " + id);
    } else if (event.target.nodeName === "BUTTON") {
        const product = first20.find(p => p.id == id);

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
    selectedView.classList.remove("hidden");
}

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

