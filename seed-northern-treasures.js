const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const User = require('./src/models/User');

const categoriesData = [
    {
        name: 'Emeralds',
        description: 'Rare, vivid green emeralds from the northern ranges.',
        image: 'https://images.unsplash.com/photo-1596708059430-ba2990a47f3b?q=80&w=1000'
    },
    {
        name: 'Sapphires',
        description: 'Celestial blue and rare padparadscha sapphires.',
        image: 'https://images.unsplash.com/photo-1615111784524-394dd5897005?q=80&w=1000'
    },
    {
        name: 'Rubies',
        description: 'Pigeon-blood red rubies of exceptional fire and depth.',
        image: 'https://images.unsplash.com/photo-1599819717147-380ff9822a7f?q=80&w=1000'
    },
    {
        name: 'Diamonds',
        description: 'Flawless white and rare colored diamonds from the vault.',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000'
    },
    {
        name: 'Rare Minerals',
        description: 'Unique geological specimens for collectors.',
        image: 'https://images.unsplash.com/photo-1635332617670-3f4129bb888f?q=80&w=1000'
    },
    {
        name: 'Quartz Fragments',
        description: 'Crystalline structures of extreme purity.',
        image: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1000'
    }
];

const productsData = [
    {
        name: 'Imperial Emerald Crystal',
        description: 'A museum-grade 8-carat emerald crystal with exceptional clarity and a deep, forest-green hue.',
        price: 12500,
        stock: 1,
        featured: true,
        images: [{ public_id: 'nt_em_1', url: 'https://images.unsplash.com/photo-1626308346445-9b44dc744f6f?q=80&w=1000' }],
        categoryName: 'Emeralds'
    },
    {
        name: 'Azure Star Sapphire',
        description: 'A 12-carat cabochon-cut sapphire displaying a perfect six-rayed star under direct light.',
        price: 8900,
        stock: 1,
        featured: true,
        images: [{ public_id: 'nt_sap_1', url: 'https://images.unsplash.com/photo-1615111784524-394dd5897005?q=80&w=1000' }],
        categoryName: 'Sapphires'
    },
    {
        name: 'Blood-Red Heart Ruby',
        description: 'A stunning 4-carat ruby with intense pigeon-blood saturation. Mined from the legendary deep veins.',
        price: 9500,
        stock: 2,
        featured: true,
        images: [{ public_id: 'nt_rub_1', url: 'https://images.unsplash.com/photo-1599819717147-380ff9822a7f?q=80&w=1000' }],
        categoryName: 'Rubies'
    },
    {
        name: 'Northern Star Diamond',
        description: 'A D-color, internally flawless 2-carat diamond. Sourced from the highest peak mines.',
        price: 22000,
        stock: 1,
        featured: true,
        images: [{ public_id: 'nt_dia_1', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000' }],
        categoryName: 'Diamonds'
    },
    {
        name: 'Deep Sea Aquamarine',
        description: 'A flawless, 5-carat aquamarine with the purity of arctic waters.',
        price: 4200,
        stock: 3,
        images: [{ public_id: 'nt_aq_1', url: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=1000' }],
        categoryName: 'Emeralds'
    },
    {
        name: 'Golden Pyrite Cube',
        description: 'Perfectly cubic pyrite crystals in a dark matrix. A masterclass in natural geometry.',
        price: 450,
        stock: 8,
        images: [{ public_id: 'nt_min_2', url: 'https://images.unsplash.com/photo-1635332617670-3f4129bb888f?q=80&w=1000' }],
        categoryName: 'Rare Minerals'
    },
    {
        name: 'Midnight Tourmaline',
        description: 'A bi-color tourmaline shard with a transition from deep obsidian to vivid pink.',
        price: 2200,
        stock: 4,
        images: [{ public_id: 'nt_em_2', url: 'https://images.unsplash.com/photo-1602127398108-94e27da3fce3?q=80&w=1000' }],
        categoryName: 'Emeralds'
    },
    {
        name: 'Aurora Opal Specimen',
        description: 'An Ethiopian Welo opal with a play-of-color resembling the dancing lights of the north.',
        price: 3800,
        stock: 2,
        images: [{ public_id: 'nt_sap_2', url: 'https://images.unsplash.com/photo-1617117832625-54778bed503a?q=80&w=1000' }],
        categoryName: 'Sapphires'
    },
    {
        name: 'Smoky Quartz Obelisk',
        description: 'A 10-inch hand-polished smoky quartz obelisk for architectural decor.',
        price: 750,
        stock: 5,
        images: [{ public_id: 'nt_q_2', url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1000' }],
        categoryName: 'Quartz Fragments'
    },
    {
        name: 'Collector\'s Rose Amethyst',
        description: 'A rare purple amethyst specimen, professionally cut for museum display.',
        price: 5600,
        stock: 1,
        images: [{ public_id: 'nt_rub_2', url: 'https://images.unsplash.com/photo-1523467136207-640bf019a76d?q=80&w=1000' }],
        categoryName: 'Rubies'
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Expanding the Vault...');

        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('No Admin User found.');
            process.exit(1);
        }

        // Clear existing data
        await Product.deleteMany({});
        await Category.deleteMany({});
        console.log('Vault cleared for expansion.');

        // Insert Categories
        const createdCategories = await Category.insertMany(categoriesData);
        console.log(`Seeded ${createdCategories.length} categories.`);

        // Insert Products
        const finalProducts = productsData.map(p => {
            const cat = createdCategories.find(c => c.name === p.categoryName);
            return {
                ...p,
                category: cat._id,
                user: admin._id
            };
        });

        for (const prod of finalProducts) {
            await Product.create(prod);
        }
        console.log(`Seeded ${finalProducts.length} diverse premium products.`);

        console.log('Northern Treasures Vault Expansion complete.');
        process.exit(0);
    } catch (err) {
        console.error('Expansion Failed:', err);
        process.exit(1);
    }
};

seed();
