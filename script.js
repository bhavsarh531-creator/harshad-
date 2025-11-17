// Sample data (in a real app, this would come from the backend)
const USD_TO_INR = 83;

let products = [
    { id: 1, name: 'Premium Coffee Beans', category: 'Beverages', price: 1078.17, quantity: 5, supplier: 'Global Foods Ltd.', lowStockThreshold: 10, description: 'High-quality arabica coffee beans' },
    { id: 2, name: 'Organic Olive Oil', category: 'Cooking', price: 1535.50, quantity: 24, supplier: 'Mediterranean Imports', lowStockThreshold: 10, description: 'Extra virgin organic olive oil' },
    { id: 3, name: 'Handmade Soap', category: 'Personal Care', price: 497.17, quantity: 3, supplier: 'Natural Products Co.', lowStockThreshold: 10, description: 'Natural handmade lavender soap' },
    { id: 4, name: 'Wireless Earbuds', category: 'Electronics', price: 4149.17, quantity: 0, supplier: 'TechGadgets Inc.', lowStockThreshold: 10, description: 'Bluetooth 5.0 wireless earbuds' },
    { id: 5, name: 'Stainless Steel Water Bottle', category: 'Accessories', price: 2074.17, quantity: 15, supplier: 'EcoLiving Supplies', lowStockThreshold: 10, description: 'Insulated stainless steel bottle' }
];

let activities = [
    { id: 1, date: '2023-07-15 14:30', activity: 'Stock updated', product: 'Premium Coffee Beans', user: 'John Doe' },
    { id: 2, date: '2023-07-15 11:15', activity: 'New product added', product: 'Organic Honey', user: 'Jane Smith' },
    { id: 3, date: '2023-07-14 16:45', activity: 'Low stock alert', product: 'Handmade Soap', user: 'System' },
    { id: 4, date: '2023-07-14 09:20', activity: 'Sale recorded', product: 'Wireless Earbuds', user: 'John Doe' },
    { id: 5, date: '2023-07-13 17:10', activity: 'Supplier updated', product: 'Stainless Steel Water Bottle', user: 'Jane Smith' }
];

// DOM Elements
const mainContentArea = document.getElementById('main-content-area');
const addProductBtn = document.getElementById('addProductBtn');
const addProductModal = document.getElementById('addProductModal');
const closeBtn = document.querySelector('.close-btn');
const cancelBtn = document.getElementById('cancelBtn');
const productForm = document.getElementById('productForm');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadPage('dashboard');
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('nav a, .sidebar-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            loadPage(page);
            
            // Update active states
            document.querySelectorAll('nav a, .sidebar-menu a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Modal functionality
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            addProductModal.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addProductModal) {
            closeModal();
        }
    });

    // Form submission
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
}

// Close modal function
function closeModal() {
    if (addProductModal) {
        addProductModal.style.display = 'none';
        productForm.reset();
    }
}

// Handle product form submission
function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        id: products.length + 1,
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value) * USD_TO_INR,
        quantity: parseInt(document.getElementById('productQuantity').value),
        supplier: document.getElementById('productSupplier').value,
        lowStockThreshold: parseInt(document.getElementById('lowStockThreshold').value),
        description: document.getElementById('productDescription').value
    };
    
    // Add product to the array (in a real app, this would be an API call)
    products.push(productData);
    
    // Add activity
    activities.unshift({
        id: activities.length + 1,
        date: new Date().toLocaleString(),
        activity: 'New product added',
        product: productData.name,
        user: 'Current User'
    });
    
    alert('Product added successfully!');
    closeModal();
    
    // Reload the products page if we're on it
    if (document.querySelector('nav a.active').getAttribute('data-page') === 'products') {
        loadPage('products');
    } else {
        loadPage('dashboard');
    }
}

// Load page content
function loadPage(page) {
    // Show loading
    mainContentArea.innerHTML = '<div id="loading">Loading...</div>';
    
    // Simulate API delay
    setTimeout(() => {
        let content = '';
        
        switch(page) {
            case 'dashboard':
                content = getDashboardContent();
                break;
            case 'products':
                content = getProductsContent();
                break;
            case 'suppliers':
                content = getSuppliersContent();
                break;
            case 'reports':
                content = getReportsContent();
                break;
            case 'settings':
                content = getSettingsContent();
                break;
            default:
                content = getDashboardContent();
        }
        
        mainContentArea.innerHTML = content;
        
        // Re-attach event listeners for dynamic content
        if (page === 'products') {
            document.getElementById('addProductBtn').addEventListener('click', () => {
                addProductModal.style.display = 'flex';
            });
            
            // Attach delete event listeners
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = parseInt(this.closest('tr').getAttribute('data-id'));
                    deleteProduct(productId);
                });
            });
        }
    }, 500);
}

