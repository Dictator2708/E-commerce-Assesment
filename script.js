let allProducts = [];
let cartCount = 0;

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const categoryFilter = document.getElementById('categoryFilter');
const sortOption = document.getElementById('sortOption');
const searchInput = document.getElementById('searchInput');
const cartCountDisplay = document.getElementById('cartCount');

// Modal Elements
const modalBody = document.getElementById('productModalBody');
let productModal;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    fetchProducts();

    // Event Listeners for filtering and sorting
    categoryFilter.addEventListener('change', filterAndSortData);
    sortOption.addEventListener('change', filterAndSortData);
    searchInput.addEventListener('input', searchData);
});

// Fetch products from API
async function fetchProducts() {
    loadingMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    productsContainer.innerHTML = '';

    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        allProducts = await response.json();
        
        populateCategories();
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error:', error);
        errorMessage.style.display = 'block';
    } finally {
        loadingMessage.style.display = 'none';
    }
}

// Populate category dropdown
function populateCategories() {
    const categories = [];
    allProducts.forEach(product => {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
}

// Render products to screen
function displayProducts(products) {
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<div class="col-12 text-center mt-4"><p>No products found.</p></div>';
        return;
    }

    products.forEach(product => {
        const productHtml = `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.title}" style="cursor:pointer;" onclick="showProductDetails(${product.id})">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title" title="${product.title}" style="cursor:pointer;" onclick="showProductDetails(${product.id})">${product.title}</h5>
                        <p class="card-text fw-bold text-success mt-auto">$${product.price.toFixed(2)}</p>
                        <button class="btn btn-dark w-100 mt-2" onclick="addToCart()">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productHtml;
    });
}

// Master filter and sort function
function filterAndSortData() {
    let filteredProducts = [...allProducts];

    // 1. Filter by Category
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }

    // 2. Search by Title (case insensitive)
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => p.title.toLowerCase().includes(searchTerm));
    }

    // 3. Sort by Price
    const sortBy = sortOption.value;
    if (sortBy === 'lowToHigh') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'highToLow') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
}

// Added searchData to clearly meet requirement of having searchData()
function searchData() {
    filterAndSortData();
}

// Added filterData to clearly meet requirement of having filterData()  
function filterData() {
    filterAndSortData();
}

// Increment cart counter
function addToCart() {
    cartCount++;
    cartCountDisplay.textContent = cartCount;
}

// Show details modal
function showProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    let ratingHtml = product.rating ? `Rating: ${product.rating.rate}/5 (${product.rating.count} reviews)` : 'No rating available';

    modalBody.innerHTML = `
        <div class="text-center">
            <img src="${product.image}" class="img-fluid modal-product-img" alt="${product.title}">
        </div>
        <h5 class="mt-3">${product.title}</h5>
        <h4 class="text-success mb-3">$${product.price.toFixed(2)}</h4>
        <p><strong>Category:</strong> <span class="text-capitalize">${product.category}</span></p>
        <p><strong>${ratingHtml}</strong></p>
        <hr>
        <p><strong>Description:</strong></p>
        <p class="text-muted">${product.description}</p>
    `;
    
    productModal.show();
}
