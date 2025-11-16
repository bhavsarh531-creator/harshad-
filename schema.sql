-- Create database
CREATE DATABASE IF NOT EXISTS stock_control;
USE stock_control;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    supplier VARCHAR(255),
    low_stock_threshold INT DEFAULT 10,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activity VARCHAR(255),
    product VARCHAR(255),
    user VARCHAR(100)
);

-- Insert sample data
INSERT INTO products (name, category, price, quantity, supplier, description) VALUES
('Premium Coffee Beans', 'Beverages', 12.99, 5, 'Global Foods Ltd.', 'High-quality arabica coffee beans'),
('Organic Olive Oil', 'Cooking', 18.50, 24, 'Mediterranean Imports', 'Extra virgin organic olive oil'),
('Handmade Soap', 'Personal Care', 5.99, 3, 'Natural Products Co.', 'Natural handmade lavender soap'),
('Wireless Earbuds', 'Electronics', 49.99, 0, 'TechGadgets Inc.', 'Bluetooth 5.0 wireless earbuds'),
('Stainless Steel Water Bottle', 'Accessories', 24.99, 15, 'EcoLiving Supplies', 'Insulated stainless steel bottle');

-- Insert sample activities
INSERT INTO activities (activity, product, user) VALUES
('Stock updated', 'Premium Coffee Beans', 'John Doe'),
('New product added', 'Organic Honey', 'Jane Smith'),
('Low stock alert', 'Handmade Soap', 'System'),
('Sale recorded', 'Wireless Earbuds', 'John Doe'),
('Supplier updated', 'Stainless Steel Water Bottle', 'Jane Smith');