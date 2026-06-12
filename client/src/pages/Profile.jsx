import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Mail, Calendar, Package, ClipboardList, Loader, ChevronRight } from 'lucide-react';

const Profile = () => {
  const { user, token, getMyOrders } = useApp();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getMyOrders();
        if (res.success) {
          // Sort by creation date descending
          const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(sorted);
        } else {
          setErrorMsg(res.message || 'Failed to load your orders.');
        }
      } catch (err) {
        setErrorMsg('Error loading order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, getMyOrders, navigate]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30';
      case 'Processing':
        return 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30';
      case 'Shipped':
        return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30';
      case 'Delivered':
        return 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/30';
      case 'Cancelled':
        return 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800';
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-cream dark:bg-[#121212] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-secondary dark:text-white mb-10 text-center relative after:content-[''] after:block after:w-16 after:h-1 after:bg-primary after:mx-auto after:mt-3">
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* User Details Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-lg dark:shadow-none border border-secondary/5 dark:border-[#2d2d30] flex flex-col items-center text-center transition-colors duration-300">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-serif text-xl font-bold text-secondary dark:text-white mb-1">{user?.name}</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 bg-secondary dark:bg-[#2d2d30] text-white dark:text-gray-200 rounded-full">
                {user?.role === 'admin' ? 'Administrator' : 'Customer'}
              </span>

              <div className="w-full border-t border-gray-100 dark:border-[#2d2d30] my-6 pt-6 text-left space-y-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate text-secondary dark:text-gray-300" title={user?.email}>{user?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-secondary dark:text-gray-300">{user?.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-secondary dark:text-gray-300 leading-relaxed">{user?.address || 'Not provided'}</span>
                </div>
              </div>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="w-full py-3 bg-secondary dark:bg-[#2d2d30] hover:bg-secondary/90 dark:hover:bg-[#323235] text-white font-bold rounded-xl transition-all duration-300 shadow-md text-xs mt-2"
                >
                  Admin Control Center
                </Link>
              )}
            </div>
          </div>

          {/* User Order History List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-lg dark:shadow-none border border-secondary/5 dark:border-[#2d2d30] transition-colors duration-300">
              <h2 className="text-2xl font-serif font-bold text-secondary dark:text-white mb-6 flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-primary" />
                Order History
              </h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-xs font-bold text-primary">
                  <Loader className="animate-spin h-8 w-8" />
                  Fetching order records...
                </div>
              ) : errorMsg ? (
                <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold border border-red-100 dark:border-red-900/30">
                  ❌ {errorMsg}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 max-w-sm mx-auto space-y-4">
                  <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto" />
                  <p className="font-serif text-lg font-bold text-secondary dark:text-white">No Orders Placed Yet</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    We haven't received any orders under this profile. Browse our gourmet cakes to place your very first order!
                  </p>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-accent text-white font-medium rounded-full transition-all duration-300 shadow-md text-xs"
                  >
                    Explore Cakes
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-100 dark:border-[#2d2d30] rounded-2xl p-6 hover:shadow-md dark:hover:shadow-none transition-all duration-305"
                    >
                      {/* Header details */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-gray-100 dark:border-[#2d2d30] mb-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
                            Order ID: #{order._id.substring(order._id.length - 8).toUpperCase()}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold">
                            <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-gray-505" />
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-secondary dark:text-white">
                            Total: <span className="text-primary">₹{order.totalAmount.toFixed(2)}</span>
                          </span>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadgeColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items details */}
                      <div className="space-y-4">
                        {order.items.map((item, idx) => {
                          const cake = item.cakeId;
                          if (!cake) return null;
                          return (
                            <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={cake.image}
                                  alt={cake.name}
                                  className="w-14 h-14 object-cover rounded-xl shadow-inner bg-cream dark:bg-[#151518] flex-shrink-0"
                                />
                                <div className="text-xs">
                                  <h4 className="font-serif font-bold text-secondary dark:text-white text-sm">{cake.name}</h4>
                                  <p className="text-primary font-semibold">{cake.flavor}</p>
                                  <div className="flex flex-wrap gap-2 text-[10px] text-gray-400 dark:text-gray-450 mt-1">
                                    <span>Weight: {item.weight}</span>
                                    <span>•</span>
                                    <span>Flavor Choice: {item.selectedFlavor}</span>
                                  </div>
                                  {item.message && (
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 italic mt-1.5 bg-gray-50 dark:bg-[#151518] px-2 py-1 rounded border border-gray-100 dark:border-[#2d2d30]">
                                      Message: "{item.message}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="text-right text-xs">
                                <p className="font-semibold text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                <p className="font-bold text-secondary dark:text-white text-sm">₹{item.subtotal.toFixed(2)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Delivery destination */}
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2d2d30] flex items-start gap-2 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          Delivering to: <strong className="text-secondary dark:text-white">{order.deliveryAddress}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
