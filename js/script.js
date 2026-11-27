
// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// Load products from localStorage
function loadProducts() {
    return JSON.parse(localStorage.getItem("products"));
}

// Load the cart from localStorage
function loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}
// save the cart to localStorgae
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add a product to cart
function addToCart(product, quantity) {
    let cart = loadCart();

    let existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push ({
            id: product.id, 
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: quantity
        });
    }
    saveCart(cart);
    updateCartCount();
}

// Update the number shown on the cart
function updateCartCount() {
    let cart = loadCart();
    let total = 0;

    for (let item of cart) {
        total += item.quantity;
    }
    document.querySelector("#cart-count").textContent = total;
}

// Show a small notification message
function showToast(message) {
    let toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}

// Display all items in the cart
function displayCart() {
    let cart = loadCart();

    let cartItems = document.querySelector("#cart-items");
    let cartEmpty = document.querySelector("#cart-empty");
    let checkoutBtn = document.querySelector("#checkout-btn");
    let shippingType = document.querySelector("#shipping-type");
    let shippingDestination = document.querySelector("#shipping-destination");

    // clear the existing cart items
    while (cartItems.firstChild) {
        cartItems.removeChild(cartItems.firstChild);
    }

    // Create a row for each cart item
    for (let item of cart) {
        let row = document.createElement("div");
        row.dataset.id = item.id;

        let image = document.createElement("img");
        image.src = item.thumbnail;

        let title = document.createElement("p");
        title.textContent = item.title;

        let price = document.createElement("p");
        price.textContent = "$" + item.price;

        let quantity = document.createElement("P");
        quantity.textContent = "Qty: " + item.quantity;

        let subtotal = document.createElement("p");
        subtotal.textContent = "$" + (item.price * item.quantity).toFixed(2);

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";

        row.appendChild(image);
        row.appendChild(title);
        row.appendChild(price);
        row.appendChild(quantity);
        row.appendChild(subtotal);
        row.appendChild(removeBtn);

        cartItems.appendChild(row);
    }

    if (cart.length === 0) {
        cartEmpty.classList.remove("hidden");

        checkoutBtn.disabled = true;
        shippingType.disabled = true;
        shippingDestination.disabled = true;
    } else {
        cartEmpty.classList.add("hidden");

        checkoutBtn.disabled = false;
        shippingType.disabled = false;
        shippingDestination.disabled = false;
    }
    updateSummary();
}

// Update the order summary
function updateSummary() {
    let cart = loadCart();

    // Calculate merchandise total
    let merchandise = 0;
    for (let item of cart) {
        merchandise += item.price * item.quantity;
    }

    let shippingType = document.querySelector("#shipping-type").value;
    let shippingDestination = document.querySelector("#shipping-destination").value;

    let shipping = 0;

    if (merchandise <= 500) {
        if (shippingType === "standard"){
            if (shippingDestination === "canada") {
                shipping = 10;
            } else if (shippingDestination === "usa") {
                shipping = 15;
            } else if (shippingDestination === "international") {
                shipping = 20;
            }

        } else if (shippingType === "express") {
            if (shippingDestination === "canada") {
                shipping = 25;
            } else if (shippingDestination === "usa") {
                shipping = 25;
            } else if(shippingDestination === "international") {
                shipping = 30;
            }

        } else if(shippingType === "priority") {
            if (shippingDestination === "canada") {
                shipping = 35;
            } else if (shippingDestination === "usa") {
                shipping = 50;
            } else if(shippingDestination === "international") {
                shipping = 50;
            }
        }
    }

    let tax = 0;

    if (shippingDestination === "canada") {
        tax = merchandise * 0.05;
    }

    let total = merchandise + shipping + tax;

    let summaryMerchandise = document.querySelector("#summary-merchandise");
    summaryMerchandise.textContent = "Merchandise: $" + merchandise.toFixed(2);

    let summaryShipping = document.querySelector("#summary-shipping");
    summaryShipping.textContent = "shipping: $" + shipping.toFixed(2);

    let summaryTax = document.querySelector("#summary-tax");
    summaryTax.textContent = "Tax: $" + tax.toFixed(2);

    let summaryTotal = document.querySelector("#summary-total");
    summaryTotal.textContent = "Total: $" + total.toFixed(2);
}

// Start the app and display the products 
function startApp() {
    applyFilters();
    displayFeatured();
    createCategoryFilters();
    createRatingFilters();
    updateCartCount();
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

let currentProduct;


// Create a product card for each product and append it to the list
function displayProducts(products, container) {
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
    for (let product of products) {
        const card = createProductCard(product);
        container.appendChild(card);
    }
}

// Handle clicks on product cards
function handleProductClick(event) {
    const id = event.target.parentElement.dataset.id;
    let product = products.find(p => p.id ==id);

    if (event.target.nodeName === "IMG" || event.target.nodeName === "H2") {
        displayProduct(product);
        showView("product-view");

    } else if (event.target.nodeName === "BUTTON") {
        addToCart(product, 1);
        showToast(product.title + " added to cart");
    }
}
list.addEventListener("click", handleProductClick);

// Show top rated products on the home
function displayFeatured() {
    let featured = products.slice().sort((a, b) => b.rating - a.rating).slice(0, 4);
    displayProducts(featured, document.querySelector("#featured"));
}
document.querySelector("#featured").addEventListener("click", handleProductClick);

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
        if (viewId === "cart-view") {
            displayCart();
        }
        showView(viewId);
    }
});

