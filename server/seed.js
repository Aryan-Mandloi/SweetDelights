const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const Cake = require('./models/Cake');
const Category = require('./models/Category');

dotenv.config();

const categoriesData = [
  { categoryName: 'Signature' },
  { categoryName: 'Chocolate' },
  { categoryName: 'Fruit' },
  { categoryName: 'Celebration' }
];

const cakesData = [
  {
    name: 'Truffle Chocolate Decadence',
    flavor: 'Double Dark Chocolate',
    price: 25.99,
    description: 'Rich dark chocolate cake layers covered in smooth chocolate truffle frosting and glazed with shiny chocolate ganache.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 15,
    rating: 4.9,
    categoryName: 'Chocolate'
  },
  {
    name: 'Strawberry Dream Chiffon',
    flavor: 'Fresh Strawberry & Vanilla Cream',
    price: 22.50,
    description: 'Light vanilla sponge layers stuffed with freshly chopped strawberries and premium whipped cream cheese frosting.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 12,
    rating: 4.8,
    categoryName: 'Fruit'
  },
  {
    name: 'Classic Madagascar Vanilla Bean',
    flavor: 'Madagascar Custard & Vanilla',
    price: 18.00,
    description: 'Traditional and ultra-moist sponge cake infused with pure Madagascar vanilla extract, layered with delicate vanilla custard.',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 20,
    rating: 4.7,
    categoryName: 'Signature'
  },
  {
    name: 'Red Velvet Majestic Rose',
    flavor: 'Red Velvet & Tangy Cream Cheese',
    price: 28.00,
    description: 'Exquisite deep red velvet cake layers with a light touch of cocoa, finished with premium tangy cream cheese frosting and edible roses.',
    image: 'https://images.unsplash.com/photo-1616260847846-5e5d38a8e1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 10,
    rating: 4.9,
    categoryName: 'Celebration'
  },
  {
    name: 'Salted Caramel Hazelnut Praline',
    flavor: 'Salted Caramel & Roasted Hazelnut',
    price: 29.50,
    description: 'Buttery caramel layers layered with rich salted caramel sauce, toasted hazelnuts, and creamy Swiss meringue buttercream.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 8,
    rating: 4.9,
    categoryName: 'Signature'
  },
  {
    name: 'Black Forest Symphony',
    flavor: 'Dark Cherry & Chocolate Shavings',
    price: 24.00,
    description: 'Delectable chocolate layers soaked in sweet cherry juice, filled with tart dark cherries and fluffy whipped cream.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 14,
    rating: 4.6,
    categoryName: 'Chocolate'
  },
  {
    name: 'Zesty Lemon Blueberry Bliss',
    flavor: 'Lemon Sponge & Wild Blueberries',
    price: 23.99,
    description: 'Bright lemon-infused sponge cake layered with sweet wild blueberry compote and silky cream cheese frosting.',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 10,
    rating: 4.8,
    categoryName: 'Fruit'
  },
  {
    name: 'Royal Wedding Tier Cake',
    flavor: 'White Chocolate & Raspberry',
    price: 95.00,
    description: 'A magnificent two-tiered luxury cake featuring white chocolate sponge and tart raspberry coulis, decorated with elegant gold flakes.',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 5,
    rating: 5.0,
    categoryName: 'Celebration'
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to database to seed...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully.');

    // Clear existing collections
    console.log('Clearing old collections...');
    await User.deleteMany({});
    await Cake.deleteMany({});
    await Category.deleteMany({});
    console.log('Collections cleared.');

    // Seed Categories
    console.log('Seeding categories...');
    const seededCategories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${seededCategories.length} categories.`);

    // Seed Cakes with resolved category ObjectId mapping
    console.log('Seeding cakes...');
    const cakesWithCategoryIds = cakesData.map(cake => {
      const matchedCategory = seededCategories.find(
        cat => cat.categoryName === cake.categoryName
      );
      return {
        ...cake,
        category: matchedCategory ? matchedCategory._id : seededCategories[0]._id
      };
    });

    const seededCakes = await Cake.insertMany(cakesWithCategoryIds);
    console.log(`Seeded ${seededCakes.length} premium cakes.`);

    // Seed users (Admin and Customer)
    console.log('Seeding premium users (Admin and Customer)...');
    
    // Hash password helper is in UserSchema pre('save'), so we don't need to manually hash, just insert through User.create or save
    const adminUser = await User.create({
      name: 'Executive Chef Admin',
      email: 'admin@sweetdelights.com',
      password: 'adminpassword123',
      phone: '+1 (555) 777-8888',
      address: '1 Bakery Lane, Sweetville',
      role: 'admin'
    });

    const normalCustomer = await User.create({
      name: 'Gourmet Lover',
      email: 'customer@sweetdelights.com',
      password: 'customerpassword123',
      phone: '+1 (555) 123-4567',
      address: '42 Chocolate Boulevard, Frosting City',
      role: 'user'
    });

    console.log('Seeding completed successfully!');
    console.log('\n--- DEFAULT DEMO LOGIN CREDENTIALS ---');
    console.log('1. Admin Account:');
    console.log('   Email: admin@sweetdelights.com');
    console.log('   Password: adminpassword123');
    console.log('2. Customer Account:');
    console.log('   Email: customer@sweetdelights.com');
    console.log('   Password: customerpassword123');
    console.log('---------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
