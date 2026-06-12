const mongoose = require('mongoose');
const User = require('./models/User');
const Cake = require('./models/Cake');
const Category = require('./models/Category');

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
    price: 2079,
    description: 'Rich dark chocolate cake layers covered in smooth chocolate truffle frosting and glazed with shiny chocolate ganache.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 15,
    rating: 4.9,
    categoryName: 'Chocolate'
  },
  {
    name: 'Strawberry Dream Chiffon',
    flavor: 'Fresh Strawberry & Vanilla Cream',
    price: 1800,
    description: 'Light vanilla sponge layers stuffed with freshly chopped strawberries and premium whipped cream cheese frosting.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 12,
    rating: 4.8,
    categoryName: 'Fruit'
  },
  {
    name: 'Classic Madagascar Vanilla Bean',
    flavor: 'Madagascar Custard & Vanilla',
    price: 1440,
    description: 'Traditional and ultra-moist sponge cake infused with pure Madagascar vanilla extract, layered with delicate vanilla custard.',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 20,
    rating: 4.7,
    categoryName: 'Signature'
  },
  {
    name: 'Red Velvet Majestic Rose',
    flavor: 'Red Velvet & Tangy Cream Cheese',
    price: 2240,
    description: 'Exquisite deep red velvet cake layers with a light touch of cocoa, finished with premium tangy cream cheese frosting and edible roses.',
    image: 'https://images.unsplash.com/photo-1616260847846-5e5d38a8e1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 10,
    rating: 4.9,
    categoryName: 'Celebration'
  },
  {
    name: 'Salted Caramel Hazelnut Praline',
    flavor: 'Salted Caramel & Roasted Hazelnut',
    price: 2360,
    description: 'Buttery caramel layers layered with rich salted caramel sauce, toasted hazelnuts, and creamy Swiss meringue buttercream.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 8,
    rating: 4.9,
    categoryName: 'Signature'
  },
  {
    name: 'Black Forest Symphony',
    flavor: 'Dark Cherry & Chocolate Shavings',
    price: 1920,
    description: 'Delectable chocolate layers soaked in sweet cherry juice, filled with tart dark cherries and fluffy whipped cream.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 14,
    rating: 4.6,
    categoryName: 'Chocolate'
  },
  {
    name: 'Zesty Lemon Blueberry Bliss',
    flavor: 'Lemon Sponge & Wild Blueberries',
    price: 1919,
    description: 'Bright lemon-infused sponge cake layered with sweet wild blueberry compote and silky cream cheese frosting.',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 10,
    rating: 4.8,
    categoryName: 'Fruit'
  },
  {
    name: 'Royal Wedding Tier Cake',
    flavor: 'White Chocolate & Raspberry',
    price: 7600,
    description: 'A magnificent two-tiered luxury cake featuring white chocolate sponge and tart raspberry coulis, decorated with elegant gold flakes.',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 5,
    rating: 5.0,
    categoryName: 'Celebration'
  }
];

const seedDB = async () => {
  try {
    await User.deleteMany({});
    await Cake.deleteMany({});
    await Category.deleteMany({});

    const seededCategories = await Category.insertMany(categoriesData);

    const cakesWithCategoryIds = cakesData.map(cake => {
      const matchedCategory = seededCategories.find(
        cat => cat.categoryName === cake.categoryName
      );
      return {
        ...cake,
        category: matchedCategory ? matchedCategory._id : seededCategories[0]._id
      };
    });

    await Cake.insertMany(cakesWithCategoryIds);

    await User.create({
      name: 'Executive Chef Admin',
      email: 'admin@sweetdelights.com',
      password: 'adminpassword123',
      phone: '+1 (555) 777-8888',
      address: '1 Bakery Lane, Sweetville',
      role: 'admin'
    });

    await User.create({
      name: 'Gourmet Lover',
      email: 'customer@sweetdelights.com',
      password: 'customerpassword123',
      phone: '+1 (555) 123-4567',
      address: '42 Chocolate Boulevard, Frosting City',
      role: 'user'
    });

    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

module.exports = seedDB;
