import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  UploadCloud,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  Truck,
  Plus,
  X,
  FileText,
  Search,
  Filter,
  Loader
} from 'lucide-react';

const AdminDashboard = () => {
  const {
    user,
    token,
    authLoading,
    cakes,
    cakesLoading,
    createCake,
    updateCake,
    deleteCake,
    getAllOrders,
    updateOrderStatus
  } = useApp();
  
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      // Allow auth state to settle, then redirect
      const timeout = setTimeout(() => {
        if (user.role !== 'admin') navigate('/');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [token, user, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState('analytics');

  // API State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Create / Edit Cake modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCake, setEditingCake] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    flavor: '',
    price: '',
    description: '',
    image: '',
    category: '',
    stock: '10'
  });
  const [modalError, setModalError] = useState('');
  const [submittingCake, setSubmittingCake] = useState(false);

  // Search & Filter state
  const [orderFilter, setOrderFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [cakeSearch, setCakeSearch] = useState('');

  const fetchAdminOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await getAllOrders();
      if (res.success) {
        setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setErrorMsg(res.message || 'Failed to fetch customer orders.');
      }
    } catch (err) {
      setErrorMsg('Error loading order files.');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminOrders();
    }
  }, [user]);

  // Calculations for Financial Dashboard
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const totalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);
  
  // Profit Margin assumed at 45% (covers baking costs, packaging, delivery logistics)
  const netProfit = totalSales * 0.45;
  const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const activeCount = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;

  const handleOpenCreateModal = () => {
    setEditingCake(null);
    setFormData({
      name: '',
      flavor: '',
      price: '',
      description: '',
      image: '',
      category: '',
      stock: '10'
    });
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (cake) => {
    setEditingCake(cake);
    setFormData({
      name: cake.name,
      flavor: cake.flavor,
      price: cake.price.toString(),
      description: cake.description,
      image: cake.image,
      category: cake.category?.categoryName || '',
      stock: cake.stock ? cake.stock.toString() : '10'
    });
    setModalError('');
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const { name, flavor, price, description, image, category } = formData;
    if (!name || !flavor || !price || !description || !image || !category) {
      setModalError('Please fill out all required fields.');
      return;
    }

    setSubmittingCake(true);
    setModalError('');

    const payload = {
      name,
      flavor,
      price: parseFloat(price),
      description,
      image,
      category,
      stock: parseInt(formData.stock) || 10
    };

    let result;
    if (editingCake) {
      result = await updateCake(editingCake._id, payload);
    } else {
      result = await createCake(payload);
    }

    setSubmittingCake(false);

    if (result.success) {
      setShowModal(false);
    } else {
      setModalError(result.message || 'Error occurred while saving cake.');
    }
  };

  const handleDeleteCake = async (cakeId) => {
    if (window.confirm('Are you sure you want to permanently remove this cake from your storefront?')) {
      await deleteCake(cakeId);
    }
  };

  const handleStatusTransition = async (orderId, currentStatus) => {
    let nextStatus = 'Pending';
    if (currentStatus === 'Pending') nextStatus = 'Processing';
    else if (currentStatus === 'Processing') nextStatus = 'Shipped';
    else if (currentStatus === 'Shipped') nextStatus = 'Delivered';

    const result = await updateOrderStatus(orderId, nextStatus);
    if (result.success) {
      fetchAdminOrders();
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this customer order?')) {
      const result = await updateOrderStatus(orderId, 'Cancelled');
      if (result.success) {
        fetchAdminOrders();
      }
    }
  };

  // Filters and Searches
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderFilter === 'All' || order.status === orderFilter;
    const matchesSearch =
      order._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.userId?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.deliveryAddress?.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredCakes = cakes.filter((cake) => {
    return (
      cake.name.toLowerCase().includes(cakeSearch.toLowerCase()) ||
      cake.flavor.toLowerCase().includes(cakeSearch.toLowerCase()) ||
      cake.category?.categoryName?.toLowerCase().includes(cakeSearch.toLowerCase())
    );
  });

  // Handle profile loading state
  if (authLoading) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-cream dark:bg-[#121212] px-4 transition-colors duration-300">
        <div className="text-center max-w-md p-10 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl dark:shadow-none border border-transparent dark:border-[#2d2d30] flex flex-col items-center justify-center gap-4">
          <Loader className="animate-spin h-10 w-10 text-primary" />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  // Guard access gracefully
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-cream dark:bg-[#121212] px-4 transition-colors duration-300">
        <div className="text-center max-w-md p-10 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl dark:shadow-none border border-secondary/5 dark:border-[#2d2d30]">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-secondary dark:text-white mb-3">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Only authorized team members can access this command panel.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-primary hover:bg-accent text-white font-medium rounded-full transition-colors text-sm shadow-md"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-[#121212] py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-secondary/10 dark:border-[#2d2d30]">
          <div>
            <h1 className="text-4xl font-serif font-bold text-secondary dark:text-white">Control Center</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
              SweetDelights operations, analytics, catalog uploads, and status workflows.
            </p>
          </div>

          <div className="flex bg-white dark:bg-[#1e1e1e] p-1 rounded-2xl shadow-inner border border-secondary/5 dark:border-[#2d2d30] transition-colors duration-300">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'analytics'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white'
              }`}
            >
              Operations Summary
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'catalog'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white'
              }`}
            >
              Catalog Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'orders'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white'
              }`}
            >
              Order Tracker ({pendingCount + activeCount})
            </button>
          </div>
        </header>

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Metric Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-md border border-secondary/5 dark:border-[#2d2d30] flex items-center gap-5 hover:shadow-lg dark:shadow-none transition-all duration-300">
                <div className="w-14 h-14 bg-green-50 dark:bg-green-950/20 rounded-2xl flex items-center justify-center text-green-500">
                  <DollarSign className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Gross Revenues</p>
                  <p className="text-2xl font-bold text-secondary dark:text-white mt-0.5">₹{totalSales.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-md border border-secondary/5 dark:border-[#2d2d30] flex items-center gap-5 hover:shadow-lg dark:shadow-none transition-all duration-300">
                <div className="w-14 h-14 bg-pink-50 dark:bg-pink-950/20 rounded-2xl flex items-center justify-center text-primary">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Net Profit (45%)</p>
                  <p className="text-2xl font-bold text-primary mt-0.5">₹{netProfit.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-md border border-secondary/5 dark:border-[#2d2d30] flex items-center gap-5 hover:shadow-lg dark:shadow-none transition-all duration-300">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center text-blue-500">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Total Orders</p>
                  <p className="text-2xl font-bold text-secondary dark:text-white mt-0.5">{orders.length}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-md border border-secondary/5 dark:border-[#2d2d30] flex items-center gap-5 hover:shadow-lg dark:shadow-none transition-all duration-300">
                <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-center text-amber-500">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Average Order</p>
                  <p className="text-2xl font-bold text-secondary dark:text-white mt-0.5">₹{avgOrderValue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Simulated Graphs and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-lg dark:shadow-none border border-secondary/5 dark:border-[#2d2d30] space-y-6 transition-colors duration-300">
                <h3 className="text-xl font-serif font-bold text-secondary dark:text-white">Revenue & Order Metrics</h3>
                
                {/* Custom Styled Charts */}
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                      <span>Completed Shipments ({deliveredOrders.length})</span>
                      <span>{orders.length > 0 ? ((deliveredOrders.length / orders.length) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="w-full bg-cream dark:bg-[#151518] h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${orders.length > 0 ? (deliveredOrders.length / orders.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                      <span>Pending Orders ({pendingCount})</span>
                      <span>{orders.length > 0 ? ((pendingCount / orders.length) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="w-full bg-cream dark:bg-[#151518] h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${orders.length > 0 ? (pendingCount / orders.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                      <span>Active Workflows ({activeCount})</span>
                      <span>{orders.length > 0 ? ((activeCount / orders.length) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="w-full bg-cream dark:bg-[#151518] h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${orders.length > 0 ? (activeCount / orders.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl border border-primary/10 dark:border-primary/20 text-xs text-secondary dark:text-gray-300 leading-relaxed mt-4">
                  🎨 <strong>SweetDelights Financial Formula:</strong> Net profit is computed dynamically by deducting standard baking resources, customized frosting labor, packaging material boxes, and third-party delivery dispatchers. Net Profit = Gross Sales * 45%.
                </div>
              </div>

              {/* Status Breakdowns */}
              <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-lg dark:shadow-none border border-secondary/5 dark:border-[#2d2d30] flex flex-col justify-between transition-colors duration-300">
                <h3 className="text-xl font-serif font-bold text-secondary dark:text-white mb-6">Workflow Status</h3>

                <div className="space-y-4 flex-grow justify-center flex flex-col">
                  <div className="flex justify-between items-center text-xs font-semibold py-2.5 border-b border-gray-100 dark:border-[#2d2d30]">
                    <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400"><Clock className="h-4 w-4" /> Pending Approval</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full">{pendingCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold py-2.5 border-b border-gray-100 dark:border-[#2d2d30]">
                    <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400"><Loader className="h-4 w-4 animate-spin" /> In Oven / Processing</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">{orders.filter(o => o.status === 'Processing').length}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold py-2.5 border-b border-gray-100 dark:border-[#2d2d30]">
                    <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"><Truck className="h-4 w-4" /> Dispatched</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full">{orders.filter(o => o.status === 'Shipped').length}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold py-2.5">
                    <span className="flex items-center gap-2 text-green-600 dark:text-green-400"><CheckCircle className="h-4 w-4" /> Delivered</span>
                    <span className="font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-1 rounded-full">{deliveredOrders.length}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="w-full py-3 bg-secondary dark:bg-[#2d2d30] hover:bg-secondary/90 dark:hover:bg-[#323235] text-white font-bold rounded-2xl text-xs transition-colors mt-6 text-center"
                >
                  Manage Order Statuses
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CATALOG TAB */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-sm border border-secondary/5 dark:border-[#2d2d30] transition-colors duration-300">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name, flavor or category..."
                  value={cakeSearch}
                  onChange={(e) => setCakeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-[#2d2d30] dark:bg-[#151518] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs transition-all"
                />
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-accent text-white font-bold rounded-xl transition-all shadow-md text-xs"
              >
                <Plus className="h-4 w-4" />
                Upload New Cake
              </button>
            </div>

            {cakesLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-xs font-bold text-primary">
                <Loader className="animate-spin h-8 w-8 mb-2" />
                Loading Catalog...
              </div>
            ) : filteredCakes.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-md border border-secondary/5 dark:border-[#2d2d30] text-gray-500 dark:text-gray-400 font-serif text-lg font-semibold">
                No matching cakes found in catalog.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCakes.map((cake) => (
                  <div
                    key={cake._id}
                    className="bg-white dark:bg-[#1e1e1e] rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-secondary/5 dark:border-[#2d2d30] flex flex-col"
                  >
                    <div className="h-48 w-full bg-cream dark:bg-[#151518] overflow-hidden relative shadow-inner">
                      <img
                        src={cake.image}
                        alt={cake.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 right-4 text-[9px] uppercase tracking-widest font-bold bg-secondary dark:bg-[#2d2d30] text-white px-2.5 py-1 rounded-full">
                        {cake.category?.categoryName || 'General'}
                      </span>
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-lg font-bold text-secondary dark:text-white truncate">{cake.name}</h4>
                          <span className="font-extrabold text-primary text-base">₹{cake.price.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-primary font-semibold mt-0.5">{cake.flavor}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                          {cake.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-[#2d2d30] text-xs">
                        <span className="font-bold text-gray-500 dark:text-gray-400">Stock: <span className="text-secondary dark:text-white">{cake.stock}</span></span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(cake)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-lg transition-all"
                            title="Edit parameters"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCake(cake._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                            title="Remove permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter and Search Bar */}
            <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-sm border border-secondary/5 dark:border-[#2d2d30] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search order ID, client name, address..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-[#2d2d30] dark:bg-[#151518] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs transition-all"
                />
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0">
                <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-[10px] uppercase tracking-wider transition-all whitespace-nowrap ${
                      orderFilter === status
                        ? 'bg-secondary text-white shadow-sm'
                        : 'bg-cream dark:bg-[#2d2d30] text-gray-550 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#323235]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-xs font-bold text-primary">
                <Loader className="animate-spin h-8 w-8 mb-2" />
                Fetching Orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-md border border-secondary/5 dark:border-[#2d2d30] text-gray-500 dark:text-gray-400 font-serif text-lg font-semibold">
                No matching order records found.
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl overflow-hidden shadow-md dark:shadow-none border border-secondary/5 dark:border-[#2d2d30] overflow-x-auto transition-colors duration-300">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-cream dark:bg-[#1c1c1f] border-b border-secondary/5 dark:border-[#2d2d30] text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                      <th className="py-4 px-6">ID & Date</th>
                      <th className="py-4 px-6">Customer Details</th>
                      <th className="py-4 px-6">Purchased Items</th>
                      <th className="py-4 px-6">Order Total</th>
                      <th className="py-4 px-6">Delivery status</th>
                      <th className="py-4 px-6 text-center">Workflow Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#2d2d30] text-xs">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-cream/40 dark:hover:bg-[#1f1f23]/30 transition-colors">
                        <td className="py-5 px-6 whitespace-nowrap">
                          <span className="font-bold text-secondary dark:text-white">
                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                          </span>
                          <span className="block text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          <span className="font-bold text-secondary dark:text-white block">{order.userId?.name || 'Guest User'}</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 block mt-0.5">{order.userId?.email}</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 block mt-0.5 truncate max-w-[200px]" title={order.deliveryAddress}>
                            📍 {order.deliveryAddress}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1">
                            {order.items.map((item, idx) => {
                              const cake = item.cakeId;
                              if (!cake) return null;
                              return (
                                <div key={idx} className="text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                                  🍰 {cake.name} ({item.weight}) x {item.quantity}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-5 px-6 font-bold text-secondary dark:text-white whitespace-nowrap text-sm">
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-5 px-6 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-extrabold ${
                              order.status === 'Pending'
                                ? 'bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30'
                                : order.status === 'Processing'
                                ? 'bg-blue-50 dark:bg-blue-955/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30'
                                : order.status === 'Shipped'
                                ? 'bg-indigo-50 dark:bg-indigo-955/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30'
                                : order.status === 'Delivered'
                                ? 'bg-green-50 dark:bg-green-955/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/30'
                                : 'bg-red-50 dark:bg-red-955/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-5 px-6 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                              <button
                                onClick={() => handleStatusTransition(order._id, order.status)}
                                className="px-3 py-1.5 bg-primary hover:bg-accent text-white font-bold rounded-lg text-[10px] tracking-wider uppercase transition-colors"
                              >
                                {order.status === 'Pending' && 'Bake (Process)'}
                                {order.status === 'Processing' && 'Ship'}
                                {order.status === 'Shipped' && 'Deliver'}
                              </button>
                            )}

                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 rounded-lg transition-colors"
                                title="Cancel order"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}

                            {(order.status === 'Delivered' || order.status === 'Cancelled') && (
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 italic">No actions</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* UPLOAD / EDIT CAKE MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1e1e22] rounded-3xl max-w-lg w-full p-8 shadow-2xl relative border border-secondary/5 dark:border-[#2d2d32] animate-scaleUp transition-colors duration-300">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-secondary dark:hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-secondary dark:text-white mb-6 flex items-center gap-2">
                <UploadCloud className="h-6 w-6 text-primary" />
                {editingCake ? 'Modify Cake Specs' : 'Upload Gourmet Cake'}
              </h3>

              {modalError && (
                <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold border border-red-100 dark:border-red-900/30 mb-6">
                  ❌ {modalError}
                </div>
              )}

              <form onSubmit={handleModalSubmit} className="space-y-4 text-xs font-semibold text-gray-600 dark:text-gray-400">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label>Cake Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dreamy Fudge Cake"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#2d2d32] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label>Flavor Choice *</label>
                    <input
                      type="text"
                      required
                      value={formData.flavor}
                      onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                      placeholder="e.g. Belgian Chocolate"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#2d2d32] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label>Unit Base Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 29.99"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#2d2d32] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label>Category (Text Field Resolves Behind Scenes) *</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Chocolates or Specialties"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#2d2d32] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label>Stock Count *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="10"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#2d2d32] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label>Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#2d2d32] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label>Baking Description / Ingredients *</label>
                  <textarea
                    rows="3"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the layers, textures, frostings, and general ingredients..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#2d2d32] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs leading-relaxed font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingCake}
                  className="w-full py-3 bg-primary hover:bg-accent text-white font-bold rounded-xl transition-all shadow-md mt-6 flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
                >
                  {submittingCake ? (
                    <>
                      <Loader className="animate-spin h-4 w-4" />
                      Uploading Specs...
                    </>
                  ) : (
                    editingCake ? 'Save Custom Specs' : 'Publish to Storefront'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
