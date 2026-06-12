import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary dark:bg-[#0a0a0c] text-white pt-16 pb-8 border-t border-transparent dark:border-[#1c1c1f] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Cake className="h-8 w-8 text-primary" />
              <span className="font-serif text-2xl font-bold text-white">SweetDelights</span>
            </div>
            <p className="text-gray-400 mb-6">
              Crafting sweet memories for all your special occasions. Every cake is a masterpiece baked with love.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Instagram className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Facebook className="h-6 w-6" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 font-serif">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/catalog" className="text-gray-400 hover:text-primary transition-colors">Cake Catalog</Link></li>
              <li><Link to="/catalog" className="text-gray-400 hover:text-primary transition-colors">Custom Orders</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 font-serif">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/support#faq" className="text-gray-400 hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/support#policy" className="text-gray-400 hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/support#contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SweetDelights Online Cake Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
