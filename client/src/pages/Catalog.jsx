import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Star, Heart, Scale, MessageSquare, Plus, CheckCircle, X, ShoppingBag } from 'lucide-react';

const Catalog = () => {
  const { cakes, cakesLoading, addToCart } = useApp();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);

  // Modal specs
  const [configCake, setConfigCake] = useState(null);
  const [customFlavor, setCustomFlavor] = useState('Standard');
  const [customWeight, setCustomWeight] = useState('1kg');
  const [customMessage, setCustomMessage] = useState('');
  const [qty, setQty] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);

  // Extract unique categories
  const categories = ['All', ...new Set(cakes.map(c => c.category?.categoryName).filter(Boolean))];

  const handleFavorite = (cakeId) => {
    if (favorites.includes(cakeId)) {
      setFavorites(favorites.filter(id => id !== cakeId));
    } else {
      setFavorites([...favorites, cakeId]);
    }
  };

  const handleOpenPersonalizer = (cake) => {
    setConfigCake(cake);
    setCustomFlavor('Standard');
    setCustomWeight('1kg');
    setCustomMessage('');
    setQty(1);
    setAddedAlert(false);
  };

  const handleConfirmAddToCart = async () => {
    if (!configCake) return;
    const res = await addToCart(configCake, qty, customWeight, customFlavor, customMessage);
    if (res.success) {
      setAddedAlert(true);
      setTimeout(() => {
        setAddedAlert(false);
        setConfigCake(null);
      }, 1500);
    }
  };

  // Math for weight multipliers
  const getWeightMultiplier = (w) => {
    const p = parseFloat(w);
    return isNaN(p) ? 1 : p;
  };

  // Filter list
  const filteredCakes = cakes.filter((cake) => {
    const matchesSearch =
      cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cake.flavor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cake.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'All' ||
      cake.category?.categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-cream dark:bg-[#121212] min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary dark:text-white font-serif mb-4">Our Cake Catalog</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Taste our freshly-baked, luxury artisanal cakes customized exclusively to highlight your celebrations!
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-md mb-10 flex flex-col md:flex-row gap-4 justify-between items-center border border-secondary/5 dark:border-[#2d2d30] transition-colors duration-300">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search flavors, names, ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-[#2d2d30] dark:bg-[#151518] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs transition-all"
            />
            <Search className="absolute left-3.5 top-3.5 text-gray-400 h-4 w-4" />
          </div>

          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-cream dark:bg-[#2d2d30] text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#323235]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog loader */}
        {cakesLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-xs font-bold text-primary">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            Preparing gourmet recipes...
          </div>
        ) : filteredCakes.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-md border border-secondary/5 dark:border-[#2d2d30] text-gray-500 dark:text-gray-400 font-serif text-lg font-semibold">
            No cakes found matching your selection.
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCakes.map((cake) => (
              <div
                key={cake._id}
                className="bg-white dark:bg-[#1e1e1e] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-secondary/5 dark:border-[#2d2d30] flex flex-col justify-between group"
              >
                <div className="relative overflow-hidden h-60 bg-cream dark:bg-[#151518] shadow-inner">
                  <img
                    src={cake.image}
                    alt={cake.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleFavorite(cake._id)}
                    className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md backdrop-blur-sm transition-colors duration-300 ${
                      favorites.includes(cake._id)
                        ? 'bg-primary text-white'
                        : 'bg-white/80 dark:bg-[#252528]/80 hover:bg-primary hover:text-white text-gray-500 dark:text-gray-300'
                    }`}
                  >
                    <Heart className={`h-4.5 w-4.5 ${favorites.includes(cake._id) ? 'fill-current' : ''}`} />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 dark:bg-[#1e1e1e]/90 dark:text-white backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase font-extrabold tracking-wider text-secondary shadow-sm">
                      {cake.category?.categoryName || 'Boutique'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-secondary dark:text-white leading-tight truncate" title={cake.name}>
                      {cake.name}
                    </h3>
                    <p className="text-xs text-primary font-semibold mt-0.5">{cake.flavor}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-2 line-clamp-2">
                      {cake.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-[#2d2d30]">
                    <span className="text-xl font-black text-secondary dark:text-white">
                      ₹{cake.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleOpenPersonalizer(cake)}
                      className="px-5 py-2.5 bg-secondary dark:bg-[#2d2d30] hover:bg-primary dark:hover:bg-primary text-white font-bold rounded-xl transition-colors text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PREMIUM PERSONALIZATION MODAL */}
      {configCake && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e1e22] rounded-3xl max-w-lg w-full p-8 shadow-2xl relative border border-secondary/5 dark:border-[#2d2d32] animate-scaleUp transition-colors duration-300">
            <button
              onClick={() => setConfigCake(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-secondary dark:hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {addedAlert ? (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-secondary dark:text-white mb-1">Added to Cart!</h3>
                <p className="text-xs text-gray-400">SweetDelights configured successfully.</p>
              </div>
            ) : (
              <div className="space-y-6 text-xs font-semibold text-gray-600 dark:text-gray-300">
                <div className="flex gap-4 items-center pb-4 border-b dark:border-[#2d2d32]">
                  <img
                    src={configCake.image}
                    alt={configCake.name}
                    className="w-16 h-16 object-cover rounded-xl shadow-inner bg-cream dark:bg-[#151518]"
                  />
                  <div>
                    <h3 className="font-serif text-xl font-bold text-secondary dark:text-white">{configCake.name}</h3>
                    <p className="text-primary font-bold">{configCake.flavor}</p>
                  </div>
                </div>

                {/* Weight selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-gray-500 dark:text-gray-455 uppercase tracking-wider text-[10px]">
                    <Scale className="h-4 w-4 text-primary" /> Select Cake Weight
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['0.5kg', '1kg', '2kg', '3kg'].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setCustomWeight(w)}
                        className={`py-2 rounded-lg font-bold border transition-all ${
                          customWeight === w
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 dark:border-[#2d2d32] text-gray-550 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#252528]'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flavor customization */}
                <div className="space-y-2">
                  <label className="text-gray-500 dark:text-gray-455 uppercase tracking-wider text-[10px] block">
                    Choose Frosting Flavor
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Standard', 'Extra Chocolate', 'Creamy Vanilla'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setCustomFlavor(f)}
                        className={`py-2 rounded-lg font-bold border transition-all ${
                          customFlavor === f
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 dark:border-[#2d2d32] text-gray-555 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#252528]'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom message bubble */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-gray-500 dark:text-gray-455 uppercase tracking-wider text-[10px]">
                    <MessageSquare className="h-4 w-4 text-primary" /> Message On Cake (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength="50"
                    placeholder="e.g. Happy Birthday Sarah! 🎂"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#2d2d32] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                  />
                </div>

                {/* Quantity adjuster */}
                <div className="flex items-center justify-between pt-4 border-t dark:border-[#2d2d32]">
                  <div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-455 uppercase font-extrabold block">Personalized Price</span>
                    <span className="text-2xl font-black text-secondary dark:text-white">
                      ₹{(configCake.price * qty * getWeightMultiplier(customWeight)).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border dark:border-[#2d2d32] rounded-lg bg-cream dark:bg-[#151518]">
                      <button
                        type="button"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="px-3 py-1.5 hover:bg-gray-150 dark:hover:bg-[#252528] rounded text-secondary dark:text-white"
                      >
                        -
                      </button>
                      <span className="px-4 font-bold text-secondary dark:text-white text-sm">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(qty + 1)}
                        className="px-3 py-1.5 hover:bg-gray-150 dark:hover:bg-[#252528] rounded text-secondary dark:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmAddToCart}
                      className="px-6 py-3 bg-primary hover:bg-accent text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-[11px] uppercase tracking-wider"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
