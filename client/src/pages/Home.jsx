import React from 'react';
import { Cake, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const featuredCakes = [
    { id: 1, name: 'Truffle Chocolate', price: 25.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 2, name: 'Strawberry Dream', price: 22.50, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 3, name: 'Vanilla Vanilla', price: 18.00, image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-light dark:bg-[#1e1713] overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-secondary dark:text-white mb-6 leading-tight">
              Baking Dreams <br/> Into <span className="text-primary">Reality</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Handcrafted with love and the finest ingredients. Order custom cakes for birthdays, weddings, or just because you deserve a treat.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/catalog" className="btn-primary px-8 py-4 text-lg w-full sm:w-auto">Shop Now</Link>
              <Link to="/catalog" className="btn-outline px-8 py-4 text-lg w-full sm:w-auto">Custom Order</Link>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]"></div>
            <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Beautiful Cake" className="relative z-10 w-full max-w-md mx-auto rounded-[40px] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border-8 border-white dark:border-[#2a2a2d]" />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-white dark:bg-[#121212] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary dark:text-white mb-4">Our Signature Cakes</h2>
            <p className="text-gray-500 dark:text-gray-450 max-w-2xl mx-auto">Discover our most loved creations, baked fresh daily with premium ingredients.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredCakes.map((cake) => (
              <div key={cake.id} className="card group">
                <div className="relative overflow-hidden h-72">
                  <img src={cake.image} alt={cake.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <button className="absolute top-4 right-4 bg-white/80 dark:bg-[#252528]/90 text-gray-500 dark:text-gray-300 p-2 rounded-full hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-secondary dark:text-white">{cake.name}</h3>
                    <div className="flex items-center text-accent">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{cake.rating}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary mb-4">₹{cake.price.toFixed(2)}</p>
                  <Link to="/catalog" className="w-full text-center block btn-outline hover:btn-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 py-2.5 rounded-full font-semibold">
                    Customize & Add
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
