
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./lokmada_menu.db');

db.serialize(() => {
    // Enable foreign keys
    db.run("PRAGMA foreign_keys = ON");

    // Categories Table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        category_id INTEGER,
        is_available INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )`);

    // Prices Table
    db.run(`CREATE TABLE IF NOT EXISTS product_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        size TEXT,
        price_value TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )`);

    // Seed initial data if tables are empty
    db.get("SELECT COUNT(*) as count FROM categories", (err, row) => {
        if (row && row.count === 0) {
            console.log('Seeding initial data...');
            db.run("INSERT INTO categories (name) VALUES (?)", ["Lokmada"], function() {
                const catId = this.lastID;
                db.run("INSERT INTO products (name, description, image_url, category_id) VALUES (?, ?, ?, ?)", 
                ["White Lokmada", "Vanilla - White Chocolate - Oreo", "https://lh3.googleusercontent.com/aida-public/AB6AXuCNTU_5GqNP7Y70lWdBFYZJoAa1gJKX0B4g8nAjKaaqlEdI9uMToMj7Oy5NyxrQtFcHXXdYeq4mgxtRO2y2RiDb8yEMFxQQPiCiR3VhMK2DVqcK34GBRPTgMAonVp6pTrra4_1Z2XsX4bjPWDx1y8M84wkkRr0BUIHOsQXmDhltlqlY2KWCLi6wCiRtG3r0FGD5-jAw02ybSIHXfTScicKR5djlNC4yFNiYvZUXulkd2RJamO9cqpvSv2DWTp_EE5HIfKv1S85R_g1v", catId], 
                function() {
                    const prodId = this.lastID;
                    db.run("INSERT INTO product_prices (product_id, size, price_value) VALUES (?, ?, ?)", [prodId, "Small", "IQD 2,500"]);
                    db.run("INSERT INTO product_prices (product_id, size, price_value) VALUES (?, ?, ?)", [prodId, "Medium", "IQD 5,000"]);
                    db.run("INSERT INTO product_prices (product_id, size, price_value) VALUES (?, ?, ?)", [prodId, "Large", "IQD 9,000"]);
                });
            });
        }
    });
    
    console.log('Database initialized.');
});

module.exports = db;
