const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const products = [
  {
    name: 'Imperial Emerald Crystal',
    description: 'A stunning 5-carat deep green emerald crystal from the northern ranges. Exceptional clarity and natural form.',
    price: 4500,
    category: 'Gemstones',
    images: [{ public_id: 'emerald1', url: 'https://images.unsplash.com/photo-1596708059430-ba2990a47f3b?q=80&w=600&h=800&auto=format&fit=crop' }],
    stock: 2,
    rating: 5,
    numOfReviews: 12,
    featured: true
  },
  {
    name: 'Raw Blue Sapphire',
    description: 'Natural unheated blue sapphire specimen. Perfect for collectors or custom jewelry settings.',
    price: 1200,
    category: 'Gemstones',
    images: [{ public_id: 'sapphire1', url: 'https://images.unsplash.com/photo-1615111784767-4d762198031d?q=80&w=600&h=800&auto=format&fit=crop' }],
    stock: 5,
    rating: 4.8,
    numOfReviews: 8
  },
  {
    name: 'Amethyst Cathedral Geode',
    description: 'Large amethyst geode with deep purple crystals. A magnificent centerpiece for any room.',
    price: 850,
    category: 'Minerals',
    images: [{ public_id: 'amethyst1', url: 'https://images.unsplash.com/photo-1523467136207-640bf019a76d?q=80&w=600&h=800&auto=format&fit=crop' }],
    stock: 3,
    rating: 4.9,
    numOfReviews: 15,
    featured: true
  },
  {
    name: 'Midnight Obsidian Sphere',
    description: 'Polished black obsidian sphere. Volcanic glass known for its depth and mirror-like surface.',
    price: 120,
    category: 'Raw Gems',
    images: [{ public_id: 'obsidian1', url: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=600&h=800&auto=format&fit=crop' }],
    stock: 10,
    rating: 4.7,
    numOfReviews: 22
  },
  {
    name: 'Golden Pyrite Specimen',
    description: "Fool's gold in its most majestic cubic form. Brilliant metallic luster and sharp geometry.",
    price: 75,
    category: 'Minerals',
    images: [{ public_id: 'pyrite1', url: 'https://images.unsplash.com/photo-1635332617670-3f4129bb888f?q=80&w=600&h=800&auto=format&fit=crop' }],
    stock: 20,
    rating: 4.5,
    numOfReviews: 45
  },
  {
    name: 'Northern Star Diamond',
    description: 'Ethically mined 1-carat brilliant cut diamond. Superior fire and brilliance.',
    price: 8900,
    category: 'Gemstones',
    images: [{ public_id: 'diamond1', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&h=800&auto=format&fit=crop' }],
    stock: 1,
    rating: 5,
    numOfReviews: 3,
    featured: true
  }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Product = require('./src/models/Product');
        
        // Clear existing products
        await Product.deleteMany({});
        console.log('Products cleared');

        // Insert new products
        await Product.insertMany(products);
        console.log('Products seeded successfully');
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
