document.addEventListener('DOMContentLoaded', displayProducts);

function displayProducts() {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            let productList = document.getElementById('productList');
            productList.innerHTML = '';

            products.forEach(product => {
                let productItem = `
                    <div class="product-item">
                        <h3>${product.name}</h3>
                        <img src="${product.image}" alt="Product Image">
                        <p>${product.description}</p>
                    </div>`;
                productList.innerHTML += productItem;
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Function to calculate average rating
function calculateAverageRating(productReviews) {
    if (productReviews.length === 0) return 0;
    let sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / productReviews.length).toFixed(1);
}

// Function to get star representation of rating
function getStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += i < rating ? '★' : '☆';
    }
    return stars;
}

// Function to save a new review
function saveReview(productIndex) {
    let rating = document.getElementById('reviewRating').value;
    let reviewText = document.getElementById('reviewText').value;

    // Validation to prevent empty reviews
    if (!rating || reviewText.trim() === '') {
        alert('Please provide a valid rating and review text.');
        return;
    }

    let products = JSON.parse(localStorage.getItem('products')) || [];
    let product = products[productIndex];
    if (!product) return;

    // Push the new review to the product's reviews array
    product.reviews.push({ rating: parseInt(rating), text: reviewText });
    localStorage.setItem('products', JSON.stringify(products));
    displayProductDetails(productIndex); // Refresh the product details with the new review

    // Clear the form after saving the review
    document.getElementById('reviewForm').reset();
}

// Function to edit review
function editReview(productIndex, reviewIndex) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let product = products[productIndex];
    if (!product) return;

    // Populate form with existing review details for editing
    let review = product.reviews[reviewIndex];
    document.getElementById('reviewRating').value = review.rating;
    document.getElementById('reviewText').value = review.text;

    // Change the form submit button to update the review
    document.getElementById('reviewForm').removeEventListener('submit', saveReview);
    document.getElementById('reviewForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateReview(productIndex, reviewIndex);
    });
}

// Function to update review
function updateReview(productIndex, reviewIndex) {
    let rating = document.getElementById('reviewRating').value;
    let reviewText = document.getElementById('reviewText').value;

    let products = JSON.parse(localStorage.getItem('products')) || [];
    let product = products[productIndex];
    if (!product) return;

    // Update the existing review
    let review = product.reviews[reviewIndex];
    review.rating = parseInt(rating);
    review.text = reviewText;
    localStorage.setItem('products', JSON.stringify(products));
    displayProductDetails(productIndex); // Refresh the product details with updated review

    // Clear the form and restore original submit event
    document.getElementById('reviewForm').reset();
    document.getElementById('reviewForm').removeEventListener('submit', updateReview);
    document.getElementById('reviewForm').addEventListener('submit', function(event) {
        event.preventDefault();
        saveReview(productIndex);
    });
}

// Function to delete review
function deleteReview(productIndex, reviewIndex) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let product = products[productIndex];
    if (!product) return;

    // Remove the review
    product.reviews.splice(reviewIndex, 1);
    localStorage.setItem('products', JSON.stringify(products));
    displayProductDetails(productIndex); // Refresh the product details without the deleted review
}

// Display product list on initial page load
document.addEventListener('DOMContentLoaded', displayProducts);