// The Shop Now button goes to Browse
document.querySelector("#shop-now-btn").addEventListener("click", function() {
    showView("browse-view");
});


// Select the About dialog
let dialog = document.querySelector("#about-dialog");

// Open the dialog when About is clicked
let aboutBtn = document.querySelector("#about-btn");
aboutBtn.addEventListener("click", function() {
    dialog.showModal();
});

// Add the open product to cart with the quantity that was chosen
let addToCartBtn = document.querySelector("#add-to-cart-btn");

addToCartBtn.addEventListener("click", function () {
    let quantity = Number(document.querySelector("#product-quantity").value);
    addToCart(currentProduct, quantity);
    showToast(currentProduct.title + " added to cart");
    
    });

// Switch between the specifications and reviews tabs
document.querySelector("#product-tabs").addEventListener("click", function(e) {
    if (e.target.nodeName === "BUTTON") {
        document.querySelector("#specs-panel").classList.add("hidden");
        document.querySelector("#reviews-panel").classList.add("hidden");

        document.querySelector("#" + e.target.dataset.tab).classList.remove("hidden");
    }
});

     // Remove an item from the cart
    let cartItems = document.querySelector("#cart-items");
    cartItems.addEventListener("click", function(e) {
        if (e.target.nodeName === "BUTTON") {
            let id = e.target.parentElement.dataset.id;
            let cart = loadCart();

            cart = cart.filter(item => item.id !=id);

            saveCart(cart);
            displayCart();
            updateCartCount();
        }
});

// Recalculate the summary when shipping options change
document.querySelector("#shipping-type").addEventListener("change", updateSummary);
document.querySelector("#shipping-destination").addEventListener("change", updateSummary);

// Handle checkout
let checkoutBtn = document.querySelector("#checkout-btn");

checkoutBtn.addEventListener("click", function () {
    showToast("Thank you for your order");

    saveCart([]);

    updateCartCount();
    showView("home-view");
});

// re-filter products when any filter changes
document.querySelector("#filters").addEventListener("input", applyFilters);

//re sort products when the sort option changes
document.querySelector("#sort-select").addEventListener("change", applyFilters);

// Clear all filter
document.querySelector("#clear-filters").addEventListener("click", function() {
    document.querySelector("#filter-name").value = "";
    document.querySelector("#filter-price-min").value ="";
    document.querySelector("#filter-price-max").value="";

    let checkboxes = document.querySelectorAll("#filters input[type=checkbox]");

    for (let checkbox of checkboxes) {
        checkbox.checked = false;
    }
    applyFilters();
});

// Remove an active filter
document.querySelector("#active-filters").addEventListener("click", function(e) {
    if (e.target.nodeName === "BUTTON") {
        let type = e.target.dataset.type;
        let value = e.target.dataset.value;

        let checkboxes = document.querySelectorAll("#filter-" + type + " input");

        for (let checkbox of checkboxes) {
            if (checkbox.value == value) {
                checkbox.checked = false;
            }
        }
        applyFilters();
    }
});

// Open and close the filter sections
document.querySelector("#filters").addEventListener("click", function(e) {
    if (e.target.nodeName === "H3") {
        let sectionId = e.target.dataset.section;

        document.querySelector("#" + sectionId).classList.toggle("hidden");
    }
})

