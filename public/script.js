// Global state
let currentPage = 'home';
let filteredProperties = [...properties];
let selectedProperty = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('home');
    updateActiveNavLinks();
});

// Navigation
function navigateTo(page) {
    currentPage = page;
    updateActiveNavLinks();
    
    // Filter properties based on page
    if (page === 'buy') {
        filteredProperties = properties.filter(p => p.forSale);
    } else if (page === 'rent') {
        filteredProperties = properties.filter(p => !p.forSale);
    } else {
        filteredProperties = [...properties];
    }
    
    renderPage();
}

function updateActiveNavLinks() {
    document.querySelectorAll('.nav-link').forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Page rendering
function renderPage() {
    const mainContent = document.getElementById('main-content');
    
    switch (currentPage) {
        case 'home':
            mainContent.innerHTML = renderHomePage();
            break;
        case 'buy':
            mainContent.innerHTML = renderPropertyListPage('Properties for Sale');
            initializeFilters();
            break;
        case 'rent':
            mainContent.innerHTML = renderPropertyListPage('Properties for Rent');
            initializeFilters();
            break;
        case 'sell':
            mainContent.innerHTML = renderSellPage();
            initializeSellForm();
            break;
        case 'detail':
            if (selectedProperty) {
                mainContent.innerHTML = renderDetailPage(selectedProperty);
                initializeDetailPage();
            }
            break;
        default:
            mainContent.innerHTML = renderHomePage();
    }
    
    window.scrollTo(0, 0);
}

// Home page
function renderHomePage() {
    const featuredProperties = properties.filter(p => p.featured).slice(0, 6);
    
    return `
        <!-- Hero Section -->
        <div class="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <div class="container mx-auto px-4 py-20">
                <div class="max-w-3xl mx-auto text-center">
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Find Your Dream Property
                    </h1>
                    <p class="text-lg md:text-xl mb-10 text-blue-100">
                        Discover the perfect home, land, or investment opportunity from thousands of listings
                    </p>

                    <!-- Search Bar -->
                    <div class="bg-white rounded-lg shadow-xl p-4 md:p-6">
                        <div class="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                id="hero-search"
                                placeholder="Search by location, property name..."
                                class="flex-1 px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select id="hero-type" class="w-full md:w-48 px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="all">All Types</option>
                                <option value="house">Houses</option>
                                <option value="land">Land</option>
                                <option value="building">Buildings</option>
                                <option value="rental">Rentals</option>
                            </select>
                            <button onclick="handleHeroSearch()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <i class="fas fa-search"></i>
                                Search
                            </button>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="grid grid-cols-3 gap-8 mt-16 text-center">
                        <div>
                            <div class="text-3xl md:text-4xl font-bold mb-2">500+</div>
                            <div class="text-sm md:text-base text-blue-100">Properties</div>
                        </div>
                        <div>
                            <div class="text-3xl md:text-4xl font-bold mb-2">1000+</div>
                            <div class="text-sm md:text-base text-blue-100">Happy Clients</div>
                        </div>
                        <div>
                            <div class="text-3xl md:text-4xl font-bold mb-2">50+</div>
                            <div class="text-sm md:text-base text-blue-100">Cities</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Featured Properties -->
        <div class="container mx-auto px-4 py-12">
            <h2 class="text-3xl font-bold mb-2">Featured Properties</h2>
            <p class="text-gray-600 mb-8">Handpicked properties just for you</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${featuredProperties.map(property => renderPropertyCard(property)).join('')}
            </div>
        </div>
    `;
}

// Property list page
function renderPropertyListPage(title) {
    return `
        <div class="container mx-auto px-4 py-8">
            <!-- Header -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 class="text-3xl font-bold mb-2">${title}</h2>
                    <p class="text-gray-600">Showing ${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'}</p>
                </div>
                <button onclick="toggleFilters()" class="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <i class="fas fa-filter"></i>
                    Filters
                </button>
            </div>

            <!-- Filter Panel -->
            <div id="filter-panel" class="hidden bg-white border rounded-lg p-6 mb-8 filter-panel">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label class="block text-sm font-medium mb-2">Sort By</label>
                        <select id="sort-by" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="newest">Newest First</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Property Type</label>
                        <select id="filter-type" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="all">All Types</option>
                            <option value="house">Houses</option>
                            <option value="land">Land</option>
                            <option value="building">Buildings</option>
                            <option value="rental">Rentals</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Bedrooms</label>
                        <select id="filter-bedrooms" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="all">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Max Price: $<span id="price-value">5000000</span></label>
                        <input type="range" id="filter-price" min="0" max="5000000" step="50000" value="5000000" class="w-full">
                    </div>
                </div>
                <div class="flex gap-2 mt-6">
                    <button onclick="applyFilters()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Apply Filters
                    </button>
                    <button onclick="resetFilters()" class="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        Reset
                    </button>
                </div>
            </div>

            <!-- Property Grid -->
            <div id="property-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${filteredProperties.length > 0 
                    ? filteredProperties.map(property => renderPropertyCard(property)).join('')
                    : '<div class="col-span-full text-center py-12"><p class="text-gray-600 text-lg">No properties found matching your criteria.</p></div>'
                }
            </div>
        </div>
    `;
}

// Property card component
function renderPropertyCard(property) {
    const formatPrice = (price, forSale) => {
        return forSale ? `$${price.toLocaleString()}` : `$${price.toLocaleString()}/mo`;
    };
    
    const typeLabel = property.type.charAt(0).toUpperCase() + property.type.slice(1);
    
    return `
        <div class="property-card bg-white rounded-lg overflow-hidden border shadow-sm" onclick="viewPropertyDetail('${property.id}')">
            <div class="relative aspect-[4/3] overflow-hidden image-container">
                <img src="${property.image}" alt="${property.title}" class="w-full h-full object-cover">
                <div class="absolute top-3 left-3 flex gap-2">
                    <span class="badge badge-blue">${typeLabel}</span>
                    ${property.featured ? '<span class="badge badge-yellow">Featured</span>' : ''}
                </div>
                <div class="absolute top-3 right-3">
                    <span class="badge badge-green">${property.forSale ? 'For Sale' : 'For Rent'}</span>
                </div>
            </div>
            <div class="p-4">
                <div class="mb-2">
                    <h3 class="text-lg font-semibold mb-1">${property.title}</h3>
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${property.location}</span>
                    </div>
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div class="flex items-center gap-1">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${property.area.toLocaleString()} sq ft</span>
                    </div>
                    ${property.bedrooms ? `
                        <div class="flex items-center gap-1">
                            <i class="fas fa-bed"></i>
                            <span>${property.bedrooms} beds</span>
                        </div>
                    ` : ''}
                    ${property.bathrooms ? `
                        <div class="flex items-center gap-1">
                            <i class="fas fa-bath"></i>
                            <span>${property.bathrooms} baths</span>
                        </div>
                    ` : ''}
                </div>
                <div class="text-2xl font-bold text-blue-600">
                    ${formatPrice(property.price, property.forSale)}
                </div>
            </div>
        </div>
    `;
}

// Property detail page
function renderDetailPage(property) {
    const formatPrice = (price, forSale) => {
        return forSale ? `$${price.toLocaleString()}` : `$${price.toLocaleString()}/mo`;
    };
    
    const typeLabel = property.type.charAt(0).toUpperCase() + property.type.slice(1);
    
    return `
        <div class="container mx-auto px-4 py-8">
            <button onclick="navigateTo('buy')" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <i class="fas fa-arrow-left"></i>
                Back to Listings
            </button>

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Main Content -->
                <div class="lg:col-span-2">
                    <!-- Image -->
                    <div class="relative aspect-[16/10] rounded-lg overflow-hidden mb-6">
                        <img src="${property.image}" alt="${property.title}" class="w-full h-full object-cover">
                        <div class="absolute top-4 left-4 flex gap-2">
                            <span class="badge badge-blue text-base px-3 py-1">${typeLabel}</span>
                            ${property.featured ? '<span class="badge badge-yellow text-base px-3 py-1">Featured</span>' : ''}
                        </div>
                    </div>

                    <!-- Title and Location -->
                    <div class="mb-6">
                        <div class="flex items-start justify-between mb-2">
                            <h1 class="text-3xl font-bold">${property.title}</h1>
                            <span class="badge badge-green text-base px-3 py-1">${property.forSale ? 'For Sale' : 'For Rent'}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                            <i class="fas fa-map-marker-alt text-lg"></i>
                            <span class="text-lg">${property.location}</span>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div class="bg-white border rounded-lg p-4 flex items-center gap-3">
                            <i class="fas fa-ruler-combined text-2xl text-blue-600"></i>
                            <div>
                                <div class="text-sm text-gray-600">Area</div>
                                <div class="font-semibold">${property.area.toLocaleString()} sq ft</div>
                            </div>
                        </div>
                        ${property.bedrooms ? `
                            <div class="bg-white border rounded-lg p-4 flex items-center gap-3">
                                <i class="fas fa-bed text-2xl text-blue-600"></i>
                                <div>
                                    <div class="text-sm text-gray-600">Bedrooms</div>
                                    <div class="font-semibold">${property.bedrooms}</div>
                                </div>
                            </div>
                        ` : ''}
                        ${property.bathrooms ? `
                            <div class="bg-white border rounded-lg p-4 flex items-center gap-3">
                                <i class="fas fa-bath text-2xl text-blue-600"></i>
                                <div>
                                    <div class="text-sm text-gray-600">Bathrooms</div>
                                    <div class="font-semibold">${property.bathrooms}</div>
                                </div>
                            </div>
                        ` : ''}
                        ${property.yearBuilt ? `
                            <div class="bg-white border rounded-lg p-4 flex items-center gap-3">
                                <i class="fas fa-calendar text-2xl text-blue-600"></i>
                                <div>
                                    <div class="text-sm text-gray-600">Year Built</div>
                                    <div class="font-semibold">${property.yearBuilt}</div>
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Description -->
                    <div class="mb-8">
                        <h2 class="text-2xl font-bold mb-4">Description</h2>
                        <p class="text-gray-700 leading-relaxed">${property.description}</p>
                    </div>

                    <!-- Amenities -->
                    <div class="mb-8">
                        <h2 class="text-2xl font-bold mb-4">Amenities</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            ${property.amenities.map(amenity => `
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-check-circle text-green-600"></i>
                                    <span>${amenity}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-white border rounded-lg p-6 sticky top-20">
                        <div class="text-3xl font-bold text-blue-600 mb-6">
                            ${formatPrice(property.price, property.forSale)}
                        </div>

                        <div id="contact-form-container">
                            <div class="space-y-3">
                                <button onclick="showContactForm()" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                    Contact Agent
                                </button>
                                <button class="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    Schedule Tour
                                </button>
                                <button class="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    Save Property
                                </button>
                            </div>
                        </div>

                        <div class="mt-6 pt-6 border-t">
                            <h3 class="font-semibold mb-3">Property Details</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Property ID:</span>
                                    <span>#${property.id}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Type:</span>
                                    <span>${typeLabel}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Status:</span>
                                    <span class="capitalize">${property.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Sell page
function renderSellPage() {
    return `
        <div class="container mx-auto px-4 py-8">
            <div class="max-w-3xl mx-auto">
                <div class="bg-white border rounded-lg p-6 mb-6">
                    <h2 class="text-3xl font-bold mb-2">List Your Property</h2>
                    <p class="text-gray-600 mb-6">Fill in the details below to list your property</p>

                    <form id="sell-property-form" class="space-y-6">
                        <!-- Basic Information -->
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Basic Information</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium mb-2">Property Title *</label>
                                    <input type="text" name="title" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Modern Family Home">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Property Type *</label>
                                    <select name="type" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select type</option>
                                        <option value="house">House</option>
                                        <option value="land">Land</option>
                                        <option value="building">Building</option>
                                        <option value="rental">Rental</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Listing Type *</label>
                                    <select name="forSale" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="sale">For Sale</option>
                                        <option value="rent">For Rent</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Price *</label>
                                    <input type="number" name="price" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 450000">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Location *</label>
                                    <input type="text" name="location" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="City, State">
                                </div>
                            </div>
                        </div>

                        <!-- Property Details -->
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Property Details</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium mb-2">Area (sq ft) *</label>
                                    <input type="number" name="area" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 2500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Year Built</label>
                                    <input type="number" name="yearBuilt" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 2020" min="1800" max="2026">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Bedrooms</label>
                                    <input type="number" name="bedrooms" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 4" min="0">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Bathrooms</label>
                                    <input type="number" name="bathrooms" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 3" min="0">
                                </div>
                            </div>
                        </div>

                        <!-- Description -->
                        <div>
                            <label class="block text-sm font-medium mb-2">Description *</label>
                            <textarea name="description" required rows="5" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe your property..."></textarea>
                        </div>

                        <!-- Amenities -->
                        <div>
                            <label class="block text-sm font-medium mb-2">Amenities (comma-separated)</label>
                            <input type="text" name="amenities" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Garage, Garden, Modern Kitchen">
                        </div>

                        <!-- Images -->
                        <div>
                            <label class="block text-sm font-medium mb-2">Property Images</label>
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                <i class="fas fa-upload text-4xl text-gray-400 mb-4"></i>
                                <p class="text-gray-600 mb-2">Click to upload or drag and drop</p>
                                <p class="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
                            Submit Property Listing
                        </button>
                    </form>
                </div>

                <!-- Info Card -->
                <div class="bg-white border rounded-lg p-6">
                    <h3 class="font-semibold mb-2">What happens next?</h3>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li>• Our team will review your listing within 24 hours</li>
                        <li>• You'll receive a confirmation email once approved</li>
                        <li>• Your property will be visible to thousands of potential buyers</li>
                        <li>• You can manage your listing anytime from your dashboard</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// Event handlers
function handleHeroSearch() {
    const searchTerm = document.getElementById('hero-search').value;
    const propertyType = document.getElementById('hero-type').value;
    
    let filtered = properties;
    
    if (propertyType !== 'all') {
        filtered = filtered.filter(p => p.type === propertyType);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(term) ||
            p.location.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term)
        );
    }
    
    filteredProperties = filtered;
    navigateTo('buy');
}

function viewPropertyDetail(propertyId) {
    selectedProperty = properties.find(p => p.id === propertyId);
    currentPage = 'detail';
    renderPage();
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-menu-icon');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        menu.classList.add('hidden');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Auth dialog
function openAuthDialog() {
    document.getElementById('auth-dialog').classList.remove('hidden');
}

function closeAuthDialog() {
    document.getElementById('auth-dialog').classList.add('hidden');
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    showToast('Login successful! Welcome back.', 'success');
    closeAuthDialog();
}

function handleRegister(event) {
    event.preventDefault();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    
    if (password !== confirm) {
        showToast('Passwords do not match!', 'error');
        return;
    }
    
    showToast('Registration successful! Welcome to EstateHub.', 'success');
    closeAuthDialog();
}

// Filters
function toggleFilters() {
    const panel = document.getElementById('filter-panel');
    panel.classList.toggle('hidden');
}

function initializeFilters() {
    const priceSlider = document.getElementById('filter-price');
    if (priceSlider) {
        priceSlider.addEventListener('input', (e) => {
            document.getElementById('price-value').textContent = parseInt(e.target.value).toLocaleString();
        });
    }
}

function applyFilters() {
    const sortBy = document.getElementById('sort-by').value;
    const type = document.getElementById('filter-type').value;
    const bedrooms = document.getElementById('filter-bedrooms').value;
    const maxPrice = parseInt(document.getElementById('filter-price').value);
    
    let filtered = currentPage === 'buy' 
        ? properties.filter(p => p.forSale)
        : properties.filter(p => !p.forSale);
    
    // Apply filters
    if (type !== 'all') {
        filtered = filtered.filter(p => p.type === type);
    }
    
    if (bedrooms !== 'all') {
        const bedroomCount = parseInt(bedrooms);
        filtered = filtered.filter(p => p.bedrooms && p.bedrooms >= bedroomCount);
    }
    
    filtered = filtered.filter(p => p.price <= maxPrice);
    
    // Apply sorting
    switch (sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filtered.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0));
            break;
        case 'featured':
        default:
            filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
    }
    
    filteredProperties = filtered;
    
    // Update the property grid
    const grid = document.getElementById('property-grid');
    if (grid) {
        grid.innerHTML = filteredProperties.length > 0
            ? filteredProperties.map(property => renderPropertyCard(property)).join('')
            : '<div class="col-span-full text-center py-12"><p class="text-gray-600 text-lg">No properties found matching your criteria.</p></div>';
    }
    
    // Update count
    const header = document.querySelector('.container.mx-auto.px-4.py-8 h2 + p');
    if (header) {
        header.textContent = `Showing ${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'}`;
    }
}

function resetFilters() {
    document.getElementById('sort-by').value = 'featured';
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-bedrooms').value = 'all';
    document.getElementById('filter-price').value = '5000000';
    document.getElementById('price-value').textContent = '5000000';
    
    filteredProperties = currentPage === 'buy'
        ? properties.filter(p => p.forSale)
        : properties.filter(p => !p.forSale);
    
    applyFilters();
}

// Detail page
function initializeDetailPage() {
    // Any initialization needed for detail page
}

function showContactForm() {
    const container = document.getElementById('contact-form-container');
    container.innerHTML = `
        <h3 class="text-lg font-semibold mb-4">Contact Agent</h3>
        <form onsubmit="handleContactSubmit(event)" class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-2">Full Name</label>
                <input type="text" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe">
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Email</label>
                <input type="email" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com">
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Phone Number</label>
                <input type="tel" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+1 (555) 000-0000">
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Message</label>
                <textarea required rows="4" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tell us about your requirements...">I'm interested in ${selectedProperty.title}</textarea>
            </div>
            <div class="flex gap-2">
                <button type="submit" class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Send Message
                </button>
                <button type="button" onclick="hideContactForm()" class="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
            </div>
        </form>
    `;
}

function hideContactForm() {
    renderPage();
}

function handleContactSubmit(event) {
    event.preventDefault();
    showToast('Message sent successfully! An agent will contact you soon.', 'success');
    hideContactForm();
}

// Sell form
function initializeSellForm() {
    const form = document.getElementById('sell-property-form');
    if (form) {
        form.addEventListener('submit', handleSellFormSubmit);
    }
}

function handleSellFormSubmit(event) {
    event.preventDefault();
    showToast('Property listing submitted successfully! Our team will review it shortly.', 'success');
    event.target.reset();
}

// Toast notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600';
    
    toast.innerHTML = `
        <i class="fas ${icon} ${iconColor}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
