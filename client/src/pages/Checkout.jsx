import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ArrowLeft, ShoppingBag, CreditCard, Truck, Loader } from 'lucide-react';

const Checkout = () => {
  const { user, token, cart, checkoutOrder } = useApp();
  const navigate = useNavigate();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!token) {
      // Small delay to allow auth state to resolve if loading
    }
  }, [token]);

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Card Payment details states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UPI details state
  const [upiId, setUpiId] = useState('');

  // Prefill details if user exists
  useEffect(() => {
    if (user) {
      setAddress(user.address || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const shippingCost = cart.totalPrice > 50 ? 0 : 5;
  const grandTotal = cart.totalPrice + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) {
      setErrorMsg('Please fill in all delivery details.');
      return;
    }

    if (paymentMethod === 'Card Payment') {
      const cleanCardNo = cardNumber.replace(/\D/g, '');
      const cleanExpiry = cardExpiry.replace(/\D/g, '');
      if (!cardName.trim() || cleanCardNo.length < 15 || cleanExpiry.length < 4 || cardCvv.length < 3) {
        setErrorMsg('Please enter complete credit card details.');
        return;
      }
    }

    if (paymentMethod === 'UPI Payment') {
      if (!upiId.trim() || !upiId.includes('@')) {
        setErrorMsg('Please enter a valid UPI ID (e.g. username@bankname).');
        return;
      }
    }

    setSubmitting(true);
    setErrorMsg('');

    // Prepare items matching Order schema
    const orderItems = cart.items.map((item) => ({
      cakeId: item.cakeId._id || item.cakeId,
      quantity: item.quantity,
      subtotal: item.subtotal,
      message: item.message || '',
      weight: item.weight || '1kg',
      selectedFlavor: item.selectedFlavor || 'Standard',
    }));

    const result = await checkoutOrder({
      orderItems,
      deliveryAddress: address,
      phone,
      paymentMethod,
      totalAmount: grandTotal,
    });

    setSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } else {
      setErrorMsg(result.message || 'Something went wrong during checkout.');
    }
  };

  // If user is not logged in, prompt elegantly
  if (!token) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream dark:bg-[#121212] px-4 transition-colors duration-300">
        <div className="text-center max-w-md p-10 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl dark:shadow-none border border-secondary/5 dark:border-[#2d2d30]">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-secondary dark:text-white mb-3">Login Required</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
            Please log in or register an account to configure your delivery details and place your order.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login?redirect=checkout"
              className="px-8 py-3.5 bg-primary hover:bg-accent text-white font-medium rounded-full transition-all duration-300 shadow-md text-sm"
            >
              Sign In to Checkout
            </Link>
            <Link
              to="/catalog"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors font-medium"
            >
              Or continue browsing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and checkout hasn't succeeded yet
  if (cart.items.length === 0 && !success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream dark:bg-[#121212] px-4 transition-colors duration-300">
        <div className="text-center max-w-md p-10 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl dark:shadow-none border border-transparent dark:border-[#2d2d30]">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-secondary dark:text-white mb-3">No Items in Checkout</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Your cart is currently empty. Let's add some sweet items first!
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-accent text-white font-medium rounded-full transition-all duration-300 shadow-md text-sm"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-cream dark:bg-[#121212] px-4 transition-colors duration-300">
        <div className="text-center max-w-lg p-10 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl dark:shadow-none border border-green-100 dark:border-green-950/20 flex flex-col items-center">
          <div className="w-24 h-24 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
            <ShieldCheck className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-secondary dark:text-white mb-3">Order Placed Successfully!</h2>
          <p className="text-green-600 dark:text-green-455 font-semibold text-sm mb-4">
            Thank you for ordering with SweetDelights!
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-xs max-w-xs leading-relaxed">
            Our master bakers are preheating the ovens. You will be redirected to your profile dashboard shortly to view order statuses.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Loader className="animate-spin h-4 w-4" />
            Loading your dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-[#121212] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/cart" className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm font-semibold">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-4xl font-serif font-bold text-secondary dark:text-white mb-10 text-center relative after:content-[''] after:block after:w-16 after:h-1 after:bg-primary after:mx-auto after:mt-3">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Checkout Details Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-lg dark:shadow-none border border-secondary/5 dark:border-[#2d2d30] space-y-6">
            <h2 className="text-2xl font-serif font-bold text-secondary dark:text-white pb-4 border-b dark:border-[#2d2d30] flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              Delivery Details
            </h2>

            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold border border-red-100 dark:border-red-900/30">
                ❌ {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="address" className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Full Delivery Address *
              </label>
              <textarea
                id="address"
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Apartment/Street, Area, City, Zipcode"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2d2d30] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2d2d30] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-serif font-bold text-secondary dark:text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Method
              </h3>              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 dark:border-[#2d2d30] hover:bg-gray-50 dark:hover:bg-[#252528] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="accent-primary h-4 w-4"
                  />
                  <div>
                    <p className="font-bold text-sm">Cash on Delivery</p>
                    <p className="text-[10px] text-gray-555 dark:text-gray-400">Pay inside cash on hand</p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'Card Payment'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 dark:border-[#2d2d30] hover:bg-gray-50 dark:hover:bg-[#252528] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Card Payment"
                    checked={paymentMethod === 'Card Payment'}
                    onChange={() => setPaymentMethod('Card Payment')}
                    className="accent-primary h-4 w-4"
                  />
                  <div>
                    <p className="font-bold text-sm">Card Payment</p>
                    <p className="text-[10px] text-gray-555 dark:text-gray-400">Fast, instant simulated card</p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI Payment'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 dark:border-[#2d2d30] hover:bg-gray-50 dark:hover:bg-[#252528] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="UPI Payment"
                    checked={paymentMethod === 'UPI Payment'}
                    onChange={() => setPaymentMethod('UPI Payment')}
                    className="accent-primary h-4 w-4"
                  />
                  <div>
                    <p className="font-bold text-sm">UPI Payment</p>
                    <p className="text-[10px] text-gray-555 dark:text-gray-400">Pay via virtual UPI ID</p>
                  </div>
                </label>
              </div>
            </div>

            {paymentMethod === 'Card Payment' && (
              <div className="space-y-4 pt-4 border-t dark:border-[#2d2d30] animate-fadeIn">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Secure Card Details
                </h4>
                
                <div className="space-y-3 p-5 rounded-2xl bg-cream/30 dark:bg-[#151518]/50 border border-gray-200/50 dark:border-[#2d2d30]">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500">Cardholder Name *</label>
                    <input
                      type="text"
                      required={paymentMethod === 'Card Payment'}
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2d2d30] dark:bg-[#121212] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500">Card Number *</label>
                    <input
                      type="text"
                      required={paymentMethod === 'Card Payment'}
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const match = val.match(/.{1,4}/g);
                        const formatted = match ? match.join(' ') : '';
                        setCardNumber(formatted.substring(0, 19));
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2d2d30] dark:bg-[#121212] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">Expiration Date *</label>
                      <input
                        type="text"
                        required={paymentMethod === 'Card Payment'}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 2) {
                            val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
                          }
                          setCardExpiry(val.substring(0, 5));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2d2d30] dark:bg-[#121212] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">CVV / CVC *</label>
                      <input
                        type="password"
                        required={paymentMethod === 'Card Payment'}
                        placeholder="•••"
                        maxLength="4"
                        value={cardCvv}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setCardCvv(val.substring(0, 4));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2d2d30] dark:bg-[#121212] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'UPI Payment' && (
              <div className="space-y-4 pt-4 border-t dark:border-[#2d2d30] animate-fadeIn">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  UPI Details
                </h4>
                
                <div className="space-y-3 p-5 rounded-2xl bg-cream/30 dark:bg-[#151518]/50 border border-gray-200/50 dark:border-[#2d2d30]">
                  <div className="space-y-1">
                    <label htmlFor="upiId" className="text-[10px] uppercase font-bold text-gray-500">Virtual Payment Address (UPI ID) *</label>
                    <input
                      type="text"
                      id="upiId"
                      required={paymentMethod === 'UPI Payment'}
                      placeholder="e.g. yourname@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2d2d30] dark:bg-[#121212] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-primary hover:bg-accent text-white font-bold rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-8 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader className="animate-spin h-4 w-4" />
                  Processing Order...
                </>
              ) : (
                `Place Order - ₹${grandTotal.toFixed(2)}`
              )}
            </button>
          </form>

          {/* Cart Summary Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-lg dark:shadow-none border border-secondary/5 dark:border-[#2d2d30]">
              <h3 className="text-lg font-serif font-bold text-secondary dark:text-white mb-4 pb-2 border-b dark:border-[#2d2d30]">
                Your Order
              </h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {cart.items.map((item, index) => {
                  const cake = item.cakeId;
                  if (!cake) return null;
                  return (
                    <div key={index} className="flex gap-4 items-center">
                      <img
                        src={cake.image}
                        alt={cake.name}
                        className="w-12 h-12 object-cover rounded-lg shadow-inner bg-cream dark:bg-[#151518]"
                      />
                      <div className="flex-grow text-xs">
                        <h4 className="font-serif font-bold text-secondary dark:text-white">{cake.name}</h4>
                        <p className="text-gray-400 dark:text-gray-450">Qty: {item.quantity} • {item.weight}</p>
                      </div>
                      <span className="font-bold text-secondary dark:text-white text-xs">
                        ₹{item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 mt-6 pt-4 border-t dark:border-[#2d2d30] text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-secondary dark:text-white">₹{cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-secondary dark:text-white">
                    {shippingCost === 0 ? <span className="text-green-600 dark:text-green-455 font-bold">FREE</span> : `₹${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <hr className="border-gray-100 dark:border-[#2d2d30]" />
                <div className="flex justify-between text-sm font-bold text-secondary dark:text-white pt-1">
                  <span>Total Amount</span>
                  <span className="text-primary text-base">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/5 dark:bg-[#2d2d30]/30 p-5 rounded-2xl border border-secondary/10 dark:border-[#2d2d30]/50 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                <p className="font-bold text-secondary dark:text-white">End-to-End Encryption</p>
                <p>Your delivery credentials and transaction logs are handled in highly secure channels with SweetDelights automated ordering flow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