// Show the active filters
function showActiveFilters(selectedCategories, selectedRatings) {
    let activeFilters = document.querySelector("#active-filters");

    while (activeFilters.firstChild) {
        activeFilters.removeChild(activeFilters.firstChild);
    }

    for (let category of selectedCategories) {
        let button = document.createElement("button");
        button.textContent = category + " x";
        button.dataset.type = "category";
        button.dataset.value = category;

        activeFilters.appendChild(button);
    }

    for (let rating of selectedRatings) {
        let button = document.createElement("button");
        button.textContent = prodRating(rating) + " x";
        button.dataset.type = "rating";
        button.dataset.value = rating;

        activeFilters.appendChild(button);
    }
}

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
    currentProduct = product;
    let image = document.querySelector("#product-image");
    let tags = document.querySelector("#product-tags");
    let title = document.querySelector("#product-title");
    let price = document.querySelector("#product-price");
    let sku = document.querySelector("#product-sku");
    let stock = document.querySelector("#product-stock");
    let rating = document.querySelector("#product-rating");
    let description = document.querySelector("#product-description");
    let breadcrumb = document.querySelector("#product-breadcrumb");

    let specWeight = document.querySelector("#spec-weight");
    let specDimensions = document.querySelector("#spec-dimensions");
    let specWarranty = document.querySelector("#spec-warranty");
    let specShipping = document.querySelector("#spec-shipping");
    let specReturn = document.querySelector("#spec-return");

    const reviewList = document.querySelector("#reviews-list");

    while (reviewList.firstChild) {
        reviewList.removeChild(reviewList.firstChild);
    }
    while (tags.firstChild) {
        tags.removeChild(tags.firstChild);
    }

    for (let tag of product.tags) {
        const tagPill = document.createElement("span");
        tagPill.textContent = tag;
        tagPill.classList.add("tag");
        tags.appendChild(tagPill);
    }

    title.textContent = product.title;
    price.textContent = "$" + product.price;
    sku.textContent = "SKU: " + product.sku;
    stock.textContent = product.availabilityStatus;
    rating.textContent = prodRating(product.rating);
    description.textContent = product.description;
    breadcrumb.textContent = "Home > " + product.category + " > " + product.title;

    specWeight.textContent = "Weight: " + product.weight + " kg";

    specDimensions.textContent = "Dimensions: " + product.dimensions.width + " x " 
        + product.dimensions.height + " x " 
        + product.dimensions.depth + " cm";

    specWarranty.textContent = "Warranty: " + product.warrantyInformation;
    specShipping.textContent = "Shipping: " + product.shippingInformation;
    specReturn.textContent = "Return Policy: " + product.returnPolicy;

    for (let review of product.reviews) {
        let li = document.createElement("li");

        let rating = document.createElement("p");
        rating.textContent = prodRating(review.rating);

        let comment = document.createElement("p");
        comment.textContent = review.comment;

        let nameDate = document.createElement("p");
        nameDate.textContent = review.reviewerName + " - " + new Date(review.date).toLocaleDateString();


        li.appendChild(rating);
        li.appendChild(comment);
        li.appendChild(nameDate);

        reviewList.appendChild(li);
    }

    image.src = product.images[0];
    image.alt = product.title;

}

// Apply filter to the products
function applyFilters() {
    let results = products.slice();
    let nameText = document.querySelector("#filter-name").value.toLowerCase();

    if (nameText !== "") {
        results = results.filter(p => p.title.toLowerCase().includes(nameText));
    }

    // Get selected categories
    let selectedCategories = [];
    let categoryCheckboxes = document.querySelectorAll("#filter-category input");

    for (let checkbox of categoryCheckboxes) {
        if (checkbox.checked === true) {
            selectedCategories.push(checkbox.value);
        }
    }

    if (selectedCategories.length > 0) {
        results = results.filter(p => selectedCategories.includes(p.category));
    }

    let selectedRatings = [];
    let ratingCheckboxes = document.querySelectorAll("#filter-rating input");
    for (let checkbox of ratingCheckboxes) {
        if(checkbox.checked === true) {
            selectedRatings.push(Number(checkbox.value));
        }
    }

    if (selectedRatings.length >0 ) {
        results = results.filter(p => selectedRatings.includes(Math.round(p.rating)));
    }

    let min = document.querySelector("#filter-price-min").value;
    let max = document.querySelector("#filter-price-max").value;

    if (min !== "") {
        results = results.filter(p => p.price >= Number(min));
    }
    if (max !== "") {
        results = results.filter(p => p.price <= Number(max));
    }

    // Sort the results
    let sortBy = document.querySelector("#sort-select").value;
    
    if (sortBy === "name") {
        results.sort((a, b) => a.title < b.title ? -1 : 1);
    } else if (sortBy === "price") {
        results.sort((a, b) => a.price - b.price);
    } else if (sortBy === "category") {
        results.sort((a, b) => a.category < b.category ? -1 : 1);
    }

    displayProducts(results, list);

    showActiveFilters(selectedCategories, selectedRatings);

    let noResults = document.querySelector("#no-results");

    if (results.length === 0) {
        noResults.classList.remove("hidden");
    } else {
        noResults.classList.add("hidden");
    }
}

// Create category checkboxes from product data
function createCategoryFilters() {
    let categories = new Set();

    for (let product of products) {
        categories.add(product.category);
    }

    let filterCategory = document.querySelector("#filter-category");

    for (let category of categories) {
        let label = document.createElement("label");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = category;

        label.appendChild(checkbox);

        label.appendChild(document.createTextNode(" " + category));
        filterCategory.appendChild(label);

    }
}

// Create rating filter checkboxes
function createRatingFilters() {
    const ratingFilter = document.querySelector("#filter-rating");

    for (let i=1; i<=5; i++) {
        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = i;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(prodRating(i)));

        ratingFilter.appendChild(label);
    }
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


