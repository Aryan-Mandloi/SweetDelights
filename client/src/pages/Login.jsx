import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, Phone, MapPin, Loader, Key } from 'lucide-react';

const Login = () => {
  const { user, token, login, register } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (token && user) {
      navigate(redirect);
    }
  }, [token, user, navigate, redirect]);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setErrorMsg('Please enter all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register({ name, email, password, phone, address });
    }

    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.message || 'An error occurred during authentication.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-cream dark:bg-[#121212] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#1e1e1e] p-10 rounded-3xl shadow-xl dark:shadow-none border border-secondary/5 dark:border-[#2d2d30]">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-secondary dark:text-white font-serif">
            {isLogin ? 'Sign in to your account' : 'Create new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Or{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
              }}
              className="font-bold text-primary hover:text-accent transition-colors"
            >
              {isLogin ? 'register for a new account' : 'sign in to existing account'}
            </button>
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold border border-red-100 dark:border-red-900/30">
            ❌ {errorMsg}
          </div>
        )}

        <form className="mt-6 space-y-4 text-xs font-semibold text-gray-600 dark:text-gray-400" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-1">
              <label htmlFor="name" className="dark:text-gray-400">Full Name *</label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2d2d30] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                  placeholder="John Doe"
                />
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email-address" className="dark:text-gray-400">Email Address *</label>
            <div className="relative">
              <input
                id="email-address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2d2d30] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                placeholder="you@example.com"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="dark:text-gray-400">Password *</label>
            <div className="relative">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2d2d30] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                placeholder="••••••"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="space-y-1">
                <label htmlFor="phone" className="dark:text-gray-400">Phone Number (Optional)</label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2d2d30] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                    placeholder="+1 (555) 000-0000"
                  />
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="address" className="dark:text-gray-400">Delivery Address (Optional)</label>
                <div className="relative">
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2d2d30] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                    placeholder="123 Sweet St, Frosting City"
                  />
                  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary hover:bg-accent text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4" />
                  Authenticating...
                </>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
