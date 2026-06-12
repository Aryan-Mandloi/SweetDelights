import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, Minus, ShoppingBag, MessageSquare, Scale, ChevronRight } from 'lucide-react';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart } = useApp();
  const navigate = useNavigate();

  const shippingCost = cart.totalPrice > 0 ? (cart.totalPrice > 50 ? 0 : 5) : 0;
  const grandTotal = cart.totalPrice + shippingCost;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream dark:bg-[#121212] px-4 transition-colors duration-300">
        <div className="text-center max-w-md p-8 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl dark:shadow-none border border-transparent dark:border-[#2d2d30] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-primary animate-bounce" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-secondary dark:text-white mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
            Explore our curated, artisanal cake catalog and satisfy your SweetDelights cravings!
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-accent text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-sm"
          >
            Browse Cakes
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-[#121212] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-secondary dark:text-white mb-10 text-center relative after:content-[''] after:block after:w-16 after:h-1 after:bg-primary after:mx-auto after:mt-3">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item, index) => {
              const cake = item.cakeId;
              if (!cake) return null;
              
              const itemKey = `${cake._id}-${item.selectedFlavor}-${item.weight}-${index}`;
              
              return (
                <div
                  key={itemKey}
                  className="bg-white dark:bg-[#1e1e1e] border border-transparent dark:border-[#2d2d30] rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-6 items-center"
                >
                  {/* Image */}
                  <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-inner bg-cream dark:bg-[#151518] relative">
                    <img
                      src={cake.image}
                      alt={cake.name}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-secondary dark:text-white">{cake.name}</h3>
                        <p className="text-primary text-sm font-semibold">{cake.flavor}</p>
                      </div>
                      <span className="font-bold text-secondary dark:text-white text-lg">
                        ₹{(item.subtotal).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-gray-500 font-medium pt-1">
                      <span className="flex items-center gap-1 bg-cream dark:bg-[#2d2d30] px-2.5 py-1 rounded-full text-secondary dark:text-gray-300">
                        <Scale className="h-3.5 w-3.5 text-primary" />
                        {item.weight}
                      </span>
                      <span className="flex items-center gap-1 bg-cream dark:bg-[#2d2d30] px-2.5 py-1 rounded-full text-secondary dark:text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                        Flavor: {item.selectedFlavor}
                      </span>
                    </div>

                    {item.message && (
                      <div className="flex items-start gap-2 bg-pink-50/50 dark:bg-pink-950/10 p-2.5 rounded-lg border border-pink-100/50 dark:border-pink-900/30 text-left">
                        <MessageSquare className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                          "{item.message}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-6 w-full sm:w-auto border-t sm:border-t-0 dark:border-[#2d2d30] pt-4 sm:pt-0">
                    <div className="flex items-center bg-cream dark:bg-[#151518] rounded-full p-1 border border-secondary/10 dark:border-[#2d2d30] shadow-inner dark:shadow-none">
                      <button
                        onClick={() => updateCartItem(cake._id, item.quantity - 1, item.selectedFlavor, item.weight)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-secondary dark:text-white hover:bg-white dark:hover:bg-[#2d2d30] hover:text-primary transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-4 font-bold text-secondary dark:text-white text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(cake._id, item.quantity + 1, item.selectedFlavor, item.weight)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-secondary dark:text-white hover:bg-white dark:hover:bg-[#2d2d30] hover:text-primary transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(cake._id, item.selectedFlavor, item.weight)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full"
                      title="Remove from cart"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Card */}
          <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 shadow-lg border border-secondary/5 dark:border-[#2d2d30] sticky top-24 transition-colors duration-300">
            <h2 className="text-2xl font-serif font-bold text-secondary dark:text-white mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-secondary dark:text-white">₹{cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Delivery Charge</span>
                <span className="font-semibold text-secondary dark:text-white">
                  {shippingCost === 0 ? (
                    <span className="text-green-600 dark:text-green-455 font-bold">FREE</span>
                  ) : (
                    `₹${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-[11px] text-primary bg-primary/5 dark:bg-primary/10 p-2 rounded-lg leading-relaxed">
                  💡 Free delivery on orders over <strong>₹50.00</strong>! Add <strong>₹{(50 - cart.totalPrice).toFixed(2)}</strong> more to save.
                </p>
              )}
              <hr className="border-gray-100 dark:border-[#2d2d30]" />
              <div className="flex justify-between text-lg font-bold text-secondary dark:text-white pt-2">
                <span>Grand Total</span>
                <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-primary hover:bg-accent text-white font-bold rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group text-sm"
            >
              Proceed to Checkout
              <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/catalog"
              className="block text-center text-xs text-primary hover:text-accent font-semibold mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
