"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const store_entity_1 = require("../stores/entities/store.entity");
const user_entity_1 = require("../users/entities/user.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const subcategory_entity_1 = require("../subcategories/entities/subcategory.entity");
const menu_item_entity_1 = require("../menu-items/entities/menu-item.entity");
const supplier_entity_1 = require("../suppliers/entities/supplier.entity");
const purchase_invoices_service_1 = require("../purchase-invoices/purchase-invoices.service");
const orders_service_1 = require("../orders/orders.service");
const enums_1 = require("../common/enums");
const stores = [
    {
        store: {
            name: 'Blue Brew Coffee',
            address: '12 Main Street, Silom, Bang Rak, Bangkok 10500',
            phone: '+66-2-111-2222',
            email: 'hello@bluebrew.co',
            website: 'https://www.bluebrewcoffee.co',
            logo: 'https://placehold.co/200x200/4A2C2A/FFFFFF?text=Blue+Brew',
            googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.2!2d100.5233!3d13.7244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBangkok!5e0!3m2!1sen!2sth!4v1700000001',
        },
        categories: [
            {
                name: 'Hot Beverages', sortOrder: 1,
                subcategories: [
                    {
                        name: 'Espresso Based', sortOrder: 1,
                        items: [
                            { name: 'Espresso', description: 'Single shot of pure espresso', price: 3.50, unit: 'cup', sku: 'ESP-001', lowStockThreshold: 20 },
                            { name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 5.00, unit: 'cup', sku: 'CAP-001', lowStockThreshold: 20 },
                            { name: 'Latte', description: 'Espresso with steamed milk', price: 5.50, unit: 'cup', sku: 'LAT-001', lowStockThreshold: 20 },
                            { name: 'Flat White', description: 'Double ristretto with microfoam milk', price: 5.50, unit: 'cup', sku: 'FLW-001', lowStockThreshold: 15 },
                            { name: 'Macchiato', description: 'Espresso with a dash of milk', price: 4.50, unit: 'cup', sku: 'MAC-001', lowStockThreshold: 15 },
                        ],
                    },
                    {
                        name: 'Tea & Others', sortOrder: 2,
                        items: [
                            { name: 'Thai Milk Tea', description: 'Classic Thai iced tea with condensed milk', price: 4.50, unit: 'cup', sku: 'TMT-001', lowStockThreshold: 20 },
                            { name: 'Matcha Latte', description: 'Premium Japanese matcha with steamed milk', price: 6.00, unit: 'cup', sku: 'MAT-001', lowStockThreshold: 15 },
                            { name: 'Hot Chocolate', description: 'Rich Belgian chocolate drink', price: 5.50, unit: 'cup', sku: 'HCH-001', lowStockThreshold: 15 },
                        ],
                    },
                ],
            },
            {
                name: 'Cold Beverages', sortOrder: 2,
                subcategories: [
                    {
                        name: 'Iced Coffee', sortOrder: 1,
                        items: [
                            { name: 'Iced Latte', description: 'Espresso over ice with cold milk', price: 6.00, unit: 'cup', sku: 'ICL-001', lowStockThreshold: 20 },
                            { name: 'Cold Brew', description: '12-hour cold-steeped coffee', price: 6.50, unit: 'cup', sku: 'CBR-001', lowStockThreshold: 20 },
                            { name: 'Iced Americano', description: 'Double espresso over ice', price: 5.00, unit: 'cup', sku: 'IAM-001', lowStockThreshold: 20 },
                            { name: 'Frappuccino', description: 'Blended iced coffee with cream', price: 7.00, unit: 'cup', sku: 'FRP-001', lowStockThreshold: 15 },
                        ],
                    },
                    {
                        name: 'Smoothies & Juice', sortOrder: 2,
                        items: [
                            { name: 'Mango Smoothie', description: 'Fresh mango blended with yogurt', price: 7.50, unit: 'cup', sku: 'MNG-001', lowStockThreshold: 10 },
                            { name: 'Strawberry Smoothie', description: 'Fresh strawberries with banana', price: 7.50, unit: 'cup', sku: 'STR-001', lowStockThreshold: 10 },
                            { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 5.50, unit: 'cup', sku: 'OJC-001', lowStockThreshold: 10 },
                        ],
                    },
                ],
            },
            {
                name: 'Food', sortOrder: 3,
                subcategories: [
                    {
                        name: 'Pastries', sortOrder: 1,
                        items: [
                            { name: 'Butter Croissant', description: 'Flaky French-style croissant', price: 3.50, unit: 'pc', sku: 'CRS-001', lowStockThreshold: 10 },
                            { name: 'Blueberry Muffin', description: 'Moist muffin with fresh blueberries', price: 3.50, unit: 'pc', sku: 'MUF-001', lowStockThreshold: 10 },
                            { name: 'Banana Bread Slice', description: 'Homemade banana bread', price: 4.00, unit: 'pc', sku: 'BNB-001', lowStockThreshold: 8 },
                            { name: 'Cinnamon Roll', description: 'Soft roll with cinnamon and cream cheese icing', price: 4.50, unit: 'pc', sku: 'CNR-001', lowStockThreshold: 8 },
                        ],
                    },
                    {
                        name: 'Sandwiches', sortOrder: 2,
                        items: [
                            { name: 'Club Sandwich', description: 'Triple-decker with chicken, bacon and egg', price: 9.50, unit: 'pc', sku: 'CLB-001', lowStockThreshold: 5 },
                            { name: 'Avocado Toast', description: 'Sourdough with smashed avocado and egg', price: 10.00, unit: 'pc', sku: 'AVT-001', lowStockThreshold: 5 },
                            { name: 'Tuna Melt', description: 'Tuna salad with melted cheese on toast', price: 8.50, unit: 'pc', sku: 'TNM-001', lowStockThreshold: 5 },
                        ],
                    },
                ],
            },
        ],
        suppliers: [
            { name: 'Arabica Bean Co.', contactPerson: 'James Lee', email: 'james@arabicabean.com', phone: '+66-81-234-5678', address: 'Chiang Rai, Thailand' },
            { name: 'FreshBake Supplies', contactPerson: 'Sara Kim', email: 'sara@freshbake.com', phone: '+66-82-345-6789', address: 'Bangkok, Thailand' },
        ],
        purchaseInvoices: [
            {
                supplierName: 'Arabica Bean Co.',
                invoiceDate: '2026-04-01',
                items: [
                    { name: 'Espresso', quantity: 200, unitPrice: 1.50 },
                    { name: 'Cappuccino', quantity: 150, unitPrice: 2.00 },
                    { name: 'Latte', quantity: 150, unitPrice: 2.00 },
                    { name: 'Flat White', quantity: 100, unitPrice: 2.00 },
                    { name: 'Iced Latte', quantity: 150, unitPrice: 2.00 },
                    { name: 'Cold Brew', quantity: 100, unitPrice: 2.50 },
                    { name: 'Iced Americano', quantity: 150, unitPrice: 1.80 },
                ],
            },
            {
                supplierName: 'FreshBake Supplies',
                invoiceDate: '2026-04-05',
                items: [
                    { name: 'Butter Croissant', quantity: 80, unitPrice: 1.20 },
                    { name: 'Blueberry Muffin', quantity: 60, unitPrice: 1.20 },
                    { name: 'Banana Bread Slice', quantity: 50, unitPrice: 1.50 },
                    { name: 'Cinnamon Roll', quantity: 50, unitPrice: 1.80 },
                    { name: 'Club Sandwich', quantity: 40, unitPrice: 4.00 },
                    { name: 'Avocado Toast', quantity: 40, unitPrice: 4.50 },
                ],
            },
            {
                supplierName: 'Arabica Bean Co.',
                invoiceDate: '2026-04-12',
                items: [
                    { name: 'Espresso', quantity: 100, unitPrice: 1.50 },
                    { name: 'Thai Milk Tea', quantity: 120, unitPrice: 1.80 },
                    { name: 'Matcha Latte', quantity: 80, unitPrice: 2.20 },
                    { name: 'Frappuccino', quantity: 80, unitPrice: 2.50 },
                    { name: 'Mango Smoothie', quantity: 60, unitPrice: 3.00 },
                ],
            },
        ],
        orders: [
            { tableNumber: 'T-01', customerName: 'Walk-in', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Latte', quantity: 2 }, { name: 'Butter Croissant', quantity: 2 }] },
            { tableNumber: 'T-03', customerName: 'Walk-in', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Cappuccino', quantity: 1 }, { name: 'Club Sandwich', quantity: 1 }] },
            { tableNumber: 'T-05', customerName: 'Walk-in', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Cold Brew', quantity: 2 }, { name: 'Avocado Toast', quantity: 2 }] },
            { tableNumber: 'T-07', customerName: 'Walk-in', status: enums_1.OrderStatus.READY, items: [{ name: 'Frappuccino', quantity: 3 }, { name: 'Blueberry Muffin', quantity: 2 }] },
            { tableNumber: 'T-02', customerName: 'Walk-in', status: enums_1.OrderStatus.PREPARING, items: [{ name: 'Espresso', quantity: 2 }, { name: 'Cinnamon Roll', quantity: 1 }] },
            { tableNumber: 'T-06', customerName: 'Walk-in', status: enums_1.OrderStatus.CONFIRMED, items: [{ name: 'Iced Latte', quantity: 2 }, { name: 'Mango Smoothie', quantity: 1 }] },
            { tableNumber: 'T-08', customerName: 'Walk-in', status: enums_1.OrderStatus.PENDING, items: [{ name: 'Thai Milk Tea', quantity: 2 }, { name: 'Matcha Latte', quantity: 1 }] },
            { tableNumber: 'T-04', customerName: 'Walk-in', status: enums_1.OrderStatus.PENDING, items: [{ name: 'Flat White', quantity: 1 }, { name: 'Banana Bread Slice', quantity: 1 }] },
        ],
    },
    {
        store: {
            name: 'Glow Skincare',
            address: '88 Sukhumvit Road, Khlong Toei, Bangkok 10110',
            phone: '+66-2-333-4444',
            email: 'hello@glowskincare.co',
            website: 'https://www.glowskincare.co',
            logo: 'https://placehold.co/200x200/F4A7B9/FFFFFF?text=Glow',
            googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.6!2d100.5602!3d13.7308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSukhumvit!5e0!3m2!1sen!2sth!4v1700000002',
        },
        categories: [
            {
                name: 'Cleansers', sortOrder: 1,
                subcategories: [
                    {
                        name: 'Face Wash', sortOrder: 1,
                        items: [
                            { name: 'Gentle Foam Cleanser', description: 'Sulfate-free foam cleanser for sensitive skin', price: 18.00, unit: 'bottle', sku: 'GFC-001', lowStockThreshold: 10 },
                            { name: 'Salicylic Gel Wash', description: '2% salicylic acid cleanser for acne-prone skin', price: 22.00, unit: 'bottle', sku: 'SGW-001', lowStockThreshold: 10 },
                            { name: 'Micellar Cleansing Water', description: 'Dual-phase makeup remover & cleanser', price: 19.00, unit: 'bottle', sku: 'MCW-001', lowStockThreshold: 8 },
                            { name: 'Oil Cleansing Balm', description: 'Melting balm removes SPF and makeup', price: 28.00, unit: 'jar', sku: 'OCB-001', lowStockThreshold: 8 },
                        ],
                    },
                    {
                        name: 'Exfoliants', sortOrder: 2,
                        items: [
                            { name: 'AHA/BHA Exfoliating Toner', description: '10% AHA + 2% BHA chemical exfoliant', price: 32.00, unit: 'bottle', sku: 'AHB-001', lowStockThreshold: 8 },
                            { name: 'Gentle Scrub', description: 'Physical exfoliant with jojoba beads', price: 20.00, unit: 'tube', sku: 'GSC-001', lowStockThreshold: 8 },
                            { name: 'Enzyme Powder Wash', description: 'Papaya enzyme exfoliating cleanser', price: 35.00, unit: 'jar', sku: 'EPW-001', lowStockThreshold: 5 },
                        ],
                    },
                ],
            },
            {
                name: 'Moisturizers', sortOrder: 2,
                subcategories: [
                    {
                        name: 'Day Creams', sortOrder: 1,
                        items: [
                            { name: 'Hydrating Day Cream SPF 30', description: 'Lightweight moisturizer with broad-spectrum SPF', price: 38.00, unit: 'jar', sku: 'HDC-001', lowStockThreshold: 8 },
                            { name: 'Oil Control Gel Cream', description: 'Mattifying moisturizer for oily skin', price: 32.00, unit: 'tube', sku: 'OGC-001', lowStockThreshold: 8 },
                            { name: 'Ceramide Barrier Cream', description: 'Barrier-repair moisturizer for dry skin', price: 42.00, unit: 'jar', sku: 'CBC-001', lowStockThreshold: 8 },
                        ],
                    },
                    {
                        name: 'Serums', sortOrder: 2,
                        items: [
                            { name: 'Hyaluronic Acid Serum', description: '3-weight HA for deep hydration', price: 45.00, unit: 'bottle', sku: 'HAS-001', lowStockThreshold: 8 },
                            { name: 'Vitamin C Brightening Serum', description: '15% Vitamin C + E + Ferulic', price: 55.00, unit: 'bottle', sku: 'VCS-001', lowStockThreshold: 8 },
                            { name: 'Retinol Night Serum', description: '0.5% retinol with bakuchiol', price: 60.00, unit: 'bottle', sku: 'RNS-001', lowStockThreshold: 5 },
                            { name: 'Niacinamide 10% Serum', description: 'Pore minimizing + oil control serum', price: 28.00, unit: 'bottle', sku: 'NIA-001', lowStockThreshold: 8 },
                        ],
                    },
                ],
            },
            {
                name: 'Sun Protection', sortOrder: 3,
                subcategories: [
                    {
                        name: 'Sunscreen', sortOrder: 1,
                        items: [
                            { name: 'Mineral Sunscreen SPF 50+', description: 'Zinc oxide physical sunscreen, reef-safe', price: 30.00, unit: 'tube', sku: 'MSS-001', lowStockThreshold: 10 },
                            { name: 'Chemical Sunscreen SPF 50', description: 'Ultra-light fluid sunscreen', price: 28.00, unit: 'tube', sku: 'CSS-001', lowStockThreshold: 10 },
                            { name: 'Tinted Sunscreen SPF 40', description: 'Light coverage with sun protection', price: 35.00, unit: 'tube', sku: 'TSS-001', lowStockThreshold: 8 },
                        ],
                    },
                ],
            },
        ],
        suppliers: [
            { name: 'Derma Labs Co.', contactPerson: 'Dr. Anna Reyes', email: 'anna@dermalabs.com', phone: '+66-83-456-7890', address: 'Singapore' },
            { name: 'NaturalGlow Cosmetics', contactPerson: 'Lisa Park', email: 'lisa@naturalglow.com', phone: '+66-84-567-8901', address: 'Seoul, Korea' },
        ],
        purchaseInvoices: [
            {
                supplierName: 'Derma Labs Co.',
                invoiceDate: '2026-04-02',
                items: [
                    { name: 'Gentle Foam Cleanser', quantity: 60, unitPrice: 8.00 },
                    { name: 'Salicylic Gel Wash', quantity: 50, unitPrice: 9.50 },
                    { name: 'AHA/BHA Exfoliating Toner', quantity: 40, unitPrice: 14.00 },
                    { name: 'Hyaluronic Acid Serum', quantity: 40, unitPrice: 20.00 },
                    { name: 'Vitamin C Brightening Serum', quantity: 35, unitPrice: 24.00 },
                    { name: 'Mineral Sunscreen SPF 50+', quantity: 60, unitPrice: 13.00 },
                ],
            },
            {
                supplierName: 'NaturalGlow Cosmetics',
                invoiceDate: '2026-04-08',
                items: [
                    { name: 'Micellar Cleansing Water', quantity: 50, unitPrice: 8.50 },
                    { name: 'Oil Cleansing Balm', quantity: 30, unitPrice: 12.00 },
                    { name: 'Ceramide Barrier Cream', quantity: 40, unitPrice: 18.00 },
                    { name: 'Niacinamide 10% Serum', quantity: 50, unitPrice: 12.00 },
                    { name: 'Retinol Night Serum', quantity: 25, unitPrice: 26.00 },
                    { name: 'Tinted Sunscreen SPF 40', quantity: 40, unitPrice: 15.00 },
                ],
            },
        ],
        orders: [
            { customerName: 'Sophia N.', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Hyaluronic Acid Serum', quantity: 1 }, { name: 'Mineral Sunscreen SPF 50+', quantity: 2 }] },
            { customerName: 'Emma L.', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Gentle Foam Cleanser', quantity: 2 }, { name: 'Niacinamide 10% Serum', quantity: 1 }] },
            { customerName: 'Nina R.', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Vitamin C Brightening Serum', quantity: 1 }, { name: 'Ceramide Barrier Cream', quantity: 1 }] },
            { customerName: 'Amy K.', status: enums_1.OrderStatus.CONFIRMED, items: [{ name: 'AHA/BHA Exfoliating Toner', quantity: 1 }, { name: 'Oil Cleansing Balm', quantity: 1 }] },
            { customerName: 'Grace P.', status: enums_1.OrderStatus.PENDING, items: [{ name: 'Retinol Night Serum', quantity: 1 }, { name: 'Tinted Sunscreen SPF 40', quantity: 1 }] },
            { customerName: 'Iris T.', status: enums_1.OrderStatus.PENDING, items: [{ name: 'Micellar Cleansing Water', quantity: 2 }] },
        ],
    },
    {
        store: {
            name: 'TechZone Electronics',
            address: '99 IT Plaza, Chaeng Watthana Road, Lak Si, Bangkok 10210',
            phone: '+66-2-555-6666',
            email: 'sales@techzone.co',
            website: 'https://www.techzone.co',
            logo: 'https://placehold.co/200x200/1A1A2E/FFFFFF?text=TechZone',
            googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.4!2d100.5701!3d13.7529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBangkok!5e0!3m2!1sen!2sth!4v1700000003',
        },
        categories: [
            {
                name: 'Smartphones', sortOrder: 1,
                subcategories: [
                    {
                        name: 'Apple', sortOrder: 1,
                        items: [
                            { name: 'iPhone 15 Pro 256GB', description: 'A17 Pro chip, titanium design', price: 1199.00, unit: 'unit', sku: 'APL-IP15P-256', lowStockThreshold: 3 },
                            { name: 'iPhone 15 128GB', description: 'Dynamic Island, USB-C', price: 799.00, unit: 'unit', sku: 'APL-IP15-128', lowStockThreshold: 3 },
                            { name: 'iPhone 14 128GB', description: 'A15 Bionic, emergency SOS', price: 699.00, unit: 'unit', sku: 'APL-IP14-128', lowStockThreshold: 3 },
                        ],
                    },
                    {
                        name: 'Android', sortOrder: 2,
                        items: [
                            { name: 'Samsung Galaxy S24 256GB', description: 'Galaxy AI, 200MP camera', price: 999.00, unit: 'unit', sku: 'SAM-S24-256', lowStockThreshold: 3 },
                            { name: 'Samsung Galaxy A55 256GB', description: 'IP67, 50MP OIS camera', price: 449.00, unit: 'unit', sku: 'SAM-A55-256', lowStockThreshold: 5 },
                            { name: 'Xiaomi 14 256GB', description: 'Leica optics, Snapdragon 8 Gen 3', price: 799.00, unit: 'unit', sku: 'XIR-14-256', lowStockThreshold: 3 },
                            { name: 'Google Pixel 8 128GB', description: '7 years OS updates, Tensor G3', price: 699.00, unit: 'unit', sku: 'GPX-8-128', lowStockThreshold: 3 },
                        ],
                    },
                ],
            },
            {
                name: 'Laptops', sortOrder: 2,
                subcategories: [
                    {
                        name: 'Ultrabooks', sortOrder: 1,
                        items: [
                            { name: 'MacBook Air M3 15"', description: 'Apple M3 chip, 8GB RAM, 256GB SSD', price: 1299.00, unit: 'unit', sku: 'APL-MBA-M3', lowStockThreshold: 2 },
                            { name: 'Dell XPS 15 i7', description: 'Intel i7-13700H, 16GB, 512GB OLED', price: 1799.00, unit: 'unit', sku: 'DEL-XPS15-I7', lowStockThreshold: 2 },
                            { name: 'Lenovo ThinkPad X1', description: 'Business ultrabook, i7, 16GB, 512GB', price: 1599.00, unit: 'unit', sku: 'LEN-TPX1-I7', lowStockThreshold: 2 },
                        ],
                    },
                    {
                        name: 'Gaming Laptops', sortOrder: 2,
                        items: [
                            { name: 'ASUS ROG Strix G16', description: 'RTX 4070, i9, 32GB, 1TB', price: 2199.00, unit: 'unit', sku: 'ASU-ROG-G16', lowStockThreshold: 2 },
                            { name: 'MSI Katana 15', description: 'RTX 4060, i7, 16GB, 512GB', price: 1399.00, unit: 'unit', sku: 'MSI-KAT-15', lowStockThreshold: 2 },
                        ],
                    },
                ],
            },
            {
                name: 'Audio', sortOrder: 3,
                subcategories: [
                    {
                        name: 'Headphones & Earbuds', sortOrder: 1,
                        items: [
                            { name: 'AirPods Pro 2nd Gen', description: 'Active noise cancellation, USB-C', price: 249.00, unit: 'unit', sku: 'APL-APP2', lowStockThreshold: 5 },
                            { name: 'Sony WH-1000XM5', description: 'Industry-leading ANC headphones', price: 349.00, unit: 'unit', sku: 'SON-WH1000XM5', lowStockThreshold: 5 },
                            { name: 'Samsung Galaxy Buds3 Pro', description: 'Hi-Fi sound, ANC earbuds', price: 199.00, unit: 'unit', sku: 'SAM-GBP3', lowStockThreshold: 5 },
                            { name: 'JBL Tune 770NC', description: 'Wireless ANC headphones 70hr battery', price: 129.00, unit: 'unit', sku: 'JBL-T770NC', lowStockThreshold: 5 },
                        ],
                    },
                    {
                        name: 'Speakers', sortOrder: 2,
                        items: [
                            { name: 'JBL Charge 5', description: 'Portable Bluetooth speaker, IP67', price: 179.00, unit: 'unit', sku: 'JBL-CHG5', lowStockThreshold: 5 },
                            { name: 'Sonos Era 100', description: 'Smart WiFi speaker with Alexa', price: 249.00, unit: 'unit', sku: 'SON-ERA100', lowStockThreshold: 3 },
                        ],
                    },
                ],
            },
        ],
        suppliers: [
            { name: 'iDistrib Thailand', contactPerson: 'Kevin Wong', email: 'kevin@idistrib.th', phone: '+66-85-678-9012', address: 'Bangkok, Thailand' },
            { name: 'TechImport Asia', contactPerson: 'David Choi', email: 'david@techimport.asia', phone: '+66-86-789-0123', address: 'Hong Kong' },
        ],
        purchaseInvoices: [
            {
                supplierName: 'iDistrib Thailand',
                invoiceDate: '2026-04-01',
                items: [
                    { name: 'iPhone 15 Pro 256GB', quantity: 15, unitPrice: 950.00 },
                    { name: 'iPhone 15 128GB', quantity: 20, unitPrice: 630.00 },
                    { name: 'MacBook Air M3 15"', quantity: 10, unitPrice: 1050.00 },
                    { name: 'AirPods Pro 2nd Gen', quantity: 30, unitPrice: 180.00 },
                ],
            },
            {
                supplierName: 'TechImport Asia',
                invoiceDate: '2026-04-07',
                items: [
                    { name: 'Samsung Galaxy S24 256GB', quantity: 18, unitPrice: 780.00 },
                    { name: 'Samsung Galaxy A55 256GB', quantity: 25, unitPrice: 340.00 },
                    { name: 'ASUS ROG Strix G16', quantity: 8, unitPrice: 1750.00 },
                    { name: 'Sony WH-1000XM5', quantity: 20, unitPrice: 270.00 },
                    { name: 'JBL Charge 5', quantity: 25, unitPrice: 130.00 },
                ],
            },
            {
                supplierName: 'TechImport Asia',
                invoiceDate: '2026-04-14',
                items: [
                    { name: 'Xiaomi 14 256GB', quantity: 15, unitPrice: 620.00 },
                    { name: 'JBL Tune 770NC', quantity: 20, unitPrice: 85.00 },
                    { name: 'Samsung Galaxy Buds3 Pro', quantity: 20, unitPrice: 140.00 },
                    { name: 'MSI Katana 15', quantity: 10, unitPrice: 1100.00 },
                ],
            },
        ],
        orders: [
            { customerName: 'Alex H.', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'iPhone 15 Pro 256GB', quantity: 1 }, { name: 'AirPods Pro 2nd Gen', quantity: 1 }] },
            { customerName: 'Ben T.', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Samsung Galaxy S24 256GB', quantity: 2 }] },
            { customerName: 'Chris W.', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'MacBook Air M3 15"', quantity: 1 }] },
            { customerName: 'Diana F.', status: enums_1.OrderStatus.PREPARING, items: [{ name: 'Sony WH-1000XM5', quantity: 1 }, { name: 'JBL Charge 5', quantity: 1 }] },
            { customerName: 'Eddie S.', status: enums_1.OrderStatus.CONFIRMED, items: [{ name: 'ASUS ROG Strix G16', quantity: 1 }] },
            { customerName: 'Fiona K.', status: enums_1.OrderStatus.PENDING, items: [{ name: 'Xiaomi 14 256GB', quantity: 1 }, { name: 'Samsung Galaxy Buds3 Pro', quantity: 1 }] },
        ],
    },
    {
        store: {
            name: 'BuildMart Construction',
            address: '45 Industrial Road, Mueang Samut Prakan, Samut Prakan 10280',
            phone: '+66-2-777-8888',
            email: 'sales@buildmart.co',
            website: 'https://www.buildmart.co',
            logo: 'https://placehold.co/200x200/D97706/FFFFFF?text=BuildMart',
            googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.1!2d100.5950!3d13.5991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSamutPrakan!5e0!3m2!1sen!2sth!4v1700000004',
        },
        categories: [
            {
                name: 'Building Materials', sortOrder: 1,
                subcategories: [
                    {
                        name: 'Cement & Concrete', sortOrder: 1,
                        items: [
                            { name: 'Portland Cement 50kg', description: 'Grade 42.5N general purpose cement', price: 12.00, unit: 'bag', sku: 'CEM-PC-50', lowStockThreshold: 50 },
                            { name: 'Rapid Set Cement 25kg', description: 'Fast-hardening cement for repairs', price: 15.00, unit: 'bag', sku: 'CEM-RS-25', lowStockThreshold: 30 },
                            { name: 'Concrete Hollow Block 20cm', description: 'Standard hollow block 40x20x20cm', price: 1.20, unit: 'pc', sku: 'BLK-HB-20', lowStockThreshold: 200 },
                            { name: 'River Sand 1 Ton', description: 'Washed river sand for construction', price: 45.00, unit: 'ton', sku: 'SND-RV-1T', lowStockThreshold: 10 },
                        ],
                    },
                    {
                        name: 'Steel & Metal', sortOrder: 2,
                        items: [
                            { name: 'Steel Rebar 12mm x 10m', description: 'Deformed steel bar for concrete reinforcement', price: 18.00, unit: 'pc', sku: 'STL-RB-12', lowStockThreshold: 50 },
                            { name: 'Steel Rebar 16mm x 10m', description: 'Heavy duty rebar for structural use', price: 28.00, unit: 'pc', sku: 'STL-RB-16', lowStockThreshold: 30 },
                            { name: 'Plywood Sheet 12mm', description: '1.2mx2.4m marine plywood sheet', price: 32.00, unit: 'sheet', sku: 'PLY-12MM', lowStockThreshold: 20 },
                        ],
                    },
                ],
            },
            {
                name: 'Power Tools', sortOrder: 2,
                subcategories: [
                    {
                        name: 'Cutting & Grinding', sortOrder: 1,
                        items: [
                            { name: 'Angle Grinder 4.5"', description: 'Bosch 900W angle grinder with disc', price: 85.00, unit: 'unit', sku: 'TL-AG45', lowStockThreshold: 5 },
                            { name: 'Circular Saw 7.25"', description: 'Makita 1200W circular saw', price: 145.00, unit: 'unit', sku: 'TL-CS725', lowStockThreshold: 3 },
                            { name: 'Jigsaw Variable Speed', description: 'DeWalt 700W jigsaw with blade', price: 120.00, unit: 'unit', sku: 'TL-JS-VS', lowStockThreshold: 3 },
                        ],
                    },
                    {
                        name: 'Drilling', sortOrder: 2,
                        items: [
                            { name: 'Corded Drill 13mm', description: 'Bosch 750W impact drill', price: 75.00, unit: 'unit', sku: 'TL-CD-13', lowStockThreshold: 5 },
                            { name: 'Rotary Hammer 28mm', description: 'Makita SDS+ rotary hammer 1100W', price: 280.00, unit: 'unit', sku: 'TL-RH-28', lowStockThreshold: 3 },
                            { name: 'Cordless Drill 18V', description: 'DeWalt 18V brushless 2 battery kit', price: 199.00, unit: 'unit', sku: 'TL-CDRL-18V', lowStockThreshold: 5 },
                        ],
                    },
                ],
            },
            {
                name: 'Plumbing', sortOrder: 3,
                subcategories: [
                    {
                        name: 'Pipes & Fittings', sortOrder: 1,
                        items: [
                            { name: 'PVC Pipe 4" x 4m', description: 'Schedule 40 PVC pressure pipe', price: 14.00, unit: 'pc', sku: 'PVC-4IN-4M', lowStockThreshold: 20 },
                            { name: 'PVC Pipe 2" x 4m', description: 'Schedule 40 PVC drain pipe', price: 8.00, unit: 'pc', sku: 'PVC-2IN-4M', lowStockThreshold: 30 },
                            { name: 'Ball Valve 1"', description: 'Brass full-bore ball valve', price: 12.00, unit: 'pc', sku: 'PLB-BV-1IN', lowStockThreshold: 20 },
                            { name: 'PVC Elbow 90° 4"', description: 'Pressure PVC elbow fitting', price: 3.50, unit: 'pc', sku: 'PVC-EL-4IN', lowStockThreshold: 30 },
                        ],
                    },
                ],
            },
            {
                name: 'Electrical', sortOrder: 4,
                subcategories: [
                    {
                        name: 'Wiring & Cables', sortOrder: 1,
                        items: [
                            { name: 'THW Cable 2.5mm 100m', description: 'Single-core copper THW cable roll', price: 48.00, unit: 'roll', sku: 'ELC-THW25-100', lowStockThreshold: 10 },
                            { name: 'THW Cable 1.5mm 100m', description: 'Single-core copper THW cable roll', price: 32.00, unit: 'roll', sku: 'ELC-THW15-100', lowStockThreshold: 10 },
                            { name: 'Circuit Breaker 20A', description: 'Single pole MCB 20A', price: 18.00, unit: 'unit', sku: 'ELC-CB-20A', lowStockThreshold: 20 },
                            { name: 'LED Bulb 10W E27', description: 'Warm white LED bulb 6500K', price: 4.50, unit: 'unit', sku: 'LED-10W-E27', lowStockThreshold: 50 },
                        ],
                    },
                ],
            },
        ],
        suppliers: [
            { name: 'CementPro Thailand', contactPerson: 'David Sombat', email: 'david@cementpro.th', phone: '+66-87-890-1234', address: 'Saraburi, Thailand' },
            { name: 'PowerTools Direct', contactPerson: 'John Smith', email: 'john@ptdirect.co', phone: '+66-88-901-2345', address: 'Lat Krabang, Bangkok' },
        ],
        purchaseInvoices: [
            {
                supplierName: 'CementPro Thailand',
                invoiceDate: '2026-04-01',
                items: [
                    { name: 'Portland Cement 50kg', quantity: 500, unitPrice: 9.00 },
                    { name: 'Rapid Set Cement 25kg', quantity: 200, unitPrice: 11.00 },
                    { name: 'Concrete Hollow Block 20cm', quantity: 2000, unitPrice: 0.70 },
                    { name: 'River Sand 1 Ton', quantity: 50, unitPrice: 30.00 },
                    { name: 'Steel Rebar 12mm x 10m', quantity: 300, unitPrice: 13.00 },
                    { name: 'Plywood Sheet 12mm', quantity: 100, unitPrice: 22.00 },
                ],
            },
            {
                supplierName: 'PowerTools Direct',
                invoiceDate: '2026-04-05',
                items: [
                    { name: 'Angle Grinder 4.5"', quantity: 20, unitPrice: 58.00 },
                    { name: 'Circular Saw 7.25"', quantity: 12, unitPrice: 100.00 },
                    { name: 'Corded Drill 13mm', quantity: 25, unitPrice: 50.00 },
                    { name: 'Cordless Drill 18V', quantity: 15, unitPrice: 140.00 },
                    { name: 'PVC Pipe 4" x 4m', quantity: 100, unitPrice: 9.00 },
                    { name: 'PVC Pipe 2" x 4m', quantity: 150, unitPrice: 5.00 },
                    { name: 'Ball Valve 1"', quantity: 80, unitPrice: 6.00 },
                    { name: 'PVC Elbow 90° 4"', quantity: 150, unitPrice: 1.80 },
                ],
            },
            {
                supplierName: 'CementPro Thailand',
                invoiceDate: '2026-04-12',
                items: [
                    { name: 'Portland Cement 50kg', quantity: 300, unitPrice: 9.00 },
                    { name: 'Steel Rebar 16mm x 10m', quantity: 150, unitPrice: 20.00 },
                    { name: 'THW Cable 2.5mm 100m', quantity: 40, unitPrice: 33.00 },
                    { name: 'LED Bulb 10W E27', quantity: 300, unitPrice: 2.50 },
                    { name: 'Circuit Breaker 20A', quantity: 80, unitPrice: 12.00 },
                ],
            },
        ],
        orders: [
            { customerName: 'ACE Contractors', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Portland Cement 50kg', quantity: 50 }, { name: 'Steel Rebar 12mm x 10m', quantity: 30 }, { name: 'River Sand 1 Ton', quantity: 5 }] },
            { customerName: 'Prime Builders', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Concrete Hollow Block 20cm', quantity: 200 }, { name: 'Portland Cement 50kg', quantity: 20 }] },
            { customerName: 'Solo Contractor', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Angle Grinder 4.5"', quantity: 2 }, { name: 'Corded Drill 13mm', quantity: 1 }] },
            { customerName: 'Mega Build Co.', status: enums_1.OrderStatus.CONFIRMED, items: [{ name: 'Portland Cement 50kg', quantity: 100 }, { name: 'Steel Rebar 16mm x 10m', quantity: 50 }] },
            { customerName: 'Home Renovator', status: enums_1.OrderStatus.CONFIRMED, items: [{ name: 'PVC Pipe 4" x 4m', quantity: 10 }, { name: 'Ball Valve 1"', quantity: 5 }] },
            { customerName: 'Electrician Joe', status: enums_1.OrderStatus.PENDING, items: [{ name: 'THW Cable 2.5mm 100m', quantity: 5 }, { name: 'Circuit Breaker 20A', quantity: 10 }] },
        ],
    },
    {
        store: {
            name: 'FreshMart Superstore',
            address: '200 Ratchadaphisek Road, Huai Khwang, Bangkok 10310',
            phone: '+66-2-999-0000',
            email: 'info@freshmart.co',
            website: 'https://www.freshmart.co',
            logo: 'https://placehold.co/200x200/16A34A/FFFFFF?text=FreshMart',
            googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.8!2d100.5694!3d13.7657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRatchadaphisek!5e0!3m2!1sen!2sth!4v1700000005',
        },
        categories: [
            {
                name: 'Beverages', sortOrder: 1,
                subcategories: [
                    {
                        name: 'Soft Drinks', sortOrder: 1,
                        items: [
                            { name: 'Coca-Cola 1.5L', description: 'Carbonated cola drink', price: 2.50, unit: 'bottle', sku: 'BEV-COK-15', lowStockThreshold: 50 },
                            { name: 'Pepsi 1.5L', description: 'Carbonated cola drink', price: 2.30, unit: 'bottle', sku: 'BEV-PEP-15', lowStockThreshold: 50 },
                            { name: 'Sprite 1.5L', description: 'Lemon-lime carbonated drink', price: 2.30, unit: 'bottle', sku: 'BEV-SPR-15', lowStockThreshold: 30 },
                            { name: 'Red Bull 250ml', description: 'Energy drink can', price: 1.80, unit: 'can', sku: 'BEV-RBL-250', lowStockThreshold: 50 },
                            { name: '100Plus 325ml', description: 'Isotonic drink can', price: 1.20, unit: 'can', sku: 'BEV-1PL-325', lowStockThreshold: 50 },
                        ],
                    },
                    {
                        name: 'Water & Juice', sortOrder: 2,
                        items: [
                            { name: 'Mineral Water 1.5L', description: 'Natural mineral water bottle', price: 0.80, unit: 'bottle', sku: 'BEV-MWR-15', lowStockThreshold: 100 },
                            { name: 'Mineral Water 600ml', description: 'Natural mineral water bottle', price: 0.50, unit: 'bottle', sku: 'BEV-MWR-6', lowStockThreshold: 100 },
                            { name: 'Tropicana Orange 900ml', description: '100% pure squeezed orange juice', price: 4.50, unit: 'bottle', sku: 'BEV-TRP-9', lowStockThreshold: 30 },
                            { name: 'Milo 3in1 Pack 20s', description: 'Chocolate malt drink sachets', price: 6.50, unit: 'pack', sku: 'BEV-MLO-20', lowStockThreshold: 20 },
                        ],
                    },
                ],
            },
            {
                name: 'Snacks', sortOrder: 2,
                subcategories: [
                    {
                        name: 'Chips & Crisps', sortOrder: 1,
                        items: [
                            { name: "Lay's Original 75g", description: 'Classic salted potato chips', price: 1.80, unit: 'bag', sku: 'SNK-LAY-75', lowStockThreshold: 50 },
                            { name: 'Pringles Original 165g', description: 'Stackable potato crisps', price: 4.50, unit: 'can', sku: 'SNK-PRG-165', lowStockThreshold: 30 },
                            { name: 'Cheetos 60g', description: 'Crunchy cheese puffs', price: 1.50, unit: 'bag', sku: 'SNK-CHE-60', lowStockThreshold: 50 },
                        ],
                    },
                    {
                        name: 'Chocolates & Candy', sortOrder: 2,
                        items: [
                            { name: 'KitKat 4-Finger', description: 'Milk chocolate wafer bar', price: 1.20, unit: 'bar', sku: 'CHC-KKT-4F', lowStockThreshold: 50 },
                            { name: 'Snickers 50g', description: 'Peanut caramel chocolate bar', price: 1.30, unit: 'bar', sku: 'CHC-SNK-50', lowStockThreshold: 50 },
                            { name: 'Oreo Original 154g', description: 'Classic cream sandwich cookies', price: 2.50, unit: 'pack', sku: 'CHC-ORE-154', lowStockThreshold: 30 },
                            { name: 'Toblerone 100g', description: 'Swiss milk chocolate with honey & almond', price: 4.00, unit: 'bar', sku: 'CHC-TBL-100', lowStockThreshold: 20 },
                        ],
                    },
                ],
            },
            {
                name: 'Dairy & Eggs', sortOrder: 3,
                subcategories: [
                    {
                        name: 'Milk & Cream', sortOrder: 1,
                        items: [
                            { name: 'Full Cream Milk 1L', description: 'Fresh pasteurized full-fat milk', price: 3.00, unit: 'carton', sku: 'DRY-FCM-1L', lowStockThreshold: 30 },
                            { name: 'Low Fat Milk 1L', description: 'Fresh pasteurized 1.5% fat milk', price: 2.80, unit: 'carton', sku: 'DRY-LFM-1L', lowStockThreshold: 20 },
                            { name: 'UHT Milk 1L', description: 'Long-life full cream UHT milk', price: 2.20, unit: 'carton', sku: 'DRY-UHT-1L', lowStockThreshold: 50 },
                        ],
                    },
                    {
                        name: 'Cheese & Yogurt', sortOrder: 2,
                        items: [
                            { name: 'Cheddar Cheese 250g', description: 'Mature cheddar block', price: 6.50, unit: 'pack', sku: 'DRY-CHD-250', lowStockThreshold: 15 },
                            { name: 'Greek Yogurt 500g', description: 'Plain full-fat Greek yogurt', price: 4.50, unit: 'tub', sku: 'DRY-GYG-500', lowStockThreshold: 15 },
                            { name: 'Butter 250g', description: 'Salted dairy butter block', price: 5.00, unit: 'pack', sku: 'DRY-BUT-250', lowStockThreshold: 15 },
                        ],
                    },
                ],
            },
            {
                name: 'Household', sortOrder: 4,
                subcategories: [
                    {
                        name: 'Cleaning', sortOrder: 1,
                        items: [
                            { name: 'Fairy Dishwashing Liquid 500ml', description: 'Concentrated dish soap', price: 3.80, unit: 'bottle', sku: 'HH-FRY-500', lowStockThreshold: 20 },
                            { name: 'Ariel Laundry Powder 3kg', description: 'Auto-washing machine powder', price: 9.50, unit: 'box', sku: 'HH-ARL-3K', lowStockThreshold: 15 },
                            { name: 'Flash Bathroom Cleaner 750ml', description: 'Multi-surface bathroom spray', price: 4.50, unit: 'bottle', sku: 'HH-FLS-750', lowStockThreshold: 15 },
                            { name: 'Domestos Bleach 750ml', description: 'Thick bleach toilet cleaner', price: 3.50, unit: 'bottle', sku: 'HH-DOM-750', lowStockThreshold: 20 },
                        ],
                    },
                ],
            },
        ],
        suppliers: [
            { name: 'Beverage Distributors Ltd.', contactPerson: 'Kim Suda', email: 'kim@bevdist.co', phone: '+66-89-012-3456', address: 'Bangkok, Thailand' },
            { name: 'Metro Grocery Wholesale', contactPerson: 'Nancy Lu', email: 'nancy@metrowholesale.co', phone: '+66-80-123-4567', address: 'Nonthaburi, Thailand' },
        ],
        purchaseInvoices: [
            {
                supplierName: 'Beverage Distributors Ltd.',
                invoiceDate: '2026-04-01',
                items: [
                    { name: 'Coca-Cola 1.5L', quantity: 300, unitPrice: 1.60 },
                    { name: 'Pepsi 1.5L', quantity: 200, unitPrice: 1.50 },
                    { name: 'Red Bull 250ml', quantity: 400, unitPrice: 1.10 },
                    { name: 'Mineral Water 1.5L', quantity: 500, unitPrice: 0.40 },
                    { name: 'Mineral Water 600ml', quantity: 500, unitPrice: 0.25 },
                    { name: 'Tropicana Orange 900ml', quantity: 150, unitPrice: 2.80 },
                ],
            },
            {
                supplierName: 'Metro Grocery Wholesale',
                invoiceDate: '2026-04-03',
                items: [
                    { name: "Lay's Original 75g", quantity: 300, unitPrice: 1.10 },
                    { name: 'Pringles Original 165g', quantity: 150, unitPrice: 2.80 },
                    { name: 'KitKat 4-Finger', quantity: 400, unitPrice: 0.75 },
                    { name: 'Oreo Original 154g', quantity: 200, unitPrice: 1.50 },
                    { name: 'Full Cream Milk 1L', quantity: 200, unitPrice: 1.80 },
                    { name: 'UHT Milk 1L', quantity: 300, unitPrice: 1.30 },
                    { name: 'Cheddar Cheese 250g', quantity: 100, unitPrice: 3.80 },
                    { name: 'Fairy Dishwashing Liquid 500ml', quantity: 150, unitPrice: 2.20 },
                    { name: 'Ariel Laundry Powder 3kg', quantity: 80, unitPrice: 5.50 },
                ],
            },
            {
                supplierName: 'Beverage Distributors Ltd.',
                invoiceDate: '2026-04-10',
                items: [
                    { name: 'Coca-Cola 1.5L', quantity: 200, unitPrice: 1.60 },
                    { name: 'Milo 3in1 Pack 20s', quantity: 100, unitPrice: 4.00 },
                    { name: 'Greek Yogurt 500g', quantity: 80, unitPrice: 2.80 },
                    { name: 'Butter 250g', quantity: 80, unitPrice: 3.00 },
                    { name: 'Snickers 50g', quantity: 300, unitPrice: 0.80 },
                ],
            },
        ],
        orders: [
            { customerName: 'Regular Customer', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Coca-Cola 1.5L', quantity: 4 }, { name: "Lay's Original 75g", quantity: 3 }, { name: 'KitKat 4-Finger', quantity: 5 }] },
            { customerName: 'Family Shop', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Full Cream Milk 1L', quantity: 3 }, { name: 'Cheddar Cheese 250g', quantity: 2 }, { name: 'Butter 250g', quantity: 1 }] },
            { customerName: 'Weekly Shopper', status: enums_1.OrderStatus.DELIVERED, items: [{ name: 'Ariel Laundry Powder 3kg', quantity: 2 }, { name: 'Fairy Dishwashing Liquid 500ml', quantity: 2 }, { name: 'Mineral Water 1.5L', quantity: 6 }] },
            { customerName: 'Office Order', status: enums_1.OrderStatus.CONFIRMED, items: [{ name: 'Mineral Water 600ml', quantity: 24 }, { name: 'Red Bull 250ml', quantity: 12 }, { name: 'Milo 3in1 Pack 20s', quantity: 4 }] },
            { customerName: 'Party Supplies', status: enums_1.OrderStatus.CONFIRMED, items: [{ name: 'Pringles Original 165g', quantity: 5 }, { name: 'Oreo Original 154g', quantity: 4 }, { name: 'Coca-Cola 1.5L', quantity: 6 }] },
            { customerName: 'Quick Grab', status: enums_1.OrderStatus.PENDING, items: [{ name: 'Snickers 50g', quantity: 3 }, { name: 'Red Bull 250ml', quantity: 2 }] },
        ],
    },
];
const seedUsers = [
    {
        name: 'Alex Suthep',
        phone: '+66811111111',
        email: 'alex@staff.co',
        password: 'Manager@123',
        role: enums_1.UserRole.MANAGER,
        storeNames: ['Blue Brew Coffee', 'Glow Skincare'],
    },
    {
        name: 'Bob Tanaka',
        phone: '+66822222222',
        email: 'bob@staff.co',
        password: 'Manager@123',
        role: enums_1.UserRole.MANAGER,
        storeNames: ['TechZone Electronics', 'BuildMart Construction'],
    },
    {
        name: 'Carol Sirilak',
        phone: '+66833333333',
        email: 'carol@staff.co',
        password: 'Manager@123',
        role: enums_1.UserRole.MANAGER,
        storeNames: ['FreshMart Superstore'],
    },
    {
        name: 'Dave Chaisin',
        phone: '+66844444444',
        email: 'dave@staff.co',
        password: 'Cashier@123',
        role: enums_1.UserRole.CASHIER,
        storeNames: ['Blue Brew Coffee', 'FreshMart Superstore'],
    },
    {
        name: 'Eve Thanu',
        phone: '+66855555555',
        email: 'eve@staff.co',
        password: 'Cashier@123',
        role: enums_1.UserRole.CASHIER,
        storeNames: ['Glow Skincare'],
    },
    {
        name: 'Frank Torres',
        phone: '+66866666666',
        email: 'frank@staff.co',
        password: 'Cashier@123',
        role: enums_1.UserRole.CASHIER,
        storeNames: ['BuildMart Construction'],
    },
    {
        name: 'Grace Phakorn',
        phone: '+66877777777',
        email: 'grace@staff.co',
        password: 'Staff@123',
        role: enums_1.UserRole.STAFF,
        storeNames: ['TechZone Electronics'],
    },
];
async function main() {
    console.log('\n🌱  Seeding database...\n');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, { logger: ['error'] });
    const ds = app.get(typeorm_1.DataSource);
    const piService = app.get(purchase_invoices_service_1.PurchaseInvoicesService);
    const ordersService = app.get(orders_service_1.OrdersService);
    const storeRepo = ds.getRepository(store_entity_1.Store);
    const userRepo = ds.getRepository(user_entity_1.User);
    const categoryRepo = ds.getRepository(category_entity_1.Category);
    const subcategoryRepo = ds.getRepository(subcategory_entity_1.Subcategory);
    const menuItemRepo = ds.getRepository(menu_item_entity_1.MenuItem);
    const supplierRepo = ds.getRepository(supplier_entity_1.Supplier);
    console.log('🗑️   Clearing existing data...');
    const tableNames = ds.entityMetadatas.map((e) => `"${e.tableName}"`).join(', ');
    await ds.query(`TRUNCATE TABLE ${tableNames} CASCADE`);
    const hash = (p) => bcrypt.hash(p, 10);
    await userRepo.save(userRepo.create({
        name: 'Super Admin',
        phone: '+66800000000',
        email: 'admin@stockcontrol.com',
        password: await hash('Admin@123'),
        role: enums_1.UserRole.ADMIN,
        stores: [],
    }));
    console.log('👤  Super admin  →  +66800000000 / Admin@123\n');
    const storeMap = new Map();
    for (const config of stores) {
        const store = await storeRepo.save(storeRepo.create(config.store));
        storeMap.set(store.name, store);
    }
    console.log(`🏪  Created ${storeMap.size} stores\n`);
    const usersByStore = new Map();
    for (const u of seedUsers) {
        const assignedStores = u.storeNames.map((n) => {
            const s = storeMap.get(n);
            if (!s)
                throw new Error(`Store not found: "${n}"`);
            return s;
        });
        const user = await userRepo.save(userRepo.create({ ...u, password: await hash(u.password), stores: assignedStores }));
        for (const s of assignedStores) {
            const list = usersByStore.get(s.name) ?? [];
            list.push(user);
            usersByStore.set(s.name, list);
        }
    }
    console.log(`👥  Created ${seedUsers.length} users\n`);
    for (const config of stores) {
        const store = storeMap.get(config.store.name);
        const storeUsers = usersByStore.get(store.name) ?? [];
        console.log(`🏪  ${store.name}  (${storeUsers.length} users)`);
        let totalItems = 0;
        for (const catDef of config.categories) {
            const category = await categoryRepo.save(categoryRepo.create({ name: catDef.name, store_id: store.id, sortOrder: catDef.sortOrder }));
            for (const subDef of catDef.subcategories) {
                const sub = await subcategoryRepo.save(subcategoryRepo.create({ name: subDef.name, category_id: category.id, sortOrder: subDef.sortOrder }));
                for (const itemDef of subDef.items) {
                    await menuItemRepo.save(menuItemRepo.create({
                        ...itemDef,
                        store_id: store.id,
                        category_id: category.id,
                        subcategory_id: sub.id,
                    }));
                    totalItems++;
                }
            }
        }
        const supplierMap = {};
        for (const sDef of config.suppliers) {
            supplierMap[sDef.name] = await supplierRepo.save(supplierRepo.create({ ...sDef, store_id: store.id }));
        }
        const menuItems = await menuItemRepo.find({ where: { store_id: store.id } });
        const itemByName = (n) => {
            const found = menuItems.find((m) => m.name === n);
            if (!found)
                throw new Error(`Item not found: "${n}" in ${store.name}`);
            return found;
        };
        let invIdx = 1;
        for (const invDef of config.purchaseInvoices) {
            const invoice = await piService.create(store.id, {
                supplierId: supplierMap[invDef.supplierName].id,
                invoiceNumber: `PI-${store.name.replace(/\s+/g, '').slice(0, 3).toUpperCase()}-${String(invIdx++).padStart(3, '0')}`,
                invoiceDate: invDef.invoiceDate,
                items: invDef.items.map((i) => ({
                    menuItemId: itemByName(i.name).id,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                })),
            });
            await piService.receive(invoice.id, store.id);
        }
        const orderUserId = storeUsers[0]?.id ?? '';
        for (const orderDef of config.orders) {
            const order = await ordersService.create(store.id, orderUserId, {
                tableNumber: orderDef.tableNumber,
                customerName: orderDef.customerName,
                items: orderDef.items.map((i) => ({
                    menuItemId: itemByName(i.name).id,
                    quantity: i.quantity,
                })),
            });
            const target = orderDef.status;
            const chain = [];
            if (target !== enums_1.OrderStatus.PENDING)
                chain.push(enums_1.OrderStatus.CONFIRMED);
            if ([enums_1.OrderStatus.PREPARING, enums_1.OrderStatus.READY, enums_1.OrderStatus.DELIVERED].includes(target))
                chain.push(enums_1.OrderStatus.PREPARING);
            if ([enums_1.OrderStatus.READY, enums_1.OrderStatus.DELIVERED].includes(target))
                chain.push(enums_1.OrderStatus.READY);
            if (target === enums_1.OrderStatus.DELIVERED)
                chain.push(enums_1.OrderStatus.DELIVERED);
            for (const s of chain)
                await ordersService.updateStatus(order.id, store.id, s);
        }
        console.log(`   ✓ ${totalItems} items · ${config.purchaseInvoices.length} invoices · ${config.orders.length} orders`);
    }
    console.log('\n✅  Seed complete!\n');
    console.log('─────────────────────────────────────────────────────────────');
    console.log('Login with phone number:');
    console.log(`  ${'+66800000000'.padEnd(16)} Admin@123    ← Super Admin (all stores)`);
    for (const u of seedUsers) {
        const storeList = u.storeNames.join(', ');
        console.log(`  ${u.phone.padEnd(16)} ${u.password.padEnd(14)} ${u.role.padEnd(9)} [${storeList}]`);
    }
    console.log('─────────────────────────────────────────────────────────────\n');
    await app.close();
    process.exit(0);
}
main().catch((e) => {
    console.error('❌  Seed failed:', e.message);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map