// Get dashboard content
function getDashboardContent() {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold).length;
    const outOfStockProducts = products.filter(p => p.quantity === 0).length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    
    return `
        <div class="page-content active">
            <!-- Dashboard Cards -->
            <div class="dashboard">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Total Products</div>
                        <div class="card-icon bg-primary">
                            <i class="fas fa-box"></i>
                        </div>
                    </div>
                    <div class="card-value">₹{totalProducts}</div>
                    <div class="card-text">Active products in inventory</div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Low Stock</div>
                        <div class="card-icon bg-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                    </div>
                    <div class="card-value">₹{lowStockProducts}</div>
                    <div class="card-text">Products need restocking</div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Out of Stock</div>
                        <div class="card-icon bg-secondary">
                            <i class="fas fa-times-circle"></i>
                        </div>
                    </div>
                    <div class="card-value">₹{outOfStockProducts}</div>
                    <div class="card-text">Products unavailable</div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Total Value</div>
                        <div class="card-icon bg-success">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                    </div>
                    <div class="card-value">₹₹{totalValue.toFixed(2)}</div>
                    <div class="card-text">Current inventory value</div>
                </div>
            </div>

            <!-- Low Stock Alert -->
            ₹{lowStockProducts > 0 ? `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-circle"></i>
                <div>
                    <strong>Low Stock Alert:</strong> ₹{lowStockProducts} products are running low and need to be restocked soon.
                </div>
            </div>
            ` : ''}

            <!-- Products Section -->
            <div class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Recent Stock Activity</h2>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Activity</th>
                                <th>Product</th>
                                <th>User</th>
                            </tr>
                        </thead>
                        <tbody>
                            ₹{activities.slice(0, 5).map(activity => `
                                <tr>
                                    <td>₹{activity.date}</td>
                                    <td>₹{activity.activity}</td>
                                    <td>₹{activity.product}</td>
                                    <td>₹{activity.user}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Low Stock Products -->
            <div class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Low Stock Products</h2>
                </div>
                ₹{lowStockProducts > 0 ? `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Current Stock</th>
                                <th>Threshold</th>
                                <th>Supplier</th>
                            </tr>
                        </thead>
                        <tbody>
                            ₹{products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold).map(product => `
                                <tr>
                                    <td>₹{product.name}</td>
                                    <td class="low-stock">₹{product.quantity}</td>
                                    <td>₹{product.lowStockThreshold}</td>
                                    <td>₹{product.supplier}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : '<p>No products with low stock.</p>'}
            </div>
        </div>
    `;
}

// Get products content
function getProductsContent() {
    return `
        <div class="page-content active">
            <!-- Products Section -->
            <div class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Product Inventory</h2>
                    <button class="btn btn-primary" id="addProductBtn">
                        <i class="fas fa-plus"></i> Add Product
                    </button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Supplier</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ₹{products.map(product => {
                                let status = 'status-in-stock';
                                let statusText = 'In Stock';
                                
                                if (product.quantity === 0) {
                                    status = 'status-out-of-stock';
                                    statusText = 'Out of Stock';
                                } else if (product.quantity <= product.lowStockThreshold) {
                                    status = 'status-low-stock';
                                    statusText = 'Low Stock';
                                }
                                
                                return `
                                <tr data-id="₹{product.id}">
                                    <td>₹{product.name}</td>
                                    <td>₹{product.category}</td>
                                    <td>₹₹{product.price.toFixed(2)}</td>
                                    <td class="₹{product.quantity <= product.lowStockThreshold ? 'low-stock' : ''}">₹{product.quantity}</td>
                                    <td>₹{product.supplier}</td>
                                    <td><span class="status-badge ₹{status}">₹{statusText}</span></td>
                                    <td class="action-buttons">
                                        <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                                        <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Get suppliers content
function getSuppliersContent() {
    const suppliers = [...new Set(products.map(p => p.supplier))];
    
    return `
        <div class="page-content active">
            <div class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Suppliers</h2>
                    <button class="btn btn-primary">
                        <i class="fas fa-plus"></i> Add Supplier
                    </button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Products Supplied</th>
                                <th>Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ₹{suppliers.map(supplier => {
                                const supplierProducts = products.filter(p => p.supplier === supplier);
                                return `
                                <tr>
                                    <td>₹{supplier}</td>
                                    <td>₹{supplierProducts.length} products</td>
                                    <td>contact@₹{supplier.toLowerCase().replace(/\s+/g, '')}.com</td>
                                    <td class="action-buttons">
                                        <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                                        <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Get reports content
function getReportsContent() {
    const categoryCount = {};
    products.forEach(product => {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });
    
    return `
        <div class="page-content active">
            <div class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Inventory Reports</h2>
                    <button class="btn btn-primary">
                        <i class="fas fa-download"></i> Export Report
                    </button>
                </div>
                
                <div class="dashboard" style="margin-bottom: 30px;">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">Products by Category</div>
                        </div>
                        <div class="card-value">₹{Object.keys(categoryCount).length}</div>
                        <div class="card-text">Categories in inventory</div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">Average Price</div>
                        </div>
                        <div class="card-value">₹₹{(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}</div>
                        <div class="card-text">Average product price</div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">Total Items</div>
                        </div>
                        <div class="card-value">₹{products.reduce((sum, p) => sum + p.quantity, 0)}</div>
                        <div class="card-text">Total items in stock</div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <h3>Stock Value by Category</h3>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 15px;">
                            ₹{Object.entries(categoryCount).map(([category, count]) => `
                                <div style="margin-bottom: 10px;">
                                    <div style="display: flex; justify-content: between; margin-bottom: 5px;">
                                        <span>₹{category}</span>
                                        <span>₹{count} products</span>
                                    </div>
                                    <div style="height: 10px; background: #e9ecef; border-radius: 5px; overflow: hidden;">
                                        <div style="height: 100%; background: var(--primary); width: ₹{(count / products.length) * 100}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <h3>Stock Status Distribution</h3>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 15px;">
                            <div style="margin-bottom: 10px;">
                                <div style="display: flex; justify-content: between; margin-bottom: 5px;">
                                    <span>In Stock</span>
                                    <span>₹{products.filter(p => p.quantity > p.lowStockThreshold).length} products</span>
                                </div>
                                <div style="height: 10px; background: #e9ecef; border-radius: 5px; overflow: hidden;">
                                    <div style="height: 100%; background: var(--success); width: ₹{(products.filter(p => p.quantity > p.lowStockThreshold).length / products.length) * 100}%"></div>
                                </div>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <div style="display: flex; justify-content: between; margin-bottom: 5px;">
                                    <span>Low Stock</span>
                                    <span>₹{products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold).length} products</span>
                                </div>
                                <div style="height: 10px; background: #e9ecef; border-radius: 5px; overflow: hidden;">
                                    <div style="height: 100%; background: var(--warning); width: ₹{(products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold).length / products.length) * 100}%"></div>
                                </div>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <div style="display: flex; justify-content: between; margin-bottom: 5px;">
                                    <span>Out of Stock</span>
                                    <span>₹{products.filter(p => p.quantity === 0).length} products</span>
                                </div>
                                <div style="height: 10px; background: #e9ecef; border-radius: 5px; overflow: hidden;">
                                    <div style="height: 100%; background: var(--gray); width: ₹{(products.filter(p => p.quantity === 0).length / products.length) * 100}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get settings content
function getSettingsContent() {
    return `
        <div class="page-content active">
            <div class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Settings</h2>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="shopName">Shop Name</label>
                        <input type="text" id="shopName" value="My Shop">
                    </div>
                    <div class="form-group">
                        <label for="currency">Currency</label>
                        <select id="currency">
                            <option value="USD">US Dollar (₹)</option>
                            <option value="EUR">Euro (€)</option>
                            <option value="GBP">British Pound (£)</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="lowStockDefault">Default Low Stock Threshold</label>
                        <input type="number" id="lowStockDefault" value="10">
                    </div>
                    <div class="form-group">
                        <label for="timezone">Timezone</label>
                        <select id="timezone">
                            <option value="est">Eastern Time (EST)</option>
                            <option value="pst">Pacific Time (PST)</option>
                            <option value="gmt">Greenwich Mean Time (GMT)</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="notifications">Notifications</label>
                    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" checked> Low stock alerts
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" checked> Out of stock alerts
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox"> Daily summary reports
                        </label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn">Cancel</button>
                    <button type="button" class="btn btn-primary">Save Settings</button>
                </div>
            </div>
        </div>
    `;
}

// Delete product function
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        
        // Add activity
        activities.unshift({
            id: activities.length + 1,
            date: new Date().toLocaleString(),
            activity: 'Product deleted',
            product: `Product ID: ₹{productId}`,
            user: 'Current User'
        });
        
        loadPage('products');
    }
}
