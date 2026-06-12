import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Cake, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { user, cart, logout, darkMode, toggleDarkMode } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 dark:bg-[#121212]/90 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100 dark:border-[#222222] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Cake className="h-8 w-8 text-primary" />
              <span className="font-serif text-2xl font-bold text-secondary dark:text-white">SweetDelights</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider">
            <Link to="/" className="text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Home</Link>
            <Link to="/catalog" className="text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Cakes</Link>
            <Link to="/about" className="text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">About</Link>
            <Link to="/support" className="text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Support</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-primary hover:text-accent transition-colors font-extrabold">
                Admin Panel
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary p-2.5 transition-all duration-300 rounded-xl hover:bg-gray-50 dark:hover:bg-[#252528] relative overflow-hidden group cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <div className="relative h-5.5 w-5.5 transition-transform duration-500 transform group-hover:rotate-12 flex items-center justify-center">
                {darkMode ? (
                  <Sun className="h-5.5 w-5.5 text-amber-400 fill-amber-300 animate-fadeIn" />
                ) : (
                  <Moon className="h-5.5 w-5.5 text-secondary dark:text-gray-300 animate-fadeIn" />
                )}
              </div>
            </button>

            <Link to="/cart" className="text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary relative p-2 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow animate-scaleUp">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-1.5 text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-xs font-semibold">
                  <User className="h-4.5 w-4.5 text-primary" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-5 py-2.5 bg-primary hover:bg-accent text-white font-bold rounded-xl transition-all text-xs flex items-center gap-1.5 shadow-sm">
                <User className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="text-secondary dark:text-gray-300 p-2 rounded-lg"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-amber-400 fill-amber-300" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-secondary dark:text-gray-300 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#18181b] border-t border-gray-100 dark:border-[#222222] shadow-lg py-4 px-6 space-y-4 text-sm font-semibold transition-colors duration-300">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary">Home</Link>
          <Link to="/catalog" onClick={() => setIsOpen(false)} className="block text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary">Cakes</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary">About</Link>
          <Link to="/support" onClick={() => setIsOpen(false)} className="block text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary">Support</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-primary hover:text-accent font-bold">
              Admin Panel
            </Link>
          )}
          <Link to="/cart" onClick={() => setIsOpen(false)} className="block text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" /> Cart ({cart.totalItems})
          </Link>
          {user ? (
            <div className="pt-4 border-t border-gray-100 dark:border-[#222222] space-y-4">
              <Link to="/profile" onClick={() => setIsOpen(false)} className="block text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-primary flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Account Profile
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogoutClick();
                }}
                className="w-full text-left text-red-500 flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-primary flex items-center gap-2">
              <User className="h-5 w-5" /> Login / Signup
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
